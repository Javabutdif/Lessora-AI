import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AdminUser } from "../schemas/admin.schema";
import { AuthenticationError } from "../types/errors";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Valid email is required").max(254),
  password: z.string().min(1, "Password is required").max(128),
});

export type LoginPayload = z.infer<typeof loginSchema>;

const JWT_EXPIRES_IN = "1h";
const INVALID_CREDENTIALS = "Invalid email or password";

type AdminAuthUser = {
  id: string;
  name: string;
  email: string;
  role: "admin";
};

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return secret;
}

function signAdminToken(user: AdminAuthUser) {
  return jwt.sign({ user }, getJwtSecret(), { expiresIn: JWT_EXPIRES_IN });
}

export async function loginAdmin(input: LoginPayload) {
  const admin = await AdminUser.findOne({ email: input.email }).select("+passwordHash");

  // Same message for unknown, disabled and wrong-password so admin emails cannot be enumerated
  if (!admin || !admin.isActive) {
    console.warn("[admin-auth] failed login attempt");
    throw new AuthenticationError(INVALID_CREDENTIALS);
  }

  const isValidPassword = await bcrypt.compare(input.password, admin.passwordHash);
  if (!isValidPassword) {
    console.warn("[admin-auth] failed login attempt");
    throw new AuthenticationError(INVALID_CREDENTIALS);
  }

  const name = `${admin.firstName} ${admin.lastName}`.trim();
  const authUser: AdminAuthUser = {
    id: admin._id.toString(),
    name,
    email: admin.email,
    role: "admin",
  };

  const token = signAdminToken(authUser);

  admin.lastLogin = new Date();
  await admin.save();

  return {
    token,
    user: authUser,
  };
}
