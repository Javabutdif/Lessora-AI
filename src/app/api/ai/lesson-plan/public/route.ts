import { NextResponse } from "next/server";
import openAIService from "@/lib/services/openai.service";
import { isConnected } from "@/lib/db";

export async function GET() {
  if (!isConnected) {
    return NextResponse.json(
      { data: null, error: { code: "SERVICE_UNAVAILABLE", message: "Database is starting up. Please retry." } },
      { status: 503 },
    );
  }

  try {
    const result = await openAIService.listPublicLessonPlans();
    return NextResponse.json({ data: result, error: null });
  } catch (error) {
    return NextResponse.json(
      { data: null, error: { code: "SERVER_ERROR", message: "Failed to fetch public plans" } },
      { status: 500 },
    );
  }
}
