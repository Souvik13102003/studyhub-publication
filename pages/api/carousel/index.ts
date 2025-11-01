// pages/api/carousel/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Carousel from "@/models/Carousel";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await dbConnect();
  if (!db) {
    // sample fallback
    return res.status(200).json([
      { _id: "c1", title: "Sample Poster", imageUrl: "/samples/book-placeholder.png", link: "", order: 0, active: true }
    ]);
  }
  try {
    const items = await Carousel.find({ active: true }).sort({ order: 1, createdAt: -1 }).lean();
    res.status(200).json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
}
