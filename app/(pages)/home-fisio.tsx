import DateNavigator from "@/components/DateNavigator";
import { useTheme } from "@/components/ThemeContext";
import { Colors } from "@/constants/Colors";
import { makeSystemStyle } from "@/constants/genericStyles";
import { SupabaseService } from "@/services/supabase.service";
import { formattedDate } from "@/services/utils";
import FontAwesome from "@expo/vector-icons/FontAwesome";
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

export default function HomeFisioScreen() {
  const [profissionalId, setProfissionalId] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingPacientes, setLoadingPacientes] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
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

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      await checkUser();
    });
    return unsubscribe;
  }, [navigation]);

  const checkUser = async () => {
    const response = await supabaseService.checkUserLoggedIn();
    if (!response.data.user) {
      router.navigate("Login" as any);
    } else {
      setProfissionalId(response.data.user.id);
      await getExercicios(currentDate, response.data.user.id);
    }
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      if (!profissionalId) {
        checkUser();
      }
      await getExercicios(currentDate, profissionalId);
    });

    return unsubscribe;
  }, [navigation, currentDate, profissionalId]);

  const getExercicios = async (date: Date, id: string = profissionalId) => {
    setLoadingPacientes(true);
    const response = await supabaseService.getTreinosByProfissional(
      id,
      formattedDate(date)
    );
    const pacientes = response.data
      ?.map((x: any) => ({
        id: x.patient_id,
        ...x.patient_data,
        date: x.treino_registro_date,
        feito: x.has_treino_registro,
      }))
      .flat() as Array<any>;
    setPacientes(pacientes);
    setLoadingPacientes(false);
  };

  const handleDateChange = async (date: Date) => {
    setCurrentDate(date);
    await getExercicios(date);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getExercicios(currentDate, profissionalId);
    setRefreshing(false);
  }, [currentDate, profissionalId]);

  const handleVisualizar = async (id: string) => {
    router.push({
      pathname: "details-paciente" as any,
      params: {
        pacienteId: id,
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
        <Text style={styles.title}>Bem-vindo ao PREDAP</Text>
        <DateNavigator
          startDate={currentDate}
          onDateChange={handleDateChange}
        />
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
                    Acompanhamento de Hoje
                  </Text>
                )}
                {pacientes?.map((paciente: any) => (
                  <TouchableHighlight
                    key={paciente.id}
                    activeOpacity={0.6}
                    underlayColor={Colors[colorScheme || "light"].underlayColor}
                    style={{ marginBottom: 20 }}
                    onPress={() => handleVisualizar(paciente.id)}
                  >
                    <View style={styles.boxExercise} key={paciente.id}>
                        <FontAwesome
                            name={paciente.feito ? "check-circle" : "clock-o"}
                            size={40}
                            color="white"
                        />
                      <Text style={styles.exerciseText}>{paciente.nome}</Text>
                    </View>
                  </TouchableHighlight>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
        <Pressable
          style={{ ...styles.button, width: 300 }}
          onPress={() => {
            router.navigate("/(pages)/selecionar-paciente" as any);
          }}
        >
          <Text style={styles.buttonText}>Adicionar Treino para Paciente</Text>
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
