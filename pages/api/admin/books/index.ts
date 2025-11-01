// pages/api/admin/books/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Book from "@/models/Book";
import { verifyTokenFromHeader } from "@/lib/verifyAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const db = await dbConnect();
    if (!db) return res.status(500).json({ error: "DB not configured" });

    const admin = verifyTokenFromHeader(req.headers.authorization);
    if (!admin) return res.status(401).json({ error: "unauthorized" });

    if (req.method === "GET") {
        // optional query params for admin listing (page, q)
        const { q } = req.query;
        const filter: any = {};
        if (q && typeof q === "string") {
            const re = new RegExp(q, "i");
            filter.$or = [{ title: re }, { author: re }, { isbn: re }];
        }
        const docs = await Book.find(filter).sort({ createdAt: -1 }).limit(1000).lean();
        return res.status(200).json(docs);
    }

    if (req.method === "POST") {
        const { title, author, isbn, category, frontCover, backCover, description } = req.body || {};
        if (!title || !author) return res.status(400).json({ error: "title and author required" });
        const doc = await Book.create({ title, author, isbn, category, frontCover, backCover, description });
        return res.status(201).json(doc);
    }

    return res.status(405).json({ error: "method not allowed" });
}
