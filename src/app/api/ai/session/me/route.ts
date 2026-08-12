import { NextRequest, NextResponse } from "next/server";
import { Session } from "@/lib/schemas/session.schema";
import { requireAuthOrSession, handleApiError } from "@/lib/middleware/auth-or-session";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuthOrSession(request);

    if (!auth) {
      return NextResponse.json(
        { data: { creditsRemaining: 0, isAnonymous: true }, error: null },
      );
    }

    if (!auth.isAnonymous) {
      return NextResponse.json({ data: { creditsRemaining: 5, isAnonymous: false }, error: null });
    }

    const session = await Session.findOne({ sessionId: auth.session.sessionId })
      .select("aiResponseCredits")
      .lean();

    return NextResponse.json({
      data: { creditsRemaining: session?.aiResponseCredits ?? 0, isAnonymous: true },
      error: null,
    });
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}
