import { Router } from "express";
import {
  generateLessonPlan,
  getLessonPlanById,
  getLessonPlanAIConfig,
  listRecentLessonPlans,
  refineLessonPlan,
} from "../controllers/ai.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/lesson-plan/config", getLessonPlanAIConfig);
router.get("/lesson-plan/history", requireAuth, listRecentLessonPlans);
router.get(
  "/lesson-plan/history/:lessonPlanId",
  requireAuth,
  getLessonPlanById,
);
router.post("/lesson-plan/generate", requireAuth, generateLessonPlan);
router.post("/lesson-plan/refine", requireAuth, refineLessonPlan);

export { router as aiRouter };
