import { NextRequest, NextResponse } from "next/server";
import { User } from "@/lib/schemas/user.schema";
import { verifyResetToken } from "@/lib/utils/password.utils";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Reset token is required." },
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

    return NextResponse.json({
      success: true,
      message: "Reset token is valid.",
      expiresAt: user.passwordResetTokenExpires,
    });
  } catch (error) {
    console.error("Verify reset token error:", error);
    return NextResponse.json(
      { data: null, error: { code: "SERVER_ERROR", message: "Failed to verify token" } },
      { status: 500 },
    );
  }
}
