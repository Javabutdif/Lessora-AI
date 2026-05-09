import React from "react";
import { View, ViewProps } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface CardProps extends ViewProps {
  variant?: "default" | "glass" | "gradient";
}

export default function Card({ variant = "default", className = "", children, ...props }: CardProps) {
  if (variant === "gradient") {
    return (
      <LinearGradient
        colors={["#4A7DFF", "#2F5BFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className={`rounded-3xl p-5 shadow-lg shadow-royal/30 ${className}`}
        {...props}
      >
        {children}
      </LinearGradient>
    );
  }

  if (variant === "glass") {
    return (
      <View
        className={`rounded-3xl p-5 bg-white/80 border border-white/40 shadow-sm shadow-navy/5 ${className}`}
        {...props}
      >
        {children}
      </View>
    );
  }

  return (
    <View
      className={`rounded-3xl p-5 bg-white shadow-sm shadow-navy/5 ${className}`}
      {...props}
    >
      {children}
    </View>
  );
}
