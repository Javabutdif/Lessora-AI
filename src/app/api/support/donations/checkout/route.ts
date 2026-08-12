import { NextRequest, NextResponse } from "next/server";
import { supportDonationCheckoutSchema } from "@/lib/schemas/support-donation.schema";
import { createSupportDonationCheckout } from "@/lib/services/support-donation.service";
import { handleApiError } from "@/lib/middleware/error-handler";

export async function POST(request: NextRequest) {
  try {
    const input = supportDonationCheckoutSchema.parse(await request.json());
    const result = await createSupportDonationCheckout(input.amount);
    return NextResponse.json({ data: result, error: null }, { status: 201 });
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}
