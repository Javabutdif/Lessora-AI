import React from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import TemplateSelectionModal from "../../components/ui/TemplateSelectionModal";
import { generateLessonPlan, LessonPlanTemplate } from "../../services/api";
import { DashboardStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<DashboardStackParamList, "Generate">;

const gradeOptions = [
  { label: "Preschool", value: "preschool" },
  { label: "Kindergarten", value: "kindergarten" },

  { label: "Grade 1", value: "grade1" },
  { label: "Grade 2", value: "grade2" },
  { label: "Grade 3", value: "grade3" },
  { label: "Grade 4", value: "grade4" },
  { label: "Grade 5", value: "grade5" },
  { label: "Grade 6", value: "grade6" },

  { label: "Grade 7", value: "grade7" },
  { label: "Grade 8", value: "grade8" },
  { label: "Grade 9", value: "grade9" },
  { label: "Grade 10", value: "grade10" },

  { label: "Grade 11", value: "grade11" },
  { label: "Grade 12", value: "grade12" },

  { label: "Senior High School", value: "seniorhigh" },
];

function getGradeLabel(value: string) {
  return gradeOptions.find((grade) => grade.value === value)?.label ?? value;
}

export default function GeneratePlanScreen({ route, navigation }: Props) {
  const [topicSubject, setTopicSubject] = React.useState("");
  const [selectedGrade, setSelectedGrade] = React.useState("");
  const [duration, setDuration] = React.useState("");
  const [goalsStandards, setGoalsStandards] = React.useState("");
  const [selectedTemplate, setSelectedTemplate] = React.useState<LessonPlanTemplate>("lessora-ai");
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isPickerVisible, setIsPickerVisible] = React.useState(false);
  const [isTemplateModalVisible, setIsTemplateModalVisible] = React.useState(false);

  const resetDraftState = React.useCallback(() => {
    setTopicSubject("");
    setSelectedGrade("");
    setDuration("");
    setGoalsStandards("");
    setSelectedTemplate("lessora-ai");
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.lessonPlanId) {
        navigation.replace("Preview", {
          lessonPlanId: route.params.lessonPlanId,
        });
        return;
      }

      resetDraftState();
    }, [navigation, resetDraftState, route.params?.lessonPlanId]),
  );

  const handleGenerate = async () => {
    const trimmedTopicSubject = topicSubject.trim();
    const trimmedGoalsStandards = goalsStandards.trim();
    const parsedDuration = Number(duration);

    if (!trimmedTopicSubject || !selectedGrade || !duration.trim()) {
      Toast.show({
        type: "error",
        text1: "Complete the required fields",
        text2: "Topic, grade level, and duration are needed.",
      });
      return;
    }

    if (!Number.isInteger(parsedDuration) || parsedDuration < 5) {
      Toast.show({
        type: "error",
        text1: "Check the duration",
        text2: "Use a whole number of minutes, minimum 5.",
      });
      return;
    }

    try {
      setIsGenerating(true);
      const result = await generateLessonPlan({
        title: trimmedTopicSubject,
        subject: trimmedTopicSubject,
        gradeLevel: getGradeLabel(selectedGrade),
        duration: parsedDuration,
        numberOfSessions: 1,
        userDraftText: trimmedGoalsStandards || undefined,
        templateNotes: trimmedGoalsStandards || undefined,
        templateId: selectedTemplate,
      });

      console.log("Generated lesson plan response", {
        hasDocument: !!result.document,
        blockCount: result.document?.blocks?.length ?? 0,
        keys: Object.keys(result ?? {}),
      });

      if (!result.document?.blocks?.length) {
        throw new Error(
          "The generated lesson plan was empty. Please try again.",
        );
      }

      Toast.show({
        type: "success",
        text1: "Lesson plan generated",
        text2: `${result.remainingResponses} AI responses remaining.`,
      });

      navigation.navigate("Preview", {
        lessonPlanId: result.lessonPlanId,
        document: result.document,
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Generation failed",
        text2: error?.message || "Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-soft-gray">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ padding: 24 }}>
          <View className="mb-8">
            <Text className="text-navy font-poppins-bold text-3xl mb-2">
              Create Lesson Plan
            </Text>
            <Text className="text-secondary font-poppins text-base">
              Let AI design the perfect lesson for your classroom.
            </Text>
          </View>

          <View className="bg-white p-6 rounded-3xl shadow-sm shadow-navy/5 mb-8 space-y-4">
            {/* Template Selection */}
            <View className="mb-4">
              <Text className="text-secondary font-poppins-semi text-sm mb-2">
                Lesson Plan Template
              </Text>
              <TouchableOpacity
                onPress={() => setIsTemplateModalVisible(true)}
                className="flex-row items-center rounded-2xl px-4"
                style={{
                  height: 50,
                  backgroundColor: "#FFFFFF",
                  borderColor: "#E5E7EB",
                  borderWidth: 1,
                  justifyContent: "space-between",
                }}
              >
                <View className="flex-row items-center flex-1">
                  <Ionicons
                    name={selectedTemplate === "lessora-ai" ? "sparkles" : "document-text"}
                    size={20}
                    color="#8E95B2"
                    style={{ marginRight: 10 }}
                  />
                  <Text
                    className="font-poppins text-base flex-1"
                    numberOfLines={1}
                    style={{ color: "#111827" }}
                  >
                    {selectedTemplate === "lessora-ai"
                      ? "Lessora AI Template"
                      : "DepEd Semi-Detailed"}
                  </Text>
                </View>
                <Ionicons name="chevron-down-outline" size={16} color="#8E95B2" />
              </TouchableOpacity>
            </View>

            <Input
              label="Topic / Subject"
              placeholder="e.g. The Solar System"
              icon="book-outline"
              value={topicSubject}
              onChangeText={setTopicSubject}
            />

            <View className="flex-row space-x-4">
              <View className="flex-1 mr-2 mb-4">
                <Text className="text-secondary font-poppins-semi text-sm mb-2">
                  Grade Level
                </Text>
                <TouchableOpacity
                  onPress={() => setIsPickerVisible(true)}
                  className="flex-row items-center rounded-2xl px-4"
                  style={{
                    height: 50,
                    backgroundColor: "#FFFFFF",
                    borderColor: "#E5E7EB",
                    borderWidth: 1,
                    justifyContent: "space-between",
                  }}
                >
                  <View className="flex-row items-center flex-1">
                    <Ionicons
                      name="school-outline"
                      size={20}
                      color="#8E95B2"
                      style={{ marginRight: 10 }}
                    />
                    <Text
                      className="font-poppins text-base flex-1"
                      numberOfLines={1}
                      style={{ color: selectedGrade ? "#111827" : "#8E95B2" }}
                    >
                      {selectedGrade ? getGradeLabel(selectedGrade) : "Select Grade"}
                    </Text>
                  </View>
                  <Ionicons name="chevron-down-outline" size={16} color="#8E95B2" />
                </TouchableOpacity>
              </View>
              <View className="flex-1 ml-2">
                <Input
                  label="Duration (mins)"
                  placeholder="45"
                  keyboardType="numeric"
                  icon="time-outline"
                  value={duration}
                  onChangeText={setDuration}
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
              value={goalsStandards}
              onChangeText={setGoalsStandards}
            />

            <View className="mt-4">
              <Button
                title={isGenerating ? "Generating..." : "Generate with AI"}
                variant="glowing"
                icon="sparkles"
                isLoading={isGenerating}
                disabled={isGenerating}
                onPress={handleGenerate}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={isPickerVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsPickerVisible(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-end"
          activeOpacity={1}
          onPress={() => setIsPickerVisible(false)}
        >
          <View className="bg-white rounded-t-3xl max-h-[60%] px-6 pt-6 pb-8">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-navy font-poppins-bold text-xl">Select Grade Level</Text>
              <TouchableOpacity onPress={() => setIsPickerVisible(false)}>
                <Ionicons name="close" size={24} color="#8E95B2" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={gradeOptions}
              keyExtractor={(item) => item.value}
              contentContainerStyle={{ paddingBottom: 20 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedGrade(item.value);
                    setIsPickerVisible(false);
                  }}
                  className={`py-4 px-4 rounded-xl mb-2 flex-row justify-between items-center ${
                    selectedGrade === item.value ? "bg-soft-blue" : ""
                  }`}
                >
                  <Text
                    className={`font-poppins text-base ${
                      selectedGrade === item.value ? "text-royal font-poppins-semi" : "text-primary"
                    }`}
                  >
                    {item.label}
                  </Text>
                  {selectedGrade === item.value && (
                    <Ionicons name="checkmark" size={20} color="#2F5BFF" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Template Selection Modal */}
      <TemplateSelectionModal
        visible={isTemplateModalVisible}
        onClose={() => setIsTemplateModalVisible(false)}
        onSelectTemplate={setSelectedTemplate}
        selectedTemplate={selectedTemplate}
      />
    </SafeAreaView>
  );
}
