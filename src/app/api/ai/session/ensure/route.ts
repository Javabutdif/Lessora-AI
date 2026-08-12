import { NextRequest, NextResponse } from "next/server";
import { generateLessonPlanSchema, refineLessonPlanSchema } from "@/lib/schemas/ai.schema";
import openAIService from "@/lib/services/openai.service";
import { Session } from "@/lib/schemas/session.schema";
import { requireAuthOrSession, handleApiError } from "@/lib/middleware/auth-or-session";

export async function POST(request: NextRequest) {
  try {
    const existingSessionId = (await request.json())?.sessionId as string | undefined;
    let sessionId: string;

    if (existingSessionId) {
      sessionId = existingSessionId;
    } else {
      const { generateSessionId } = await import("@/lib/utils/session-utils");
      sessionId = generateSessionId();
    }

    const session = await Session.findOneAndUpdate(
      { sessionId },
      {
        $setOnInsert: {
          sessionId,
          ip: request.headers.get("x-forwarded-for") || "",
          userAgent: request.headers.get("user-agent") || "",
          aiResponseCredits: 3,
          lessonPlanIds: [],
        },
        $set: { lastActivityAt: new Date() },
      },
      { new: true, upsert: true },
    );

    return NextResponse.json({
      data: { sessionId: session.sessionId, creditsRemaining: session.aiResponseCredits },
      error: null,
    });
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}
