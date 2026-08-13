import { NextRequest, NextResponse } from "next/server";
import openAIService from "@/lib/services/openai.service";
import { connectionReady } from "@/lib/db";

const CONNECTION_TIMEOUT_MS = 15_000;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await Promise.race([
      connectionReady,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("MongoDB connection timed out")), CONNECTION_TIMEOUT_MS),
      ),
    ]);
    const { id: lessonPlanId } = await params;
    const result = await openAIService.getPublicLessonPlanById(lessonPlanId);
    return NextResponse.json({ data: result, error: null });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch lesson plan";
    const isTimeout = error instanceof Error && error.message.includes("timed out");
    return NextResponse.json(
      { data: null, error: { code: isTimeout ? "SERVICE_UNAVAILABLE" : "SERVER_ERROR", message } },
      { status: isTimeout ? 503 : 500 },
    );
  }
}
