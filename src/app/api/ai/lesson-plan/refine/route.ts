import { NextRequest, NextResponse } from "next/server";
import { refineLessonPlanSchema } from "@/lib/schemas/ai.schema";
import openAIService from "@/lib/services/openai.service";
import { connectionReady } from "@/lib/db";
import { checkRateLimit, getSessionId } from "@/lib/middleware/rate-limiter";
import { handleApiError } from "@/lib/middleware/error-handler";

export async function POST(request: NextRequest) {
  try {
    await connectionReady;
    const rateLimit = checkRateLimit(request);
    if (rateLimit) return rateLimit;

    const sessionId = getSessionId(request);
    if (!sessionId) {
      return NextResponse.json(
        { data: null, error: { code: "UNAUTHORIZED", message: "Session token is required" } },
        { status: 401 },
      );
    }

    const input = refineLessonPlanSchema.parse(await request.json());
    const result = await openAIService.refineLessonPlan(
      input.lessonPlanId,
      input.selectedSections,
      input.refinementRequest,
      sessionId,
      true,
    );
    return NextResponse.json({ data: result, error: null });
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}
