// pages/api/contact.ts
import type { NextApiRequest, NextApiResponse } from "next";

type ContactPayload = {
  name?: string;
  phone?: string;
  email?: string;
  bookName?: string;
  message?: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const data: ContactPayload = req.body || {};
  if (!data.name || !data.phone) {
    return res.status(400).json({ error: "Name and Phone are required" });
  }

  // For now just log to server console (later will save to DB and email)
  console.log("Contact submission:", data);

  return res.status(201).json({ ok: true, message: "Feedback received" });
}
