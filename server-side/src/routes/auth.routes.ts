import { Router } from "express";
import {
  login,
  register,
  forgotPassword,
  verifyResetTokenHandler,
  resetPassword,
} from "../controllers/auth.controller";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/forgot-password", forgotPassword);
router.get("/verify-reset-token/:token", verifyResetTokenHandler);
router.post("/reset-password", resetPassword);

export { router as authRouter };
