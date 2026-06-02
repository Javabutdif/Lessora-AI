import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import Button from "../../components/ui/Button";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "ResetPasswordSuccess"
  >;
};

export default function PasswordResetSuccessScreen({ navigation }: Props) {
  return (
    <SafeAreaView className="flex-1 bg-soft-gray">
      <View className="flex-1 items-center justify-center px-6">
        {/* Success Icon */}
        <View className="mb-8">
          <View className="w-20 h-20 bg-green-500/20 rounded-full items-center justify-center">
            <Text className="text-4xl">✓</Text>
          </View>
        </View>

        {/* Success Message */}
        <Text className="text-navy font-poppins-bold text-3xl mb-4 text-center">
          Password Reset Successful
        </Text>

        <Text className="text-secondary font-poppins text-base text-center mb-10">
          Your password has been successfully reset. You can now log in with
          your new password.
        </Text>

        {/* Back to Login Button */}
        <Button
          title="Back to Login"
          variant="primary"
          onPress={() => {
            // Clear navigation stack and navigate to Login
            navigation.navigate("Login");
          }}
        />
      </View>
    </SafeAreaView>
  );
}
