import { Request, Response, NextFunction } from "express";
import { loginSchema } from "../schemas/auth.schema";
import { User } from "../schemas/user.schema";
import { LessonPlan } from "../schemas/lesson.schema";
import { loginAdmin } from "../services/admin-auth.service";
import {
  getAllUsers,
  updateUser,
  softDeleteUser,
} from "../services/admin-users.service";
import { getDashboardMetrics } from "../services/admin.service";

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

export async function getDashboardMetricsController(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const metrics = await getDashboardMetrics();

    res.json({
      success: true,
      data: metrics,
      error: null,
    });
  } catch (error) {
    next(error);
  }
}

export async function getLandingMetricsController(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const metrics = await getDashboardMetrics();

    res.json({
      success: true,
      data: {
        activeUsers: metrics.activeUsers,
        totalLessonPlans: metrics.totalLessonPlans,
        lastUpdated: metrics.lastUpdated,
      },
      error: null,
    });
  } catch (error) {
    next(error);
  }
}

export async function listUsersController(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const users = await getAllUsers();
    res.json({
      data: users,
      error: null,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateUserController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const { name, email, status } = req.body;

    const updatedUser = await updateUser(id, { name, email, status });

    res.json({
      data: updatedUser,
      error: null,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteUserController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;

    await softDeleteUser(id);

    res.json({
      data: { success: true },
      error: null,
    });
  } catch (error) {
    next(error);
  }
}
