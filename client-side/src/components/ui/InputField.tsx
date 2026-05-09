import { TextInput, TextInputProps, View, Text } from "react-native";

interface InputFieldProps extends TextInputProps {
  label: string;
  hint?: string;
}

export default function InputField({ label, hint, style, ...props }: InputFieldProps) {
  return (
    <View className="space-y-2">
      <Text className="text-sm font-semibold text-[#5B6280]">{label}</Text>
      <TextInput
        className="rounded-[24px] border border-[#E8EAFB] bg-white px-4 py-4 text-base text-[#0B102B] shadow-sm"
        placeholderTextColor="#8E95B2"
        style={style}
        {...props}
      />
      {hint ? <Text className="text-xs text-[#8E95B2]">{hint}</Text> : null}
    </View>
  );
}
