// pages/api/books/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import booksData from "./index"; // we won't actually call it; use sample below

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

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id }
  } = req;

  const data = SAMPLE_BY_ID[String(id)];
  if (!data) return res.status(404).json({ error: "Book not found" });
  return res.status(200).json(data);
}
