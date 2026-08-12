import { NextRequest, NextResponse } from "next/server";
import { supportDonationWebhookSchema } from "@/lib/schemas/support-donation.schema";
import { recordPaymongoWebhook } from "@/lib/services/support-donation.service";

export async function POST(request: NextRequest) {
  try {
    const payload = supportDonationWebhookSchema.parse(await request.json());

    if (payload.data.type !== "checkout_session.payment.paid") {
      return NextResponse.json({ data: { received: true, ignored: true }, error: null });
    }

    const session = payload.data.data;
    const referenceNumber = session.attributes?.reference_number;
    const payment = session.attributes?.payments?.[0];
    const paymentStatus = payment?.attributes?.status === "paid" ? "paid" : "failed";

    await recordPaymongoWebhook({
      referenceNumber,
      checkoutSessionId: session.id,
      paymentId: payment?.id,
      status: paymentStatus,
      amount: payment?.attributes?.amount,
      currency: payment?.attributes?.currency || "PHP",
    });

    return NextResponse.json({ data: { received: true }, error: null });
  } catch (error) {
    return NextResponse.json(
      { data: null, error: { code: "VALIDATION_ERROR", message: "Invalid webhook payload" } },
      { status: 400 },
    );
  }
}
