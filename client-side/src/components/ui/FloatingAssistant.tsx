import React, { useEffect } from "react";
import { TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from "react-native-reanimated";

export default function FloatingAssistant() {
  const translateY = useSharedValue(0);
  const glowOpacity = useSharedValue(0.5);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 1500 }),
        withTiming(0, { duration: 1500 })
      ),
      -1,
      true
    );

    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500 }),
        withTiming(0.5, { duration: 1500 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <Animated.View style={[animatedStyle, { position: "absolute", bottom: 100, right: 20, zIndex: 50 }]}>
      <TouchableOpacity activeOpacity={0.8} className="items-center justify-center">
        <Animated.View
          style={[glowStyle]}
          className="absolute w-16 h-16 rounded-full bg-purple/30"
        />
        <View className="w-14 h-14 rounded-full bg-navy items-center justify-center shadow-lg shadow-navy/50 border border-purple/30">
          <Ionicons name="sparkles" size={24} color="#C6B6FF" />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
