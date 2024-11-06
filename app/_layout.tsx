// // RootLayout.tsx
// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import { useFonts } from 'expo-font';
// import { Stack } from 'expo-router';
// import * as SplashScreen from 'expo-splash-screen';
// import { useEffect, useState } from 'react';
// import 'react-native-reanimated';
// import { Button, View } from 'react-native';

// SplashScreen.preventAutoHideAsync();

// export default function RootLayout() {
//   const [loaded] = useFonts({
//     SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
//   });

//   const [isDarkTheme, setIsDarkTheme] = useState(false);

//   // Alterna o tema entre claro e escuro
//   const toggleTheme = () => setIsDarkTheme((prev) => !prev);

//   useEffect(() => {
//     if (loaded) {
//       SplashScreen.hideAsync();
//     }
//   }, [loaded]);

//   if (!loaded) {
//     return null;
//   }

//   return (
//     <ThemeProvider value={isDarkTheme ? DarkTheme : DefaultTheme}>
//       <View style={{ flex: 1 }}>
//         {/* Botão para alternar o tema, exibido em todas as telas */}
//         <Button title="Alterar Tema" onPress={toggleTheme} />
        
//         {/* Conteúdo da navegação */}
//         <Stack>
//           <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//           <Stack.Screen name="(auth)/Login" options={{ headerShown: false }} />
//           <Stack.Screen name="(auth)/CriarConta" options={{ title: "Criar Conta" }} />
//           <Stack.Screen name="(auth)/EsqueciSenha" options={{ title: "Esqueci Senha" }} />
//           <Stack.Screen name="timer" options={{ title: "Timer" }} />
//           <Stack.Screen name="+not-found" />
//         </Stack>
//       </View>
//     </ThemeProvider>
//   );
// }

// RootLayout.tsx
import { Stack } from 'expo-router';
import { ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ThemeProvider, useTheme } from '../components/ThemeContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
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
      <ThemeConsumerLayout />
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
          <Stack.Screen name="(auth)/CriarConta" options={{ title: "Criar Conta" }} />
          <Stack.Screen name="(auth)/EsqueciSenha" options={{ title: "Esqueci Senha" }} />
          <Stack.Screen name="timer" options={{ title: "Timer" }} />
          <Stack.Screen name="(pages)/preferences" options={{ title: "Preferências" }} />
          <Stack.Screen name="(pages)/profile" options={{ title: "Perfil" }} />
          <Stack.Screen name="+not-found" />
      </Stack>
    </NavigationThemeProvider>
  );
}
