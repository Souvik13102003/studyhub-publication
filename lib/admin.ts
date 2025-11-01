// lib/admin.ts
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "change_this_secret";

// Issue a short-lived JWT on admin login
export function signAdminToken() {
    return jwt.sign({ admin: true }, ADMIN_SECRET, { expiresIn: "8h" });
}

export function verifyAdminToken(token: string | undefined) {
    if (!token) return null;
    try {
        const data = jwt.verify(token, ADMIN_SECRET);
        return data;
    } catch {
        return null;
    }
}

// Middleware guard for API routes
export function requireAdmin(handler: (req: NextApiRequest, res: NextApiResponse) => any) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        const auth = req.headers.authorization || "";
        const token = auth.replace(/^Bearer\s*/i, "");
        const ok = verifyAdminToken(token);
        if (!ok) return res.status(401).json({ error: "unauthorized" });
        return handler(req, res);
    };
}
