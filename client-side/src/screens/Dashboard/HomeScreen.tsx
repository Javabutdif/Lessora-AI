import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import Card from "../../components/ui/Card";
import FloatingAssistant from "../../components/ui/FloatingAssistant";
import { useAuth } from "../../context/AuthContext";
import {
  LessonPlanHistoryItem,
  listRecentLessonPlans,
} from "../../services/api";

type DashboardTabParamList = {
  HomeTab: undefined;
  Generate: { lessonPlanId?: string } | undefined;
  Analytics: undefined;
  Profile: undefined;
};

type Props = {
  navigation: BottomTabNavigationProp<DashboardTabParamList, "HomeTab">;
};

export default function HomeScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [recentPlans, setRecentPlans] = React.useState<LessonPlanHistoryItem[]>(
    [],
  );
  const [isLoadingRecentPlans, setIsLoadingRecentPlans] = React.useState(false);

  function getInitials(name?: string) {
    if (!name) {
      return "U";
    }

    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      async function loadRecentPlans() {
        try {
          setIsLoadingRecentPlans(true);
          const plans = await listRecentLessonPlans();

          if (isActive) {
            setRecentPlans(plans);
          }
        } catch (error: any) {
          if (isActive) {
            Toast.show({
              type: "error",
              text1: "Could not load recent plans",
              text2: error?.message || "Please try again.",
            });
          }
        } finally {
          if (isActive) {
            setIsLoadingRecentPlans(false);
          }
        }
      }

      loadRecentPlans();

      return () => {
        isActive = false;
      };
    }, []),
  );

  function formatUpdatedAt(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Recently updated";
    }

    return `Updated ${date.toLocaleDateString()}`;
  }

  return (
    <SafeAreaView className="flex-1 bg-soft-gray">
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
        <View className="flex-row justify-between items-center mb-8">
          <View>
            <Text className="text-secondary font-poppins text-sm mb-1">
              Good Morning,
            </Text>
            <Text className="text-navy font-poppins-bold text-2xl">
              {user?.name}
            </Text>
          </View>
          <View className="w-12 h-12 bg-lavender rounded-full items-center justify-center">
            <Text className="text-navy font-poppins-bold text-lg">
              {getInitials(user?.name)}
            </Text>
          </View>
        </View>

        <Card variant="gradient" className="mb-8">
          <Text className="text-white font-poppins-semi text-sm mb-2 opacity-90">
            Ready for your next class?
          </Text>
          <Text className="text-white font-poppins-bold text-2xl mb-4 leading-tight">
            Generate an AI-powered lesson plan in seconds.
          </Text>
          <TouchableOpacity
            className="bg-white/20 self-start px-4 py-2 rounded-xl flex-row items-center"
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Generate")}
          >
            <Text className="text-white font-poppins-semi mr-2">
              Try it now
            </Text>
            <Ionicons name="arrow-forward" size={16} color="white" />
          </TouchableOpacity>
        </Card>

        <View className="mb-6 flex-row justify-between items-end">
          <Text className="text-navy font-poppins-bold text-xl">
            Recent Plans
          </Text>
          <Text className="text-royal font-poppins-semi text-sm">
            {isLoadingRecentPlans ? "Loading" : "View All"}
          </Text>
        </View>

        {recentPlans.length ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-8 -mx-6 px-6"
          >
            {recentPlans.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                activeOpacity={0.85}
                onPress={() =>
                  navigation.navigate("Generate", { lessonPlanId: plan.id })
                }
              >
                <Card className="w-64 mr-4 p-4">
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
                    numberOfLines={1}
                  >
                    {plan.title}
                  </Text>
                  <Text className="text-secondary font-poppins text-sm mb-4">
                    {plan.gradeLevel} - {plan.totalDuration} mins
                  </Text>
                  <Text className="text-muted font-poppins text-xs">
                    {formatUpdatedAt(plan.updatedAt)}
                  </Text>
                </Card>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <Card className="mb-8 p-4">
            <Text className="text-primary font-poppins-semi text-base mb-1">
              No recent plans yet
            </Text>
            <Text className="text-secondary font-poppins text-sm">
              Generate your first lesson plan and it will appear here.
            </Text>
          </Card>
        )}

        <Text className="text-navy font-poppins-bold text-xl mb-4">
          AI Suggestions
        </Text>
        <Card variant="glass" className="mb-4 flex-row items-center">
          <View className="w-12 h-12 bg-purple/10 rounded-xl items-center justify-center mr-4">
            <Ionicons name="bulb-outline" size={24} color="#8A3FFC" />
          </View>
          <View className="flex-1">
            <Text className="text-primary font-poppins-semi text-base mb-1">
              Add Interactive Quiz
            </Text>
            <Text className="text-secondary font-poppins text-sm">
              To your latest lesson plan.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#8E95B2" />
        </Card>
      </ScrollView>
      <FloatingAssistant />
    </SafeAreaView>
  );
}
