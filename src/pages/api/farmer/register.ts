import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import Farmer from "@/models/Farmer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, phone, location } = req.body;
  if (!name || !phone || !location) return res.status(400).json({ error: "All fields required" });

  await connectToDatabase();

  try {
    const existing = await Farmer.findOne({ phone });
    if (existing) return res.status(409).json({ error: "Phone already registered" });

    const farmer = await Farmer.create({ name, phone, location });
    return res.status(201).json({ success: true, farmer });
  } catch (err) {
    return res.status(500).json({ error: "Registration failed" });
  }
}