import { NextRequest, NextResponse } from "next/server";
import { getSupportDonationStatus } from "@/lib/services/support-donation.service";
import { handleApiError } from "@/lib/middleware/error-handler";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ ref: string }> },
) {
  try {
    const { ref: referenceNumber } = await params;

    if (!referenceNumber) {
      return NextResponse.json(
        { data: null, error: { code: "BAD_REQUEST", message: "Reference number is required" } },
        { status: 400 },
      );
    }

    const result = await getSupportDonationStatus(referenceNumber);
    return NextResponse.json({ data: result, error: null });
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}
