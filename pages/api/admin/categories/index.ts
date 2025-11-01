// pages/api/admin/categories/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";
import { verifyTokenFromHeader } from "@/lib/verifyAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const db = await dbConnect();
    if (!db) return res.status(500).json({ error: "DB not configured" });

    const admin = verifyTokenFromHeader(req.headers.authorization);
    if (!admin) return res.status(401).json({ error: "unauthorized" });

    if (req.method === "GET") {
        const items = await Category.find().sort({ name: 1 }).lean();
        return res.status(200).json(items);
    }

    if (req.method === "POST") {
        const { name, thumbnail } = req.body || {};
        if (!name) return res.status(400).json({ error: "name required" });
        const existing = await Category.findOne({ name });
        if (existing) return res.status(400).json({ error: "category already exists" });
        const c = await Category.create({ name, thumbnail });
        return res.status(201).json(c);
    }

    return res.status(405).json({ error: "method not allowed" });
}
