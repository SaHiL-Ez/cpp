'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getNews } from "@/lib/news";
import { NewsArticle } from "@/models/News";
import { useTranslation } from "react-i18next";
import { TriangleAlert } from "lucide-react";
import { useFarm } from "@/contexts/farm-context";


export function AlertsAndNews() {
  const { selectedFarm } = useFarm();
  const { t } = useTranslation();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const handleFetchNews = async () => {
    setLoading(true);
    // Reduced keywords to comply with API query length limits
    const englishKeywords = [
      "agriculture", "farming", "crops", "monsoon", "msp"
    ];
    const hindiKeywords = [
      "किसान", "खेती", "फसल", "कृषि", "मानसून", "एमएसपी"
    ];

    // Fetch news for both languages and combine them
    const enNews = await getNews("en", englishKeywords, "in");
    const hiNews = await getNews("hi", hindiKeywords, "in");

    // Combine and de-duplicate news articles
    const allNews = [...enNews, ...hiNews];
    const uniqueNews = allNews.filter((article, index, self) => 
      index === self.findIndex((a) => (
        a.title === article.title && a.link === article.link
      ))
    );

    setNews(uniqueNews);
    setLastUpdated(new Date());
    setLoading(false);
  };

  useEffect(() => {
    handleFetchNews();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TriangleAlert className="text-destructive" />
                {t("weather_alerts")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                <TriangleAlert className="size-5 mt-1 shrink-0 text-destructive" />
                <div>
                  <h3 className="font-semibold">{t("high_uv_index_today")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedFarm.weather.uvAlert} {t("uv_levels_high_warning")}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4">
                <TriangleAlert className="size-5 mt-1 shrink-0 text-yellow-600 dark:text-yellow-500" />
                <div>
                  <h3 className="font-semibold">{t("chance_of_thunderstorms")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("monitor_weather_updates")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Farming News</CardTitle>
              <Button onClick={handleFetchNews} disabled={loading} size="sm">
                {loading ? "Refreshing..." : "Refresh"}
              </Button>
            </CardHeader>
            <CardContent>
            {lastUpdated && (
                <p className="text-xs text-muted-foreground mb-4">
                  Last updated: {lastUpdated.toLocaleString()}
                </p>
              )}
              <div className="space-y-4 h-64 overflow-y-auto">
                {news.length > 0 ? (
                  news.map((article, index) => (
                    <div key={index}>
                      <h3 className="font-semibold">{article.title}</h3>
                      <p className="text-sm text-muted-foreground">{article.description}</p>
                      <a href={article.link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary">Read More</a>
                    </div>
                  ))
                ) : (
                  <p>No news available at the moment.</p>
                )}
              </div>
            </CardContent>
          </Card>
    </div>
  );
}