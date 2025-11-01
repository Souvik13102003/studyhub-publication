// pages/api/categories/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";

const SAMPLE = [
    { _id: "c1", name: "Polytechnic Courses", thumbnail: "/samples/cat-poly.png" },
    { _id: "c2", name: "Vocational Courses", thumbnail: "/samples/cat-voc.png" },
    { _id: "c3", name: "CBSE, ICSE and WBBSE Courses", thumbnail: "/samples/cat-cbse.png" }
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const db = await dbConnect();
    if (!db) return res.status(200).json(SAMPLE);

    try {
        const cats = await Category.find().sort({ name: 1 }).lean();
        return res.status(200).json(cats);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "server error" });
    }
}