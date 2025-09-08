
/**
 * @fileOverview Schemas for the get-ndvi-map flow.
 *
 * - GetNdviMapInputSchema - The Zod schema for the input of the getNdVIMap function.
 * - GetNdviMapInput - The input type for the getNdVIMap function.
 * - GetNdviMapOutputSchema - The Zod schema for the output of the getNdVIMap function.
 * - GetNdviMapOutput - The return type for the getNdVIMap function.
 */

import { z } from 'genkit';

const PolygonSchema = z.object({
  type: z.literal('Polygon'),
  coordinates: z.array(z.array(z.array(z.number()))),
});

export const GetNdviMapInputSchema = z.object({
  geometry: PolygonSchema.describe('A GeoJSON Polygon object representing the farm boundary.'),
   bbox: z
    .array(z.number())
    .length(4)
    .describe(
      'The bounding box for the map in WGS84 coordinates: [minLon, minLat, maxLon, maxLat].'
    ),
});
export type GetNdviMapInput = z.infer<typeof GetNdviMapInputSchema>;

export const GetNdviMapOutputSchema = z.object({
  imageUrl: z
    .string()
    .describe('A data URI of the generated NDVI map image.'),
});
export type GetNdviMapOutput = z.infer<typeof GetNdviMapOutputSchema>;
