import { NextResponse } from "next/server";
import { Session } from "../schemas/session.schema";

export const DAILY_SESSION_LIMIT = 5;

const DAY_MS = 24 * 60 * 60 * 1000;
// Asia/Manila is UTC+8 with no daylight saving
const MANILA_OFFSET_MS = 8 * 60 * 60 * 1000;

export function startOfManilaDay(now = new Date()): Date {
  const manilaMs = now.getTime() + MANILA_OFFSET_MS;
  return new Date(manilaMs - (manilaMs % DAY_MS) - MANILA_OFFSET_MS);
}

export function computeNextResetAt(now = new Date()): Date {
  return new Date(startOfManilaDay(now).getTime() + DAY_MS);
}

export async function countSessionsCreatedToday(ip: string): Promise<number> {
  return Session.countDocuments({ ip, createdAt: { $gte: startOfManilaDay() } });
}

export async function checkDailyLimit(ip: string): Promise<NextResponse | null> {
  try {
    const createdToday = await countSessionsCreatedToday(ip);

    if (createdToday >= DAILY_SESSION_LIMIT) {
      console.warn(`[ip-daily-limiter] daily session cap hit for ip ${ip}`);
      return NextResponse.json(
        {
          data: null,
          error: {
            code: "RATE_LIMITED_DAILY",
            message: `${DAILY_SESSION_LIMIT} sessions used today. Try again tomorrow.`,
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
  const session = await Session.findOneAndUpdate(
    { sessionId },
    {
      $setOnInsert: {
        sessionId,
        ip,
        userAgent,
        aiResponseCredits: 3,
        dailySessionCount: 1,
        dailyCountResetAt: computeNextResetAt(),
        lessonPlanIds: [],
      },
      $set: {
        lastActivityAt: new Date(),
      },
    },
    { new: true, upsert: true },
  );

  return {
    sessionId: session.sessionId,
    creditsRemaining: session.aiResponseCredits,
  };
}
