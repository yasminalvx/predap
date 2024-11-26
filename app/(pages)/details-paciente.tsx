import { useTheme } from "@/components/ThemeContext";
import { Colors } from "@/constants/Colors";
import { makeSystemStyle } from "@/constants/genericStyles";
import { SupabaseService } from "@/services/supabase.service";
import { formattedFullDate } from "@/services/utils";
import { useNavigation } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function DatailsPacienteScreen() {
  const { pacienteId, date } = useLocalSearchParams<{
    pacienteId: string;
    date: string;
  }>();
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(true);
  const [exercicios, setExercicios]: any[] = useState([]);
  const supabaseService = new SupabaseService();
  const { isDarkTheme } = useTheme();
  const colorScheme = isDarkTheme ? "dark" : "light";
  const systemStyle = makeSystemStyle(Colors[colorScheme || "light"]);
  const styles = makeStyles(Colors[colorScheme || "light"], systemStyle);
  const navigation = useNavigation();

  useEffect(() => {
    checkUser();
    checkPaciente();
  }, []);

  const checkUser = async () => {
    const response = await supabaseService.checkUserLoggedIn();
    if (!response.data.user) {
      router.navigate("Login" as any);
    } else {
      await getExercicios();
    }
    setLoading(false);
  };
  const checkPaciente = async () => {
    const response = await supabaseService.get("users", pacienteId);
    if (!response.data) {
      router.navigate("Login" as any);
    } else {
      setNome(response.data[0].data.nome);
      await getExercicios();
    }
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      if (!pacienteId) {
        checkUser();
      }
      await getExercicios();
    });

    return unsubscribe;
  }, [navigation, pacienteId]);

  const getExercicios = async () => {
    const response = await supabaseService.getExercicies(pacienteId, new Date(date));
    const exercicios = response.data?.map((x: any) => {
      return {
        id: x.id,
        nome: x.pelvic_exercises.exercise_name,
        inicio: x.treino_registro[0]?.created_at,
      };
    });
    setExercicios(exercicios);
  };

  const formattedDate = (date: string) => {
    if (date.includes("+00:00")) {
      date = date.replace("+00:00", "");
    }
    return formattedFullDate(date);
  }

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        style={systemStyle.activityIndicator}
        color="#9A4DFF"
      />
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <Text style={styles.title}>Paciente: {nome}</Text>
        {exercicios?.map((exercicio: any, index: number) => (
          <View style={styles.boxExercise} key={exercicio.id}>
            <Text style={styles.title}>Exercício: {exercicio.nome}</Text>
            {exercicio.inicio ? (
              <Text style={styles.title}>
                Concluído às: {formattedDate(exercicio.inicio)}
              </Text>
            ) : (
              <Text style={styles.title}>Não concluído </Text>
            )}
          </View>
        ))}
      </SafeAreaView>
      <Pressable
        style={{
          ...systemStyle.buttonOutlined,
          marginHorizontal: 20,
          marginBottom: 20,
        }}
        onPress={() => router.navigate("/" as any)}
      >
        <Text style={systemStyle.buttonTextOutlined}>Voltar</Text>
      </Pressable>
    </SafeAreaProvider>
  );
}

const makeStyles = (colors: any, systemStyle: any) => {
  return StyleSheet.create({
    button: {
      ...systemStyle.button,
      width: "100%",
      fontSize: 32,
      marginHorizontal: "auto",
      marginTop: 12,
      marginBottom: 40,
    },
    buttonText: {
      ...systemStyle.buttonText,
      fontSize: 18,
    },
    exerciseText: {
      fontSize: 18,
      width: "100%",
      marginHorizontal: 40,
      color: "#000",
    },
    containerExercises: {
      width: "100%",
      paddingHorizontal: 20,
      marginBottom: 30,
    },
    boxExercise: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      width: "100%",
      backgroundColor: "#c1bdda",
      padding: 10,
      paddingVertical: 20,
      borderRadius: 8,
      marginVertical: 10,
    },
    scrollView: {
      height: "100%",
    },
    container: {
      flex: 1,
      padding: 20,
    },
    exerciseContainer: {
      padding: 15,
      marginVertical: 10,
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 8,
    },
    title: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 5,
    },
    input: {
      height: 40,
      borderColor: "#ccc",
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 10,
      paddingHorizontal: 10,
    },
    textArea: {
      borderColor: "#ccc",
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 10,
      paddingHorizontal: 10,
    },
    removeButton: {
      backgroundColor: "#446aff",
      padding: 10,
      borderRadius: 5,
      alignItems: "center",
      marginTop: 10,
    },
    removeButtonText: {
      color: "white",
      fontWeight: "bold",
      width: "100%",
      fontSize: 18,
      marginHorizontal: "auto",
    },
    label: {
      fontSize: 14,
      color: colors.text,
    },
  });
};
