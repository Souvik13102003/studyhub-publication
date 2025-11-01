// pages/api/admin/upload.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { v2 as cloudinary } from "cloudinary";
import formidable from "formidable";
import fs from "fs";
import { verifyTokenFromHeader } from "@/lib/verifyAdmin";

export const config = {
  api: { bodyParser: false } // allow formidable to parse
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const admin = verifyTokenFromHeader(req.headers.authorization);
  if (!admin) return res.status(401).json({ error: "unauthorized" });

  if (req.method !== "POST") return res.status(405).json({ error: "method not allowed" });

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(400).json({ error: "invalid form data" });
    const file = (files.file as any) || (files.image as any);
    if (!file) return res.status(400).json({ error: "file required" });

    try {
      // read file buffer path
      const path = file.filepath || file.path;
      const result = await cloudinary.uploader.upload(path, {
        folder: "studyhub_publication",
        use_filename: true,
        unique_filename: true,
        overwrite: false
      });

      // optionally remove temp file
      try { fs.unlinkSync(path); } catch(e) {}

      return res.status(200).json({ url: result.secure_url, raw: result });
    } catch (e) {
      console.error("cloud upload err", e);
      return res.status(500).json({ error: "upload failed" });
    }
  });
}
