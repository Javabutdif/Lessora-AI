import { Router } from "express";
import {
  createSupportDonationCheckoutController,
  getSupportDonationConfigController,
  getSupportDonationStatusController,
  supportDonationWebhookController,
} from "../controllers/support.controller";
import { createRateLimitMiddleware } from "../middleware/rate-limit.middleware";

const router = Router();

const supportDonationRateLimit = createRateLimitMiddleware({
  windowMs: 60_000,
  maxRequests: 12,
  keyPrefix: "support-donation",
});

router.get("/donations/config", getSupportDonationConfigController);
router.get("/donations/:referenceNumber", getSupportDonationStatusController);
router.post(
  "/donations/checkout",
  supportDonationRateLimit,
  createSupportDonationCheckoutController,
);
router.post("/donations/webhook", supportDonationWebhookController);

export { router as supportRouter };
