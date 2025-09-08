'use server';
/**
 * @fileOverview Provides soil health and fertilizer recommendations based on location.
 *
 * - getSoilHealthAndFertilizerGuidance - A function that provides soil health and fertilizer recommendations.
 * - SoilHealthAndFertilizerGuidanceInput - The input type for the getSoilHealthAndFertilizerGuidance function.
 * - SoilHealthAndFertilizerGuidanceOutput - The return type for the getSoilHealthAndFertilizerGuidance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SoilHealthAndFertilizerGuidanceInputSchema = z.object({
  location: z
    .string()
    .describe(
      'The location of the farm. Please be as specific as possible, including city, state, and country.'
    ),
  crop: z.string().describe('The crop being grown.'),
  soilType: z.string().describe('The type of soil in the location.'),
});
export type SoilHealthAndFertilizerGuidanceInput = z.infer<
  typeof SoilHealthAndFertilizerGuidanceInputSchema
>;

const SoilHealthAndFertilizerGuidanceOutputSchema = z.object({
  soilHealthRecommendations: z
    .string()
    .describe('Recommendations for improving soil health.'),
  fertilizerGuidance: z
    .string()
    .describe('Guidance on fertilizer use for the specified crop and location.'),
});
export type SoilHealthAndFertilizerGuidanceOutput = z.infer<
  typeof SoilHealthAndFertilizerGuidanceOutputSchema
>;

export async function getSoilHealthAndFertilizerGuidance(
  input: SoilHealthAndFertilizerGuidanceInput
): Promise<SoilHealthAndFertilizerGuidanceOutput> {
  return soilHealthAndFertilizerGuidanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'soilHealthAndFertilizerGuidancePrompt',
  input: {schema: SoilHealthAndFertilizerGuidanceInputSchema},
  output: {schema: SoilHealthAndFertilizerGuidanceOutputSchema},
  prompt: `You are an expert agricultural advisor. Based on the provided location, crop, and soil type, provide recommendations for improving soil health and guidance on fertilizer use. Provide detailed and actionable advice.

Location: {{{location}}}
Crop: {{{crop}}}
Soil Type: {{{soilType}}}`,
});

const soilHealthAndFertilizerGuidanceFlow = ai.defineFlow(
  {
    name: 'soilHealthAndFertilizerGuidanceFlow',
    inputSchema: SoilHealthAndFertilizerGuidanceInputSchema,
    outputSchema: SoilHealthAndFertilizerGuidanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
