import { useTheme } from "@/components/ThemeContext";
import { Colors } from "@/constants/Colors";
import { makeSystemStyle } from "@/constants/genericStyles";
import { SupabaseService } from "@/services/supabase.service";
import { Picker } from "@react-native-picker/picker";
import { router, useNavigation } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function ProfileScreen() {
  const { isDarkTheme } = useTheme();
  const colorScheme = isDarkTheme ? "dark" : "light";
  const systemStyle = makeSystemStyle(Colors[colorScheme || "light"]);
  const styles = makeStyle(Colors[colorScheme || "light"], systemStyle);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const supabaseService = new SupabaseService();
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [sexo, setSexo] = useState("");
  const [dataNascimento, setDataNascimento] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      checkUser();
    });

    return unsubscribe;
  }, [navigation, refreshing]);

  const checkUser = async () => {
    console.log("Searching for user");
    const response = await supabaseService.checkUserLoggedIn();
    if (!response.data.user) {
      router.navigate("Login" as any);
    } else {
      const data = response.data.user.user_metadata;
      setEmail(data.email);
      setNome(data.nome);
      setSexo(data.sexo);
      setDataNascimento(new Date(data.dataNascimento));
      console.log(response.data);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    checkUser();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const updateUser = async () => {
    if (!email || !nome || !sexo || !dataNascimento) {
      Alert.alert("Preencha todos os campos");
      return;
    }
    const response = await supabaseService.updateUser(email, {
      nome: nome?.trim(),
      sexo: sexo,
      dataNascimento,
    });
    if (response.data) {
      Alert.alert("Usuário atualizado com sucesso");
      router.back();
    } else
    if (response.error) {
      console.log(response.error);
    }
  };

  const formatDate = (date: Date) => {
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={systemStyle.form}>
            <View>
              <Text style={systemStyle.labelInput}>Email</Text>
              <TextInput
                style={systemStyle.input}
                placeholder="Email"
                onChangeText={setEmail}
                value={email}
                keyboardType="email-address"
                autoCapitalize="none"
                textContentType="emailAddress"
                disableFullscreenUI={true}
              />
            </View>
            <View>
              <Text style={systemStyle.labelInput}>Nome</Text>
              <TextInput
                style={systemStyle.input}
                placeholder="Nome"
                onChangeText={setNome}
                value={nome}
              />
            </View>
            <View>
              <Text style={systemStyle.labelInput}>Data de Nascimento</Text>
              <Pressable onPress={() => setShowDatePicker(true)}>
                <TextInput
                  style={systemStyle.input}
                  placeholder="Data de Nascimento"
                  value={formatDate(dataNascimento)}
                  editable={false}
                />
              </Pressable>
              {showDatePicker && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={dataNascimento}
                  mode="date"
                  display="default"
                  onChange={(_, selectedDate) => {
                    setShowDatePicker(false); // Fecha o DatePicker após seleção
                    if (selectedDate) {
                      setDataNascimento(selectedDate); // Atualiza a data
                    }
                  }}
                />
              )}
            </View>
            <View>
              <Text style={systemStyle.labelInput}>Sexo</Text>
              <Picker
                selectedValue={sexo}
                onValueChange={(itemValue: any) => setSexo(itemValue)}
                selectionColor="#9A4DFF"
                style={systemStyle.input}
              >
                <Picker.Item label="Selecione" value="" />
                <Picker.Item label="Feminino" value="F" />
                <Picker.Item label="Masculino" value="M" />
              </Picker>
            </View>
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <Pressable
            style={systemStyle.buttonOutlined}
            onPress={() => router.back()}
          >
            <Text style={systemStyle.buttonTextOutlined}>Voltar</Text>
          </Pressable>
          <Pressable style={systemStyle.button} onPress={updateUser}>
            <Text style={systemStyle.buttonText}>Salvar</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const makeStyle = (colors: any, systemStyle: any) => {
  return StyleSheet.create({
    container: {
      height: "100%",
      width: "100%",
      paddingHorizontal: 20,
    },
    scrollView: {
      height: "100%",
    },
    footer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 20,
    },
  });
};
