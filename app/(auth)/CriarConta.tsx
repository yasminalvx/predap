import { useAlert } from "@/components/Alert";
import { useTheme } from "@/components/ThemeContext";
import { Colors } from "@/constants/Colors";
import { makeSystemStyle } from "@/constants/genericStyles";
import { SupabaseService } from "@/services/supabase.service";
import Checkbox from "expo-checkbox";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";

export default function CriarConta() {
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [password, setPassword] = useState("");
  const [isChecked, setChecked] = useState(false);
  const supabaseService = new SupabaseService();
  const { isDarkTheme } = useTheme();
  const colorScheme = isDarkTheme ? "dark" : "light";
  const systemStyle = makeSystemStyle(Colors[colorScheme || "light"]);
  const showAlert = useAlert();

  const handleSignUp = async () => {
    const { error } = await supabaseService.signUp(email, password, { nome, perfil: isChecked ? "fisioterapeuta" : "paciente" });
    if (error) {
      console.error(error);
      showAlert(error.message);
    } else {
      router.navigate("Login" as any);
    }
  };

  return (
    <View style={systemStyle.mainContainer}>
      <View style={systemStyle.container}>
        <View style={systemStyle.logoContainer}>
          <Text style={systemStyle.logoTitle}>PREDAP</Text>
          <Image
            style={systemStyle.logo}
            source={require("@/assets/images/logo.png")}
          ></Image>
        </View>
        <View style={systemStyle.form}>
          <TextInput
            style={systemStyle.input}
            placeholder="Nome"
            onChangeText={setNome}
            value={nome}
          />
          <TextInput
            style={systemStyle.input}
            placeholder="Email"
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
            textContentType="emailAddress"
          />
          <TextInput
            style={systemStyle.input}
            placeholder="Senha"
            secureTextEntry
            onChangeText={setPassword}
            value={password}
          />
          <View style={systemStyle.checkbox}>
            <Checkbox
              value={isChecked}
              onValueChange={setChecked}
              color={isChecked ? '#4630EB' : undefined}
            />
            <Text style={systemStyle.text}>Sou o(a) Fisioterapeuta</Text>
          </View>
        </View>
        <Pressable style={systemStyle.button} onPress={handleSignUp}>
          <Text style={systemStyle.buttonText}>Criar Conta</Text>
        </Pressable>
      </View>
    </View>
  );
}
