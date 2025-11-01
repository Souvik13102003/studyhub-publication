// pages/api/settings/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Setting from "@/models/Setting";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const db = await dbConnect();
    if (!db) {
        // dev fallback
        return res.status(200).json({
            homeTitle: "WELCOME TO STUDY-HUB PUBLICATION",
            homeDescription: "Explore our catalogue of books."
        });
    }

    try {
        let s = await Setting.findOne().lean();
        if (!s) {
            s = await Setting.create({ homeTitle: "WELCOME TO STUDY-HUB PUBLICATION", homeDescription: "" });
        }
        res.status(200).json(s);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "server error" });
    }
}
