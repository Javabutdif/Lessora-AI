import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { register } from "../../services/api";
import Toast from "react-native-toast-message";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Register">;
};

export default function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");
      const res = await register({ name, email, password });

      if (res) {
        Toast.show({
          type: "success",
          text1: res,
          text2: "Your account has been created.",
        });
        navigation.navigate("Login");
      }
      // Optionally navigate after a short delay or immediately
      // navigation.navigate("Main");
    } catch (error: any) {
      const msg = error.message || "An error occurred during registration.";
      setErrorMessage(msg);
      Toast.show({
        type: "error",
        text1: "Registration Failed",
        text2: msg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-soft-gray">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            padding: 24,
          }}
        >
          <View className="mb-10">
            <Text className="text-navy font-poppins-bold text-4xl mb-2">
              Create Account
            </Text>
            <Text className="text-secondary font-poppins text-base">
              Join Lessora AI and supercharge your teaching.
            </Text>
          </View>

          <View className="bg-white p-6 rounded-3xl shadow-sm shadow-navy/5 mb-8">
            {errorMessage ? (
              <Text className="text-red-500 font-poppins text-sm mb-4 text-center">
                {errorMessage}
              </Text>
            ) : null}
            <Input
              label="Full Name"
              placeholder="Jane Doe"
              autoCapitalize="words"
              icon="person-outline"
              value={name}
              onChangeText={setName}
            />
            <Input
              label="Email Address"
              placeholder="teacher@school.edu"
              keyboardType="email-address"
              autoCapitalize="none"
              icon="mail-outline"
              value={email}
              onChangeText={setEmail}
            />
            <Input
              label="Password"
              placeholder="••••••••"
              isPassword
              icon="lock-closed-outline"
              value={password}
              onChangeText={setPassword}
            />

            <View className="mt-6">
              <Button
                title={isLoading ? "Signing Up..." : "Sign Up"}
                variant="glowing"
                onPress={handleRegister}
                disabled={isLoading}
              />
            </View>
          </View>

          <View className="flex-row justify-center mt-4">
            <Text className="text-secondary font-poppins text-sm">
              Already have an account?{" "}
            </Text>
            <Text
              className="text-royal font-poppins-semi text-sm"
              onPress={() => navigation.navigate("Login")}
            >
              Log In
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
