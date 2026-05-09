import React from "react";
import { View, Text, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Register">;
};

export default function RegisterScreen({ navigation }: Props) {
  return (
    <SafeAreaView className="flex-1 bg-soft-gray">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 24 }}>
          <View className="mb-10">
            <Text className="text-navy font-poppins-bold text-4xl mb-2">Create Account</Text>
            <Text className="text-secondary font-poppins text-base">
              Join Lessora AI and supercharge your teaching.
            </Text>
          </View>

          <View className="bg-white p-6 rounded-3xl shadow-sm shadow-navy/5 mb-8">
            <Input
              label="Full Name"
              placeholder="Jane Doe"
              autoCapitalize="words"
              icon="person-outline"
            />
            <Input
              label="Email Address"
              placeholder="teacher@school.edu"
              keyboardType="email-address"
              autoCapitalize="none"
              icon="mail-outline"
            />
            <Input
              label="Password"
              placeholder="••••••••"
              isPassword
              icon="lock-closed-outline"
            />
            
            <View className="mt-6">
              <Button
                title="Sign Up"
                variant="glowing"
                onPress={() => navigation.navigate("Main")}
              />
            </View>
          </View>

          <View className="flex-row justify-center mt-4">
            <Text className="text-secondary font-poppins text-sm">Already have an account? </Text>
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
