import { Text, View } from "react-native";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export default function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <View className="mb-4 flex-row items-end justify-between">
      <View>
        <Text className="text-xl font-bold text-[#0B102B]">{title}</Text>
        {subtitle ? (
          <Text className="text-sm text-[#5B6280]">{subtitle}</Text>
        ) : null}
      </View>
    </View>
  );
}
