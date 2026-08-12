import mongoose, { Schema, Document } from "mongoose";

export interface IAdminUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  username: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: "admin";
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AdminUserSchema = new Schema<IAdminUser>(
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
      select: false,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

AdminUserSchema.index({ email: 1, role: 1 });

let AdminUserModel = mongoose.models.AdminUser as mongoose.Model<IAdminUser> | undefined;
if (!AdminUserModel) {
  AdminUserModel = mongoose.model<IAdminUser>("AdminUser", AdminUserSchema);
}
export const AdminUser = AdminUserModel;
