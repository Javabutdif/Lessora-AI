import { Schema, model } from "mongoose";

export interface IAppConfig extends Document {
  key: string;
  minimumBuildNumber: number;
  latestVersion: string;
  createdAt: Date;
  updatedAt: Date;
}

const appConfigSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    minimumBuildNumber: {
      type: Number,
      required: true,
      default: 0,
    },
    latestVersion: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const AppConfig = model("AppConfig", appConfigSchema);
