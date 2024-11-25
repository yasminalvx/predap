import { useAlert } from "@/components/Alert";
import { useTheme } from "@/components/ThemeContext";
import { Colors } from "@/constants/Colors";
import { makeSystemStyle } from "@/constants/genericStyles";
import { SupabaseService } from "@/services/supabase.service";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";

export default function EsqueciSenha() {
  const [email, setEmail] = useState("");
  const supabaseService = new SupabaseService();
  const { isDarkTheme } = useTheme();
  const colorScheme = isDarkTheme ? "dark" : "light";
  const systemStyle = makeSystemStyle(Colors[colorScheme || "light"]);
  const showAlert = useAlert();

  const handleForgotPassword = async () => {
    const { error } = await supabaseService.resetPassword(email);
    if (error) {
      showAlert("Erro", error.message);
    } else {
      showAlert("Sucesso", "Verifique seu email para redefinir a senha", () => {
        router.navigate("Login" as any);
      });
    }
  }

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
            placeholder="Email"
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
            textContentType="emailAddress"
          />
        </View>
        <Pressable style={systemStyle.button} onPress={handleForgotPassword}>
          <Text style={systemStyle.buttonText}>Redefinir Senha</Text>
        </Pressable>
      </View>
    </View>
  );
}
