import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'Google Maps API key is not configured.' });
    }

    // Step 1: Get latitude and longitude from the client's IP address
    const ipLocateResponse = await fetch(`https://ipapi.co/${ip}/json/`);
    if (!ipLocateResponse.ok) {
      throw new Error('Failed to fetch coarse location from IP API');
    }
    const ipData = await ipLocateResponse.json();

    if (ipData.error) {
      return res.status(500).json({ error: ipData.reason || 'Could not find location from IP' });
    }

    const { latitude, longitude } = ipData;

    if (!latitude || !longitude) {
        return res.status(500).json({ error: 'Could not determine coordinates from IP' });
    }

    // Step 2: Use Google Maps reverse geocoding to get a formatted address
    const googleApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

    const googleResponse = await fetch(googleApiUrl);
    const googleData = await googleResponse.json();

    if (googleData.status === 'OK') {
      const address = googleData.results[0]?.formatted_address;
      if (address) {
        res.status(200).json({ address });
      } else {
        res.status(404).json({ error: 'Address not found by Google Geocoding API.' });
      }
    } else {
      // If Google's API fails, fall back to the simpler address from the IP service
      const fallbackAddress = [ipData.city, ipData.region, ipData.country_name].filter(Boolean).join(', ');
      if (fallbackAddress) {
          res.status(200).json({ address: fallbackAddress });
      } else {
          res.status(500).json({ error: 'Failed to fetch address from Google Maps API and no fallback available.' });
      }
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
