// pages/api/books/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Book from "@/models/Book";

const SAMPLE_BOOKS = [
    /* you can paste previous sample books here if desired */
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { q, category } = req.query;
    // Connect DB
    const db = await dbConnect();
    if (!db) {
        // fallback to sample
        let out = SAMPLE_BOOKS;
        if (category) out = out.filter((b) => b.category === category);
        if (q && typeof q === "string" && q.trim()) {
            const re = new RegExp(q, "i");
            out = out.filter((b) => re.test(b.title) || re.test(b.author) || re.test(b.isbn));
        }
        return res.status(200).json(out);
    }
    // Use DB
    try {
        const filter: any = {};
        if (category) filter.category = category;
        if (q && typeof q === "string" && q.trim()) {
            const re = new RegExp(q, "i");
            filter.$or = [{ title: re }, { author: re }, { isbn: re }];
        }
        const books = await Book.find(filter).sort({ createdAt: -1 }).limit(500);
        return res.status(200).json(books);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "server error" });
    }
}
