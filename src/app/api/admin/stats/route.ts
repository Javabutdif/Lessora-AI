import { NextRequest, NextResponse } from "next/server";
import { authenticateToken } from "@/middleware";
import { handleApiError } from "@/lib/middleware/error-handler";
import { User } from "@/lib/schemas/user.schema";
import { LessonPlan } from "@/lib/schemas/lesson.schema";

function requireAdmin(request: NextRequest): ReturnType<typeof authenticateToken> | NextResponse {
  try {
    const user = authenticateToken(request);
    if (user.role !== "admin") {
      return NextResponse.json(
        { data: null, error: { code: "FORBIDDEN", message: "Admin access is required" } },
        { status: 403 },
      );
    }
    return user;
  } catch {
    return NextResponse.json(
      { data: null, error: { code: "UNAUTHORIZED", message: "Invalid or expired session" } },
      { status: 401 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const admin = requireAdmin(request);
    if (admin instanceof NextResponse) return admin;

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [totalUsers, activeUsers, totalLessonPlans, publishedLessonPlans, generatedLast7Days] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ lastLogin: { $gte: sevenDaysAgo } }),
        LessonPlan.countDocuments(),
        LessonPlan.countDocuments({ status: "published" }),
        LessonPlan.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      ]);

    const generatedPerDay = generatedLast7Days / 7;

    return NextResponse.json({
      data: {
        totalUsers,
        activeUsers,
        totalLessonPlans,
        publishedLessonPlans,
        generatedLast7Days,
        generationRate: Number(generatedPerDay.toFixed(1)),
      },
      error: null,
    });
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}
