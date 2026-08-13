import { NextResponse } from "next/server";
import openAIService from "@/lib/services/openai.service";
import { connectionReady } from "@/lib/db";

const CONNECTION_TIMEOUT_MS = 15_000;

export async function GET() {
  try {
    await Promise.race([
      connectionReady,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("MongoDB connection timed out")), CONNECTION_TIMEOUT_MS),
      ),
    ]);
    const result = await openAIService.listPublicLessonPlans();
    return NextResponse.json({ data: result, error: null });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch public plans";
    const isTimeout = error instanceof Error && error.message.includes("timed out");
    return NextResponse.json(
      { data: null, error: { code: isTimeout ? "SERVICE_UNAVAILABLE" : "SERVER_ERROR", message } },
      { status: isTimeout ? 503 : 500 },
    );
  }
}
