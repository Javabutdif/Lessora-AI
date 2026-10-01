import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Session } from "@/lib/schemas/session.schema";
import { connectionReady } from "@/lib/db";
import { checkRateLimit, getClientIp } from "@/lib/middleware/rate-limiter";
import { handleApiError } from "@/lib/middleware/error-handler";
import { checkDailyLimit, createOrUpdateDailySession } from "@/lib/middleware/ip-daily-limiter";
import { generateSessionId } from "@/lib/utils/session-utils";

const ensureSessionSchema = z.object({
  sessionId: z.string().uuid("Invalid session id").optional(),
});

export async function POST(request: NextRequest) {
  try {
    await connectionReady;
    const rateLimit = await checkRateLimit(request);
    if (rateLimit) return rateLimit;

    let rawBody: unknown = {};
    try {
      rawBody = await request.json();
    } catch {
      // No body provided — treat as empty
    }

    const body = ensureSessionSchema.parse(rawBody);
    const sessionId = body.sessionId ?? generateSessionId();
    const ip = getClientIp(request);

    // Only brand-new sessions count toward the per-IP daily cap
    const existing = await Session.exists({ sessionId });
    if (!existing) {
      const dailyLimit = await checkDailyLimit(ip);
      if (dailyLimit) return dailyLimit;
    }

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
