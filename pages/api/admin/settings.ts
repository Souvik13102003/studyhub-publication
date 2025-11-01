// pages/api/admin/settings.ts
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Setting from "@/models/Setting";

let verifyTokenFromHeader: ((h?: string | string[]) => any) | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const v = require("@/lib/verifyAdmin");
  if (v && typeof v.verifyTokenFromHeader === "function") verifyTokenFromHeader = v.verifyTokenFromHeader;
} catch (e) {
  verifyTokenFromHeader = null;
}

function simpleVerify(header?: string | string[]) {
  if (!header) return false;
  const h = Array.isArray(header) ? header[0] : header;
  if (!h.startsWith("Bearer ")) return false;
  const token = h.slice(7).trim();
  return token && process.env.ADMIN_SECRET && token === process.env.ADMIN_SECRET;
}

async function requireAdmin(req: NextApiRequest, res: NextApiResponse) {
  const header = req.headers.authorization;
  if (verifyTokenFromHeader) {
    try {
      const ok = verifyTokenFromHeader(header);
      if (!ok) {
        res.status(401).json({ error: "unauthorized" });
        return false;
      }
      return true;
    } catch {
      res.status(401).json({ error: "unauthorized" });
      return false;
    }
  } else {
    if (!simpleVerify(header)) {
      res.status(401).json({ error: "unauthorized (set ADMIN_SECRET or add verify helper)" });
      return false;
    }
    return true;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await dbConnect();
  } catch (e) {
    console.error("DB connect failed", e);
    return res.status(500).json({ error: "DB connect failed" });
  }

  if (req.method === "PUT") {
    const ok = await requireAdmin(req, res);
    if (!ok) return;

    const { title, description } = req.body || {};
    if (typeof title !== "string" || typeof description !== "string") {
      return res.status(400).json({ error: "title and description required" });
    }

    try {
      const updated = await Setting.findOneAndUpdate(
        { key: "home" },
        { $set: { title: title.trim(), description: description.trim() } },
        { upsert: true, new: true }
      );
      return res.status(200).json(updated);
    } catch (err) {
      console.error("PUT settings error", err);
      return res.status(500).json({ error: "server error" });
    }
  }

  return res.status(405).json({ error: "method not allowed" });
}
