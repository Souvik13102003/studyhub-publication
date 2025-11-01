// models/Book.ts
import mongoose, { Schema } from "mongoose";

export interface IBook {
  title: string;
  author: string;
  isbn?: string;
  category?: string;
  frontCover?: string;
  backCover?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const BookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    isbn: { type: String },
    category: { type: String },
    frontCover: { type: String },
    backCover: { type: String },
    description: { type: String }
  },
  { timestamps: true }
);

export default mongoose.models.Book || mongoose.model("Book", BookSchema);
