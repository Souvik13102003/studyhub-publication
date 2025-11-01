// pages/api/admin/carousel/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Carousel from "@/models/Carousel";
import { verifyTokenFromHeader } from "@/lib/verifyAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const db = await dbConnect();
    if (!db) return res.status(500).json({ error: "DB not configured" });
    const admin = verifyTokenFromHeader(req.headers.authorization);
    if (!admin) return res.status(401).json({ error: "unauthorized" });

    if (req.method === "GET") {
        const items = await Carousel.find().sort({ order: 1, createdAt: -1 }).lean();
        return res.status(200).json(items);
    }

    if (req.method === "POST") {
        const { title, imageUrl, link, order = 0, active = true } = req.body || {};
        if (!imageUrl) return res.status(400).json({ error: "imageUrl required" });
        const item = await Carousel.create({ title, imageUrl, link, order, active });
        return res.status(201).json(item);
    }

    return res.status(405).json({ error: "method not allowed" });
}
