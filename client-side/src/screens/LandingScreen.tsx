import { View, Text, Pressable, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Onboarding">;

export default function LandingScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lessora AI Mobile</Text>
      <Text style={styles.subtitle}>
       AI-Powered Lesson Planning
      </Text>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.buttonText}>Log In</Text>
      </Pressable>
      <Pressable
        style={[styles.button, styles.secondary]}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={[styles.buttonText, styles.secondaryText]}>Register</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#eef2ff",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#312e81",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#4b5563",
    marginBottom: 32,
    lineHeight: 24,
  },
  button: {
    backgroundColor: "#4338ca",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  secondary: {
    backgroundColor: "#e0e7ff",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryText: {
    color: "#4338ca",
  },
});
