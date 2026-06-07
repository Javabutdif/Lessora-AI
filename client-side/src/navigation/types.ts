import { NavigatorScreenParams } from "@react-navigation/native";
import { LessonPlanDocument, LessonPlanTemplate } from "../services/api";

export type DashboardStackParamList = {
  Generate: { lessonPlanId?: string } | undefined;
  Preview: {
    lessonPlanId?: string;
    document?: LessonPlanDocument;
    templateId?: LessonPlanTemplate;
  };
  Refine: {
    lessonPlanId?: string;
    document?: LessonPlanDocument;
    templateId?: LessonPlanTemplate;
  };
};

export type DashboardTabParamList = {
  HomeTab: undefined;
  History: undefined;
  Generate: NavigatorScreenParams<DashboardStackParamList>;
  Analytics: undefined;
  Profile: undefined;
};
