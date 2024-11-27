import { useAlert } from "@/components/Alert";
import { useTheme } from "@/components/ThemeContext";
import { Colors } from "@/constants/Colors";
import { makeSystemStyle } from "@/constants/genericStyles";
import { SupabaseService } from "@/services/supabase.service";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";

export default function ResetarSenha() {
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const supabase = new SupabaseService().supabase;
  const { isDarkTheme } = useTheme();
  const colorScheme = isDarkTheme ? "dark" : "light";
  const systemStyle = makeSystemStyle(Colors[colorScheme || "light"]);
  const showAlert = useAlert();

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.slice(1));
    setAccessToken(params.get("access_token") || '');
    setRefreshToken(params.get("refresh_token") || '');
  }, []);

  const handleResetPassword = async () => {
    const { error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken
    });

    if (sessionError) {
      console.error("Erro ao setar sessão:", sessionError.message);
      showAlert("Falha ao redefinir a senha.");
      return;
    }

    if (!accessToken) {
      showAlert("Token de acesso não encontrado!");
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      console.error("Erro ao redefinir senha:", updateError.message);
      const mapErrors: any = {
        "Token expired": "Token expirado",
        "New password should be different from the old password.": "A nova senha deve ser diferente da antiga.",
      }
      showAlert(mapErrors[updateError.message] || "Falha ao redefinir a senha.");
    } else {
      showAlert("Senha redefinida com sucesso!", "Agora você pode fazer login com sua nova senha.", () => {
        router.navigate("Login" as any);
      });
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
          />
        </View>
        <View style={systemStyle.form}>
          <TextInput
            style={systemStyle.input}
            placeholder="Nova Senha"
            onChangeText={setNewPassword}
            value={newPassword}
            secureTextEntry
          />
        </View>
        <Pressable style={systemStyle.button} onPress={handleResetPassword}>
          <Text style={systemStyle.buttonText}>Redefinir Senha</Text>
        </Pressable>
      </View>
    </View>
  );
};
