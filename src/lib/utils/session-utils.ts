import { randomUUID } from "node:crypto";

export function generateSessionId(): string {
  if (typeof randomUUID === "function") {
    return randomUUID();
  }
  const crypto = require("crypto") as typeof import("crypto");
  return crypto.randomBytes(16).toString("hex");
}
