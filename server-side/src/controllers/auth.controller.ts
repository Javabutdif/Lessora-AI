import { Request, Response, NextFunction } from "express";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import { loginUser, registerUser } from "../services/auth.service";
import { User } from "../schemas/user.schema";
import bcrypt from "bcryptjs";
import {
  generateResetToken,
  hashResetToken,
  verifyResetToken,
  getTokenExpirationDate,
  validatePassword,
} from "../utils/password.utils";
import { ResendService } from "../services/resend.service";

const RESET_TOKEN_RATE_LIMIT = new Map<
  string,
  { count: number; resetTime: number }
>();

/**
 * Check rate limit for forgot password requests
 * Max 3 requests per email per hour
 */
function checkRateLimit(email: string): boolean {
  const now = Date.now();
  const limit = RESET_TOKEN_RATE_LIMIT.get(email);

  if (!limit) {
    RESET_TOKEN_RATE_LIMIT.set(email, { count: 1, resetTime: now + 3600000 });
    return true;
  }

  if (now > limit.resetTime) {
    RESET_TOKEN_RATE_LIMIT.set(email, { count: 1, resetTime: now + 3600000 });
    return true;
  }

  if (limit.count >= 3) {
    return false;
  }

  limit.count++;
  return true;
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const input = loginSchema.parse(req.body);
    const user = await loginUser(input);
    res.json({ data: user, error: null });
  } catch (error) {
    next(error);
  }
}

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const input = registerSchema.parse(req.body);
    await registerUser(input);
    res.status(200).json({ message: "Register Successful", error: null });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/forgot-password
 * Request password reset email
 */
export async function forgotPassword(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    // Check rate limit
    if (!checkRateLimit(email)) {
      return res.status(429).json({
        success: false,
        message: "Too many reset requests. Please try again in 1 hour.",
      });
    }

    // Find user by email (don't reveal if user exists)
    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return success message to prevent email enumeration
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If an account exists with this email, a reset link has been sent.",
      });
    }

    // Generate reset token
    const resetToken = generateResetToken();
    const hashedToken = await hashResetToken(resetToken);
    const expiresAt = getTokenExpirationDate();

    // Save token to database
    user.passwordResetToken = hashedToken;
    user.passwordResetTokenExpires = expiresAt;
    await user.save();

    // Build reset link
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";
    const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;

    // Send email
    try {
      await ResendService.sendPasswordResetEmail(
        user.email,
        user.firstName,
        resetLink,
      );
    } catch (emailError) {
      console.error("Failed to send reset email:", emailError);
      // Clear reset token if email fails
      user.passwordResetToken = null;
      user.passwordResetTokenExpires = null;
      await user.save();
      return res.status(500).json({
        success: false,
        message: "Failed to send reset email. Please try again later.",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "If an account exists with this email, a reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    next(error);
  }
}

/**
 * GET /api/auth/verify-reset-token/:token
 * Verify reset token is valid and not expired
 */
export async function verifyResetTokenHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Reset token is required.",
      });
    }

    // Find user with this token
    const user = await User.findOne({
      passwordResetToken: { $exists: true, $ne: null },
      passwordResetTokenExpires: { $gt: new Date() },
    }).select("+passwordResetToken +passwordResetTokenExpires");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token.",
      });
    }

    // Verify token matches
    const tokenValid = await verifyResetToken(token, user.passwordResetToken!);

    if (!tokenValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Reset token is valid.",
      expiresAt: user.passwordResetTokenExpires,
    });
  } catch (error) {
    console.error("Verify reset token error:", error);
    next(error);
  }
}

/**
 * POST /api/auth/reset-password
 * Reset password with valid token
 */
export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Reset token and new password are required.",
      });
    }

    // Validate password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return res.status(400).json({
        success: false,
        message: passwordValidation.error,
      });
    }

    // Find user with reset token
    const user = await User.findOne({
      passwordResetToken: { $exists: true, $ne: null },
      passwordResetTokenExpires: { $gt: new Date() },
    }).select("+passwordResetToken +passwordResetTokenExpires");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token.",
      });
    }

    // Verify token matches
    const tokenValid = await verifyResetToken(token, user.passwordResetToken!);

    if (!tokenValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token.",
      });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update user
    user.passwordHash = passwordHash;
    user.passwordResetToken = null;
    user.passwordResetTokenExpires = null;
    await user.save();

    res.status(200).json({
      success: true,
      message:
        "Password reset successfully. You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    next(error);
  }
}
