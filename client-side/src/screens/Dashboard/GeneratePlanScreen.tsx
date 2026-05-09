import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function GeneratePlanScreen() {
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

  const [selectedGrade, setSelectedGrade] = React.useState("");
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
            />

            <View className="mt-4">
              <Button
                title="Generate with AI"
                variant="glowing"
                icon="sparkles"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
