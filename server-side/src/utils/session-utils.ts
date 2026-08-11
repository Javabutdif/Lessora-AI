import { randomUUID } from "node:crypto";

/**
 * Generates a cryptographically secure UUID v4 string.
 * polyfill for Node.js < 19 when crypto.randomUUID() is unavailable.
 */
export function generateSessionId(): string {
  if (typeof randomUUID === "function") {
    return randomUUID();
  }

  // Fallback: use crypto.randomBytes for environments without randomUUID
  const crypto = require("crypto") as typeof import("crypto");
  return crypto.randomBytes(16).toString("hex");
}
