
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { lat, lng } = req.query;
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  console.log('GOOGLE_MAPS_API_KEY:', apiKey ? 'Loaded' : 'Not Loaded');

  if (!apiKey) {
    return res.status(500).json({ error: 'Google Maps API key is not configured.' });
  }

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Latitude and longitude are required.' });
  }

  const url = `https://weather.googleapis.com/v1/weather:get?location.latitude=${lat}&location.longitude=${lng}&requests=CURRENT_CONDITIONS,DAILY_FORECAST,HEALTH_FORECAST&key=${apiKey}`;
  console.log('Requesting URL:', url);

  try {
    const response = await fetch(url);
    const data = await response.json();

    console.log('Google Weather API Response:', data);

    if (response.ok) {
      res.status(200).json(data);
    } else {
      res.status(response.status).json({ error: data.error || 'Failed to fetch weather data.' });
    }
  } catch (error: any) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: error.message });
  }
}
