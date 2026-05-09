import React from "react";
import { View, Text, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function GeneratePlanScreen() {
  return (
    <SafeAreaView className="flex-1 bg-soft-gray">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ padding: 24 }}>
          <View className="mb-8">
            <Text className="text-navy font-poppins-bold text-3xl mb-2">Create Lesson Plan</Text>
            <Text className="text-secondary font-poppins text-base">
              Let AI design the perfect lesson for your classroom.
            </Text>
          </View>

          <View className="bg-white p-6 rounded-3xl shadow-sm shadow-navy/5 mb-8 space-y-4">
            <Input
              label="Topic / Subject"
              placeholder="e.g. The Solar System"
              icon="book-outline"
            />
            
            <View className="flex-row space-x-4">
              <View className="flex-1 mr-2">
                <Input
                  label="Grade Level"
                  placeholder="e.g. 5th Grade"
                  icon="school-outline"
                />
              </View>
              <View className="flex-1 ml-2">
                <Input
                  label="Duration (mins)"
                  placeholder="45"
                  keyboardType="numeric"
                  icon="time-outline"
                />
              </View>
            </View>

            <Input
              label="Specific Goals / Standards"
              placeholder="e.g. Understand the order of planets"
              multiline
              numberOfLines={3}
              className="h-24"
              textAlignVertical="top"
            />

            <View className="mt-4">
              <Button title="Generate with AI" variant="glowing" icon="sparkles" />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
