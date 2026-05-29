import { NavigatorScreenParams } from "@react-navigation/native";
import { LessonPlanDocument } from "../services/api";

export type DashboardStackParamList = {
  Generate: { lessonPlanId?: string } | undefined;
  Preview: {
    lessonPlanId?: string;
    document?: LessonPlanDocument;
  };
};

export type DashboardTabParamList = {
  HomeTab: undefined;
  History: undefined;
  Generate: NavigatorScreenParams<DashboardStackParamList>;
  Analytics: undefined;
  Profile: undefined;
};
