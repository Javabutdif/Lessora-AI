import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Share } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import {
  getLessonPlanById,
  LessonPlanDocument,
  LessonPlanDocumentBlock,
} from "../../services/api";
import { exportLessonPlanDocumentToCache } from "../../utils/documentExport";
import { DashboardStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<DashboardStackParamList, "Preview">;

function renderDocumentBlock(block: LessonPlanDocumentBlock, index: number) {
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
  block: LessonPlanDocumentBlock,
  index: number,
  onUpdate: (blockIndex: number, block: LessonPlanDocumentBlock) => void,
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

export default function LessonPlanPreviewScreen({ route, navigation }: Props) {
  const [editableDocument, setEditableDocument] =
    React.useState<LessonPlanDocument | null>(route.params.document ?? null);
  const [isLoading, setIsLoading] = React.useState(
    !route.params.document && Boolean(route.params.lessonPlanId),
  );
  const [isEditingPreview, setIsEditingPreview] = React.useState(false);
  const [isExporting, setIsExporting] = React.useState(false);

  React.useEffect(() => {
    let isActive = true;

    if (route.params.document) {
      setEditableDocument(route.params.document);
      setIsLoading(false);
      return () => {
        isActive = false;
      };
    }

    const lessonPlanId = route.params.lessonPlanId;

    if (!lessonPlanId) {
      setIsLoading(false);
      return () => {
        isActive = false;
      };
    }

    async function loadSavedLessonPlan() {
      try {
        setIsLoading(true);
        const plan = await getLessonPlanById(lessonPlanId as string);

        if (!isActive) {
          return;
        }

        setEditableDocument(plan.document);
        setIsLoading(false);
      } catch (error: any) {
        if (!isActive) {
          return;
        }

        setIsLoading(false);
        Toast.show({
          type: "error",
          text1: "Could not open lesson plan",
          text2: error?.message || "Please try again.",
        });
      }
    }

    loadSavedLessonPlan();

    return () => {
      isActive = false;
    };
  }, [route.params.document, route.params.lessonPlanId]);

  const handleUpdateBlock = (
    blockIndex: number,
    block: LessonPlanDocumentBlock,
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
      const exportedDocument =
        await exportLessonPlanDocumentToCache(editableDocument);

      await Share.share({
        title: exportedDocument.filename,
        url: exportedDocument.uri,
        message: exportedDocument.plainText,
      });

      Toast.show({
        type: "success",
        text1: "DOC export prepared",
        text2: exportedDocument.filename,
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

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-soft-gray">
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-navy font-poppins-bold text-lg mb-2">
            Loading lesson plan...
          </Text>
          <Text className="text-secondary font-poppins text-sm">
            Fetching the saved document.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!editableDocument) {
    return (
      <SafeAreaView className="flex-1 bg-soft-gray">
        <View className="px-6 pt-6">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
            className="flex-row items-center mb-6"
          >
            <Ionicons name="chevron-back" size={20} color="#2F5BFF" />
            <Text className="text-royal font-poppins-semi ml-1">Back</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-navy font-poppins-bold text-lg mb-2">
            Lesson plan unavailable
          </Text>
          <Text className="text-secondary font-poppins text-sm text-center">
            This lesson plan could not be loaded. Return and try again.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-soft-gray">
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 40 }}>
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.goBack()}
              className="flex-row items-center"
            >
              <Ionicons name="chevron-back" size={20} color="#2F5BFF" />
              <Text className="text-royal font-poppins-semi ml-1">Back</Text>
            </TouchableOpacity>

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
                name={isEditingPreview ? "checkmark-outline" : "pencil-outline"}
                size={20}
                color="#2F5BFF"
              />
            </TouchableOpacity>
          </View>

          <Text className="text-navy font-poppins-bold text-3xl mb-2">
            {editableDocument.title}
          </Text>
          <Text className="text-secondary font-poppins text-base mb-4">
            Preview, edit, and export your lesson plan.
          </Text>
        </View>

        <View className="bg-white p-6 rounded-3xl shadow-sm shadow-navy/5 mb-6">
          {isEditingPreview ? (
            <View>
              {editableDocument.blocks.map((block, index) =>
                renderEditableDocumentBlock(block, index, handleUpdateBlock),
              )}
            </View>
          ) : (
            <View>
              {editableDocument.blocks.map((block, index) =>
                renderDocumentBlock(block, index),
              )}
            </View>
          )}

          <View className="mt-6">
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
      </ScrollView>
    </SafeAreaView>
  );
}
