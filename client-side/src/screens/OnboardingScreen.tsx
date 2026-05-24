import React from "react";
import {
  View,
  Text,
  Image,
  SafeAreaView,
  useWindowDimensions,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import Button from "../components/ui/Button";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Onboarding">;
};

export default function OnboardingScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const logoSize = Math.min(width * 0.68, 250);

  return (
    <SafeAreaView className="flex-1 bg-soft-gray">
      <View className="flex-1 justify-center items-center px-6 pt-10 pb-6">
        <View className="flex-1 justify-center items-center w-full">
          {/* Logo */}
          <Image
            source={require("../assets/LessoraLogo.png")}
            style={{ width: logoSize, height: logoSize, marginBottom: 40 }}
            resizeMode="contain"
            accessibilityLabel="Lessora AI logo"
          />

          <Text className="text-primary font-poppins-bold text-3xl text-center mb-4">
            AI-Powered Lesson Planning
          </Text>
          <Text className="text-secondary font-poppins text-base text-center px-4 leading-relaxed">
            Create engaging, standards-aligned lesson plans in seconds. Empower
            your teaching with Lessora AI.
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
