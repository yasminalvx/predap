import { useTheme } from "@/components/ThemeContext";
import { Colors } from "@/constants/Colors";
import { makeSystemStyle } from "@/constants/genericStyles";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function PreferencesScreen() {
  const { toggleTheme, isDarkTheme } = useTheme();
  const colorScheme = isDarkTheme ? "dark" : "light";
  const systemStyle = makeSystemStyle(Colors[colorScheme || "light"]);
  const styles = makeStyle(Colors[colorScheme || "light"]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setRefreshing(false);
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.menu}>
            <View style={styles.item}>
              <Text style={styles.titleItemMenu}>Alterar tema do Sistema</Text>
            </View>
            <View style={styles.switch}>
              <Switch
                trackColor={{ false: "#767577", true: "#9A4DFF" }}
                thumbColor={isDarkTheme ? "#f4f3f4" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleTheme}
                value={isDarkTheme}
              />
              <Text style={systemStyle.text}> {isDarkTheme ? "Escuro" : "Claro"}</Text>
            </View>
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <Pressable style={systemStyle.button} onPress={() => router.back()}>
            <Text style={systemStyle.buttonText}>Voltar</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const makeStyle = (colors: any) => {
  return StyleSheet.create({
    container: {
      height: "100%",
      width: "100%",
    },
    menu: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      gap: 10,
      padding: 20,
      height: "100%",
    },
    scrollView: {
      height: "100%",
    },
    item: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      paddingBottom: 10,
    },
    titleItemMenu: {
      fontSize: 18,
      color: colors.text,
      fontWeight: "bold",
      padding: 10,
    },
    footer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    switch: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
    }
  });
};
