import { NextRequest, NextResponse } from "next/server";
import openAIService from "@/lib/services/openai.service";
import { handleApiError } from "@/lib/middleware/error-handler";
import { isConnected } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isConnected) {
    return NextResponse.json(
      { data: null, error: { code: "SERVICE_UNAVAILABLE", message: "Database is starting up. Please retry." } },
      { status: 503 },
    );
  }

  try {
    const { id: lessonPlanId } = await params;
    const result = await openAIService.getPublicLessonPlanById(lessonPlanId);
    return NextResponse.json({ data: result, error: null });
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}
