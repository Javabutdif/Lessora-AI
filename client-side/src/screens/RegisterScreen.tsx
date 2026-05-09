import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { register } from "@services/api";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await register({ name, email, password });
      navigation.replace("Home");
    } catch (error) {
      Alert.alert(
        "Registration failed",
        error instanceof Error ? error.message : "Unable to create account",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Pressable
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Creating account…" : "Register"}
        </Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Already have an account?</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#f8fafc",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#312e81",
    marginBottom: 24,
  },
  label: {
    marginTop: 16,
    fontSize: 14,
    color: "#4b5563",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dbeafe",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#111827",
  },
  button: {
    marginTop: 32,
    backgroundColor: "#4338ca",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  link: {
    marginTop: 20,
    textAlign: "center",
    color: "#4338ca",
    fontWeight: "600",
  },
});
