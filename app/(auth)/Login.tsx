import { Colors } from "@/constants/Colors";
import { makeSystemStyle } from "@/constants/genericStyles";
import { SupabaseService } from "@/services/supabase.service";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, Pressable, Text, TextInput, useColorScheme, View } from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const supabaseService = new SupabaseService();
  const colorScheme = useColorScheme();
  const systemStyle = makeSystemStyle(Colors[colorScheme || "light"]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Email e senha são obrigatórios");
      return;
    }
    const entity = {
      email: email.trim(),
      password: password.trim()
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(entity.email)) {
      Alert.alert("Email inválido");
      return;
    }
    const { error } = await supabaseService.login(entity.email, entity.password);
    if (error) Alert.alert(error.message);
    else router.navigate('/' as any);
  };

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
          <TextInput
            style={systemStyle.input}
            placeholder="Password"
            secureTextEntry
            onChangeText={setPassword}
            value={password}
          />
        </View>
        <Pressable style={systemStyle.button} onPress={handleLogin}>
          <Text style={systemStyle.buttonText}>Login</Text>
        </Pressable>
        <Pressable
          style={systemStyle.button}
          onPress={() => router.navigate('CriarConta' as any)}
        >
          <Text style={systemStyle.buttonText}>Criar Conta</Text>
        </Pressable>
        <Pressable
          style={systemStyle.button}
          onPress={() => router.navigate('EsqueciSenha' as any)}
        >
          <Text style={systemStyle.buttonText}>Recuperar Senha</Text>
        </Pressable>
      </View>
    </View>
  );
}
