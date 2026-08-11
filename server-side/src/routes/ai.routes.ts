import { Router } from "express";
import {
  generateLessonPlan,
  getLessonPlanById,
  getLessonPlanAIConfig,
  listRecentLessonPlans,
  refineLessonPlan,
  listPublicLessonPlans,
  getPublicLessonPlanById,
  getSessionInfo,
  ensureAnonymousSession,
} from "../controllers/ai.controller";
import { requireAuthOrSession } from "../middleware/auth-or-session.middleware";

const router = Router();

router.post("/session/ensure", ensureAnonymousSession);
router.get("/lesson-plan/config", getLessonPlanAIConfig);
router.get("/lesson-plan/history", requireAuthOrSession, listRecentLessonPlans);
router.get(
  "/lesson-plan/history/:lessonPlanId",
  requireAuthOrSession,
  getLessonPlanById,
);
router.post("/lesson-plan/generate", requireAuthOrSession, generateLessonPlan);
router.post("/lesson-plan/refine", requireAuthOrSession, refineLessonPlan);
router.get("/lesson-plan/public", listPublicLessonPlans);
router.get("/lesson-plan/public/:lessonPlanId", getPublicLessonPlanById);
router.get("/session/me", requireAuthOrSession, getSessionInfo);

export { router as aiRouter };
