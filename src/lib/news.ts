import { NewsArticle } from "@/models/News";

export async function getNews(language: string, keywords: string[], country: string): Promise<NewsArticle[]> {
  try {
    const response = await fetch("/api/news", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ language, keywords, country }),
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.error("Error fetching news:", await response.text());
      return [];
    }
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}