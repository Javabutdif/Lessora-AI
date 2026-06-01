import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Input from "./Input";
import Button from "./Button";
import { updateUserProfile, UpdateProfilePayload, AuthUser } from "../../services/api";

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  user: AuthUser | null;
  onProfileUpdated: (updatedUser: any) => void;
}

export default function EditProfileModal({
  visible,
  onClose,
  user,
  onProfileUpdated,
}: EditProfileModalProps) {
  const [firstName, setFirstName] = useState(user?.name?.split(" ")[0] || "");
  const [lastName, setLastName] = useState(user?.name?.split(" ").slice(1).join(" ") || "");
  const [email, setEmail] = useState(user?.email || "");
  const [school, setSchool] = useState("");
  const [bio, setBio] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  React.useEffect(() => {
    if (visible && user) {
      const nameParts = user.name?.split(" ") || [];
      setFirstName(nameParts[0] || "");
      setLastName(nameParts.slice(1).join(" ") || "");
      setEmail(user.email || "");
      setSchool("");
      setBio("");
      setErrors({});
    }
  }, [visible, user]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (bio.length > 500) {
      newErrors.bio = "Bio must be 500 characters or less";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const payload: UpdateProfilePayload = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        school: school.trim() || undefined,
        bio: bio.trim() || undefined,
      };

      const response = await updateUserProfile(payload);
      
      Alert.alert("Success", "Profile updated successfully");
      onProfileUpdated(response.user);
      onClose();
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Failed to update profile");
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl max-h-[90%]">
            {/* Header */}
            <View className="flex-row items-center justify-between p-6 border-b border-gray-100">
              <Text className="text-navy font-poppins-bold text-xl">Edit Profile</Text>
              <TouchableOpacity onPress={onClose} disabled={isLoading}>
                <Ionicons name="close" size={24} color="#1A1F36" />
              </TouchableOpacity>
            </View>

            {/* Form */}
            <ScrollView className="px-6 py-4" showsVerticalScrollIndicator={false}>
              <Input
                label="First Name"
                placeholder="Enter your first name"
                value={firstName}
                onChangeText={setFirstName}
                error={errors.firstName}
                icon="person-outline"
                editable={!isLoading}
              />

              <Input
                label="Last Name"
                placeholder="Enter your last name"
                value={lastName}
                onChangeText={setLastName}
                error={errors.lastName}
                icon="person-outline"
                editable={!isLoading}
              />

              <Input
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                error={errors.email}
                icon="mail-outline"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />

              <Input
                label="School (Optional)"
                placeholder="Enter your school name"
                value={school}
                onChangeText={setSchool}
                icon="school-outline"
                editable={!isLoading}
              />

              <Input
                label="Bio (Optional)"
                placeholder="Tell us about yourself (max 500 characters)"
                value={bio}
                onChangeText={setBio}
                error={errors.bio}
                icon="document-text-outline"
                multiline
                numberOfLines={4}
                maxLength={500}
                editable={!isLoading}
                style={{ height: 100, textAlignVertical: "top" }}
              />

              <Text className="text-secondary font-poppins text-xs mb-6 text-right">
                {bio.length}/500 characters
              </Text>

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
                  title="Save Changes"
                  variant="primary"
                  onPress={handleSave}
                  isLoading={isLoading}
                  className="flex-1"
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// Made with Bob
