import crypto from "crypto";
import bcrypt from "bcryptjs";

/**
 * Password & Token Utilities
 * Handles password reset token generation, hashing, and validation
 */

/**
 * Generate a secure random reset token
 * @returns 64-character hex string
 */
export function generateResetToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Hash a reset token for storage in database
 * @param token - Raw reset token
 * @returns Hashed token
 */
export async function hashResetToken(token: string): Promise<string> {
  return bcrypt.hash(token, 10);
}

/**
 * Verify a reset token against its hash
 * @param token - Raw reset token
 * @param hash - Stored hashed token
 * @returns True if tokens match
 */
export async function verifyResetToken(
  token: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(token, hash);
}

/**
 * Check if a reset token has expired
 * @param expiresAt - Token expiration date
 * @returns True if token is expired
 */
export function isTokenExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}

/**
 * Get token expiration date (24 hours from now)
 * @returns Date object for token expiration
 */
export function getTokenExpirationDate(): Date {
  const expirationDate = new Date();
  expirationDate.setHours(expirationDate.getHours() + 24);
  return expirationDate;
}

/**
 * Validate password requirements
 * - Minimum 8 characters
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 number
 * - At least 1 special character (!@#$%^&*)
 * @param password - Password to validate
 * @returns Object with validation result and error message if invalid
 */
export function validatePassword(password: string): {
  valid: boolean;
  error?: string;
} {
  if (password.length < 8) {
    return { valid: false, error: "Password must be at least 8 characters" };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: "Password must contain an uppercase letter" };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: "Password must contain a lowercase letter" };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: "Password must contain a number" };
  }
  if (!/[!@#$%^&*]/.test(password)) {
    return {
      valid: false,
      error: "Password must contain a special character (!@#$%^&*)",
    };
  }
  return { valid: true };
}
