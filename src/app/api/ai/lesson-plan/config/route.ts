import { NextResponse } from "next/server";
import openAIService from "@/lib/services/openai.service";

export async function GET() {
  return NextResponse.json({ data: openAIService.getConfig(), error: null });
}
