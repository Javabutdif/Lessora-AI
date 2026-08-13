import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DBNAME = process.env.MONGODB_DBNAME || "lessora";
const MAX_CONNECT_ATTEMPTS = 5;
const RETRY_DELAY_MS = 2000;

export let isConnected = false;

let connectPromise: Promise<void> | null = null;

async function attemptConnect() {
  await mongoose.connect(MONGODB_URI as string, { dbName: MONGODB_DBNAME });
  isConnected = true;
  console.log(`MongoDB [${MONGODB_DBNAME}] connected successfully`);
}

export const connectionReady = (() => {
  if (connectPromise) {
    return connectPromise;
  }

  if (!MONGODB_URI) {
    console.warn("MONGODB_URI is not set. MongoDB connection skipped.");
    connectPromise = Promise.resolve();
    return connectPromise;
  }

  connectPromise = (async () => {
    for (let attempt = 1; attempt <= MAX_CONNECT_ATTEMPTS; attempt += 1) {
      try {
        await attemptConnect();
        return;
      } catch (error) {
        isConnected = false;
        if (attempt === MAX_CONNECT_ATTEMPTS) {
          console.error(
            `MongoDB connection failed after ${MAX_CONNECT_ATTEMPTS} attempts:`,
            error,
          );
          return;
        }
        console.warn(
          `MongoDB connection attempt ${attempt} failed. Retrying in ${RETRY_DELAY_MS}ms...`,
        );
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      }
    }
  })();

  return connectPromise;
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