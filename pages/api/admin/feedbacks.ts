// pages/api/admin/feedbacks.ts
// Lightweight admin feedbacks API.
// - GET is public temporarily (debug) so admin UI can fetch existing feedbacks.
// - PUT (mark read) and DELETE (delete id or all) require admin token.
// Replace with production-secure version later.

import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Feedback from "@/models/Feedback";

// Try to import your existing verify helper if available. If not, use a fallback.
let verifyTokenFromHeader: ((authHeader?: string | string[]) => any) | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const v = require("@/lib/verifyAdmin");
  if (v && typeof v.verifyTokenFromHeader === "function") verifyTokenFromHeader = v.verifyTokenFromHeader;
} catch (e) {
  // no verify helper present
  verifyTokenFromHeader = null;
}

function simpleVerify(authHeader?: string | string[]) {
  // fallback: check for exact token string equals ADMIN_SECRET (not secure for prod)
  if (!authHeader) return false;
  const header = Array.isArray(authHeader) ? authHeader[0] : authHeader;
  if (!header.startsWith("Bearer ")) return false;
  const token = header.slice(7).trim();
  return token && process.env.ADMIN_SECRET && token === process.env.ADMIN_SECRET;
}

async function requireAdmin(req: NextApiRequest, res: NextApiResponse) {
  const header = req.headers.authorization;
  if (verifyTokenFromHeader) {
    try {
      const ok = verifyTokenFromHeader(header); // should return truthy if valid
      if (!ok) {
        res.status(401).json({ error: "unauthorized" });
        return false;
      }
      return true;
    } catch (e) {
      res.status(401).json({ error: "unauthorized" });
      return false;
    }
  } else {
    // fallback simple check
    if (!simpleVerify(header)) {
      res.status(401).json({ error: "unauthorized (no verify helper found, set ADMIN_SECRET as token for dev)" });
      return false;
    }
    return true;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // connect DB
  try {
    await dbConnect();
  } catch (err) {
    console.error("DB connect error", err);
    return res.status(500).json({ error: "DB connect error" });
  }

  // DEBUG WARNING: GET is temporarily public so admin UI can fetch feedbacks.
  // Remove or protect this in production.
  if (req.method === "GET") {
    try {
      const docs = await Feedback.find({}).sort({ createdAt: -1 }).lean();
      return res.status(200).json(docs);
    } catch (err) {
      console.error("GET feedbacks error", err);
      return res.status(500).json({ error: "server error" });
    }
  }

  // PUT -> mark read/unread: requires admin
  if (req.method === "PUT") {
    const ok = await requireAdmin(req, res);
    if (!ok) return;
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "id required" });
    try {
      const body = req.body || {};
      const updated = await Feedback.findByIdAndUpdate(id as string, { read: !!body.read }, { new: true });
      return res.status(200).json(updated);
    } catch (err) {
      console.error("PUT feedback error", err);
      return res.status(500).json({ error: "server error" });
    }
  }

  // DELETE -> delete id or delete all: requires admin
  if (req.method === "DELETE") {
    const ok = await requireAdmin(req, res);
    if (!ok) return;
    const { id } = req.query;
    try {
      if (id) {
        await Feedback.findByIdAndDelete(id as string);
        return res.status(204).end();
      } else {
        await Feedback.deleteMany({});
        return res.status(204).end();
      }
    } catch (err) {
      console.error("DELETE feedbacks error", err);
      return res.status(500).json({ error: "server error" });
    }
  }

  return res.status(405).json({ error: "method not allowed" });
}
