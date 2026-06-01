import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  Alert,
  Clipboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Card from "./Card";
import Button from "./Button";

interface HelpSupportModalProps {
  visible: boolean;
  onClose: () => void;
}

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    question: "How do I generate a lesson plan?",
    answer:
      "Navigate to the Generate tab, fill in the required fields (title, subject, grade level, duration, and number of sessions), then tap 'Generate Lesson Plan'. You can also add optional draft text to guide the AI.",
  },
  {
    question: "What are response tokens?",
    answer:
      "Response tokens are credits used to generate lesson plans. Each new account receives 5 complimentary tokens. Tokens reset monthly or when you upgrade to a premium subscription.",
  },
  {
    question: "How do I export my lesson plans?",
    answer:
      "After generating a lesson plan, tap the 'Export' button on the preview screen. You can choose to export as PDF or DOCX format. The file will be saved to your device.",
  },
  {
    question: "How do I upgrade my account?",
    answer:
      "Account upgrades and premium subscriptions will be available soon. You'll be able to access more tokens, advanced features, and priority support with a premium account.",
  },
  {
    question: "Can I edit a generated lesson plan?",
    answer:
      "Currently, lesson plans are generated based on your input. You can regenerate with different parameters or export and edit the document externally. In-app editing will be available in a future update.",
  },
  {
    question: "How do I view my lesson plan history?",
    answer:
      "Navigate to the History tab to see all your previously generated lesson plans. Tap on any plan to view its full details and export it again if needed.",
  },
];

export default function HelpSupportModal({ visible, onClose }: HelpSupportModalProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const copyEmailToClipboard = () => {
    Clipboard.setString("support@lessora.ai");
    Alert.alert("Copied!", "Support email copied to clipboard");
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
            <Text className="text-navy font-poppins-bold text-xl">Help & Support</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#1A1F36" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView className="px-6 py-4" showsVerticalScrollIndicator={false}>
            {/* FAQ Section */}
            <Text className="text-navy font-poppins-semi text-lg mb-3">
              Frequently Asked Questions
            </Text>

            {FAQ_DATA.map((faq, index) => (
              <Card key={index} className="mb-3 p-0 overflow-hidden">
                <TouchableOpacity
                  onPress={() => toggleFAQ(index)}
                  className="flex-row items-center justify-between p-4"
                  activeOpacity={0.7}
                >
                  <Text className="flex-1 text-navy font-poppins-semi text-base mr-3">
                    {faq.question}
                  </Text>
                  <Ionicons
                    name={expandedIndex === index ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#2F5BFF"
                  />
                </TouchableOpacity>

                {expandedIndex === index && (
                  <View className="px-4 pb-4 pt-0 border-t border-gray-100">
                    <Text className="text-secondary font-poppins text-sm leading-5">
                      {faq.answer}
                    </Text>
                  </View>
                )}
              </Card>
            ))}

            {/* Contact Support Section */}
            <Text className="text-navy font-poppins-semi text-lg mb-3 mt-6">
              Contact Support
            </Text>
            <Card className="mb-4 p-4">
              <View className="flex-row items-center mb-3">
                <View className="w-10 h-10 bg-soft-blue rounded-full items-center justify-center mr-3">
                  <Ionicons name="mail-outline" size={20} color="#2F5BFF" />
                </View>
                <View className="flex-1">
                  <Text className="text-navy font-poppins-semi text-base">Email Us</Text>
                  <Text className="text-secondary font-poppins text-sm">
                    We typically respond within 24 hours
                  </Text>
                </View>
              </View>

              <View className="bg-soft-blue rounded-xl p-3 flex-row items-center justify-between">
                <Text className="text-royal font-poppins-semi text-sm flex-1">
                  jamesgenabio90@gmail.com

                </Text>
                <TouchableOpacity
                  onPress={copyEmailToClipboard}
                  className="ml-2 bg-white rounded-lg px-3 py-2"
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-center">
                    <Ionicons name="copy-outline" size={16} color="#2F5BFF" />
                    <Text className="text-royal font-poppins-semi text-xs ml-1">Copy</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </Card>

            {/* App Version Section */}
            <Text className="text-navy font-poppins-semi text-lg mb-3">App Information</Text>
            <Card className="mb-4 p-4">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-secondary font-poppins text-sm">Version</Text>
                <Text className="text-navy font-poppins-semi text-sm">1.0.0</Text>
              </View>
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-secondary font-poppins text-sm">Build</Text>
                <Text className="text-navy font-poppins-semi text-sm">2026.06.01</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-secondary font-poppins text-sm">Platform</Text>
                <Text className="text-navy font-poppins-semi text-sm">React Native</Text>
              </View>
            </Card>

            {/* Additional Resources */}
            <Card className="p-4 bg-soft-blue border border-royal/10 mb-6">
              <View className="flex-row items-start">
                <Ionicons
                  name="bulb-outline"
                  size={20}
                  color="#2F5BFF"
                  style={{ marginRight: 12, marginTop: 2 }}
                />
                <View className="flex-1">
                  <Text className="text-navy font-poppins-semi text-sm mb-1">Need more help?</Text>
                  <Text className="text-secondary font-poppins text-xs">
                    Visit our website at lessora.ai for tutorials, documentation, and community
                    forums.
                  </Text>
                </View>
              </View>
            </Card>

            {/* Close Button */}
            <Button title="Close" variant="primary" onPress={onClose} className="mb-6" />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// Made with Bob
