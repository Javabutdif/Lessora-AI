import { Request, Response, NextFunction } from "express";
import { updateProfileSchema, updateSettingsSchema } from "../schemas/user.schema";
import {
  getUserAnalytics,
  updateUserProfile,
  updateUserSettings,
} from "../services/user.service";

export async function getAnalytics(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.authUser?.id;

    if (!userId) {
      throw new Error("Authentication is required");
    }

    const analytics = await getUserAnalytics(userId);
    res.json({ data: analytics, error: null });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.authUser?.id;

    if (!userId) {
      throw new Error("Authentication is required");
    }

    const input = updateProfileSchema.parse(req.body);
    const result = await updateUserProfile(userId, input);
    res.json({ data: result, error: null });
  } catch (error) {
    next(error);
  }
}

export async function updateSettings(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.authUser?.id;

    if (!userId) {
      throw new Error("Authentication is required");
    }

    const input = updateSettingsSchema.parse(req.body);
    const result = await updateUserSettings(userId, input);
    res.json({ data: result, error: null });
  } catch (error) {
    next(error);
  }
}

// Made with Bob
