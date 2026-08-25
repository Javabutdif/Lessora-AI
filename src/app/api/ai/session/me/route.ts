import { NextRequest, NextResponse } from "next/server";
import { Session } from "@/lib/schemas/session.schema";
import { connectionReady } from "@/lib/db";
import { checkRateLimit } from "@/lib/middleware/rate-limiter";
import { handleApiError } from "@/lib/middleware/error-handler";

export async function GET(request: NextRequest) {
  try {
    await connectionReady;
    const rateLimit = checkRateLimit(request);
    if (rateLimit) return rateLimit;

    const sessionId = request.headers.get("x-session-token") as string | null;

    if (!sessionId) {
      return NextResponse.json({
        data: { creditsRemaining: 0, isAnonymous: true, sessionsRemainingToday: 0 },
        error: null,
      });
    }

    const session = await Session.findOne({ sessionId })
      .select("aiResponseCredits dailySessionCount dailyCountResetAt")
      .lean();

    const now = new Date();
    const sessionsRemainingToday = Math.max(
      0,
      5 - ((session?.dailySessionCount as number) ?? 0),
    );

    return NextResponse.json({
      data: {
        creditsRemaining: session?.aiResponseCredits ?? 0,
        isAnonymous: true,
        sessionsRemainingToday,
      },
      error: null,
    });
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}
