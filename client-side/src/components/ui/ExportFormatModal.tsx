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

export type ExportFormat = "pdf" | "docx" | "doc";

interface ExportFormatModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectFormat: (format: ExportFormat) => void;
}

export default function ExportFormatModal({
  visible,
  onClose,
  onSelectFormat,
}: ExportFormatModalProps) {
  const handleSelectFormat = (format: ExportFormat) => {
    onSelectFormat(format);
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
                Export Format
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
              Choose the format for your lesson plan export
            </Text>

            {/* PDF Option */}
            <TouchableOpacity
              onPress={() => handleSelectFormat("pdf")}
              className="flex-row items-center p-4 mb-3 rounded-2xl bg-soft-blue border border-royal/10"
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Export as PDF"
            >
              <View className="h-12 w-12 items-center justify-center rounded-xl bg-royal/10 mr-4">
                <Ionicons name="document-text" size={24} color="#2F5BFF" />
              </View>
              <View className="flex-1">
                <Text className="text-navy font-poppins-semi text-base mb-1">
                  Export as PDF
                </Text>
                <Text className="text-secondary font-poppins text-xs">
                  Recommended for viewing and printing
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            {/* DOCX Option */}
            <TouchableOpacity
              onPress={() => handleSelectFormat("docx")}
              className="flex-row items-center p-4 mb-3 rounded-2xl bg-soft-blue border border-royal/10"
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Export as DOCX"
            >
              <View className="h-12 w-12 items-center justify-center rounded-xl bg-royal/10 mr-4">
                <Ionicons name="create" size={24} color="#2F5BFF" />
              </View>
              <View className="flex-1">
                <Text className="text-navy font-poppins-semi text-base mb-1">
                  Export as DOCX
                </Text>
                <Text className="text-secondary font-poppins text-xs">
                  Recommended for editing in Word
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            {/* DOC Option */}
            <TouchableOpacity
              onPress={() => handleSelectFormat("doc")}
              className="flex-row items-center p-4 rounded-2xl bg-soft-blue border border-royal/10"
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Export as DOC"
            >
              <View className="h-12 w-12 items-center justify-center rounded-xl bg-royal/10 mr-4">
                <Ionicons name="document-outline" size={24} color="#2F5BFF" />
              </View>
              <View className="flex-1">
                <Text className="text-navy font-poppins-semi text-base mb-1">
                  Export as DOC
                </Text>
                <Text className="text-secondary font-poppins text-xs">
                  Legacy HTML-based format
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
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
