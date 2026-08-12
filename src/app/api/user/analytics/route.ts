import { NextRequest, NextResponse } from "next/server";
import { requireAuthOrSession, handleApiError } from "@/lib/middleware/auth-or-session";
import { getUserAnalytics } from "@/lib/services/user.service";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuthOrSession(request);
    if (!auth || auth.isAnonymous) {
      return NextResponse.json(
        { data: null, error: { code: "UNAUTHORIZED", message: "Authentication is required" } },
        { status: 401 },
      );
    }

    const userId = auth.user.id;
    const analytics = await getUserAnalytics(userId);
    return NextResponse.json({ data: analytics, error: null });
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}
