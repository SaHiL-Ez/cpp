// 'use server';

// /**
//  * @fileOverview A pest and disease detection AI agent.
//  *
//  * - detectPestDisease - A function that handles the pest and disease detection process.
//  * - DetectPestDiseaseInput - The input type for the detectPestDisease function.
//  * - DetectPestDiseaseOutput - The return type for the detectPestDisease function.
//  */

// import {ai} from '@/ai/genkit';
// import {z} from 'genkit';

// const DetectPestDiseaseInputSchema = z.object({
//   photoDataUri: z
//     .string()
//     .describe(
//       "A photo of a crop, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
//     ),
// });
// export type DetectPestDiseaseInput = z.infer<typeof DetectPestDiseaseInputSchema>;

// const DetectPestDiseaseOutputSchema = z.object({
//   detected: z.boolean().describe('Whether a pest or disease has been detected.'),
//    PestOrDisease: z.string().describe('The name of the pest or disease detected, if any.'),
//   confidence: z.number().describe('The confidence level of the detection (0-1).'),
//   recommendations: z.string().describe('Recommendations for treatment or prevention.'),
// });
// export type DetectPestDiseaseOutput = z.infer<typeof DetectPestDiseaseOutputSchema>;

// export async function detectPestDisease({ photoDataUri }: { photoDataUri: string }) {
//     try {
//         // The python API expects a JSON with an "image" key holding the base64 string
//         // The data URI from the browser includes a prefix like "data:image/jpeg;base64,"
//         // We need to remove it.
//         const base64Image = photoDataUri.split(',')[1];

//         const response = await fetch("http://localhost:5000/predict", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ image: base64Image }), // base64 without datauri prefix OK
//         });

//         if (!response.ok) {
//             console.error("API Error Response:", await response.text());
//             throw new Error("Prediction failed");
//         }

//         const data = await response.json();
//         // Example: take top-1
//         const top = data.predictions?.[0];
//         return {
//             detected: top ? top.index !== 0 : false, // Replace 0 with the actual index for "healthy" if different
//             PestOrDisease: top ? top.label : "Unknown",
//             confidence: top ? top.confidence : 0,
//             recommendations: top ? `See recommended treatment for ${top.label}` : "",
//         };
//     } catch (error) {
//         console.error("Error in pest detection:", error);
//         throw error;
//     }
// }

// function extractFeaturesFromImage(photoDataUri: string): number[] {
//     // Placeholder: Convert the image to features (depends on your model)
//     // You might need to preprocess the image and extract features
//     return [/* Example features */];
// }

// const prompt = ai.definePrompt({
//   name: 'detectPestDiseasePrompt',
//   input: {schema: DetectPestDiseaseInputSchema},
//   output: {schema: DetectPestDiseaseOutputSchema},
//   prompt: `You are an expert in plant pathology and pest management. Analyze the image of the crop and identify any signs of pests or diseases. Provide a diagnosis, confidence level (0-1), and recommendations for treatment or prevention.

// Photo: {{media url=photoDataUri}}`,
// });

// const detectPestDiseaseFlow = ai.defineFlow(
//   {
//     name: 'detectPestDiseaseFlow',
//     inputSchema: DetectPestDiseaseInputSchema,
//     outputSchema: DetectPestDiseaseOutputSchema,
//   },
//   async input => {
//     const {output} = await prompt(input);
//     return output!;
//   }
// );



// ai/flows/pest-disease-detection.ts
'use server';

import { z } from 'genkit';
import { Label } from "@/components/ui/label";

const DetectPestDiseaseInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a crop, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DetectPestDiseaseInput = z.infer<typeof DetectPestDiseaseInputSchema>;

const DetectPestDiseaseOutputSchema = z.object({
  detected: z.boolean().describe('Whether a pest or disease has been detected.'),
  PestOrDisease: z.string().describe('The name of the pest or disease detected, if any.'),
  confidence: z.number().describe('The confidence level of the detection (0-1).'),
  recommendations: z.string().describe('Recommendations for treatment or prevention.'),
});
export type DetectPestDiseaseOutput = z.infer<typeof DetectPestDiseaseOutputSchema>;

/**
 * detectPestDisease
 * Sends the image (data URI) to the Python ML API and converts the response
 * into DetectPestDiseaseOutput.
 */
export async function detectPestDisease({ photoDataUri }: { photoDataUri: string }): Promise<DetectPestDiseaseOutput> {
  // Validate basic shape
  if (!photoDataUri || typeof photoDataUri !== 'string') {
    throw new Error('photoDataUri (data URI string) is required.');
  }

  // Remove data URI prefix if present
  const base64Image = photoDataUri.includes(',') ? photoDataUri.split(',')[1] : photoDataUri;

  // API endpoint - adjust host/port if different in prod
  const API_URL = process.env.PEST_API_URL ?? 'http://localhost:5000/predict';

  try {
    const resp = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Image }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error('Pest API error:', resp.status, text);
      throw new Error(`Prediction API returned status ${resp.status}`);
    }

    const json = await resp.json();

    // Expected shape:
    // { top_k: number, predictions: [{ index, label, confidence }, ...], raw_probabilities: [...] }
    const preds = json.predictions ?? [];

    if (!Array.isArray(preds) || preds.length === 0) {
      return {
        detected: false,
        PestOrDisease: 'Unknown',
        confidence: 0,
        recommendations: 'Could not detect any condition. Try another clear close-up photo.',
      };
    }

    const top = preds[0]; // top-1
    const label: string = typeof top.label === 'string' ? top.label : 'Unknown';
    const confidence: number = typeof top.confidence === 'number' ? top.confidence : 0;

    // Heuristic: if the predicted label contains 'healthy' we treat as no issue detected.
    const lowerLabel = label.toLowerCase();
    const isHealthy = lowerLabel.includes('healthy') || lowerLabel.includes('healthy') || lowerLabel.includes('normal');

    const detected = !isHealthy;

    // Simple recommendations generator (you can expand this mapping)
    let recommendations = '';
    if (!detected) {
      recommendations = 'No visible disease detected. Maintain usual care and monitor for changes.';
    } else if (confidence >= 0.7) {
      recommendations = `High confidence (${(confidence * 100).toFixed(0)}%). Follow standard treatment for ${label}. Consider contacting local extension services for specific pesticides or cultural controls.`;
    } else if (confidence >= 0.4) {
      recommendations = `Moderate confidence (${(confidence * 100).toFixed(0)}%). Retake image from a closer/clearer angle or provide multiple images. Consider expert confirmation before applying treatment.`;
    } else {
      recommendations = `Low confidence (${(confidence * 100).toFixed(0)}%). Image may be unclear — try taking a closer, well-lit photo or multiple photos of different parts of the plant.`;
    }

    return {
      detected,
      PestOrDisease: label,
      confidence,
      recommendations,
    };
  } catch (err) {
    console.error('detectPestDisease error:', err);
    throw err;
  }
}
