import { useAlert } from "@/components/Alert";
import { useTheme } from "@/components/ThemeContext";
import { Colors } from "@/constants/Colors";
import { SupabaseService } from "@/services/supabase.service";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function TimerScreen() {
  const { exercisesInput } = useLocalSearchParams<{
    exercisesInput: string;
  }>();
  const exercises = exercisesInput ? JSON.parse(exercisesInput) : [];
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isContracting, setIsContracting] = useState(true);
  const [setsRemaining, setSetsRemaining] = useState(exercises[0].sets);
  const [isResting, setIsResting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const { isDarkTheme } = useTheme();
  const colorScheme = isDarkTheme ? "dark" : "light";
  const styles = makeStyles(Colors[colorScheme || "light"]);
  const currentExercise = exercises[currentExerciseIndex];
  const [pacientId, setPacientId] = useState("");
  const supabaseService = new SupabaseService();
  let intervalId: any;
  const showAlert = useAlert();

  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  const handleRedirect = () => {
    router.navigate("/");
  };

  const resetTimer = () => {
    setTimer(0);
    setIsRunning(false);
    setIsContracting(true);
    setIsResting(false);
    setIsCompleted(false);
    setSetsRemaining(currentExercise?.sets || 0);
  };

  useEffect(() => {
    resetTimer();
    checkUser();
  }, [navigator]);

  const checkUser = async () => {
    const response = await supabaseService.checkUserLoggedIn();
    if (!response.data.user) {
      router.navigate("Login" as any);
    } else {
      setPacientId(response.data.user.id);
    }
  };

  useEffect(() => {
    if (isRunning) {
      intervalId = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 100);
    } else if (!isRunning && intervalId) {
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
  }, [isRunning]);

  const registrarTreino = async (exercicioId: string) => {
    const { error } = await supabaseService.registroExercicio(
      pacientId,
      exercicioId
    );
    if (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const handleTimer = async () => {
      const totalDuration = isResting
        ? currentExercise.rest_time
        : isContracting
        ? currentExercise.time_contracting
        : currentExercise.time_releasing;

      if (timer >= totalDuration) {
        setTimer(0);

        if (isResting) {
          if (currentExerciseIndex < exercises.length - 1) {
            setCurrentExerciseIndex((prev) => prev + 1);
            await registrarTreino(currentExercise.exercicioId);
            setSetsRemaining(exercises[currentExerciseIndex + 1].sets);
          } else {
            setIsCompleted(true);
            setIsRunning(false);
          }
          setIsResting(false);
          setIsContracting(true);
        } else if (isContracting) {
          setIsContracting(false);
        } else {
          if (setsRemaining > 1) {
            setSetsRemaining((prev: any) => prev - 1);
            setIsContracting(true);
          } else {
            if (currentExerciseIndex === exercises.length - 1) {
              setIsCompleted(true);
              setSetsRemaining(0);
              await registrarTreino(currentExercise.exercicioId);
              setIsRunning(false);
            } else {
              setSetsRemaining(0);
              setIsResting(true);
            }
          }
        }
      }
    };

    handleTimer();
  }, [
    timer,
    isContracting,
    isResting,
    currentExercise,
    currentExerciseIndex,
    setsRemaining,
  ]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <Text style={styles.title}>Exercícios</Text>
        <Text style={styles.exerciseName}>{currentExercise.exercise_name}</Text>
        <Text style={styles.sets}>Séries restantes: {setsRemaining}</Text>
        {currentExercise.description && (
          <Pressable
            style={styles.buttonDetails}
            onPress={() =>
              showAlert("Sobre o Exercício", currentExercise.description)
            }
          >
            <Text style={styles.buttonDetailsText}>Ver descrição </Text>
          </Pressable>
        )}
      </View>

      <View
        style={[
          styles.exerciseBox,
          isResting
            ? styles.restingBox
            : isCompleted
            ? styles.completedBox
            : isContracting
            ? styles.contractingBox
            : styles.releasingBox,
        ]}
      >
        <Text style={styles.timer}>
          {isCompleted
            ? "Concluído!"
            : isResting
            ? `Descanso\n${currentExercise.rest_time - timer} seg`
            : isContracting
            ? `Contrai\n${currentExercise.time_contracting - timer} seg`
            : `Relaxa\n${currentExercise.time_releasing - timer} seg`}
        </Text>
      </View>

      <View style={styles.buttonsContainer}>
        {!isCompleted ? (
          <Pressable style={[styles.button]} onPress={toggleTimer}>
            <FontAwesome
              name={isRunning ? "pause" : "play"}
              size={24}
              color="white"
            />
          </Pressable>
        ) : (
          <Pressable
            style={[styles.button, styles.redirectButton]}
            onPress={handleRedirect}
          >
            <FontAwesome name="home" size={24} color="black" />
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
}

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      height: "100%",
      padding: 40,
      paddingBottom: 100,
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 20,
      textAlign: "center",
      color: colors?.text,
    },
    exerciseName: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 10,
      textAlign: "center",
      color: colors?.text,
    },
    sets: {
      fontSize: 16,
      marginBottom: 20,
      textAlign: "center",
      color: colors?.text,
    },
    exerciseBox: {
      width: 200,
      height: 200,
      borderRadius: 100,
      padding: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    contractingBox: {
      backgroundColor: "#FBBDFB",
    },
    releasingBox: {
      backgroundColor: "#91F1FF",
    },
    restingBox: {
      backgroundColor: "#D3A2FF",
    },
    completedBox: {
      backgroundColor: "#9AECA0",
    },
    timer: {
      fontSize: 18,
      fontWeight: "bold",
      textAlign: "center",
      paddingBottom: 10,
    },
    buttonsContainer: {
      flexDirection: "row",
      gap: 20,
    },
    button: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: "#9A4DFF",
      justifyContent: "center",
      alignItems: "center",
    },
    redirectButton: {
      backgroundColor: "#9AECA0",
    },
    buttonDetails: {
      width: 200,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 30,
      backgroundColor: "#9A4DFF",
    },
    buttonDetailsText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 18,
      paddingVertical: 5,
    },
  });
