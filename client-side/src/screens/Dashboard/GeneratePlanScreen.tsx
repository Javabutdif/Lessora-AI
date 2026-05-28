import React from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Share,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import {
  exportLessonPlanDocument,
  generateLessonPlan,
  getLessonPlanById,
  LessonPlanDocument,
  LessonPlanDocumentBlock,
  GenerateLessonPlanResponse,
} from "../../services/api";

type DashboardTabParamList = {
  HomeTab: undefined;
  Generate: { lessonPlanId?: string } | undefined;
  Analytics: undefined;
  Profile: undefined;
};

type Props = BottomTabScreenProps<DashboardTabParamList, "Generate">;

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

type EditableDocumentBlock = LessonPlanDocumentBlock;

function renderDocumentBlock(block: EditableDocumentBlock, index: number) {
  if (block.type === "heading") {
    const headingClass =
      block.level === 1
        ? "text-navy font-poppins-bold text-xl mb-3"
        : "text-navy font-poppins-bold text-base mt-4 mb-2";

    return (
      <Text key={`block-${index}`} className={headingClass}>
        {block.text}
      </Text>
    );
  }

  if (block.type === "paragraph") {
    return (
      <Text
        key={`block-${index}`}
        className="text-secondary font-poppins text-sm leading-6 mb-2"
      >
        {block.text}
      </Text>
    );
  }

  return (
    <View key={`block-${index}`} className="mb-2">
      {block.items.map((item, itemIndex) => (
        <Text
          key={`block-${index}-item-${itemIndex}`}
          className="text-secondary font-poppins text-sm leading-6 mb-1"
        >
          {block.style === "numbered"
            ? `${itemIndex + 1}. ${item}`
            : `- ${item}`}
        </Text>
      ))}
    </View>
  );
}

function renderEditableDocumentBlock(
  block: EditableDocumentBlock,
  index: number,
  onUpdate: (blockIndex: number, block: EditableDocumentBlock) => void,
) {
  if (block.type === "list") {
    return (
      <View key={`editable-block-${index}`} className="mb-3">
        {block.items.map((item, itemIndex) => (
          <Input
            key={`editable-block-${index}-item-${itemIndex}`}
            label={`${block.style === "numbered" ? itemIndex + 1 : "-"} Item`}
            value={item}
            onChangeText={(text) => {
              const nextItems = [...block.items];
              nextItems[itemIndex] = text;
              onUpdate(index, { ...block, items: nextItems });
            }}
            multiline
            textAlignVertical="top"
          />
        ))}
      </View>
    );
  }

  return (
    <Input
      key={`editable-block-${index}`}
      label={block.type === "heading" ? `Heading ${block.level}` : "Paragraph"}
      value={block.text}
      onChangeText={(text) => onUpdate(index, { ...block, text })}
      multiline={block.type === "paragraph"}
      textAlignVertical="top"
    />
  );
}

