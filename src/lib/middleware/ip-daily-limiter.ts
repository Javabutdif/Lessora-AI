import { NextRequest, NextResponse } from "next/server";
import { Session } from "../schemas/session.schema";

const DAILY_SESSION_LIMIT = 5;

function getIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : request.headers.get("x-real-ip") ?? "unknown";
}

function computeNextResetAt(): Date {
  const now = new Date();
  // Asia/Manila is UTC+8
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60_000;
  const tomorrow = new Date(utcMs + 24 * 60 * 60 * 1000);
  const nextReset = new Date(tomorrow.getTime() - 8 * 60 * 60 * 1000);
  return nextReset;
}

export async function checkDailyLimit(request: NextRequest): Promise<NextResponse | null> {
  const ip = getIp(request);
  const now = new Date();

  try {
    const sessions = await Session.find({
      ip,
      dailyCountResetAt: { $gt: now },
    }).sort({ dailyCountResetAt: -1 });

    if (sessions.length === 0) {
      return null;
    }

    const totalDailyCount = sessions.reduce((sum, s) => sum + (s.dailySessionCount ?? 0), 0);

    if (totalDailyCount >= DAILY_SESSION_LIMIT) {
      return NextResponse.json(
        {
          data: null,
          error: {
            code: "RATE_LIMITED_DAILY",
            message: `5 sessions used today. Try again tomorrow.`,
          },
        },
        { status: 429 },
      );
    }

    return null;
  } catch (error) {
    console.error("[ip-daily-limiter] DB error during daily check:", error);
    return null;
  }
}

export async function createOrUpdateDailySession(
  sessionId: string,
  ip: string,
  userAgent: string,
): Promise<{ sessionId: string; creditsRemaining: number }> {
  const resetAt = computeNextResetAt();
  const now = new Date();

  // First: upsert with $setOnInsert only (no $inc — avoids same-path conflict)
  const session = await Session.findOneAndUpdate(
    { sessionId },
    {
      $setOnInsert: {
        sessionId,
        ip,
        userAgent,
        aiResponseCredits: 3,
        dailySessionCount: 1,
        dailyCountResetAt: resetAt,
        lessonPlanIds: [],
      },
      $set: {
        lastActivityAt: now,
      },
    },
    { new: true, upsert: true },
  );

  // Then: increment dailySessionCount for existing sessions (separate operation)
  const isInsert = session.isNew;
  if (!isInsert) {
    await Session.updateOne(
      { sessionId },
      { $inc: { dailySessionCount: 1 } },
    );
  }

  // Re-fetch to get the updated count
  const updated = await Session.findOne({ sessionId });

  return {
    sessionId: updated!.sessionId,
    creditsRemaining: updated!.aiResponseCredits,
  };
}
