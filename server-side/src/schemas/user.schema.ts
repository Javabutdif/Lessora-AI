import mongoose, { Schema, Document } from "mongoose";
import { z } from "zod";

/**
 * User Schema
 * - Stores user authentication and profile information
 * - Password is hashed using bcrypt
 * - Includes schemaVersion for future migrations
 * - Email is indexed for fast lookups and uniqueness
 */

export interface IUserSettings {
  notifications: {
    email: boolean;
  };
  language: string;
  theme: string;
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  username: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  school?: string;
  avatar?: string;
  bio?: string;
  role: "teacher";
  isVerified: boolean;
  isActive: boolean;
  aiResponseCredits: number;
  settings?: IUserSettings;
  lastLogin?: Date;
  passwordResetToken?: string | null;
  passwordResetTokenExpires?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  schemaVersion: number;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false, // Exclude by default in queries
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    school: {
      type: String,
      default: "",
      trim: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: "",
      maxlength: 500,
    },
    role: {
      type: String,

      default: "teacher",
      index: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    aiResponseCredits: {
      type: Number,
      default: 5,
      min: 0,
    },
    settings: {
      type: {
        notifications: {
          email: { type: Boolean, default: true },
        },
        language: { type: String, default: "en" },
        theme: { type: String, default: "light" },
      },
      default: {
        notifications: { email: true },
        language: "en",
        theme: "light",
      },
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    passwordResetToken: {
      type: String,
      default: null,
      select: false, // Exclude by default in queries
    },
    passwordResetTokenExpires: {
      type: Date,
      default: null,
    },
    schemaVersion: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  },
);

// Compound index: email + role for role-based queries
UserSchema.index({ email: 1, role: 1 });

// Index for finding active users
UserSchema.index({ isActive: 1, isVerified: 1 });

export const User = mongoose.model<IUser>("User", UserSchema);

// Zod validation schemas for user routes
export const updateProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Valid email is required"),
  school: z.string().max(200).optional(),
  bio: z.string().max(500).optional(),
});

export const updateSettingsSchema = z.object({
  notifications: z.object({
    email: z.boolean(),
  }),
  language: z.string().optional(),
  theme: z.string().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Valid email is required"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[0-9]/, "Password must contain a number")
    .regex(
      /[!@#$%^&*]/,
      "Password must contain a special character (!@#$%^&*)",
    ),
});

export const verifyResetTokenSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
});

export type UpdateProfilePayload = z.infer<typeof updateProfileSchema>;
export type UpdateSettingsPayload = z.infer<typeof updateSettingsSchema>;
export type ForgotPasswordPayload = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordPayload = z.infer<typeof resetPasswordSchema>;
export type VerifyResetTokenPayload = z.infer<typeof verifyResetTokenSchema>;
