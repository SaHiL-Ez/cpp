
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { lat, lng } = req.query;
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Google Maps API key is not configured.' });
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK') {
      const address = data.results[0]?.formatted_address;
      if (address) {
        res.status(200).json({ address });
      } else {
        res.status(404).json({ error: 'Address not found.' });
      }
    } else {
      res.status(500).json({ error: 'Failed to fetch address from Google Maps API.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
}
