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
import { checkAppVersion } from "./middleware/auth.middleware";

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
      console.log("MongoDB connected successfully");

      CreditRefreshScheduler.initialize();
    })
    .catch((error) => {
      console.error("MongoDB connection failed:", error);
    });
}
const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.use(checkAppVersion);

app.use("/api/auth", authRouter);
app.use("/api/ai", aiRouter);
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use(errorHandler);

export { app };
