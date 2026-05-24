import React from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { login as loginRequest } from "../../services/api";
import Toast from "react-native-toast-message";
import { useAuth } from "../../context/AuthContext";
import { useSuppressGlobalRequestOverlay } from "../../context/RequestLoadingContext";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Login">;
};

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { login } = useAuth();
  const isLoginLoading = isSubmitting;

  useSuppressGlobalRequestOverlay();

  const handleLogin = async () => {
    if (isSubmitting) {
      return;
    }

    if (!email || !password) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please fill in all fields.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const session = await loginRequest({ email, password });
      await login(session.token);
      Toast.show({
        type: "success",
        text1: `Welcome back, ${session.user.name}!`,
        text2: "You have successfully logged in.",
      });
    } catch (error: any) {
      const msg = error.message || "An error occurred during login.";
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: msg,
      });
    } finally {
      setIsSubmitting(false);
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
              Welcome Back
            </Text>
            <Text className="text-secondary font-poppins text-base">
              Sign in to continue planning with Lessora AI.
            </Text>
          </View>

          <View className="bg-white p-6 rounded-3xl shadow-sm shadow-navy/5 mb-8">
            <Input
              label="Email Address"
              placeholder="teacher@school.edu"
              keyboardType="email-address"
              autoCapitalize="none"
              icon="mail-outline"
              value={email}
              onChangeText={setEmail}
              editable={!isLoginLoading}
            />
            <Input
              label="Password"
              placeholder="••••••••"
              isPassword
              icon="lock-closed-outline"
              value={password}
              onChangeText={setPassword}
              editable={!isLoginLoading}
            />
            <Text className="text-royal font-poppins-semi text-sm text-right mt-2 mb-6">
              Forgot Password?
            </Text>

            <Button
              title={isLoginLoading ? "Signing in..." : "Log In"}
              variant="primary"
              onPress={() => handleLogin()}
              disabled={isLoginLoading}
              isLoading={isLoginLoading}
            />
          </View>

          <View className="flex-row justify-center mt-4">
            <Text className="text-secondary font-poppins text-sm">
              Don't have an account?{" "}
            </Text>
            <Text
              className="text-royal font-poppins-semi text-sm"
              onPress={() => navigation.navigate("Register")}
            >
              Sign Up
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
