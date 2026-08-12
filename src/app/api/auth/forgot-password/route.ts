import { NextRequest, NextResponse } from "next/server";
import { User } from "@/lib/schemas/user.schema";
import {
  generateResetToken,
  hashResetToken,
  getTokenExpirationDate,
} from "@/lib/utils/password.utils";
import { ResendService } from "@/lib/services/resend.service";

const RESET_TOKEN_RATE_LIMIT = new Map<string, { count: number; resetTime: number }>();

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

  if (limit.count >= 3) return false;
  limit.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required." },
        { status: 400 },
      );
    }

    if (!checkRateLimit(email)) {
      return NextResponse.json(
        { success: false, message: "Too many reset requests. Please try again in 1 hour." },
        { status: 429 },
      );
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json({
        success: true,
        message: "If an account exists with this email, a reset link has been sent.",
      });
    }

    const resetToken = generateResetToken();
    const hashedToken = await hashResetToken(resetToken);
    const expiresAt = getTokenExpirationDate();

    user.passwordResetToken = hashedToken;
    user.passwordResetTokenExpires = expiresAt;
    await user.save();

    const baseUrl = process.env.BASE_URL || "http://localhost:3000";
    const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;

    try {
      await ResendService.sendPasswordResetEmail(user.email, user.firstName, resetLink);
    } catch (emailError) {
      console.error("Failed to send reset email:", emailError);
      user.passwordResetToken = null;
      user.passwordResetTokenExpires = null;
      await user.save();
      return NextResponse.json(
        { success: false, message: "Failed to send reset email. Please try again later." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "If an account exists with this email, a reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { data: null, error: { code: "SERVER_ERROR", message: "Failed to process request" } },
      { status: 500 },
    );
  }
}
