// models/Setting.ts
import mongoose, { Schema } from "mongoose";

export interface ISetting {
  homeTitle?: string;
  homeDescription?: string;
}

const SettingSchema = new Schema<ISetting>(
  {
    homeTitle: { type: String, default: "WELCOME TO STUDY-HUB PUBLICATION" },
    homeDescription: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.models.Setting || mongoose.model("Setting", SettingSchema);
