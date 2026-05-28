import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/Dashboard/HomeScreen";
import GeneratePlanScreen from "../screens/Dashboard/GeneratePlanScreen";
import AnalyticsScreen from "../screens/Dashboard/AnalyticsScreen";
import ProfileScreen from "../screens/Dashboard/ProfileScreen";
import { View } from "react-native";

type DashboardTabParamList = {
  HomeTab: undefined;
  Generate: { lessonPlanId?: string } | undefined;
  Analytics: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<DashboardTabParamList>();

export default function BottomTabBar() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: "#06145F",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
          height: 80,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          position: "absolute",
        },
        tabBarIcon: ({ focused, color }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";
          let size = 24;

          if (route.name === "HomeTab") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Generate") {
            iconName = focused ? "sparkles" : "sparkles-outline";
          } else if (route.name === "Analytics") {
            iconName = focused ? "bar-chart" : "bar-chart-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          if (route.name === "Generate") {
            return (
              <View className="bg-electric w-14 h-14 rounded-full items-center justify-center -mt-6 shadow-lg shadow-electric/50">
                <Ionicons name={iconName} size={28} color="#FFFFFF" />
              </View>
            );
          }

          return <Ionicons name={iconName} size={size} color={focused ? "#2F5BFF" : "#8E95B2"} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} />
      <Tab.Screen name="Generate" component={GeneratePlanScreen} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
