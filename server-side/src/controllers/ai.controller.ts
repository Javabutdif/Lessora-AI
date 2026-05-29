import { Request, Response, NextFunction } from "express";
import {
  generateLessonPlanSchema,
  refineLessonPlanSchema,
} from "../schemas/ai.schema";
import openAIService from "../services/openai.service";

export async function generateLessonPlan(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const input = generateLessonPlanSchema.parse(req.body);
    const userId = req.authUser?.id;

    if (!userId) {
      throw new Error("Authentication is required");
    }

    const result = await openAIService.generateLessonPlan(input, userId);
    res.json({ data: result, error: null });
  } catch (error) {
    next(error);
  }
}

export async function refineLessonPlan(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const input = refineLessonPlanSchema.parse(req.body);
    const userId = req.authUser?.id;

    if (!userId) {
      throw new Error("Authentication is required");
    }

    const result = await openAIService.refineLessonPlan(
      input.currentDraftText,
      input.refinementRequest,
      userId,
    );
    res.json({ data: result, error: null });
  } catch (error) {
    next(error);
  }
}

export function getLessonPlanAIConfig(_req: Request, res: Response) {
  res.json({ data: openAIService.getConfig(), error: null });
}

export async function listRecentLessonPlans(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.authUser?.id;

    if (!userId) {
      throw new Error("Authentication is required");
    }

    const result = await openAIService.listRecentLessonPlans(userId);
    res.json({ data: result, error: null });
  } catch (error) {
    next(error);
  }
}

export async function getLessonPlanById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.authUser?.id;

    if (!userId) {
      throw new Error("Authentication is required");
    }

    const result = await openAIService.getLessonPlanById(
      userId,
      req.params.lessonPlanId,
    );
    res.json({ data: result, error: null });
  } catch (error) {
    next(error);
  }
}
