import React from "react";
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Card from "../../components/ui/Card";
import FloatingAssistant from "../../components/ui/FloatingAssistant";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-soft-gray">
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
        {/* Header */}
        <View className="flex-row justify-between items-center mb-8">
          <View>
            <Text className="text-secondary font-poppins text-sm mb-1">Good Morning,</Text>
            <Text className="text-navy font-poppins-bold text-2xl">Jane Doe 👋</Text>
          </View>
          <View className="w-12 h-12 bg-lavender rounded-full items-center justify-center">
            <Text className="text-navy font-poppins-bold text-lg">JD</Text>
          </View>
        </View>

        {/* Hero Section */}
        <Card variant="gradient" className="mb-8">
          <Text className="text-white font-poppins-semi text-sm mb-2 opacity-90">
            Ready for your next class?
          </Text>
          <Text className="text-white font-poppins-bold text-2xl mb-4 leading-tight">
            Generate an AI-powered lesson plan in seconds.
          </Text>
          <TouchableOpacity className="bg-white/20 self-start px-4 py-2 rounded-xl flex-row items-center">
            <Text className="text-white font-poppins-semi mr-2">Try it now</Text>
            <Ionicons name="arrow-forward" size={16} color="white" />
          </TouchableOpacity>
        </Card>

        {/* Recent Plans */}
        <View className="mb-6 flex-row justify-between items-end">
          <Text className="text-navy font-poppins-bold text-xl">Recent Plans</Text>
          <Text className="text-royal font-poppins-semi text-sm">View All</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8 -mx-6 px-6">
          {[1, 2, 3].map((item) => (
            <Card key={item} className="w-64 mr-4 p-4">
              <View className="flex-row justify-between items-start mb-3">
                <View className="bg-soft-blue px-3 py-1 rounded-lg">
                  <Text className="text-royal font-poppins-semi text-xs">Science</Text>
                </View>
                <Ionicons name="ellipsis-horizontal" size={20} color="#8E95B2" />
              </View>
              <Text className="text-primary font-poppins-semi text-lg mb-1" numberOfLines={1}>
                Photosynthesis & Cells
              </Text>
              <Text className="text-secondary font-poppins text-sm mb-4">Grade 8 • 45 mins</Text>
              <Text className="text-muted font-poppins text-xs">Updated 2h ago</Text>
            </Card>
          ))}
        </ScrollView>

        {/* AI Suggestions */}
        <Text className="text-navy font-poppins-bold text-xl mb-4">AI Suggestions</Text>
        <Card variant="glass" className="mb-4 flex-row items-center">
          <View className="w-12 h-12 bg-purple/10 rounded-xl items-center justify-center mr-4">
            <Ionicons name="bulb-outline" size={24} color="#8A3FFC" />
          </View>
          <View className="flex-1">
            <Text className="text-primary font-poppins-semi text-base mb-1">Add Interactive Quiz</Text>
            <Text className="text-secondary font-poppins text-sm">To your History lesson plan.</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#8E95B2" />
        </Card>

      </ScrollView>
      <FloatingAssistant />
    </SafeAreaView>
  );
}
