import React from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import Card from "../../components/ui/Card";
import { useAuth } from "../../context/AuthContext";
import { getUserAnalytics, UserAnalytics } from "../../services/api";

export default function AnalyticsScreen() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = React.useState<UserAnalytics | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const loadStats = React.useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setIsLoading(true);
      }
      const data = await getUserAnalytics();
      setAnalytics(data);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Could not load analytics",
        text2: error?.message || "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadStats(true);
    }, [loadStats])
  );

  const remainingTokens = analytics?.tokensRemaining ?? user?.aiResponseCredits ?? 5;
  const usedTokens = analytics?.tokensUsed ?? 0;
  const planCount = analytics?.plansCreated ?? 0;
  const subscribeStatus = analytics?.subscriptionStatus ?? "Active (Free Trial)";
  const accountType = analytics?.accountType ?? "Teacher Profile";

  return (
    <SafeAreaView className="flex-1 bg-soft-gray" edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => loadStats(false)}
            colors={["#2F5BFF"]}
            tintColor="#2F5BFF"
          />
        }
      >
        <Text className="text-navy font-poppins-bold text-3xl mb-6">Teaching Analytics</Text>

        {/* Subscription Status Card */}
        <Card variant="gradient" className="mb-6">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-white font-poppins-semi text-sm opacity-80">Subscription Status</Text>
              <Text className="text-white font-poppins-bold text-2xl mt-1">{subscribeStatus}</Text>
            </View>
            <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
              <Ionicons name="ribbon-outline" size={24} color="#FFFFFF" />
            </View>
          </View>
          <Text className="text-white font-poppins text-sm mt-3 opacity-90">
            Account Type: {accountType}
          </Text>
        </Card>

        {/* Tokens and Usage Stats */}
        <View className="flex-row justify-between mb-6">
          <Card className="flex-1 mr-2 p-4 items-center justify-center">
            <View className="w-10 h-10 bg-soft-blue rounded-xl items-center justify-center mb-2">
              <Ionicons name="sparkles" size={20} color="#2F5BFF" />
            </View>
            <Text className="text-navy font-poppins-bold text-2xl">{remainingTokens}</Text>
            <Text className="text-secondary font-poppins text-xs text-center mt-1">Tokens Remaining</Text>
          </Card>

          <Card className="flex-1 mx-1 p-4 items-center justify-center">
            <View className="w-10 h-10 bg-purple/10 rounded-xl items-center justify-center mb-2">
              <Ionicons name="pie-chart" size={20} color="#8A3FFC" />
            </View>
            <Text className="text-navy font-poppins-bold text-2xl">{usedTokens}</Text>
            <Text className="text-secondary font-poppins text-xs text-center mt-1">Tokens Used</Text>
          </Card>

          <Card className="flex-1 ml-2 p-4 items-center justify-center">
            <View className="w-10 h-10 bg-yellow-50 rounded-xl items-center justify-center mb-2">
              <Ionicons name="document-text" size={20} color="#FBBF24" />
            </View>
            <Text className="text-navy font-poppins-bold text-2xl">{planCount}</Text>
            <Text className="text-secondary font-poppins text-xs text-center mt-1">Plans Created</Text>
          </Card>
        </View>

        {/* Informative Tip Card */}
        <Card className="p-4 bg-soft-blue flex-row items-center border border-royal/10">
          <Ionicons name="information-circle-outline" size={24} color="#2F5BFF" style={{ marginRight: 12 }} />
          <View className="flex-1">
            <Text className="text-navy font-poppins-semi text-sm mb-0.5">Response tokens</Text>
            <Text className="text-secondary font-poppins text-xs">
              Every new account receives 5 complimentary generation tokens. Tokens reset monthly or when upgraded.
            </Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
