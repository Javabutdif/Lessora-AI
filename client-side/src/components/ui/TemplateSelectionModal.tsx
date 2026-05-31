import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Pressable,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LessonPlanTemplate } from "../../services/api";

interface TemplateSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectTemplate: (template: LessonPlanTemplate) => void;
  selectedTemplate?: LessonPlanTemplate;
}

export default function TemplateSelectionModal({
  visible,
  onClose,
  onSelectTemplate,
  selectedTemplate = "lessora-ai",
}: TemplateSelectionModalProps) {
  const handleSelectTemplate = (template: LessonPlanTemplate) => {
    onSelectTemplate(template);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
          <View className="bg-white rounded-3xl p-6 w-full max-w-sm">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-navy font-poppins-bold text-xl">
                Select Template
              </Text>
              <TouchableOpacity
                onPress={onClose}
                className="h-8 w-8 items-center justify-center rounded-full bg-soft-gray"
                accessibilityRole="button"
                accessibilityLabel="Close modal"
              >
                <Ionicons name="close" size={20} color="#1E3A8A" />
              </TouchableOpacity>
            </View>

            <Text className="text-secondary font-poppins text-sm mb-6">
              Choose a template for your lesson plan
            </Text>

            {/* Lessora AI Template Option */}
            <TouchableOpacity
              onPress={() => handleSelectTemplate("lessora-ai")}
              className={`flex-row items-center p-4 mb-3 rounded-2xl border ${
                selectedTemplate === "lessora-ai"
                  ? "bg-soft-blue border-royal"
                  : "bg-soft-blue border-royal/10"
              }`}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Lessora AI Template"
            >
              <View className="h-12 w-12 items-center justify-center rounded-xl bg-royal/10 mr-4">
                <Ionicons name="sparkles" size={24} color="#2F5BFF" />
              </View>
              <View className="flex-1">
                <Text className="text-navy font-poppins-semi text-base mb-1">
                  Lessora AI Template
                </Text>
                <Text className="text-secondary font-poppins text-xs">
                  Standard AI-generated lesson plan
                </Text>
              </View>
              {selectedTemplate === "lessora-ai" && (
                <Ionicons name="checkmark-circle" size={24} color="#2F5BFF" />
              )}
            </TouchableOpacity>

            {/* DepEd Semi-Detailed Template Option */}
            <TouchableOpacity
              onPress={() => handleSelectTemplate("deped-semi-detailed")}
              className={`flex-row items-center p-4 rounded-2xl border ${
                selectedTemplate === "deped-semi-detailed"
                  ? "bg-soft-blue border-royal"
                  : "bg-soft-blue border-royal/10"
              }`}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="DepEd Semi-Detailed Template"
            >
              <View className="h-12 w-12 items-center justify-center rounded-xl bg-royal/10 mr-4">
                <Ionicons name="document-text" size={24} color="#2F5BFF" />
              </View>
              <View className="flex-1">
                <Text className="text-navy font-poppins-semi text-base mb-1">
                  DepEd Semi-Detailed
                </Text>
                <Text className="text-secondary font-poppins text-xs">
                  Philippine DepEd format with detailed sections
                </Text>
              </View>
              {selectedTemplate === "deped-semi-detailed" && (
                <Ionicons name="checkmark-circle" size={24} color="#2F5BFF" />
              )}
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 400,
  },
});

// Made with Bob
