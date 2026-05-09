import React from "react";
import { View, Text, Image, SafeAreaView } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import Button from "../components/ui/Button";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Onboarding">;
};

export default function OnboardingScreen({ navigation }: Props) {
  return (
    <SafeAreaView className="flex-1 bg-soft-gray">
      <View className="flex-1 justify-center items-center px-6 pt-10 pb-6">
        <View className="flex-1 justify-center items-center w-full">
          {/* Logo representation */}
          <View className="w-32 h-32 bg-white rounded-3xl items-center justify-center shadow-xl shadow-royal/20 mb-10">
            <Text className="text-navy font-poppins-bold text-6xl">L</Text>
            <View className="absolute top-4 right-4 w-3 h-3 bg-electric rounded-full" />
            <View className="absolute bottom-4 left-4 w-3 h-3 bg-purple rounded-full" />
          </View>
          
          <Text className="text-primary font-poppins-bold text-3xl text-center mb-4">
            AI-Powered Lesson Planning
          </Text>
          <Text className="text-secondary font-poppins text-base text-center px-4 leading-relaxed">
            Create engaging, standards-aligned lesson plans in seconds. Empower your teaching with Lessora AI.
          </Text>
        </View>

        <View className="w-full space-y-4">
          <Button
            title="Get Started"
            variant="glowing"
            icon="sparkles"
            onPress={() => navigation.navigate("Register")}
          />
          <Button
            title="Log In"
            variant="ghost"
            className="mt-4"
            onPress={() => navigation.navigate("Login")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
