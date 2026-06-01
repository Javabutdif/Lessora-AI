import { Router } from "express";
import {
  getAnalytics,
  updateProfile,
  updateSettings,
} from "../controllers/user.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

// All user routes require authentication
router.get("/analytics", requireAuth, getAnalytics);
router.put("/profile", requireAuth, updateProfile);
router.put("/settings", requireAuth, updateSettings);

export { router as userRouter };

// Made with Bob
