import { View, Text, Pressable, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Lessora AI</Text>
      <Text style={styles.subtitle}>
        You are signed in. The server-side API is available at /api/auth.
      </Text>
      <Pressable style={styles.button} onPress={() => navigation.popToTop()}>
        <Text style={styles.buttonText}>Back to landing</Text>
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
    fontSize: 28,
    fontWeight: "700",
    color: "#312e81",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#4b5563",
    lineHeight: 24,
    marginBottom: 32,
  },
  button: {
    backgroundColor: "#4338ca",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
});
