import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DBNAME = process.env.MONGODB_DBNAME || "lessora";

export let isConnected = false;

let connectPromise: Promise<void> | null = null;

export const connectionReady = (async () => {
  if (!MONGODB_URI) {
    console.warn("MONGODB_URI is not set. MongoDB connection skipped.");
    return;
  }
  try {
    await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DBNAME });
    isConnected = true;
    console.log(`MongoDB [${MONGODB_DBNAME}] connected successfully`);
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    isConnected = false;
  }
})();

mongoose.connection.on("disconnected", () => {
  isConnected = false;
  console.warn("MongoDB disconnected. Reconnect may occur automatically.");
});

mongoose.connection.on("reconnected", () => {
  isConnected = true;
  console.log("MongoDB reconnected successfully");
});

export {};
