import React from "react";
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Button from "../../components/ui/Button";

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-soft-gray">
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text className="text-navy font-poppins-bold text-3xl mb-8">Profile</Text>

        <View className="items-center mb-8">
          <View className="w-24 h-24 bg-lavender rounded-full items-center justify-center mb-4">
            <Text className="text-navy font-poppins-bold text-3xl">JD</Text>
          </View>
          <Text className="text-navy font-poppins-bold text-xl">Jane Doe</Text>
          <Text className="text-secondary font-poppins text-sm">jane.doe@school.edu</Text>
        </View>

        <View className="bg-white rounded-3xl shadow-sm shadow-navy/5 overflow-hidden mb-6">
          <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-100">
            <Ionicons name="person-outline" size={24} color="#2F5BFF" className="mr-4" />
            <Text className="flex-1 text-primary font-poppins-semi text-base ml-3">Edit Profile</Text>
            <Ionicons name="chevron-forward" size={20} color="#8E95B2" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-100">
            <Ionicons name="settings-outline" size={24} color="#2F5BFF" className="mr-4" />
            <Text className="flex-1 text-primary font-poppins-semi text-base ml-3">Settings</Text>
            <Ionicons name="chevron-forward" size={20} color="#8E95B2" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center p-4">
            <Ionicons name="help-circle-outline" size={24} color="#2F5BFF" className="mr-4" />
            <Text className="flex-1 text-primary font-poppins-semi text-base ml-3">Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color="#8E95B2" />
          </TouchableOpacity>
        </View>

        <Button title="Log Out" variant="outline" className="mt-4" />
      </ScrollView>
    </SafeAreaView>
  );
}
