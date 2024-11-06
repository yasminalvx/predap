import { StyleSheet } from "react-native";

export const makeSystemStyle = (colors: any) => StyleSheet.create({
  activityIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mainContainer: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    marginTop: 50,
    marginHorizontal: 30,
    width: "70%",
  },
  logoContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  logoTitle: {
    fontSize: 24,
    marginVertical: 20,
    fontFamily: "Roboto",
    fontStyle: "italic",
  },
  logo: {
    width: 100,
    height: 100,
    backgroundColor: "#9A4DFF",
  },
  form: {
    marginVertical: 40,
  },
  input: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 2,
    borderColor: "#C7C7C7",
    borderRadius: 8,
    backgroundColor: "#F6F6F6",
    color: colors?.inputText,
  },
  button: {
    borderRadius: 12,
    backgroundColor: "#9A4DFF",
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginBottom: 10,
  },
  buttonOutlined: {
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#9A4DFF",
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonTextOutlined: {
    color: "#9A4DFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  checkbox: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  text: {
    color: colors?.text,
  },
  labelInput: {
    color: colors?.text,
    fontSize: 16,
    fontWeight: "500"
  }
});
