// RootLayout.tsx
import { Stack } from "expo-router";
import { ThemeProvider as NavigationThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ThemeProvider, useTheme } from "../components/ThemeContext";
import { AlertProvider } from "@/components/Alert";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <AlertProvider>
        <ThemeConsumerLayout />
      </AlertProvider>
    </ThemeProvider>
  );
}

// Layout que consome o tema do contexto
function ThemeConsumerLayout() {
  const { theme } = useTheme();

  return (
    <NavigationThemeProvider value={theme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/Login" options={{ headerShown: false }} />
        <Stack.Screen
          name="(auth)/CriarConta"
          options={{ title: "Criar Conta" }}
        />
        <Stack.Screen
          name="(auth)/EsqueciSenha"
          options={{ title: "Esqueci Senha" }}
        />
        <Stack.Screen
          name="(auth)/ResetarSenha"
          options={{ title: "Resetar Senha" }}
        />
        <Stack.Screen name="timer" options={{ title: "Fazer Exercício Diário" }} />
        <Stack.Screen
          name="(pages)/preferences"
          options={{ title: "Preferências" }}
        />
        <Stack.Screen name="(pages)/profile" options={{ title: "Perfil" }} />
        <Stack.Screen
          name="(pages)/selecionar-paciente"
          options={{ title: "Selecionar Paciente", headerBackVisible: false }}
        />
        <Stack.Screen
          name="(pages)/atribuir-treino"
          options={{
            title: "Adicionar Treino",
            headerBackVisible: false,
          }}
        />
        <Stack.Screen
          name="(pages)/details-paciente"
          options={{
            title: "Visualizar Paciente",
            headerBackVisible: false,
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
    </NavigationThemeProvider>
  );
}
