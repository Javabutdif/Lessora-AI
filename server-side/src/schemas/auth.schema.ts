import { z } from "zod";

const passwordRules = z
  .string()
  .min(6, "Password must be at least 6 characters");

export const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  password: passwordRules,
});

export const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: passwordRules,
});

export type RegisterPayload = z.infer<typeof registerSchema>;
export type LoginPayload = z.infer<typeof loginSchema>;
