import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import Farmer from "@/models/Farmer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: "Phone required" });

  await connectToDatabase();

  const farmer = await Farmer.findOne({ phone });
  if (!farmer) return res.status(401).json({ error: "Invalid phone" });

  return res.status(200).json({ success: true, farmer });
}