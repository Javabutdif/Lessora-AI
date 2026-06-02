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
import { forgotPassword } from "../../services/api";
import Toast from "react-native-toast-message";
import { useSuppressGlobalRequestOverlay } from "../../context/RequestLoadingContext";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "ForgotPassword">;
};

export default function ForgotPasswordScreen({ navigation }: Props) {
  const [email, setEmail] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  useSuppressGlobalRequestOverlay();

  const handleForgotPassword = async () => {
    if (isSubmitting) {
      return;
    }

    if (!email) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please enter your email address.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await forgotPassword({ email });
      Toast.show({
        type: "success",
        text1: "Email Sent",
        text2: "Check your email for password reset instructions.",
      });
      // Navigate back to login after successful submission
      setTimeout(() => {
        navigation.navigate("Login");
      }, 1500);
    } catch (error: any) {
      const msg =
        error.message || "Failed to process request. Please try again.";
      Toast.show({
        type: "error",
        text1: "Request Failed",
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
            <Text className="text-navy font-poppins-bold text-3xl mb-2">
              Reset Password
            </Text>
            <Text className="text-secondary font-poppins text-base">
              Enter your email address and we'll send you a link to reset your
              password.
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
              editable={!isSubmitting}
            />

            <Button
              title={isSubmitting ? "Sending..." : "Send Reset Link"}
              variant="primary"
              onPress={() => handleForgotPassword()}
              disabled={isSubmitting}
              isLoading={isSubmitting}
            />
          </View>

          <View className="flex-row justify-center">
            <Text className="text-secondary font-poppins text-sm">
              Remember your password?{" "}
            </Text>
            <Text
              className="text-royal font-poppins-semi text-sm"
              onPress={() => navigation.navigate("Login")}
            >
              Back to Login
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
