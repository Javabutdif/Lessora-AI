import { NextRequest, NextResponse } from "next/server";
import openAIService from "@/lib/services/openai.service";
import { handleApiError } from "@/lib/middleware/error-handler";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: lessonPlanId } = await params;
    const result = await openAIService.getPublicLessonPlanById(lessonPlanId);
    return NextResponse.json({ data: result, error: null });
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}
