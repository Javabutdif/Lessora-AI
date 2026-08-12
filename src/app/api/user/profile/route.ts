import { NextRequest, NextResponse } from "next/server";
import { requireAuthOrSession, handleApiError } from "@/lib/middleware/auth-or-session";
import { updateUserProfile } from "@/lib/services/user.service";
import { updateProfileSchema } from "@/lib/schemas/user.schema";

export async function PUT(request: NextRequest) {
  try {
    const auth = await requireAuthOrSession(request);
    if (!auth || auth.isAnonymous) {
      return NextResponse.json(
        { data: null, error: { code: "UNAUTHORIZED", message: "Authentication is required" } },
        { status: 401 },
      );
    }

    const userId = auth.user.id;
    const input = updateProfileSchema.parse(await request.json());
    const result = await updateUserProfile(userId, input);
    return NextResponse.json({ data: result, error: null });
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}
