import React, { createContext, useContext, useState } from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "./ThemeContext";
import { Colors } from "@/constants/Colors";

const AlertContext = createContext<any>(undefined);

export const AlertProvider = ({ children }: any) => {
  const [alertState, setAlertState] = useState({
    visible: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const showAlert = (title: string, message: string, onConfirm: () => {}) => {
    setAlertState({ visible: true, title, message, onConfirm });
  };

  const hideAlert = () => {
    setAlertState({ ...alertState, visible: false });
  };

  return (
    <AlertContext.Provider value={showAlert}>
      {children}
      {alertState.visible && (
        <Modal transparent animationType="fade" visible={alertState.visible}>
          <View style={styles.overlay}>
            <View style={styles.alertBox}>
              <Text style={styles.alertTitle}>{alertState.title}</Text>
              <Text style={styles.alertMessage}>{alertState.message}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    if (alertState.onConfirm) alertState.onConfirm();
                    hideAlert();
                  }}
                >
                  <Text style={styles.buttonText}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </AlertContext.Provider>
  );
};

const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    alertBox: {
      width: 300,
      padding: 20,
      backgroundColor: "white",
      borderRadius: 10,
      alignItems: "center",
    },
    alertTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
    },
    alertMessage: {
      fontSize: 16,
      textAlign: "center",
      marginBottom: 20,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "center",
    },
    button: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: "#007BFF",
      borderRadius: 5,
    },
    buttonText: {
      color: "white",
      fontWeight: "bold",
      fontSize: 16,
    },
});

export const useAlert = () => useContext(AlertContext);
