import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { User } from "@/lib/schemas/user.schema";
import { verifyResetToken, validatePassword } from "@/lib/utils/password.utils";

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Reset token and new password are required." },
        { status: 400 },
      );
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { success: false, message: passwordValidation.error },
        { status: 400 },
      );
    }

    const user = await User.findOne({
      passwordResetToken: { $exists: true, $ne: null },
      passwordResetTokenExpires: { $gt: new Date() },
    }).select("+passwordResetToken +passwordResetTokenExpires");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired reset token." },
        { status: 400 },
      );
    }

    const tokenValid = await verifyResetToken(token, user.passwordResetToken!);

    if (!tokenValid) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired reset token." },
        { status: 400 },
      );
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = passwordHash;
    user.passwordResetToken = null;
    user.passwordResetTokenExpires = null;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Password reset successfully. You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { data: null, error: { code: "SERVER_ERROR", message: "Failed to reset password" } },
      { status: 500 },
    );
  }
}
