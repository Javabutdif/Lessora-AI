import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Button from "../../components/ui/Button";
import EditProfileModal from "../../components/ui/EditProfileModal";
import SettingsModal from "../../components/ui/SettingsModal";
import HelpSupportModal from "../../components/ui/HelpSupportModal";
import { useAuth } from "../../context/AuthContext";
import Toast from "react-native-toast-message";

function getInitials(name?: string) {
  if (!name) {
    return "U";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function ProfileScreen() {
  const { user, logout, login } = useAuth();
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [helpSupportVisible, setHelpSupportVisible] = useState(false);

  const handleLogout = () => {
    Toast.show({
      type: "success",
      text2: "You have successfully logged out.",
    });
    logout();
  };

  const handleProfileUpdated = async (updatedUser: any) => {
    // Update the user in AuthContext by re-logging in with the updated token
    // The server returns the updated user data, so we need to refresh the token
    Toast.show({
      type: "success",
      text1: "Profile Updated",
      text2: "Your profile has been updated successfully.",
    });
    // Note: In a real scenario, you might need to refresh the token or re-fetch user data
    // For now, we'll just show the success message
  };

  return (
    <SafeAreaView className="flex-1 bg-soft-gray">
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text className="text-navy font-poppins-bold text-3xl mb-8">
          Profile
        </Text>

        <View className="items-center mb-8">
          <View className="w-24 h-24 bg-lavender rounded-full items-center justify-center mb-4">
            <Text className="text-navy font-poppins-bold text-3xl">
              {getInitials(user?.name)}
            </Text>
          </View>
          <Text className="text-navy font-poppins-bold text-xl">
            {user?.name || "User"}
          </Text>
          <Text className="text-secondary font-poppins text-sm">
            {user?.email || ""}
          </Text>
        </View>

        <View className="bg-white rounded-3xl shadow-sm shadow-navy/5 overflow-hidden mb-6">
          <TouchableOpacity
            className="flex-row items-center p-4 border-b border-gray-100"
            onPress={() => setEditProfileVisible(true)}
          >
            <Ionicons
              name="person-outline"
              size={24}
              color="#2F5BFF"
              className="mr-4"
            />
            <Text className="flex-1 text-primary font-poppins-semi text-base ml-3">
              Edit Profile
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#8E95B2" />
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center p-4 border-b border-gray-100"
            onPress={() => setSettingsVisible(true)}
          >
            <Ionicons
              name="settings-outline"
              size={24}
              color="#2F5BFF"
              className="mr-4"
            />
            <Text className="flex-1 text-primary font-poppins-semi text-base ml-3">
              Settings
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#8E95B2" />
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center p-4"
            onPress={() => setHelpSupportVisible(true)}
          >
            <Ionicons
              name="help-circle-outline"
              size={24}
              color="#2F5BFF"
              className="mr-4"
            />
            <Text className="flex-1 text-primary font-poppins-semi text-base ml-3">
              Help & Support
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#8E95B2" />
          </TouchableOpacity>
        </View>

        <Button
          title="Log Out"
          variant="outline"
          className="mt-4"
          onPress={() => handleLogout()}
        />
      </ScrollView>

      {/* Modals */}
      <EditProfileModal
        visible={editProfileVisible}
        onClose={() => setEditProfileVisible(false)}
        user={user}
        onProfileUpdated={handleProfileUpdated}
      />

      <SettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />

      <HelpSupportModal
        visible={helpSupportVisible}
        onClose={() => setHelpSupportVisible(false)}
      />
    </SafeAreaView>
  );
}
