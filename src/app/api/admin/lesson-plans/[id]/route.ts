import { NextRequest, NextResponse } from "next/server";
import { authenticateToken } from "@/middleware";
import { connectionReady } from "@/lib/db";
import { handleApiError } from "@/lib/middleware/error-handler";
import { deleteAdminLessonPlan } from "@/lib/services/admin.service";

function requireAdmin(request: NextRequest): ReturnType<typeof authenticateToken> | NextResponse {
  try {
    const user = authenticateToken(request);
    if (user.role !== "admin") {
      return NextResponse.json(
        { data: null, error: { code: "FORBIDDEN", message: "Admin access is required" } },
        { status: 403 },
      );
    }
    return user;
  } catch {
    return NextResponse.json(
      { data: null, error: { code: "UNAUTHORIZED", message: "Invalid or expired session" } },
      { status: 401 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = requireAdmin(request);
    if (admin instanceof NextResponse) return admin;

    await connectionReady;
    const { id } = await params;
    await deleteAdminLessonPlan(id, admin.id);
    return NextResponse.json({ data: { success: true }, error: null });
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}
