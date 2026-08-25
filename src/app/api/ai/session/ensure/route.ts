import { NextRequest, NextResponse } from "next/server";
import { Session } from "@/lib/schemas/session.schema";
import { connectionReady } from "@/lib/db";
import { checkRateLimit, getSessionId } from "@/lib/middleware/rate-limiter";
import { handleApiError } from "@/lib/middleware/error-handler";
import { checkDailyLimit, createOrUpdateDailySession } from "@/lib/middleware/ip-daily-limiter";

export async function POST(request: NextRequest) {
  try {
    await connectionReady;
    const rateLimit = checkRateLimit(request);
    if (rateLimit) return rateLimit;

    const dailyLimit = await checkDailyLimit(request);
    if (dailyLimit) return dailyLimit;

    let body: { sessionId?: string } = {};
    try {
      body = await request.json() as { sessionId?: string };
    } catch {
      // No body provided — treat as empty
    }

    const existingSessionId = body.sessionId as string | undefined;
    let sessionId: string;

    if (existingSessionId) {
      sessionId = existingSessionId;
    } else {
      const { generateSessionId } = await import("@/lib/utils/session-utils");
      sessionId = generateSessionId();
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      request.headers.get("x-real-ip") ??
      "";
    const userAgent = request.headers.get("user-agent") ?? "";

    const result = await createOrUpdateDailySession(sessionId, ip, userAgent);

    return NextResponse.json({
      data: { sessionId: result.sessionId, creditsRemaining: result.creditsRemaining },
      error: null,
    });
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}
