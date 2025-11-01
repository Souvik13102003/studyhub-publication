// pages/api/admin/feedbacks/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Feedback from "@/models/Feedback"; // create model if not exists
import { verifyTokenFromHeader } from "@/lib/verifyAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const admin = verifyTokenFromHeader(req.headers.authorization);
    if (!admin) return res.status(401).json({ error: "unauthorized" });

    const db = await dbConnect();
    if (!db) return res.status(500).json({ error: "DB not configured" });

    if (req.method === "GET") {
        // optional ?unread=true to filter
        const { unread } = req.query;
        const filter: any = {};
        if (unread === "true") filter.read = { $ne: true };
        const list = await Feedback.find(filter).sort({ createdAt: -1 }).lean();
        return res.status(200).json(list);
    }

    if (req.method === "DELETE") {
        // remove all or by id
        const { id } = req.query;
        if (id) {
            await Feedback.findByIdAndDelete(id as string);
            return res.status(204).end();
        } else {
            await Feedback.deleteMany({});
            return res.status(204).end();
        }
    }

    if (req.method === "PUT") {
        // mark as read/unread
        const { id } = req.query;
        if (!id) return res.status(400).json({ error: "id required" });
        const { read } = req.body;
        const updated = await Feedback.findByIdAndUpdate(id as string, { read: !!read }, { new: true });
        return res.status(200).json(updated);
    }

    return res.status(405).json({ error: "method not allowed" });
}
