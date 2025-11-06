// models/Carousel.ts
import mongoose, { Schema } from "mongoose";

export interface ICarousel {
  title?: string;
  imageUrl: string;
  // link?: string;
  order?: number;
  active?: boolean;
}

const CarouselSchema = new Schema<ICarousel>(
  {
    title: { type: String },
    imageUrl: { type: String, required: true },
    // link: { type: String },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Carousel ||
  mongoose.model("Carousel", CarouselSchema);
