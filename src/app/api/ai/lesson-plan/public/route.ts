import { NextResponse } from "next/server";
import openAIService from "@/lib/services/openai.service";

export async function GET() {
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
