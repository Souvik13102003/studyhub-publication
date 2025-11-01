// pages/api/admin/verify.ts
import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "dev_secret";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const auth = req.headers.authorization || "";
    const token = auth.replace(/^Bearer\s*/i, "");
    if (!token) return res.status(401).json({ valid: false });

    try {
        const data = jwt.verify(token, ADMIN_SECRET);
        return res.status(200).json({ valid: true, data });
    } catch (err) {
        return res.status(401).json({ valid: false, error: "invalid token" });
    }
}
