import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Button from "./Button";
import Card from "./Card";
import { updateUserSettings, UpdateSettingsPayload } from "../../services/api";

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SettingsModal({ visible, onClose }: SettingsModalProps) {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const payload: UpdateSettingsPayload = {
        notifications: {
          email: emailNotifications,
        },
        language: "en",
        theme: "light",
      };

      await updateUserSettings(payload);
      
      Alert.alert("Success", "Settings updated successfully");
      onClose();
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Failed to update settings");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl max-h-[90%]">
          {/* Header */}
          <View className="flex-row items-center justify-between p-6 border-b border-gray-100">
            <Text className="text-navy font-poppins-bold text-xl">Settings</Text>
            <TouchableOpacity onPress={onClose} disabled={isLoading}>
              <Ionicons name="close" size={24} color="#1A1F36" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView className="px-6 py-4" showsVerticalScrollIndicator={false}>
            {/* Notifications Section */}
            <Text className="text-navy font-poppins-semi text-lg mb-3">Notifications</Text>
            <Card className="mb-6 p-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-1 mr-4">
                  <Text className="text-navy font-poppins-semi text-base mb-1">
                    Email Notifications
                  </Text>
                  <Text className="text-secondary font-poppins text-sm">
                    Receive updates and announcements via email
                  </Text>
                </View>
                <Switch
                  value={emailNotifications}
                  onValueChange={setEmailNotifications}
                  trackColor={{ false: "#E5E7EB", true: "#93C5FD" }}
                  thumbColor={emailNotifications ? "#2F5BFF" : "#F3F4F6"}
                  disabled={isLoading}
                />
              </View>
            </Card>

            {/* Language Section */}
            <Text className="text-navy font-poppins-semi text-lg mb-3">Language</Text>
            <Card className="mb-6 p-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-navy font-poppins-semi text-base mb-1">
                    App Language
                  </Text>
                  <Text className="text-secondary font-poppins text-sm">
                    Currently set to English
                  </Text>
                </View>
                <View className="bg-soft-blue px-3 py-1.5 rounded-lg">
                  <Text className="text-royal font-poppins-semi text-sm">English</Text>
                </View>
              </View>
            </Card>

            {/* Theme Section */}
            <Text className="text-navy font-poppins-semi text-lg mb-3">Appearance</Text>
            <Card className="mb-6 p-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-navy font-poppins-semi text-base mb-1">
                    Theme
                  </Text>
                  <Text className="text-secondary font-poppins text-sm">
                    Currently set to Light mode
                  </Text>
                </View>
                <View className="bg-soft-blue px-3 py-1.5 rounded-lg">
                  <Text className="text-royal font-poppins-semi text-sm">Light</Text>
                </View>
              </View>
            </Card>

            {/* Info Card */}
            <Card className="p-4 bg-soft-blue border border-royal/10 mb-6">
              <View className="flex-row items-start">
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color="#2F5BFF"
                  style={{ marginRight: 12, marginTop: 2 }}
                />
                <Text className="flex-1 text-secondary font-poppins text-xs">
                  Language and theme customization will be available in a future update.
                </Text>
              </View>
            </Card>

            {/* Buttons */}
            <View className="flex-row gap-3 mb-6">
              <Button
                title="Cancel"
                variant="outline"
                onPress={onClose}
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                title="Save Settings"
                variant="primary"
                onPress={handleSave}
                isLoading={isLoading}
                className="flex-1"
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// Made with Bob
