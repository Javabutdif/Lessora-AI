import { Request, Response, NextFunction } from "express";
import { loginSchema } from "../schemas/auth.schema";
import { User } from "../schemas/user.schema";
import { LessonPlan } from "../schemas/lesson.schema";
import { loginAdmin } from "../services/admin-auth.service";

export async function loginAdminController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const input = loginSchema.parse(req.body);
    const adminSession = await loginAdmin(input);

    res.json({
      data: adminSession,
      error: null,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAdminStats(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      activeUsers,
      totalLessonPlans,
      publishedLessonPlans,
      generatedLast7Days,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ lastLogin: { $gte: sevenDaysAgo } }),
      LessonPlan.countDocuments(),
      LessonPlan.countDocuments({ status: "published" }),
      LessonPlan.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    ]);

    const generatedPerDay = generatedLast7Days / 7;

    res.json({
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
    next(error);
  }
}
