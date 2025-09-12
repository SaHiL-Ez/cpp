import { NextApiRequest, NextApiResponse } from 'next';

// A simplified interface for the data we want to send to the client
interface Place {
  place_id: string;
  name: string;
  vicinity: string; // Address or general area
  rating?: number;
  user_ratings_total?: number;
  location: {
    lat: number;
    lng: number;
  };
}

// Your Google Places API Key stored in environment variables
const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // This endpoint only accepts POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { lat, lng } = req.body;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  if (!API_KEY) {
    console.error("Google Places API key is missing.");
    return res.status(500).json({ error: 'API key not configured on the server' });
  }

  // Search for multiple keywords using the pipe '|' as an OR operator
  const keywords = "nursery|crop store|fertilizer store|pesticide store|agricultural supply";
  const radius = 20000; // 20km specified in meters

  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&keyword=${encodeURIComponent(keywords)}&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Handle API errors from Google
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error("Google Places API Error:", data.error_message || data.status);
      return res.status(500).json({ error: 'Failed to fetch data from Google Places API', details: data.error_message || data.status });
    }

    let places: Place[] = [];
    if (data.results) {
        // Map the detailed response from Google to our simplified Place interface
        places = data.results.map((place: any) => ({
            place_id: place.place_id,
            name: place.name,
            vicinity: place.vicinity,
            rating: place.rating,
            user_ratings_total: place.user_ratings_total,
            location: place.geometry.location,
        }));
    }

    // Sort the results by rating in descending order, as requested
    places.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    // Send the sorted list of places back to the client
    res.status(200).json(places);

  } catch (error: any) {
    console.error("Error in /api/nearby-places handler:", error);
    res.status(500).json({ error: error.message || 'An unknown error occurred' });
  }
}