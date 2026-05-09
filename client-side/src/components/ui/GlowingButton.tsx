import { Pressable, Text, View, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";

interface GlowingButtonProps {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  glow?: string[];
}

export default function GlowingButton({ label, onPress, style, glow }: GlowingButtonProps) {
  const opacity = useSharedValue(0.8);
  const scale = useSharedValue(0.98);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 900 }), -1, true);
    scale.value = withRepeat(withTiming(1, { duration: 900 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
    backgroundColor: glow ? "transparent" : "rgba(74,125,255,0.12)",
  }));

  return (
    <Pressable
      onPress={onPress}
      className="overflow-hidden rounded-[24px]"
      style={style}
    >
      <Animated.View
        style={[animatedStyle, { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }]}
      />
      <View
        className="rounded-[24px] px-6 py-4 items-center justify-center"
        style={{
          backgroundColor: "#2F5BFF",
          shadowColor: "#2F5BFF",
          shadowOpacity: 0.24,
          shadowRadius: 22,
          shadowOffset: { width: 0, height: 12 },
        }}
      >
        <Text className="text-base font-semibold text-white">{label}</Text>
      </View>
    </Pressable>
  );
}
