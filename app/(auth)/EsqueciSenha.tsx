import { useTheme } from "@/components/ThemeContext";
import { Colors } from "@/constants/Colors";
import { makeSystemStyle } from "@/constants/genericStyles";
import { SupabaseService } from "@/services/supabase.service";
import React, { useState } from "react";
import { Alert, Image, Pressable, Text, TextInput, View } from "react-native";

export default function EsqueciSenha({ navigation }: any) {
  const [email, setEmail] = useState("");
  const supabaseService = new SupabaseService();
  const { isDarkTheme } = useTheme();
  const colorScheme = isDarkTheme ? "dark" : "light";
  const systemStyle = makeSystemStyle(Colors[colorScheme || "light"]);

  const handleForgotPassword = async () => {
    const { error } = await supabaseService.resetPasswordForEmail(email);
    if (error) {
      Alert.alert("Erro", error.message);
    } else {
      Alert.alert("Sucesso", "Verifique seu email para redefinir a senha");
      navigation.navigate("Login");
    }
  }

  return (
    <View style={systemStyle.mainContainer}>
      <View style={systemStyle.container}>
        <View style={systemStyle.logoContainer}>
          <Text style={systemStyle.logoTitle}>PREDAP</Text>
          <Image
            style={systemStyle.logo}
            source={require("@/assets/images/splash.png")}
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
