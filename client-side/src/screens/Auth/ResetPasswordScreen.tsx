import React, { useEffect } from "react";
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
import { resetPassword, verifyResetToken } from "../../services/api";
import Toast from "react-native-toast-message";
import { useSuppressGlobalRequestOverlay } from "../../context/RequestLoadingContext";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "ResetPassword">;
  route: any;
};

const PASSWORD_REQUIREMENTS = {
  minLength: { regex: /.{8,}/, label: "At least 8 characters" },
  uppercase: { regex: /[A-Z]/, label: "One uppercase letter" },
  lowercase: { regex: /[a-z]/, label: "One lowercase letter" },
  number: { regex: /[0-9]/, label: "One number" },
  special: { regex: /[!@#$%^&*]/, label: "One special character (!@#$%^&*)" },
};

function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  Object.values(PASSWORD_REQUIREMENTS).forEach((req) => {
    if (req.regex.test(password)) score++;
  });

  if (score === 0) return { score: 0, label: "", color: "" };
  if (score <= 2) return { score: 1, label: "Weak", color: "bg-red-500" };
  if (score <= 3) return { score: 2, label: "Fair", color: "bg-yellow-500" };
  if (score <= 4) return { score: 3, label: "Good", color: "bg-blue-500" };
  return { score: 4, label: "Strong", color: "bg-green-500" };
}

export default function ResetPasswordScreen({ navigation, route }: Props) {
  const token = route.params?.token;
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isVerifying, setIsVerifying] = React.useState(true);
  const [isResetting, setIsResetting] = React.useState(false);
  const [tokenValid, setTokenValid] = React.useState(false);

  useSuppressGlobalRequestOverlay();

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        Toast.show({
          type: "error",
          text1: "Invalid Request",
          text2: "No reset token provided.",
        });
        navigation.navigate("Login");
        return;
      }

      try {
        await verifyResetToken(token);
        setTokenValid(true);
      } catch (error: any) {
        Toast.show({
          type: "error",
          text1: "Invalid Token",
          text2: error.message || "Reset link is invalid or expired.",
        });
        navigation.navigate("Login");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [token, navigation]);

  const passwordStrength = getPasswordStrength(password);
  const allRequirementsMet = Object.values(PASSWORD_REQUIREMENTS).every((req) =>
    req.regex.test(password),
  );
  const passwordsMatch = password === confirmPassword && password.length > 0;

  const handleResetPassword = async () => {
    if (isResetting) return;

    if (!password || !confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please fill in all fields.",
      });
      return;
    }

    if (!allRequirementsMet) {
      Toast.show({
        type: "error",
        text1: "Weak Password",
        text2: "Your password doesn't meet all requirements.",
      });
      return;
    }

    if (!passwordsMatch) {
      Toast.show({
        type: "error",
        text1: "Passwords Don't Match",
        text2: "Please make sure both passwords are identical.",
      });
      return;
    }

    try {
      setIsResetting(true);
      await resetPassword({ token, newPassword: password });
      Toast.show({
        type: "success",
        text1: "Password Reset Successful",
        text2: "You can now log in with your new password.",
      });
      setTimeout(() => {
        navigation.navigate("ResetPasswordSuccess");
      }, 1000);
    } catch (error: any) {
      const msg =
        error.message || "Failed to reset password. Please try again.";
      Toast.show({
        type: "error",
        text1: "Reset Failed",
        text2: msg,
      });
    } finally {
      setIsResetting(false);
    }
  };

  if (isVerifying) {
    return (
      <SafeAreaView className="flex-1 bg-soft-gray items-center justify-center">
        <Text className="text-secondary font-poppins">
          Verifying reset link...
        </Text>
      </SafeAreaView>
    );
  }

  if (!tokenValid) {
    return null;
  }

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
              Create New Password
            </Text>
            <Text className="text-secondary font-poppins text-base">
              Enter a strong password to secure your account.
            </Text>
          </View>

          <View className="bg-white p-6 rounded-3xl shadow-sm shadow-navy/5 mb-6">
            <Input
              label="New Password"
              placeholder="••••••••"
              isPassword={!showPassword}
              icon={showPassword ? "eye-outline" : "eye-off-outline"}
              value={password}
              onChangeText={setPassword}
              editable={!isResetting}
            />

            {/* Password Strength Indicator */}
            {password.length > 0 && (
              <View className="mt-4 mb-4">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-secondary font-poppins text-xs">
                    Password Strength
                  </Text>
                  {passwordStrength.label && (
                    <Text
                      className={`font-poppins-semi text-xs ${
                        passwordStrength.color === "bg-red-500"
                          ? "text-red-500"
                          : passwordStrength.color === "bg-yellow-500"
                            ? "text-yellow-500"
                            : passwordStrength.color === "bg-blue-500"
                              ? "text-blue-500"
                              : "text-green-500"
                      }`}
                    >
                      {passwordStrength.label}
                    </Text>
                  )}
                </View>

                {/* Strength Bar */}
                <View className="flex-row gap-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  {[0, 1, 2, 3].map((index) => (
                    <View
                      key={index}
                      className={`flex-1 ${
                        index < passwordStrength.score
                          ? passwordStrength.color
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </View>

                {/* Requirements List */}
                <View className="mt-4 space-y-2">
                  {Object.entries(PASSWORD_REQUIREMENTS).map(([key, req]) => {
                    const met = req.regex.test(password);
                    return (
                      <View key={key} className="flex-row items-center">
                        <Text
                          className={`text-sm ${met ? "text-green-500" : "text-gray-400"}`}
                        >
                          {met ? "✓" : "○"} {req.label}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            <Input
              label="Confirm Password"
              placeholder="••••••••"
              isPassword={!showPassword}
              icon={showPassword ? "eye-outline" : "eye-off-outline"}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              editable={!isResetting}
            />

            <Button
              title={isResetting ? "Resetting..." : "Reset Password"}
              variant="primary"
              onPress={() => handleResetPassword()}
              disabled={isResetting || !allRequirementsMet || !passwordsMatch}
              isLoading={isResetting}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
