// pages/api/categories/index.ts
import type { NextApiRequest, NextApiResponse } from "next";

const SAMPLE_CATEGORIES = [
  { _id: "c1", name: "Polytechnic Courses", thumbnail: "/samples/cat-poly.png" },
  { _id: "c2", name: "Vocational Courses", thumbnail: "/samples/cat-voc.png" },
  { _id: "c3", name: "CBSE, ICSE and WBBSE Courses", thumbnail: "/samples/cat-cbse.png" }
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).json(SAMPLE_CATEGORIES);
}
