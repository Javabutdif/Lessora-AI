import { ReactNode } from "react";
import { View, ViewProps } from "react-native";

interface GlassCardProps extends ViewProps {
  children: ReactNode;
}

export default function GlassCard({ children, style, ...props }: GlassCardProps) {
  return (
    <View
      style={[
        {
          backgroundColor: "rgba(255,255,255,0.78)",
          borderColor: "rgba(255,255,255,0.9)",
          borderWidth: 1,
          borderRadius: 28,
          shadowColor: "#06145F",
          shadowOpacity: 0.08,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 12 },
          overflow: "hidden",
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
