import { Colors } from "@/constants/Colors";
import { makeSystemStyle } from "@/constants/genericStyles";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, useColorScheme, View } from "react-native";
import { useTheme } from "./ThemeContext";

const DateNavigator = ({ onDateChange, startDate }: { onDateChange: (date: Date) => void; startDate?: Date }) => {
  const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
  const [currentDate, setCurrentDate] = useState(startDate || new Date());
  const { isDarkTheme } = useTheme();
  const colorScheme = isDarkTheme ? "dark" : "light";
  const systemStyle = makeSystemStyle(Colors[colorScheme || "light"]);
  const styles = makeStyles(Colors[colorScheme || "light"]);

  const goToPreviousDate = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
    onDateChange(newDate);
  };

  const goToNextDate = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
    onDateChange(newDate);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    onDateChange(today);
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={goToPreviousDate}>
        <Text style={systemStyle.buttonText}>{"<"}</Text>
      </Pressable>
      <Text style={styles.dateText}>
        {diasSemana[currentDate.getDay()] +
          " - " +
          currentDate.toLocaleDateString()}
      </Text>
      <Pressable style={styles.button} onPress={goToNextDate}>
        <Text style={systemStyle.buttonText}>{">"}</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={goToToday}>
        <Text style={systemStyle.buttonText}> Hoje </Text>
      </Pressable>
    </View>
  );
};

const makeStyles = (colors: any) => StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 20,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: colors?.text,
  },
  button: {
    borderRadius: 8,
    backgroundColor: "#9A4DFF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
});

export default DateNavigator;
