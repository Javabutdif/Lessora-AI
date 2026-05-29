import React from "react";
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import {
  LessonPlanHistoryItem,
  listRecentLessonPlans,
} from "../../services/api";
import { DashboardTabParamList } from "../../navigation/types";

type Props = {
  navigation: BottomTabNavigationProp<DashboardTabParamList, "History">;
};

export default function HistoryScreen({ navigation }: Props) {
  const [plans, setPlans] = React.useState<LessonPlanHistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const loadPlans = React.useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setIsLoading(true);
      }
      const fetchedPlans = await listRecentLessonPlans();
      setPlans(fetchedPlans);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Failed to load history",
        text2: error?.message || "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadPlans(true);
    }, [loadPlans])
  );

  function formatUpdatedAt(value: string) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "Recently updated";
    }
    return `Updated ${date.toLocaleDateString()}`;
  }

  const filteredPlans = plans.filter((plan) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      return true;
    }
    return (
      plan.title.toLowerCase().includes(query) ||
      plan.subject.toLowerCase().includes(query) ||
      plan.gradeLevel.toLowerCase().includes(query)
    );
  });

  return (
    <SafeAreaView className="flex-1 bg-soft-gray" edges={["top", "left", "right"]}>
      <View className="px-6 pt-4 pb-2">
        <Text className="text-navy font-poppins-bold text-3xl mb-4">Lesson Plan History</Text>
        <Input
          placeholder="Search history by title, subject..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          icon="search-outline"
          className="mb-2"
        />
      </View>

      <FlatList
        data={filteredPlans}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => loadPlans(false)}
            colors={["#2F5BFF"]}
            tintColor="#2F5BFF"
          />
        }
        renderItem={({ item: plan }) => (
          <TouchableOpacity
            key={plan.id}
            activeOpacity={0.85}
            className="mb-4"
            onPress={() =>
              navigation.navigate("Generate", {
                screen: "Preview",
                params: { lessonPlanId: plan.id },
              })
            }
          >
            <Card className="p-4">
              <View className="flex-row justify-between items-start mb-3">
                <View className="bg-soft-blue px-3 py-1 rounded-lg">
                  <Text className="text-royal font-poppins-semi text-xs">
                    {plan.subject}
                  </Text>
                </View>
                <Ionicons
                  name="document-text-outline"
                  size={20}
                  color="#8E95B2"
                />
              </View>
              <Text
                className="text-primary font-poppins-semi text-lg mb-1"
                numberOfLines={2}
              >
                {plan.title}
              </Text>
              <Text className="text-secondary font-poppins text-sm mb-4">
                {plan.gradeLevel} - {plan.totalDuration} mins
              </Text>
              <View className="flex-row justify-between items-center">
                <Text className="text-muted font-poppins text-xs">
                  {formatUpdatedAt(plan.updatedAt)}
                </Text>
                <View className="flex-row items-center">
                  <Text className="text-royal font-poppins-semi text-xs mr-1">View Details</Text>
                  <Ionicons name="chevron-forward" size={14} color="#2F5BFF" />
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          !isLoading ? (
            <Card className="p-6 items-center">
              <View className="w-16 h-16 bg-soft-blue rounded-full items-center justify-center mb-4">
                <Ionicons name="folder-open-outline" size={32} color="#2F5BFF" />
              </View>
              <Text className="text-primary font-poppins-bold text-lg mb-2 text-center">
                {searchQuery ? "No matching plans" : "No history found"}
              </Text>
              <Text className="text-secondary font-poppins text-sm text-center">
                {searchQuery
                  ? "Try adjusting your keywords or search terms."
                  : "Generate your first lesson plan using the generator to see it here."}
              </Text>
            </Card>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
