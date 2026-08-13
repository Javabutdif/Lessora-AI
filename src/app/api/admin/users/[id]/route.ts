import { NextRequest, NextResponse } from "next/server";
import { authenticateToken } from "@/middleware";
import { handleApiError } from "@/lib/middleware/error-handler";
import { updateUser, softDeleteUser } from "@/lib/services/admin-users.service";

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

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = requireAdmin(request);
    if (admin instanceof NextResponse) return admin;

    const { id } = await params;
    const { name, email, status } = await request.json();
    const updatedUser = await updateUser(id, { name, email, status });
    return NextResponse.json({ data: updatedUser, error: null });
  } catch (error) {
    const { status: s, body } = handleApiError(error);
    return NextResponse.json(body, { status: s });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = requireAdmin(_request);
    if (admin instanceof NextResponse) return admin;

    const { id } = await params;
    await softDeleteUser(id);
    return NextResponse.json({ data: { success: true }, error: null });
  } catch (error) {
    const { status: s, body } = handleApiError(error);
    return NextResponse.json(body, { status: s });
  }
}
