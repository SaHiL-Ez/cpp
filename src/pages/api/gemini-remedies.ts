// src/pages/api/gemini-remedies.ts
import type { NextApiRequest, NextApiResponse } from "next";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { pestOrDisease } = req.body;
  if (!pestOrDisease) {
    return res.status(400).json({ error: "pestOrDisease is required" });
  }

  const prompt = `
You are an expert agricultural assistant. For the following pest or disease, provide a JSON array of real, up-to-date, specific remedies and pesticides (both chemical and organic/natural) used in India. For each, include:
- name: The real product or remedy name (no placeholders)
- type: 'chemical' or 'natural'
- description: What it is and how it works
- instructions: Step-by-step instructions for use
- amount: Typical amount/dosage and units
- usage: When and how often to apply

Pest or disease: ${pestOrDisease}
Respond ONLY with a JSON array as per the schema.
`;

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json"
          }
        }),
      }
    );

    const geminiData = await geminiRes.json();
    const remedies = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!remedies) {
      return res.status(500).json({ error: "No remedies found", raw: geminiData });
    }

    let parsedRemedies;
    try {
      parsedRemedies = JSON.parse(remedies);
    } catch (e) {
      return res.status(500).json({ error: "Invalid JSON from Gemini", raw: remedies });
    }

    return res.status(200).json({ remedies: parsedRemedies });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch from Gemini", details: (error as Error).message });
  }
}