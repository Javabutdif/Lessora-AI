import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth.routes";
import { aiRouter } from "./routes/ai.routes";
import { adminRouter } from "./routes/admin.routes";
import { userRouter } from "./routes/user.routes";
import { errorHandler } from "./middleware/errorHandler";
import mongoose from "mongoose";
import { config } from "dotenv";
import path from "path";
import { CreditRefreshScheduler } from "./services/credit-refresh.scheduler";
import { ActivityReportScheduler } from "./services/activity-report.scheduler";
import { checkAppVersion } from "./middleware/auth.middleware";
import { createRateLimitMiddleware } from "./middleware/rate-limit.middleware";

config({ path: path.resolve(__dirname, "../.env") });

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.warn("MONGODB_URI is not set. MongoDB connection was skipped.");
} else {
  mongoose
    .connect(mongoUri, {
      dbName: process.env.MONGODB_DBNAME,
    })
    .then(async () => {
      console.log(
        `MongoDB [${process.env.MONGODB_DBNAME}] connected successfully`,
      );

      CreditRefreshScheduler.initialize();
      ActivityReportScheduler.initialize();
    })
    .catch((error) => {
      console.error("MongoDB connection failed:", error);
    });
}
const app = express();
app.set("trust proxy", 1);

app.use(cors({ origin: true }));
app.use(express.json());

app.use(checkAppVersion);

const apiRateLimit = createRateLimitMiddleware({
  windowMs: 60_000,
  maxRequests: 120,
  keyPrefix: "api",
});

const authWriteRateLimit = createRateLimitMiddleware({
  windowMs: 60_000,
  maxRequests: 20,
  keyPrefix: "auth-write",
});

const authRecoveryRateLimit = createRateLimitMiddleware({
  windowMs: 60_000,
  maxRequests: 10,
  keyPrefix: "auth-recovery",
});

const aiRateLimit = createRateLimitMiddleware({
  windowMs: 60_000,
  maxRequests: 30,
  keyPrefix: "ai",
});

app.use("/api/auth", apiRateLimit);
app.use("/api/auth/login", authWriteRateLimit);
app.use("/api/auth/register", authWriteRateLimit);
app.use("/api/auth/forgot-password", authRecoveryRateLimit);
app.use("/api/auth/reset-password", authRecoveryRateLimit);
app.use("/api/auth/verify-reset-token", authRecoveryRateLimit);
app.use("/api/auth", authRouter);
app.use("/api/ai", apiRateLimit, aiRateLimit, aiRouter);
app.use("/api/admin", apiRateLimit, adminRouter);
app.use("/api/user", apiRateLimit, userRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use(errorHandler);

export { app };
