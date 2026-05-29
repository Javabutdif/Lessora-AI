import { Router } from "express";
import {
  getAdminStats,
  loginAdminController,
  listUsersController,
  updateUserController,
  deleteUserController,
} from "../controllers/admin.controller";
import { requireAdmin } from "../middleware/auth.middleware";

const router = Router();

router.post("/login", loginAdminController);
router.get("/stats", requireAdmin, getAdminStats);

// User management routes
router.get("/users", requireAdmin, listUsersController);
router.patch("/users/:id", requireAdmin, updateUserController);
router.delete("/users/:id", requireAdmin, deleteUserController);

export { router as adminRouter };
