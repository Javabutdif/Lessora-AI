import { Router } from "express";
import {
  getAdminStats,
  loginAdminController,
} from "../controllers/admin.controller";
import { requireAdmin } from "../middleware/auth.middleware";

const router = Router();

router.post("/login", loginAdminController);
router.get("/stats", requireAdmin, getAdminStats);

export { router as adminRouter };
