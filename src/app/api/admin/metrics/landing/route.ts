import { NextResponse } from "next/server";
import { getDashboardMetrics } from "@/lib/services/admin.service";

export async function GET() {
  try {
    const metrics = await getDashboardMetrics();
    return NextResponse.json({
      success: true,
      data: {
        activeUsers: metrics.activeUsers,
        totalLessonPlans: metrics.totalLessonPlans,
        lastUpdated: metrics.lastUpdated,
      },
      error: null,
    });
  } catch (error) {
    return NextResponse.json(
      { data: null, error: { code: "SERVER_ERROR", message: "Failed to fetch landing metrics" } },
      { status: 500 },
    );
  }
}
