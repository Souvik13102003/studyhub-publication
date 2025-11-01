// pages/api/contact.ts
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Feedback from "@/models/Feedback";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const db = await dbConnect();
    if (!db) return res.status(500).json({ error: "DB not configured" });

    try {
        const { name, phone, email, bookName, message } = req.body || {};

        // Basic validation
        if (!name || !name.trim()) return res.status(400).json({ error: "Name is required" });
        if (!phone || !phone.trim()) return res.status(400).json({ error: "Phone number is required" });

        const doc = await Feedback.create({
            name: name.trim(),
            phone: phone.trim(),
            email: email ? String(email).trim() : undefined,
            bookName: bookName ? String(bookName).trim() : undefined,
            message: message ? String(message).trim() : undefined,
            read: false
        });

        return res.status(201).json({ ok: true, id: doc._id });
    } catch (err) {
        console.error("contact POST error:", err);
        return res.status(500).json({ error: "Server error" });
    }
}
