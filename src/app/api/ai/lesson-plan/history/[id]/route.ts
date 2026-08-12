import { NextRequest, NextResponse } from "next/server";
import openAIService from "@/lib/services/openai.service";
import { requireAuthOrSession, handleApiError } from "@/lib/middleware/auth-or-session";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireAuthOrSession(request);
    if (!auth) {
      return NextResponse.json(
        { data: null, error: { code: "UNAUTHORIZED", message: "Authentication is required" } },
        { status: 401 },
      );
    }

    const ownerId = auth.isAnonymous ? auth.session._id : auth.user.id;
    const isAnonymous = auth.isAnonymous;
    const { id: lessonPlanId } = await params;

    if (!ownerId) {
      throw new Error("Authentication is required");
    }

    const result = await openAIService.getLessonPlanById(ownerId, lessonPlanId, isAnonymous);
    return NextResponse.json({ data: result, error: null });
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}
