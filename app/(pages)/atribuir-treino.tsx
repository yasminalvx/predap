import { useAlert } from "@/components/Alert";
import { useTheme } from "@/components/ThemeContext";
import { Colors } from "@/constants/Colors";
import { makeSystemStyle } from "@/constants/genericStyles";
import { SupabaseService } from "@/services/supabase.service";
import { formattedDate, formattedFullDate, formattedFullDateToSupabase } from "@/services/utils";
import { useNavigation } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function AtribuirTreino() {
  const { pacienteId, profissionalId } = useLocalSearchParams<{
    pacienteId: string;
    profissionalId: string;
  }>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exercicios, setExercicios]: any[] = useState([]);
  const supabaseService = new SupabaseService();
  const { isDarkTheme } = useTheme();
  const colorScheme = isDarkTheme ? "dark" : "light";
  const systemStyle = makeSystemStyle(Colors[colorScheme || "light"]);
  const styles = makeStyles(Colors[colorScheme || "light"], systemStyle);
  const navigation = useNavigation();
  const date = new Date();
  let dataCriacao = "";
  const showAlert = useAlert();

  useEffect(() => {
    checkUser();
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

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      if (!profissionalId) {
        checkUser();
      }
      await getExercicios();
    });

    return unsubscribe;
  }, [navigation, profissionalId]);

  const getExercicios = async () => {
    const response = await supabaseService.getExercicies(pacienteId, date);
    const exercicios = response.data
      ?.map((x) => ({
        ...x,
        dataCriacao: formattedFullDate(new Date((x.treino as any).created_at)),
        ...x.pelvic_exercises,
        exercicioId: x.id,
        feito: x.treino_registro?.length,
      }))
      .flat() as Array<any>;
    if (exercicios.length === 0) {
      handleAddExercise();
      return;
    }
    dataCriacao = exercicios?.[0]?.dataCriacao;
    setExercicios(exercicios);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getExercicios();
    setRefreshing(false);
  }, [profissionalId]);

  const handleAddExercise = () => {
    if (!validAllForm()) {
      showAlert("Preencha todos os campos do exercício");
      return;
    }

    setExercicios([
      ...exercicios,
      {
        id: new Date().toString(),
        date: formattedDate(date),
        sets: "",
        rest_time: "",
        exercise_name: "",
        time_releasing: "",
        time_contracting: "",
        description: "",
      },
    ]);
  };

  const getTreino = async () => {
    const { data } = await supabaseService.getTreino(
      pacienteId,
      formattedDate(date)
    );
    const treinoId = data?.[0]?.id;
    return treinoId;
  };

  const submit = async () => {
    if (!validAllForm()) {
      showAlert("Preencha todos os campos do exercício");
      return;
    }

    const treinoId = await getTreino();
    if (treinoId) {
      await supabaseService.atualizarUltimoTreino(treinoId, formattedDate(date));
    }
    const { data: novoTreino } = await supabaseService.adicionarNovoTreino(
      pacienteId,
      profissionalId,
      formattedDate(date),
      formattedFullDateToSupabase(date)
    );
    const novoTreinoId = novoTreino?.[0].id;
    const { data: novosExercicios } =
      await supabaseService.adicionarNovosExercicios(exercicios);
    const exerciciosIds = novosExercicios?.map((x: any) => x.id) as string[];
    const { error } = await supabaseService.relacionarTreinoExercicios(
      novoTreinoId,
      exerciciosIds
    );

    if (error) {
      console.error(error);
      showAlert("Erro ao atribuir treino");
      return;
    }
    showAlert("Treino atribuído com sucesso", '', () => {
      router.navigate("/selecionar-paciente" as any);
    });
  };

  const validAllForm = () => {
    return exercicios.every(
      (exercise: any) =>
        exercise.sets !== "" &&
        exercise.rest_time !== "" &&
        exercise.exercise_name !== "" &&
        exercise.time_releasing !== "" &&
        exercise.time_contracting !== ""
    );
  };

  const handleInputChange = (text: string, field: string, index: number) => {
    const updatedExercises = [...exercicios];
    updatedExercises[index][field] = text;
    setExercicios(updatedExercises);
  };

  const handleRemoveExercise = (index: number) => {
    const updatedExercises = exercicios.filter(
      (_: any, i: number) => i !== index
    );
    setExercicios(updatedExercises);
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
        <Pressable style={styles.button} onPress={handleAddExercise}>
          <Text style={styles.buttonText}>Adicionar Exercício</Text>
        </Pressable>

        {dataCriacao.length !== 0 && (
          <Text style={styles.title}>Última Atualização: {dataCriacao}</Text>
        )}

        <FlatList
          data={exercicios}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item, index }) => (
            <View style={styles.exerciseContainer}>
              <Text style={styles.title}>Exercício {index + 1}</Text>

              <Text style={styles.label}>Nome do Exercício</Text>
              <TextInput
                style={styles.input}
                placeholder="Nome do Exercício"
                value={item.exercise_name}
                onChangeText={(text) =>
                  handleInputChange(text, "exercise_name", index)
                }
              />

              <Text style={styles.label}>Séries</Text>

              <TextInput
                style={styles.input}
                placeholder="Séries"
                value={item.sets.toString()}
                keyboardType="numeric"
                onChangeText={(text) => handleInputChange(text, "sets", index)}
              />

              <Text style={styles.label}>Tempo de Contração (s)</Text>

              <TextInput
                style={styles.input}
                placeholder="Tempo de Contração (s)"
                value={item.time_contracting.toString()}
                keyboardType="numeric"
                onChangeText={(text) =>
                  handleInputChange(text, "time_contracting", index)
                }
              />

              <Text style={styles.label}>Tempo de Relaxamento (s)</Text>
              <TextInput
                style={styles.input}
                placeholder="Tempo de Relaxamento (s)"
                value={item.time_releasing.toString()}
                keyboardType="numeric"
                onChangeText={(text) =>
                  handleInputChange(text, "time_releasing", index)
                }
              />

              <Text style={styles.label}>Tempo de Descanso (s)</Text>
              <TextInput
                style={styles.input}
                placeholder="Tempo de Descanso (s)"
                value={item.rest_time.toString()}
                keyboardType="numeric"
                onChangeText={(text) =>
                  handleInputChange(text, "rest_time", index)
                }
              />

              <Text style={styles.label}>Descrição</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Descrição"
                value={item.description}
                multiline={true}
                numberOfLines={8}
                onChangeText={(text) =>
                  handleInputChange(text, "description", index)
                }
              />
              <Pressable
                style={styles.removeButton}
                onPress={() => handleRemoveExercise(index)}
              >
                <Text style={styles.buttonText}>Remover</Text>
              </Pressable>
            </View>
          )}
        />
        <Pressable
          style={{ ...styles.button, marginTop: 40, marginBottom: 10 }}
          onPress={submit}
        >
          <Text style={styles.buttonText}>Salvar</Text>
        </Pressable>
        <Pressable
          style={{ ...systemStyle.buttonOutlined, marginBottom: 10 }}
          onPress={() => router.navigate("/selecionar-paciente" as any)}
        >
          <Text style={systemStyle.buttonTextOutlined}>Voltar</Text>
        </Pressable>
      </SafeAreaView>
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
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 5,
      color: colors.text,
    },
    input: {
      height: 40,
      borderColor: "#ccc",
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 10,
      paddingHorizontal: 10,
      color: colors.text
    },
    textArea: {
      borderColor: "#ccc",
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 10,
      paddingHorizontal: 10,
      color: colors.text
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
