import React, { useState } from "react";
import { View, TextInput, Text, TextInputProps, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface InputProps extends TextInputProps {
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
  error?: string;
}

export default function Input({
  label,
  icon,
  isPassword,
  error,
  className = "",
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`mb-4 ${className}`}>
      {label && <Text className="text-secondary font-poppins-semi text-sm mb-2">{label}</Text>}
      
      <View
        className={`flex-row items-center bg-white border ${
          error ? "border-red-500" : isFocused ? "border-royal" : "border-gray-200"
        } rounded-2xl px-4 py-3.5`}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={isFocused ? "#2F5BFF" : "#8E95B2"}
            style={{ marginRight: 10 }}
          />
        )}
        
        <TextInput
          className="flex-1 text-primary font-poppins text-base"
          placeholderTextColor="#8E95B2"
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#8E95B2"
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && <Text className="text-red-500 font-poppins text-xs mt-1 ml-1">{error}</Text>}
    </View>
  );
}
