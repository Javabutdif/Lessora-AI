import { NextRequest, NextResponse } from "next/server";
import { Session } from "@/lib/schemas/session.schema";
import { connectionReady } from "@/lib/db";
import { checkRateLimit, getClientIp } from "@/lib/middleware/rate-limiter";
import { handleApiError } from "@/lib/middleware/error-handler";
import { countSessionsCreatedToday, DAILY_SESSION_LIMIT } from "@/lib/middleware/ip-daily-limiter";

export async function GET(request: NextRequest) {
  try {
    await connectionReady;
    const rateLimit = await checkRateLimit(request);
    if (rateLimit) return rateLimit;

    const sessionId = request.headers.get("x-session-token") as string | null;

    if (!sessionId) {
      return NextResponse.json({
        data: { creditsRemaining: 0, isAnonymous: true, sessionsRemainingToday: 0 },
        error: null,
      });
    }

    const session = await Session.findOne({ sessionId })
      .select("aiResponseCredits dailyCountResetAt")
      .lean();

    const createdToday = await countSessionsCreatedToday(getClientIp(request));
    const sessionsRemainingToday = Math.max(0, DAILY_SESSION_LIMIT - createdToday);

    // Credits refill lazily on the next generation once the Manila day rolls over
    const creditsRemaining =
      session && session.dailyCountResetAt <= new Date() ? 3 : session?.aiResponseCredits ?? 0;

    return NextResponse.json({
      data: {
        creditsRemaining,
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
