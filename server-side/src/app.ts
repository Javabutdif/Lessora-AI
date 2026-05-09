import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth.routes";
import { errorHandler } from "./middleware/errorHandler";
import mongoose from "mongoose";
import { config } from "dotenv";
import path from "path";

config({ path: path.resolve(__dirname, "../.env") });

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  // eslint-disable-next-line no-console
  console.warn("MONGODB_URI is not set. MongoDB connection was skipped.");
} else {
  mongoose
    .connect(mongoUri, {
      dbName: process.env.MONGODB_DBNAME,
    })
    .then(() => {
      // eslint-disable-next-line no-console
      console.log("MongoDB connected successfully");
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error("MongoDB connection failed:", error);
    });
}
const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.use("/api/auth", authRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use(errorHandler);

export { app };
