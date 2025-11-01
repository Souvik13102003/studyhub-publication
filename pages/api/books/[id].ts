// pages/api/books/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Book from "@/models/Book";
import mongoose from "mongoose";

/**
 * Dev-friendly handler:
 * - If no MONGODB_URI: use SAMPLE_BY_ID fallback (works with id "1","2","3")
 * - If MONGODB_URI is present:
 *    - If id is a valid ObjectId -> Book.findById(id)
 *    - Else -> try SAMPLE_BY_ID fallback (or return 404)
 */

const SAMPLE_BY_ID: Record<string, any> = {
  "1": {
    _id: "1",
    title: "Mathematics-1",
    author: "Konch, De & Paul",
    isbn: "ISBN-1001",
    category: "Polytechnic Courses",
    frontCover: "/samples/math1-front.jpg",
    backCover: "/samples/math1-back.jpg",
    description: "Mathematics 1 for diploma engineering students."
  },
  "2": {
    _id: "2",
    title: "VOCLET (Theory & MCQ)",
    author: "Kundu & Kundu",
    isbn: "ISBN-1002",
    category: "Vocational Courses",
    frontCover: "/samples/voclet-front.jpg",
    backCover: "/samples/voclet-back.jpg",
    description: "VOCLET practice and theory."
  },
  "3": {
    _id: "3",
    title: "Bangla Mentor-X",
    author: "Alok Baran",
    isbn: "ISBN-1003",
    category: "CBSE, ICSE and WBBSE Courses",
    frontCover: "/samples/bangla-front.jpg",
    backCover: "/samples/bangla-back.jpg",
    description: "Bangla mentor for class X."
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id }
  } = req;

  // safe: if no DB connection string, fallback directly to sample map
  const db = await dbConnect();
  if (!db) {
    const data = SAMPLE_BY_ID[String(id)];
    if (!data) return res.status(404).json({ error: "not found (dev-sample)" });
    return res.status(200).json(data);
  }

  // DB is configured. Only attempt findById if id is a valid ObjectId
  const idStr = String(id);
  if (!mongoose.Types.ObjectId.isValid(idStr)) {
    // Option: try to find by some other field (e.g. legacyId) if you created such field
    // For now, fall back to sample data for dev convenience:
    const data = SAMPLE_BY_ID[idStr];
    if (data) return res.status(200).json(data);
    return res.status(400).json({ error: "invalid id format" });
  }

  try {
    const book = await Book.findById(idStr).lean();
    if (!book) return res.status(404).json({ error: "not found" });
    return res.status(200).json(book);
  } catch (err) {
    console.error("books/[id] error:", err);
    return res.status(500).json({ error: "server error" });
  }
}
