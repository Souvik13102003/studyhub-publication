// lib/verifyAdmin.ts
import jwt from "jsonwebtoken";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "dev_secret";

export function verifyTokenFromHeader(authHeader?: string) {
    if (!authHeader) return null;
    const token = authHeader.replace(/^Bearer\s*/i, "");
    try {
        const payload = jwt.verify(token, ADMIN_SECRET);
        return payload;
    } catch (err) {
        return null;
    }
}
