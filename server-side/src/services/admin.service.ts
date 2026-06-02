import { LessonPlan } from "../schemas/lesson.schema";
import { User } from "../schemas/user.schema";

const DASHBOARD_METRICS_CACHE_TTL_MS = 60_000;

export type DashboardMetrics = {
  activeUsers: number;
  totalLessonPlans: number;
  lastUpdated: Date;
  timestamp: Date;
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
