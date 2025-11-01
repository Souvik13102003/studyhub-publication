// pages/api/books/index.ts
import type { NextApiRequest, NextApiResponse } from "next";

// Sample books - used while MongoDB is not configured
const SAMPLE_BOOKS = [
  {
    _id: "1",
    title: "Mathematics-1",
    author: "Konch, De & Paul",
    isbn: "ISBN-1001",
    category: "Polytechnic Courses",
    frontCover: "/samples/math1-front.jpg",
    backCover: "/samples/math1-back.jpg",
    description: "Mathematics 1 for diploma engineering students."
  },
  {
    _id: "2",
    title: "VOCLET (Theory & MCQ)",
    author: "Kundu & Kundu",
    isbn: "ISBN-1002",
    category: "Vocational Courses",
    frontCover: "/samples/voclet-front.jpg",
    backCover: "/samples/voclet-back.jpg",
    description: "VOCLET practice and theory."
  },
  {
    _id: "3",
    title: "Bangla Mentor-X",
    author: "Alok Baran",
    isbn: "ISBN-1003",
    category: "CBSE, ICSE and WBBSE Courses",
    frontCover: "/samples/bangla-front.jpg",
    backCover: "/samples/bangla-back.jpg",
    description: "Bangla mentor for class X."
  }
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { q, category } = req.query;
  let results = SAMPLE_BOOKS;

  // basic filtering by category
  if (category && typeof category === "string") {
    results = results.filter((b) => b.category === category);
  }

  // basic search (title/author/isbn)
  if (q && typeof q === "string" && q.trim() !== "") {
    const regex = new RegExp(q, "i");
    results = results.filter(
      (b) => regex.test(b.title) || regex.test(b.author) || regex.test(b.isbn)
    );
  }

  return res.status(200).json(results);
}
