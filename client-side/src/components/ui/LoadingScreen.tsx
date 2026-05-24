import React from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

export default function LoadingScreen() {
  const { width } = useWindowDimensions();
  const logoSize = Math.min(width * 0.62, 220);

  return (
    <View className="flex-1 items-center justify-center bg-soft-gray px-8">
      <Image
        source={require("../../assets/LessoraLogo.png")}
        style={{ width: logoSize, height: logoSize, marginBottom: 32 }}
        resizeMode="contain"
        accessibilityLabel="Lessora AI logo"
      />
      <ActivityIndicator color="#2F5BFF" size="large" />
      <Text className="mt-4 text-center font-poppins-semi text-sm text-secondary">
        Loading Lessora AI
      </Text>
    </View>
  );
}
