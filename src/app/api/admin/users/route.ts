import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, handleApiError } from "@/lib/middleware/auth-or-session";
import { getAllUsers } from "@/lib/services/admin-users.service";

export async function GET(request: NextRequest) {
  try {
    const admin = requireAdmin(request);
    if (admin instanceof NextResponse) return admin;

    const users = await getAllUsers();
    return NextResponse.json({ data: users, error: null });
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}
