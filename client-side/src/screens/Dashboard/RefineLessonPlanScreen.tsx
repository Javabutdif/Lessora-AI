import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import {
  LessonPlanDocument,
  LessonPlanTemplate,
  refineLessonPlan,
} from "../../services/api";
import { DashboardStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<DashboardStackParamList, "Refine">;

type RefineOption = {
  key: string;
  label: string;
};

const templateOptions: Record<LessonPlanTemplate, RefineOption[]> = {
  "lessora-ai": [
    { key: "lesson overview", label: "Lesson Overview" },
    { key: "learning objectives", label: "Learning Objectives" },
    { key: "materials", label: "Materials" },
    { key: "procedure", label: "Procedure" },
    { key: "assessment", label: "Assessment" },
    { key: "teacher notes", label: "Teacher Notes" },
  ],
  "deped-semi-detailed": [
    { key: "metadata", label: "Metadata" },
    { key: "learning competencies", label: "Learning Competencies" },
    { key: "objectives", label: "Objectives" },
    { key: "content", label: "Content" },
    { key: "learning resources", label: "Learning Resources" },
    { key: "procedure", label: "Procedure" },
    { key: "assessment", label: "Assessment" },
    { key: "assignment", label: "Assignment" },
    { key: "remarks", label: "Remarks" },
    { key: "reflection", label: "Reflection" },
  ],
  "detailed-lesson-plan": [
    { key: "objectives", label: "Objectives" },
    { key: "content", label: "Content" },
    { key: "learning resources", label: "Learning Resources" },
    { key: "procedure", label: "Procedures" },
    { key: "evaluation", label: "Evaluation" },
    { key: "reflection", label: "Reflection" },
  ],
  "daily-lesson-log": [
    { key: "objectives", label: "Objectives" },
    { key: "content", label: "Content" },
    { key: "learning resources", label: "Learning Resources" },
    { key: "procedures", label: "Procedures" },
    { key: "evaluation", label: "Evaluation" },
    { key: "remarks", label: "Remarks" },
    { key: "reflection", label: "Reflection" },
  ],
  matatag: [
    { key: "curriculum content", label: "Curriculum Content" },
    { key: "learning resources", label: "Learning Resources" },
    { key: "teaching and learning procedure", label: "Teaching and Learning Procedure" },
    { key: "evaluating learning", label: "Evaluating Learning" },
    { key: "reflection", label: "Reflection" },
  ],
};

function getTemplateId(
  templateId?: LessonPlanTemplate,
  document?: LessonPlanDocument,
): LessonPlanTemplate {
  if (templateId) {
    return templateId;
  }

  const hasDepEdHeading = document?.blocks.some(
    (block) => block.type === "heading" && block.text === "I. Metadata",
  );

  return hasDepEdHeading ? "deped-semi-detailed" : "lessora-ai";
}

export default function RefineLessonPlanScreen({ route, navigation }: Props) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [selectedSections, setSelectedSections] = React.useState<string[]>([]);
  const [prompt, setPrompt] = React.useState("");

  const templateId = getTemplateId(route.params.templateId, route.params.document);
  const options = templateOptions[templateId];

  const toggleSection = (section: string) => {
    setSelectedSections((current) =>
      current.includes(section)
        ? current.filter((item) => item !== section)
        : [...current, section],
    );
  };

  const handleRefine = async () => {
    const lessonPlanId = route.params.lessonPlanId;

    if (!lessonPlanId) {
      Toast.show({
        type: "error",
        text1: "Refine unavailable",
        text2: "Open a saved lesson plan first.",
      });
      return;
    }

    if (!selectedSections.length || !prompt.trim()) {
      Toast.show({
        type: "error",
        text1: "Complete the refine form",
        text2: "Choose at least one section and add a short instruction.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await refineLessonPlan({
        lessonPlanId,
        selectedSections,
        refinementRequest: prompt.trim(),
      });

      navigation.replace("Preview", {
        lessonPlanId: result.lessonPlanId,
        document: result.document,
        templateId,
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Refinement failed",
        text2: error?.message || "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-soft-gray">
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 40 }}>
        <View className="mb-6">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
            className="flex-row items-center mb-4"
          >
            <Ionicons name="chevron-back" size={20} color="#2F5BFF" />
            <Text className="text-royal font-poppins-semi ml-1">Back</Text>
          </TouchableOpacity>

          <Text className="text-navy font-poppins-bold text-3xl mb-2">
            Refine Lesson Plan
          </Text>
          <Text className="text-secondary font-poppins text-base">
            Choose the parts you want AI to improve in one go.
          </Text>
        </View>

        <View className="bg-white p-6 rounded-3xl shadow-sm shadow-navy/5 mb-6">
          <Text className="text-navy font-poppins-semi text-base mb-4">
            What do you want to refine?
          </Text>

          {options.map((option) => {
            const checked = selectedSections.includes(option.key);

            return (
              <TouchableOpacity
                key={option.key}
                activeOpacity={0.8}
                onPress={() => toggleSection(option.key)}
                className={`flex-row items-center justify-between rounded-2xl px-4 py-4 mb-3 border ${
                  checked ? "border-royal bg-soft-blue" : "border-gray-200 bg-white"
                }`}
              >
                <Text className="text-primary font-poppins text-base flex-1 pr-3">
                  {option.label}
                </Text>
                <Ionicons
                  name={checked ? "checkbox" : "square-outline"}
                  size={22}
                  color="#2F5BFF"
                />
              </TouchableOpacity>
            );
          })}

          <Input
            label="Refinement prompt"
            placeholder="e.g. Make the procedure more engaging and add clearer student instructions"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={prompt}
            onChangeText={setPrompt}
          />

          <View className="mt-2">
            <Button
              title={isSubmitting ? "Refining..." : "Refine Lesson Plan"}
              variant="glowing"
              icon="sparkles"
              isLoading={isSubmitting}
              disabled={isSubmitting}
              onPress={handleRefine}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
