import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DBNAME = process.env.MONGODB_DBNAME || "lessora";

if (!MONGODB_URI) {
  console.warn("MONGODB_URI is not set. MongoDB connection skipped.");
} else {
  mongoose
    .connect(MONGODB_URI, { dbName: MONGODB_DBNAME })
    .then(() => {
      console.log(`MongoDB [${MONGODB_DBNAME}] connected successfully`);
    })
    .catch((error) => {
      console.error("MongoDB connection failed:", error);
    });
}

export {};
