
'use server';
/**
 * @fileOverview Fetches an NDVI map from Sentinel Hub.
 *
 * - getNdVIMap - A function that returns an NDVI map image.
 */

import { ai } from '@/ai/genkit';
import {
  GetNdviMapInput,
  GetNdviMapInputSchema,
  GetNdviMapOutput,
  GetNdviMapOutputSchema,
} from '@/ai/schemas/get-ndvi-map';

// Helper function to get a Sentinel Hub API token
async function getSentinelAuthToken() {
  const clientId = process.env.SENTINEL_CLIENT_ID;
  const clientSecret = process.env.SENTINEL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      'Sentinel Hub credentials are not set in the environment variables.'
    );
  }

  const response = await fetch(
    'https://services.sentinel-hub.com/oauth/token',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to get Sentinel Hub token: ${response.statusText}`
    );
  }

  const data = await response.json();
  return data.access_token;
}

const getNdVIMapFlow = ai.defineFlow(
  {
    name: 'getNdviMapFlow',
    inputSchema: GetNdviMapInputSchema,
    outputSchema: GetNdviMapOutputSchema,
  },
  async ({ geometry, bbox }) => {
    const instanceId = process.env.SENTINEL_INSTANCE_ID;
    
    if (!instanceId) {
      console.warn("Sentinel Hub is not fully configured. Returning placeholder image.");
      // Forcing a failure here so the frontend shows an error if not configured.
      throw new Error("Sentinel Hub INSTANCE_ID is not configured in .env file.");
    }
    const authToken = await getSentinelAuthToken();

    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const toDate = now.toISOString().split('T')[0];
    const fromDate = thirtyDaysAgo.toISOString().split('T')[0];

    const apiUrl = `https://services.sentinel-hub.com/api/v1/process`;
    const requestBody = {
      input: {
        bounds: {
          properties: {
            crs: 'http://www.opengis.net/def/crs/OGC/1.3/CRS84',
          },
          bbox: bbox,
          geometry: geometry,
        },
        data: [
          {
            type: 'sentinel-2-l2a',
            dataFilter: {
              timeRange: {
                from: `${fromDate}T00:00:00Z`,
                to: `${toDate}T23:59:59Z`,
              },
               maxCloudCoverage: 20,
            },
          },
        ],
      },
      output: {
        width: 512,
        height: 512,
        responses: [
          {
            identifier: 'default',
            format: {
              type: 'image/png',
            },
          },
        ],
      },
      evalscript: `
        //VERSION=3
        function setup(){return {input:[{bands:["B04","B08","SCL"]}], output:{bands:4}};}
        function evaluatePixel(sample){
            var scl=sample.SCL; 
            if(scl===3||scl===8||scl===9||scl===10) return [0,0,0,0]; // Mask clouds and shadows
            var ndvi=(sample.B08-sample.B04)/(sample.B08+sample.B04+1e-6); 
            
            // Custom color ramp for NDVI
            if (ndvi < -0.2) return [0.2, 0.2, 0.2, 1]; // Water/No data - dark grey
            if (ndvi < 0) return [210/255, 180/255, 140/255, 1]; // Barren land - tan
            if (ndvi < 0.2) return [255/255, 0, 0, 1]; // Stressed vegetation - red
            if (ndvi < 0.4) return [255/255, 165/255, 0, 1]; // Moderately stressed - orange
            if (ndvi < 0.6) return [255/255, 255/255, 0, 1]; // Moderate health - yellow
            if (ndvi < 0.8) return [50/255, 205/255, 50/255, 1]; // Healthy vegetation - lime green
            return [0, 100/255, 0, 1]; // Very healthy vegetation - dark green
        }
      `,
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Sentinel Hub API request failed: ${response.statusText} - ${errorBody}`);
    }

    const imageBlob = await response.blob();
    const arrayBuffer = await imageBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const dataUrl = `data:${imageBlob.type};base64,${buffer.toString('base64')}`;

    return { imageUrl: dataUrl };
  }
);

export async function getNdVIMap(
  input: GetNdviMapInput
): Promise<GetNdviMapOutput> {
  return getNdVIMapFlow(input);
}
