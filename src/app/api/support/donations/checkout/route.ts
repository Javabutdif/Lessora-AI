import { NextRequest, NextResponse } from "next/server";
import { connectionReady } from "@/lib/db";
import { supportDonationCheckoutSchema } from "@/lib/schemas/support-donation.schema";
import { createSupportDonationCheckout } from "@/lib/services/support-donation.service";
import { checkLimit } from "@/lib/middleware/rate-limiter";
import { handleApiError } from "@/lib/middleware/error-handler";

export async function POST(request: NextRequest) {
  try {
    await connectionReady;
    const rateLimit = await checkLimit(request, { bucket: "donation-checkout", limit: 5 });
    if (rateLimit) return rateLimit;

    const input = supportDonationCheckoutSchema.parse(await request.json());
    const result = await createSupportDonationCheckout(input.amount);
    return NextResponse.json({ data: result, error: null }, { status: 201 });
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}
