import { Request, Response, NextFunction } from "express";

type RateLimitOptions = {
  windowMs: number;
  maxRequests: number;
  keyPrefix: string;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const RATE_LIMIT_STORE = new Map<string, RateLimitEntry>();

function getRequestKey(req: Request, keyPrefix: string) {
  const forwardedFor = req.headers["x-forwarded-for"];
  const ipAddress = Array.isArray(forwardedFor)
    ? forwardedFor[0]
    : forwardedFor?.split(",")[0]?.trim() || req.ip || "unknown";

  return `${keyPrefix}:${ipAddress}:${req.path}`;
}

export function createRateLimitMiddleware({
  windowMs,
  maxRequests,
  keyPrefix,
}: RateLimitOptions) {
  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const key = getRequestKey(req, keyPrefix);
    const existing = RATE_LIMIT_STORE.get(key);

    if (!existing || now >= existing.resetAt) {
      RATE_LIMIT_STORE.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (existing.count >= maxRequests) {
      const retryAfterSeconds = Math.ceil((existing.resetAt - now) / 1000);
      return res.status(429).json({
        data: null,
        error: {
          code: "RATE_LIMITED",
          message: "Too many requests. Please try again later.",
        },
        retryAfterSeconds,
      });
    }

    existing.count += 1;
    next();
  };
}
