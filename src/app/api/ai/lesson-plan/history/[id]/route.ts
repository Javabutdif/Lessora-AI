import { NextRequest, NextResponse } from "next/server";
import openAIService from "@/lib/services/openai.service";
import { checkRateLimit, getSessionId } from "@/lib/middleware/rate-limiter";
import { handleApiError } from "@/lib/middleware/error-handler";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const rateLimit = checkRateLimit(request);
    if (rateLimit) return rateLimit;

    const sessionId = getSessionId(request);
    if (!sessionId) {
      return NextResponse.json(
        { data: null, error: { code: "UNAUTHORIZED", message: "Session token is required" } },
        { status: 401 },
      );
    }

    const { id: lessonPlanId } = await params;
    const result = await openAIService.getLessonPlanById(sessionId, lessonPlanId, true);
    return NextResponse.json({ data: result, error: null });
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}
