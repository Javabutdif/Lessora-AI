import bcrypt from "bcryptjs";

export function generateResetToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export async function hashResetToken(token: string): Promise<string> {
  return bcrypt.hash(token, 10);
}

export async function verifyResetToken(
  token: string,
  hashedToken: string,
): Promise<boolean> {
  return bcrypt.compare(token, hashedToken);
}

export function getTokenExpirationDate(): Date {
  const date = new Date();
  date.setHours(date.getHours() + 1);
  return date;
}

export function validatePassword(password: string): { valid: boolean; error?: string } {
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
    return { valid: false, error: "Password must contain a special character (!@#$%^&*)" };
  }
  return { valid: true };
}
