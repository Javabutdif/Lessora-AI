import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@/lib/schemas/auth.schema";
import { registerUser } from "@/lib/services/auth.service";
import { handleApiError } from "@/lib/middleware/error-handler";

export async function POST(request: NextRequest) {
  try {
    const input = registerSchema.parse(await request.json());
    await registerUser(input);
    return NextResponse.json({ message: "Register Successful", error: null }, { status: 200 });
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}
