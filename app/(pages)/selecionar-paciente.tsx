import { useTheme } from "@/components/ThemeContext";
import { Colors } from "@/constants/Colors";
import { makeSystemStyle } from "@/constants/genericStyles";
import { SupabaseService } from "@/services/supabase.service";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function SelecionarPacienteScreen() {
  const [profissionalId, setProfissionalId] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingPacientes, setLoadingPacientes] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pacientes, setPacientes]: any[] = useState([]);
  const supabaseService = new SupabaseService();
  const { isDarkTheme } = useTheme();
  const colorScheme = isDarkTheme ? "dark" : "light";
  const systemStyle = makeSystemStyle(Colors[colorScheme || "light"]);
  const styles = makeStyles(Colors[colorScheme || "light"], systemStyle);
  const navigation = useNavigation();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const response = await supabaseService.checkUserLoggedIn();
    if (!response.data.user) {
      router.navigate("Login" as any);
    } else {
      setProfissionalId(response.data.user.id);
      await getPacientes();
    }
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      if (!profissionalId) {
        checkUser();
      }
      await getPacientes();
    });

    return unsubscribe;
  }, [navigation, profissionalId]);

  const getPacientes = async () => {
    setLoadingPacientes(true);
    const response = await supabaseService.getAllPacientes();
    const pacientes = response.data
      ?.map((x: any) => ({
        id: x.id,
        ...x.data,
      }))
      .flat() as Array<any>;
    setPacientes(pacientes);
    setLoadingPacientes(false);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getPacientes();
    setRefreshing(false);
  }, [profissionalId]);

  const handleAtribuir = async (id: string) => {
    router.push({
      pathname: "atribuir-treino" as any,
      params: {
        pacienteId: id,
        profissionalId: profissionalId,
      },
    });
  };

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
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={systemStyle.mainContainer}>
            {loadingPacientes ? (
              <ActivityIndicator
                size="large"
                style={systemStyle.activityIndicator}
                color="#9A4DFF"
              />
            ) : (
              <View style={styles.containerExercises}>
                {pacientes?.length === 0 ? (
                  <Text style={styles.emptyTable}>
                    Nenhum paciente foi cadastrado
                  </Text>
                ) : (
                  <Text style={styles.titleExercises}>
                    Selecione o paciente
                  </Text>
                )}
                {pacientes?.map((paciente: any) => (
                  <TouchableHighlight
                    key={paciente.id}
                    activeOpacity={0.6}
                    underlayColor={Colors[colorScheme || "light"].underlayColor}
                    style={{marginBottom: 20}}
                    onPress={() => handleAtribuir(paciente.id)}
                  >
                    <View style={styles.boxExercise} key={paciente.id}>
                      <Text style={styles.exerciseText}>{paciente.nome}</Text>
                    </View>
                  </TouchableHighlight>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
        <Pressable style={{...systemStyle.buttonOutlined, marginBottom: 20, marginHorizontal: 20}} onPress={() => router.navigate('/' as any)}>
          <Text style={systemStyle.buttonTextOutlined}>Voltar</Text>
        </Pressable>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const makeStyles = (colors: any, systemStyle: any) => {
  return StyleSheet.create({
    container: {
      height: "100%",
      paddingTop: 20,
      width: "100%",
    },
    title: {
      fontSize: 22,
      textAlign: "center",
      fontWeight: "bold",
      marginBottom: 40,
      width: "100%",
      color: colors?.text,
    },
    titleExercises: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 20,
      width: "100%",
      textAlign: "left",
      color: colors?.text,
    },
    emptyTable: {
      fontSize: 18,
      textAlign: "left",
      fontWeight: "bold",
      marginBottom: 40,
    },
    button: {
      ...systemStyle.button,
      width: 200,
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
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      backgroundColor: "#c1bdda",
      padding: 10,
      paddingVertical: 20,
      borderRadius: 8,
    },
    scrollView: {
      height: "100%",
    },
  });
};
