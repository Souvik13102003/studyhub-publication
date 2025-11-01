// pages/api/admin/login.ts
import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const { secret } = req.body || {};
    if (!secret) return res.status(400).json({ error: "Secret required" });

    if (!ADMIN_SECRET) {
        console.warn("ADMIN_SECRET is not configured in .env.local — set ADMIN_SECRET before production.");
        // allow login by matching body secret if env not set (dev convenience)
        if (secret !== "dev_secret") return res.status(401).json({ error: "invalid secret" });
    } else {
        if (secret !== ADMIN_SECRET) return res.status(401).json({ error: "invalid secret" });
    }

    // Issue token (8 hours)
    const token = jwt.sign({ admin: true }, ADMIN_SECRET || "dev_secret", { expiresIn: "8h" });
    return res.status(200).json({ ok: true, token });
}
