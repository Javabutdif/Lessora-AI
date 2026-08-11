import { Request, Response, NextFunction } from "express";
import {
  generateLessonPlanSchema,
  refineLessonPlanSchema,
} from "../schemas/ai.schema";
import openAIService from "../services/openai.service";
import { Session } from "../schemas/session.schema";

export async function generateLessonPlan(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const input = generateLessonPlanSchema.parse(req.body);
    console.log("Received generate lesson plan request with input:", input);

    const ownerId = req.authUser?.id || req.anonSession?._id;
    const isAnonymous = !!req.anonSession;

    if (!ownerId) {
      throw new Error("Authentication is required");
    }

    const result = await openAIService.generateLessonPlan(input, ownerId, isAnonymous);
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
    const ownerId = req.authUser?.id || req.anonSession?._id;
    const isAnonymous = !!req.anonSession;

    if (!ownerId) {
      throw new Error("Authentication is required");
    }

    const result = await openAIService.refineLessonPlan(
      input.lessonPlanId,
      input.selectedSections,
      input.refinementRequest,
      ownerId,
      isAnonymous,
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
    const ownerId = req.authUser?.id || req.anonSession?._id;
    const isAnonymous = !!req.anonSession;

    if (!ownerId) {
      throw new Error("Authentication is required");
    }

    const result = await openAIService.listRecentLessonPlans(ownerId, isAnonymous);
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
    const ownerId = req.authUser?.id || req.anonSession?._id;
    const isAnonymous = !!req.anonSession;

    if (!ownerId) {
      throw new Error("Authentication is required");
    }

    const result = await openAIService.getLessonPlanById(
      ownerId,
      req.params.lessonPlanId,
      isAnonymous,
    );
    res.json({ data: result, error: null });
  } catch (error) {
    next(error);
  }
}

export async function getPublicLessonPlanById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await openAIService.getPublicLessonPlanById(req.params.lessonPlanId);
    res.json({ data: result, error: null });
  } catch (error) {
    next(error);
  }
}

export async function listPublicLessonPlans(_req: Request, res: Response, next: NextFunction) {
  try {
    const result = await openAIService.listPublicLessonPlans();
    res.json({ data: result, error: null });
  } catch (error) {
    next(error);
  }
}

export async function getSessionInfo(req: Request, res: Response, next: NextFunction) {
  try {
    const sessionId = req.anonSession?.sessionId;

    if (!sessionId) {
      return res.json({
        data: {
          creditsRemaining: 0,
          plansCreated: 0,
          isAnonymous: true,
        },
        error: null,
      });
    }

    const session = await Session.findOne({ sessionId })
      .select("aiResponseCredits")
      .lean();

    res.json({
      data: {
        creditsRemaining: session?.aiResponseCredits ?? 0,
        isAnonymous: true,
      },
      error: null,
    });
  } catch (error) {
    next(error);
  }
}

export async function ensureAnonymousSession(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const existingSessionId = req.body?.sessionId;
    let sessionId: string;

    if (existingSessionId) {
      sessionId = existingSessionId;
    } else {
      const { generateSessionId } = require("../utils/session-utils");
      sessionId = generateSessionId();
    }

    const session = await Session.findOneAndUpdate(
      { sessionId },
      {
        $setOnInsert: {
          sessionId,
          ip: req.ip || "",
          userAgent: req.headers["user-agent"] || "",
          aiResponseCredits: 3,
          lessonPlanIds: [],
        },
        $set: { lastActivityAt: new Date() },
      },
      { new: true, upsert: true },
    );

    res.json({
      data: {
        sessionId: session.sessionId,
        creditsRemaining: session.aiResponseCredits,
      },
      error: null,
    });
  } catch (error) {
    next(error);
  }
}
