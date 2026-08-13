import { NextRequest, NextResponse } from "next/server";
import { Session } from "@/lib/schemas/session.schema";
import { checkRateLimit } from "@/lib/middleware/rate-limiter";
import { handleApiError } from "@/lib/middleware/error-handler";

export async function GET(request: NextRequest) {
  try {
    const rateLimit = checkRateLimit(request);
    if (rateLimit) return rateLimit;

    const sessionId = request.headers.get("x-session-token") as string | null;

    if (!sessionId) {
      return NextResponse.json({
        data: { creditsRemaining: 0, isAnonymous: true },
        error: null,
      });
    }

    const session = await Session.findOne({ sessionId })
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
