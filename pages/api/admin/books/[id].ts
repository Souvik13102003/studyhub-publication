// pages/api/admin/books/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Book from "@/models/Book";
import { verifyTokenFromHeader } from "@/lib/verifyAdmin";
import mongoose from "mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await dbConnect();
  if (!db) return res.status(500).json({ error: "DB not configured" });

  const admin = verifyTokenFromHeader(req.headers.authorization);
  if (!admin) return res.status(401).json({ error: "unauthorized" });

  const { id } = req.query;
  if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "invalid id" });
  }

  if (req.method === "GET") {
    const item = await Book.findById(id).lean();
    if (!item) return res.status(404).json({ error: "not found" });
    return res.status(200).json(item);
  }

  if (req.method === "PUT") {
    const updated = await Book.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json(updated);
  }

  if (req.method === "DELETE") {
    await Book.findByIdAndDelete(id);
    return res.status(204).end();
  }

  return res.status(405).json({ error: "method not allowed" });
}
