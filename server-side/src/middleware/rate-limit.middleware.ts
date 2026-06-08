import rateLimit from "express-rate-limit";
import { Request } from "express";

type RateLimitOptions = {
  windowMs: number;
  maxRequests: number;
  keyPrefix: string;
};

function getRequestKey(req: Request, keyPrefix: string) {
  return `${keyPrefix}:${req.ip}:${req.path}`;
}

export function createRateLimitMiddleware({
  windowMs,
  maxRequests,
  keyPrefix,
}: RateLimitOptions) {
  const options: Parameters<typeof rateLimit>[0] = {
    windowMs,
    limit: maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => getRequestKey(req, keyPrefix),
    handler: (_req, res) => {
      res.status(429).json({
        data: null,
        error: {
          code: "RATE_LIMITED",
          message: "Too many requests. Please try again later.",
        },
      });
    },
  };

  return rateLimit(options);
}
