import { NextApiRequest, NextApiResponse } from 'next';
import { NewsArticle } from "@/models/News";

const API_KEY = process.env.NEWSDATA_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { language, keywords, country } = req.body;

  console.log("API Key:", API_KEY ? "Loaded" : "Missing");

  if (!API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const q = keywords.join(" OR ");
  // Removed the timeframe parameter from the URL
  const url = `https://newsdata.io/api/1/news?apikey=${API_KEY}&q=${q}&country=${country}&language=${language}`;
  console.log("Request URL:", url);

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("API Response:", data);

    if (data.status === "success") {
      const articles: NewsArticle[] = data.results.map((article: any) => ({
        title: article.title,
        description: article.description,
        link: article.link,
        pubDate: article.pubDate,
      }));
      res.status(200).json(articles);
    } else {
      const errorMessage = data.results?.message || 'Error fetching news from Newsdata.io';
      console.error("Newsdata.io API Error:", errorMessage);
      res.status(500).json({ error: errorMessage });
    }
  } catch (error: any) {
    console.error("Error in /api/news handler:", error);
    res.status(500).json({ error: error.message || 'An unknown error occurred while fetching news' });
  }
}