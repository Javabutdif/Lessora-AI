import { SupportDonation } from "../schemas/support-donation.schema";
import {
  createPaymongoCheckoutSession,
  createSupportDonationReference,
} from "./paymongo.service";

export const SUPPORT_DONATION_TIERS = [
  {
    id: "coffee",
    amount: 10000,
    label: "One coffee",
    description: "A small thank-you that helps keep the lights on.",
  },
  {
    id: "meal",
    amount: 25000,
    label: "One meal",
    description: "A bigger show of support for the work behind Lessora AI.",
    recommended: true,
  },
  {
    id: "sponsor",
    amount: 50000,
    label: "Sponsor",
    description: "For teachers and friends who want to contribute more.",
  },
] as const;

export function getSupportDonationConfig() {
  return {
    title: "Support Lessora AI",
    description:
      "Lessora AI is built to help teachers spend less time formatting and more time teaching. A one-time donation helps support the project.",
    currency: "PHP",
    successMessage: "Your support helps Lessora AI keep improving for teachers.",
    tiers: SUPPORT_DONATION_TIERS,
  };
}

function getClientBaseUrl() {
  return (
    process.env.PUBLIC_APP_URL ||
    process.env.CLIENT_BASE_URL ||
    "http://localhost:5174"
  );
}

function buildSupportReturnUrl(
  status: "success" | "cancelled",
  referenceNumber: string,
) {
  const url = new URL("/support", getClientBaseUrl());
  url.searchParams.set("status", status);
  url.searchParams.set("reference", referenceNumber);
  return url.toString();
}

export async function createSupportDonationCheckout(amount: number) {
  const tier = SUPPORT_DONATION_TIERS.find((item) => item.amount === amount);

  if (!tier) {
    throw new Error("Unsupported donation amount");
  }

  const referenceNumber = createSupportDonationReference();
  const donation = await SupportDonation.create({
    referenceNumber,
    amount,
    currency: "PHP",
    status: "pending",
    tierId: tier.id,
    metadata: {
      tier: tier.id,
    },
  });

  const { checkoutUrl, checkoutSessionId } = await createPaymongoCheckoutSession(
    {
      amount,
      referenceNumber,
      successUrl: buildSupportReturnUrl("success", referenceNumber),
      cancelUrl: buildSupportReturnUrl("cancelled", referenceNumber),
      metadata: {
        tier: tier.id,
        donationId: donation._id.toString(),
      },
    },
  );

  donation.checkoutSessionId = checkoutSessionId;
  await donation.save();

  return {
    checkoutUrl,
    referenceNumber,
  };
}

export async function getSupportDonationStatus(referenceNumber: string) {
  const donation = await SupportDonation.findOne({ referenceNumber }).lean();

  if (!donation) {
    throw new Error("Donation record not found");
  }

  return {
    referenceNumber: donation.referenceNumber,
    status: donation.status,
    amount: donation.amount,
    currency: donation.currency,
    checkoutSessionId: donation.checkoutSessionId || undefined,
    paymentId: donation.paymentId || undefined,
    updatedAt: donation.updatedAt.toISOString(),
  };
}

export async function recordPaymongoWebhook(payload: {
  referenceNumber?: string;
  checkoutSessionId: string;
  paymentId?: string;
  status: "paid" | "failed" | "canceled";
  amount?: number;
  currency?: string;
}) {
  const query: Record<string, string> = payload.referenceNumber
    ? { referenceNumber: payload.referenceNumber }
    : { checkoutSessionId: payload.checkoutSessionId };

  const donation = await SupportDonation.findOneAndUpdate(
    query,
    {
      $set: {
        status: payload.status,
        checkoutSessionId: payload.checkoutSessionId,
        paymentId: payload.paymentId,
        amount: payload.amount,
        currency: payload.currency || "PHP",
      },
      $setOnInsert: {
        referenceNumber:
          payload.referenceNumber || createSupportDonationReference(),
        amount: payload.amount || 0,
        currency: payload.currency || "PHP",
        status: payload.status,
      },
    },
    { upsert: true, new: true },
  );

  return donation;
}