export default function GeneratePlanScreen({ route }: Props) {
  const [topicSubject, setTopicSubject] = React.useState("");
  const [selectedGrade, setSelectedGrade] = React.useState("");
  const [duration, setDuration] = React.useState("");
  const [goalsStandards, setGoalsStandards] = React.useState("");
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generatedPlan, setGeneratedPlan] =
    React.useState<GenerateLessonPlanResponse | null>(null);
  const [editableDocument, setEditableDocument] =
    React.useState<LessonPlanDocument | null>(null);
  const [isExporting, setIsExporting] = React.useState(false);
  const [isEditingPreview, setIsEditingPreview] = React.useState(false);

  const resetDraftState = React.useCallback(() => {
    setTopicSubject("");
    setSelectedGrade("");
    setDuration("");
    setGoalsStandards("");
    setGeneratedPlan(null);
    setEditableDocument(null);
    setIsEditingPreview(false);
    setIsExporting(false);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (!route.params?.lessonPlanId) {
        resetDraftState();
      }
    }, [resetDraftState, route.params?.lessonPlanId]),
  );

  React.useEffect(() => {
    let isActive = true;
    const lessonPlanId = route.params?.lessonPlanId;

    if (!lessonPlanId) {
      return;
    }
    const selectedLessonPlanId = lessonPlanId;

    async function loadSavedLessonPlan() {
      try {
        const plan = await getLessonPlanById(selectedLessonPlanId);

        if (!isActive) {
          return;
        }

        resetDraftState();
        setTopicSubject(plan.title);
        setEditableDocument(plan.document);
        setIsEditingPreview(false);
        Toast.show({
          type: "success",
          text1: "Lesson plan loaded",
          text2: plan.title,
        });
      } catch (error: any) {
        if (isActive) {
          Toast.show({
            type: "error",
            text1: "Could not open lesson plan",
            text2: error?.message || "Please try again.",
          });
        }
      }
    }

    loadSavedLessonPlan();

    return () => {
      isActive = false;
    };
  }, [route.params?.lessonPlanId]);

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

      setGeneratedPlan(result);
      setEditableDocument(result.document);
      setIsEditingPreview(false);
      Toast.show({
        type: "success",
        text1: "Lesson plan generated",
        text2: `${result.remainingResponses} AI responses remaining.`,
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

  const handleUpdateBlock = (
    blockIndex: number,
    block: EditableDocumentBlock,
  ) => {
    setEditableDocument((currentDocument) => {
      if (!currentDocument) {
        return currentDocument;
      }

      const nextBlocks = [...currentDocument.blocks];
      nextBlocks[blockIndex] = block;

      return {
        ...currentDocument,
        title:
          blockIndex === 0 && block.type === "heading"
            ? block.text
            : currentDocument.title,
        blocks: nextBlocks,
      };
    });
  };

  const handleExport = async () => {
    if (!editableDocument) {
      return;
    }

    try {
      setIsExporting(true);
      const result = await exportLessonPlanDocument({
        document: editableDocument,
      });

      await Share.share({
        title: result.filename,
        message: result.plainText,
      });

      Toast.show({
        type: "success",
        text1: "DOC export prepared",
        text2: result.filename,
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Export failed",
        text2: error?.message || "Please try again.",
      });
    } finally {
      setIsExporting(false);
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
                <View
                  className="flex-row items-center rounded-2xl px-4"
                  style={{
                    height: 50,
                    backgroundColor: "#FFFFFF",
                    borderColor: "#E5E7EB",
                    borderWidth: 1,
                    overflow: "hidden",
                  }}
                >
                  <Ionicons
                    name="school-outline"
                    size={20}
                    color="#8E95B2"
                    style={{ marginRight: 10 }}
                  />
                  <Picker
                    selectedValue={selectedGrade}
                    onValueChange={(itemValue) => setSelectedGrade(itemValue)}
                    style={{
                      flex: 1,
                      height: 50,
                      backgroundColor: "transparent",
                      color: selectedGrade ? "#111827" : "#8E95B2",
                    }}
                    dropdownIconColor="#8E95B2"
                  >
                    <Picker.Item label="Level" value="" />

                    {gradeOptions.map((grade) => (
                      <Picker.Item
                        key={grade.value}
                        label={grade.label}
                        value={grade.value}
                      />
                    ))}
                  </Picker>
                </View>
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

          {editableDocument ? (
            <View className="bg-white p-6 rounded-3xl shadow-sm shadow-navy/5 mb-8">
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center flex-1">
                  <Ionicons
                    name="document-text-outline"
                    size={22}
                    color="#2F5BFF"
                  />
                  <Text className="text-navy font-poppins-bold text-xl ml-2">
                    Lesson Plan Preview
                  </Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => setIsEditingPreview((value) => !value)}
                  className="h-10 w-10 items-center justify-center rounded-full bg-soft-blue"
                  accessibilityRole="button"
                  accessibilityLabel={
                    isEditingPreview
                      ? "Stop editing lesson plan"
                      : "Edit lesson plan"
                  }
                >
                  <Ionicons
                    name={
                      isEditingPreview ? "checkmark-outline" : "pencil-outline"
                    }
                    size={20}
                    color="#2F5BFF"
                  />
                </TouchableOpacity>
              </View>

              <Text className="text-secondary font-poppins text-sm leading-6">
                {isEditingPreview
                  ? "Edit the generated document below before exporting."
                  : "Review the generated document. Tap the pencil to edit."}
              </Text>

              {isEditingPreview ? (
                <View className="mt-3">
                  {editableDocument.blocks.map((block, index) =>
                    renderEditableDocumentBlock(
                      block,
                      index,
                      handleUpdateBlock,
                    ),
                  )}
                </View>
              ) : (
                <View className="mt-4">
                  {editableDocument.blocks.map((block, index) =>
                    renderDocumentBlock(block, index),
                  )}
                </View>
              )}

              <View className="mt-2">
                <Button
                  title={isExporting ? "Exporting..." : "Export DOC"}
                  variant="outline"
                  icon="download-outline"
                  isLoading={isExporting}
                  disabled={isExporting}
                  onPress={handleExport}
                />
              </View>
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
