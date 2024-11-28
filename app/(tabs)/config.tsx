import { useTheme } from "@/components/ThemeContext";
import { Colors } from "@/constants/Colors";
import { makeSystemStyle } from "@/constants/genericStyles";
import { SupabaseService } from "@/services/supabase.service";
import { router, useNavigation } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function ConfigScreen() {
  const [name, setName]: any = useState(null);
  const supabaseService = new SupabaseService();
  const { isDarkTheme } = useTheme();
  const colorScheme = isDarkTheme ? "dark" : "light";
  const systemStyle = makeSystemStyle(Colors[colorScheme || "light"]);
  const styles = makeStyle(Colors[colorScheme || "light"]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getUser();
    });
    return unsubscribe;
  }, [navigation]);

  const getUser = async () => {
    const response = await supabaseService.checkUserLoggedIn();
    if (!response.data.user) {
      router.navigate("Login" as any);
    } else {
      setName(response.data.user.user_metadata.nome);
    }
  }

  const handleLogout = async () => {
    await supabaseService.supabase.auth.signOut();
    router.navigate("/Login");
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    getUser();
    setRefreshing(false);
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Configurações</Text>
        </View>
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.menu}>
            <Text style={styles.titleCategoryMenu}>Conta</Text>
            <TouchableHighlight
              activeOpacity={0.6}
              underlayColor={Colors[colorScheme || "light"].underlayColor}
              style={styles.item}
              onPress={() => router.navigate("/(pages)/profile" as any)}
            >
              <View style={styles.profile}>
                <View style={styles.circle}></View>
                <Text style={styles.profileName}>
                  {name}
                </Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              activeOpacity={0.6}
              underlayColor={Colors[colorScheme || "light"].underlayColor}
              style={styles.item}
              onPress={() => router.navigate("/(pages)/preferences" as any)}
            >
              <Text style={styles.titleItemMenu}>Preferências</Text>
            </TouchableHighlight>
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <Pressable style={systemStyle.button} onPress={handleLogout}>
            <Text style={systemStyle.buttonText}>Sair</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const makeStyle = (colors: any) => {
  return StyleSheet.create({
    titleContainer: {
      flexDirection: "row",
      padding: 20,
    },
    container: {
      height: "100%",
      width: "100%",
    },
    menu: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: 20,
      height: "100%",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.text,
    },
    scrollView: {
      height: "100%",
    },
    item: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      borderBottomWidth: 1,
      borderBottomColor: colors.border || "red",
      paddingVertical: 10,
    },
    titleCategoryMenu: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text,
      paddingBottom: 10,
    },
    titleItemMenu: {
      fontSize: 18,
      color: colors.text,
      fontWeight: "bold",
      padding: 10,
    },
    circle: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: "#C0C0C0",
    },
    profile: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    profileName: {
      color: colors.text,
      fontSize: 18,
      maxWidth: 300,
    },
    footer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
  });
};
