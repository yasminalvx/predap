import DateNavigator from "@/components/DateNavigator";
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
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { formattedDate } from "@/services/utils";

export default function HomeScreen() {
  const [pacientId, setPacientId] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingExercises, setLoadingExercises] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [exercicies, setExercicies]: any[] = useState([]);
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
      setPacientId(response.data.user.id);
      await getExercicios(currentDate, response.data.user.id);
    }
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      if (!pacientId) {
        checkUser();
      }
      await getExercicios(currentDate, pacientId);
    });
    return unsubscribe;
  }, [navigation, currentDate, pacientId]);

  const getExercicios = async (date: Date, idPatient: string = pacientId) => {
    setLoadingExercises(true);
    const response = await supabaseService.getExercicies(idPatient, date);
    const exercicios = response.data
      ?.map((x) => ({
        ...x.pelvic_exercises,
        exercicioId: x.id,
        feito: x.treino_registro?.length,
      }))
      .flat() as Array<any>;
    setExercicies(exercicios);
    setLoadingExercises(false);
  };

  const handleTimer = async () => {
    const treinosPendentes = exercicies?.filter((x: any) => !x.feito);
    router.push({
      pathname: "timer" as any,
      params: {
        exercisesInput: JSON.stringify(treinosPendentes),
        date: formattedDate(currentDate),
      },
    });
  };

  const handleDateChange = async (date: Date) => {
    setCurrentDate(date);
    await getExercicios(date);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getExercicios(currentDate, pacientId);
    setRefreshing(false);
  }, [currentDate, pacientId]);

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
            {loadingExercises ? (
              <ActivityIndicator
                size="large"
                style={systemStyle.activityIndicator}
                color="#9A4DFF"
              />
            ) : (
              <View style={styles.containerExercises}>
                {exercicies?.length === 0 ? (
                  <Text style={styles.emptyTable}>
                    Nenhum exercício foi cadastrado
                  </Text>
                ) : (
                  <Text style={styles.titleExercises}>Exercícios de Hoje</Text>
                )}
                {exercicies?.map((exercicio: any, index: number) => (
                  <View style={styles.boxExercise} key={exercicio.id}>
                    <FontAwesome
                      name={exercicio.feito ? "check-circle" : "play-circle"}
                      size={40}
                      color="white"
                    />
                    <Text style={styles.exerciseText}>
                      {exercicio.time_contracting} seg. contrai,{" "}
                      {exercicio.time_releasing} seg. relaxa
                    </Text>
                    <Text style={styles.exerciseText}>{exercicio.sets} x</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
        {exercicies?.length !== 0 &&
        !loadingExercises &&
        exercicies?.filter((x: any) => !x.feito).length ? (
          formattedDate(currentDate) === formattedDate(new Date()) ? (
            <Pressable style={styles.button} onPress={handleTimer}>
              <Text style={styles.buttonText}>
                {exercicies?.filter((x: any) => x.feito).length > 0
                  ? "Continuar"
                  : "Iniciar"}
              </Text>
            </Pressable>
          ) : null
        ) : null}
        {exercicies?.length !== 0 &&
        !loadingExercises &&
        exercicies?.filter((x: any) => x.feito).length ===
          exercicies?.length ? (
          <Text
            style={{
              ...styles.exerciseText,
              marginBottom: 40,
              fontWeight: "bold",
            }}
          >
            Todos os exercícios foram finalizados
          </Text>
        ) : null}
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
      marginVertical: 10,
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
