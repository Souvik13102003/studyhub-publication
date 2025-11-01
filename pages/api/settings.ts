// pages/api/settings.ts
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";
import Setting from "@/models/Setting";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await dbConnect();
  } catch (err) {
    console.error("DB connect error", err);
    return res.status(500).json({ error: "DB connection error" });
  }

  if (req.method === "GET") {
    try {
      // find the 'home' settings doc or fallback to defaults in model
      let doc = await Setting.findOne({ key: "home" }).lean();
      if (!doc) {
        // create default doc (so admin can edit later)
        const created = await Setting.create({ key: "home" });
        doc = created.toObject();
      }
      return res.status(200).json(doc);
    } catch (err) {
      console.error("GET settings error", err);
      return res.status(500).json({ error: "server error" });
    }
  }

  return res.status(405).json({ error: "method not allowed" });
}
