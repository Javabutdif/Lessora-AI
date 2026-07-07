import { Router } from "express";
import {
  getDashboardMetricsController,
  getLandingMetricsController,
  getAdminStats,
  loginAdminController,
  listAdminLessonPlansController,
  listUsersController,
  updateUserController,
  deleteUserController,
} from "../controllers/admin.controller";
import { requireAdmin } from "../middleware/auth.middleware";

const router = Router();

router.post("/login", loginAdminController);
router.get("/metrics/landing", getLandingMetricsController);
router.get("/stats", requireAdmin, getAdminStats);
router.get("/metrics/dashboard", requireAdmin, getDashboardMetricsController);
router.get("/lesson-plans", requireAdmin, listAdminLessonPlansController);

// User management routes
router.get("/users", requireAdmin, listUsersController);
router.patch("/users/:id", requireAdmin, updateUserController);
router.delete("/users/:id", requireAdmin, deleteUserController);

export { router as adminRouter };
