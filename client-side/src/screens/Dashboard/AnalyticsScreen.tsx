import React from "react";
import { View, Text, SafeAreaView, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Card from "../../components/ui/Card";

export default function AnalyticsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-soft-gray">
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text className="text-navy font-poppins-bold text-3xl mb-6">Teaching Analytics</Text>
        
        {/* Stat Cards */}
        <View className="flex-row justify-between mb-6">
          <Card className="flex-1 mr-2 p-4 items-center">
            <Ionicons name="document-text" size={32} color="#2F5BFF" />
            <Text className="text-navy font-poppins-bold text-2xl mt-2">24</Text>
            <Text className="text-secondary font-poppins text-xs text-center mt-1">Plans Created</Text>
          </Card>
          <Card className="flex-1 mx-1 p-4 items-center">
            <Ionicons name="time" size={32} color="#8A3FFC" />
            <Text className="text-navy font-poppins-bold text-2xl mt-2">12h</Text>
            <Text className="text-secondary font-poppins text-xs text-center mt-1">Time Saved</Text>
          </Card>
          <Card className="flex-1 ml-2 p-4 items-center">
            <Ionicons name="star" size={32} color="#FBBF24" />
            <Text className="text-navy font-poppins-bold text-2xl mt-2">4.8</Text>
            <Text className="text-secondary font-poppins text-xs text-center mt-1">Avg Rating</Text>
          </Card>
        </View>

        {/* Chart Placeholder (using Empty State aesthetic) */}
        <Card className="p-6 mb-6">
          <Text className="text-navy font-poppins-semi text-lg mb-4">Activity Overview</Text>
          <View className="h-48 bg-soft-blue rounded-xl items-center justify-center border border-dashed border-royal/30">
            <Ionicons name="bar-chart" size={48} color="#C6B6FF" />
            <Text className="text-secondary font-poppins text-sm mt-2">
              Charts will appear here after more activity.
            </Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
