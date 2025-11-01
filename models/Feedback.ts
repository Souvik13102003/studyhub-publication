// models/Feedback.ts
import mongoose, { Schema } from "mongoose";

export interface IFeedback {
  name: string;
  phone: string;
  email?: string;
  bookName?: string;
  message?: string;
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    bookName: { type: String },
    message: { type: String }
  },
  { timestamps: true }
);

export default mongoose.models.Feedback || mongoose.model("Feedback", FeedbackSchema);
