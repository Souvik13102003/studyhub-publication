// models/Setting.ts
import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true }, // e.g. "home"
    title: { type: String, default: "WELCOME TO STUDY-HUB PUBLICATION" },
    description: {
      type: String,
      default:
        "We have the biggest bestsellers to the hardest-to-find, out-of-print rarities brought to you by thousands of Booksellers around the world. So look around and let us help you find your next favorite book."
    }
  },
  { timestamps: true }
);

export default mongoose.models.Setting || mongoose.model("Setting", SettingSchema);
