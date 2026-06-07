import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GeneratePlanScreen from "../screens/Dashboard/GeneratePlanScreen";
import LessonPlanPreviewScreen from "../screens/Dashboard/LessonPlanPreviewScreen";
import RefineLessonPlanScreen from "../screens/Dashboard/RefineLessonPlanScreen";
import { DashboardStackParamList } from "./types";

const Stack = createNativeStackNavigator<DashboardStackParamList>();

export default function DashboardStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Generate" component={GeneratePlanScreen} />
      <Stack.Screen name="Preview" component={LessonPlanPreviewScreen} />
      <Stack.Screen name="Refine" component={RefineLessonPlanScreen} />
    </Stack.Navigator>
  );
}
