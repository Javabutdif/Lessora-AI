import { Request, Response, NextFunction } from "express";
import {
  getSupportDonationConfig,
  createSupportDonationCheckout,
  getSupportDonationStatus,
  recordPaymongoWebhook,
} from "../services/support-donation.service";
import {
  supportDonationCheckoutSchema,
  supportDonationWebhookSchema,
} from "../schemas/support-donation.schema";

export async function getSupportDonationConfigController(
  _req: Request,
  res: Response,
) {
  res.json({ data: getSupportDonationConfig(), error: null });
}

export async function createSupportDonationCheckoutController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const input = supportDonationCheckoutSchema.parse(req.body);
    const result = await createSupportDonationCheckout(input.amount);
    res.status(201).json({ data: result, error: null });
  } catch (error) {
    next(error);
  }
}

export async function getSupportDonationStatusController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { referenceNumber } = req.params;

    if (!referenceNumber) {
      return res.status(400).json({
        data: null,
        error: { code: "BAD_REQUEST", message: "Reference number is required" },
      });
    }

    const result = await getSupportDonationStatus(referenceNumber);
    res.json({ data: result, error: null });
  } catch (error) {
    next(error);
  }
}

export async function supportDonationWebhookController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const payload = supportDonationWebhookSchema.parse(req.body);

    if (payload.data.type !== "checkout_session.payment.paid") {
      return res.json({ data: { received: true, ignored: true }, error: null });
    }

    const session = payload.data.data;
    const referenceNumber = session.attributes.reference_number;
    const payment = session.attributes.payments?.[0];
    const paymentStatus = payment?.attributes.status === "paid" ? "paid" : "failed";

    await recordPaymongoWebhook({
      referenceNumber,
      checkoutSessionId: session.id,
      paymentId: payment?.id,
      status: paymentStatus,
      amount: payment?.attributes.amount,
      currency: payment?.attributes.currency || "PHP",
    });

    return res.json({ data: { received: true }, error: null });
  } catch (error) {
    next(error);
  }
}
