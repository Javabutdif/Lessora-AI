import React from "react";
import { TouchableOpacity, Text, TouchableOpacityProps, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "glowing";
  icon?: keyof typeof Ionicons.glyphMap;
  isLoading?: boolean;
}

export default function Button({
  title,
  variant = "primary",
  icon,
  isLoading,
  className = "",
  ...props
}: ButtonProps) {
  const getContainerStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-royal py-4 rounded-2xl flex-row justify-center items-center";
      case "secondary":
        return "bg-soft-blue py-4 rounded-2xl flex-row justify-center items-center";
      case "outline":
        return "bg-transparent border-2 border-royal py-3.5 rounded-2xl flex-row justify-center items-center";
      case "ghost":
        return "bg-transparent py-4 rounded-2xl flex-row justify-center items-center";
      case "glowing":
        return "py-4 rounded-2xl flex-row justify-center items-center";
      default:
        return "bg-royal py-4 rounded-2xl flex-row justify-center items-center";
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case "primary":
      case "glowing":
        return "text-white font-poppins-semi text-base";
      case "secondary":
      case "outline":
      case "ghost":
        return "text-royal font-poppins-semi text-base";
      default:
        return "text-white font-poppins-semi text-base";
    }
  };

  if (variant === "glowing") {
    return (
      <TouchableOpacity activeOpacity={0.8} {...props} className={`w-full ${className}`}>
        <LinearGradient
          colors={["#4A7DFF", "#8A3FFC"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="py-4 rounded-2xl flex-row justify-center items-center shadow-lg shadow-purple/50"
        >
          {icon && <Ionicons name={icon} size={20} color="#FFFFFF" className="mr-2" />}
          <Text className={getTextStyle()}>{title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className={`${getContainerStyles()} ${className}`}
      {...props}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={20}
          color={variant === "primary" ? "#FFFFFF" : "#2F5BFF"}
          style={{ marginRight: 8 }}
        />
      )}
      <Text className={getTextStyle()}>{title}</Text>
    </TouchableOpacity>
  );
}
