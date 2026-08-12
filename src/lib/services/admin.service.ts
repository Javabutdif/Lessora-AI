import { Types } from "mongoose";
import { LessonPlan } from "../schemas/lesson.schema";
import { User } from "../schemas/user.schema";

const DASHBOARD_METRICS_CACHE_TTL_MS = 60_000;

export type DashboardMetrics = {
  activeUsers: number;
  totalLessonPlans: number;
  lastUpdated: Date;
  timestamp: Date;
};

type AdminLessonPlanOwner = {
  _id: Types.ObjectId;
  firstName?: string;
  lastName?: string;
  email: string;
} | null;

export type AdminLessonPlanHistoryItem = {
  id: string;
  title: string;
  subject: string;
  gradeLevel: string;
  totalDuration: number;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
};

let cachedDashboardMetrics: {
  data: DashboardMetrics;
  expiresAt: number;
} | null = null;

export async function getActiveUserCount() {
  return User.countDocuments({
    isActive: true,
  });
}

export async function getLessonPlanCount() {
  return LessonPlan.countDocuments();
}

export async function getDashboardMetrics() {
  const nowMs = Date.now();

  if (cachedDashboardMetrics && cachedDashboardMetrics.expiresAt > nowMs) {
    return {
      ...cachedDashboardMetrics.data,
      timestamp: new Date(),
    };
  }

  const [activeUsers, totalLessonPlans] = await Promise.all([
    getActiveUserCount(),
    getLessonPlanCount(),
  ]);

  const lastUpdated = new Date();
  const data: DashboardMetrics = {
    activeUsers,
    totalLessonPlans,
    lastUpdated,
    timestamp: lastUpdated,
  };

  cachedDashboardMetrics = {
    data,
    expiresAt: nowMs + DASHBOARD_METRICS_CACHE_TTL_MS,
  };

  return data;
}

function formatCreatorName(owner: AdminLessonPlanOwner) {
  if (!owner) {
    return "Unknown teacher";
  }

  const firstName = owner.firstName?.trim();
  const lastName = owner.lastName?.trim();

  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }

  return owner.email;
}

export async function listAdminLessonPlans(): Promise<
  AdminLessonPlanHistoryItem[]
> {
  const lessonPlans = await LessonPlan.find()
    .sort({ createdAt: -1 })
    .select("title subject gradeLevel totalDuration createdAt updatedAt userId")
    .populate<{
      userId: AdminLessonPlanOwner;
    }>({
      path: "userId",
      select: "firstName lastName email",
    });

  return lessonPlans.map((lessonPlan) => {
    const owner = lessonPlan.userId;

    return {
      id: lessonPlan._id.toString(),
      title: lessonPlan.title,
      subject: lessonPlan.subject,
      gradeLevel: lessonPlan.gradeLevel,
      totalDuration: lessonPlan.totalDuration,
      createdAt: lessonPlan.createdAt.toISOString(),
      updatedAt: lessonPlan.updatedAt.toISOString(),
      createdBy: {
        id: owner?._id?.toString() || "",
        name: formatCreatorName(owner),
        email: owner?.email || "unknown@example.com",
      },
    };
  });
}
