// models/Category.ts
import mongoose, { Schema } from "mongoose";

export interface ICategory {
  name: string;
  thumbnail?: string;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    thumbnail: { type: String }
  },
  { timestamps: true }
);

export default mongoose.models.Category || mongoose.model("Category", CategorySchema);
