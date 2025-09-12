"use client";

import { useTranslation } from "react-i18next";
import {
  useState,
  useEffect
} from "react";
import {
  ArrowUpRight,
  Cloud,
  CloudDrizzle,
  CloudRain,
  CloudSun,
  Droplets,
  FlaskConical,
  Languages,
  Map,
  ScanEye,
  Sun,
  TriangleAlert,
  Wind,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  Badge
} from "@/components/ui/badge";
import {
  Button
} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useFarm
} from "@/contexts/farm-context";

const QUICK_LINKS = [{
  title: "AI Crop Advisory",
  description: "Get location-specific crop advice in your language.",
  href: "/crop-advisory",
  icon: Languages,
}, {
  title: "Soil Health Guide",
  description: "Personalized fertilizer and soil health tips.",
  href: "/soil-health",
  icon: FlaskConical,
}, {
  title: "Pest & Disease Detection",
  description: "Upload a photo to identify crop issues.",
  href: "/pest-detection",
  icon: ScanEye,
}, {
  title: "Crop Health Map",
  description: "View satellite NDVI map of your farm.",
  href: "/crop-health",
  icon: Map,
}, ];

export default function Dashboard() {
  const {
    selectedFarm
  } = useFarm();
  const {
    t
  } = useTranslation();
  const [weatherData, setWeatherData] = useState < any > (null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!selectedFarm) return;

      try {
        const response = await fetch(
          `/api/weather?lat=${selectedFarm.location.lat}&lng=${selectedFarm.location.lng}`
        );
        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error("Failed to fetch weather data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [selectedFarm]);

  const getWeatherIcon = (condition: string) => {
    const lowerCaseCondition = condition.toLowerCase();
    if (lowerCaseCondition.includes("sunny")) return Sun;
    if (lowerCaseCondition.includes("partly cloudy")) return CloudSun;
    if (lowerCaseCondition.includes("light rain")) return CloudDrizzle;
    if (lowerCaseCondition.includes("rain")) return CloudRain;
    if (lowerCaseCondition.includes("cloudy")) return Cloud;
    return Cloud;
  };

  return (
    <main className = "flex flex-1 flex-col" >
    <div className = "flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8" >
    <div className = "grid gap-4" >
    <Card className = "flex flex-col md:flex-row" >
    <div className = "flex flex-col justify-center p-6" >
    <CardHeader >
    <CardTitle className = "font-headline text-3xl md:text-4xl" > {
      t("welcome_to", {
        farm: selectedFarm.name
      })
    } </CardTitle> <CardDescription className = "text-lg" > {
      t("dashboard_description")
    } </CardDescription> </CardHeader> <CardContent >
    <Link href="/crop-advisory">
      <Button>
        {t("get_started")}
        <ArrowUpRight className="ml-2 h-4 w-4" />
      </Button>
    </Link>
</CardContent> </div> <div className = "relative h-64 w-full shrink-0 md:h-auto md:w-1/3" >
    <Image src = {
      selectedFarm.image.src
    }
    alt = {
      selectedFarm.image.alt
    }
    data-ai-hint = {
      selectedFarm.image.hint
    }
    fill className = "rounded-r-lg object-cover"
    key = {
      selectedFarm.id
    }
    /> </div> </Card> </div> <div className = "grid grid-cols-1 gap-4 md:gap-8 lg:grid-cols-3" >
    <div className = "lg:col-span-2 grid gap-4 md:gap-8" >
    <Card >
    <CardHeader >
    <CardTitle > {
      t("current_weather")
    } </CardTitle> <CardDescription > {
      t("live_conditions_for", {
        location: selectedFarm.location.name
      })
    } </CardDescription> </CardHeader> <CardContent className = "space-y-4" > {
      loading ? ( < p > Loading weather... </p>) : weatherData && weatherData.currentConditions ? ( <>
        <div className = "flex items-center gap-6" >
        <CloudSun className = "size-16 text-accent" / >
        <div >
        <p className = "text-4xl font-bold" > {
          weatherData.currentConditions.temperature
        } & #176;C</p>
        <p className = "text-md text-muted-foreground" > {
          weatherData.currentConditions.shortDescription
        } </p> </div> </div> <div className = "grid grid-cols-2 gap-x-6 gap-y-3 text-sm" >
        <div className = "flex items-center gap-2" >
        <Wind className = "size-4 text-muted-foreground" / >
        <span > {
          t("wind")
        }: {
          weatherData.currentConditions.windSpeed
        }
        km / h </span> </div> <div className = "flex items-center gap-2" >
        <Droplets className = "size-4 text-muted-foreground" / >
        <span > {
          t("humidity")
        }: {
          weatherData.currentConditions.humidity
        } % </span> </div> <div className = "flex items-center gap-2 col-span-2" >
        <Sun className = "size-4 text-muted-foreground" / >
        <span > {
          t("uv_index")
        }: {
          " "
        } <Badge variant = {
          weatherData.currentConditions.uvIndex >= 6 ?
          "destructive" :
          "secondary"
        } > {
          weatherData.currentConditions.uvIndex
        } </Badge> </span> </div> <div className = "flex items-center gap-2" >
        <CloudRain className = "size-4 text-muted-foreground" / >
        <span > {
          t("precipitation")
        }: {
          weatherData.currentConditions.precipitationChance
        } % </span> </div> </div> </>
      ) : ( < p > Failed to load weather data. </p>)}
        </CardContent> </Card> <Card >
        <CardHeader >
        <CardTitle > {
          t("five_day_forecast")
        } </CardTitle> <CardDescription > {
          t("weather_for_upcoming_days", {
            location: selectedFarm.location.name,
          })
        } </CardDescription> </CardHeader> <CardContent className = "grid grid-cols-2 md:grid-cols-5 gap-4" > {
          loading ? ( < p > Loading forecast... </p>) : weatherData && weatherData.dailyForecast ? (
            weatherData.dailyForecast.forecasts.slice(0, 5).map((day: any) => {
              const Icon = getWeatherIcon(day.shortDescription);
              return ( <
                div key = {
                  day.date.day
                }
                className = "flex flex-col items-center gap-2 rounded-lg border bg-card p-4 text-center" >
                <p className = "font-semibold text-xs md:text-sm" > {
                  new Date(day.date.year, day.date.month - 1, day.date.day).toLocaleDateString('en-US', { weekday: 'long' })
                } </p> <Icon className = "size-8 md:size-10 text-accent" / >
                <p className = "font-bold text-md md:text-lg" > {
                  day.temperatureMax
                } & #176;C</p>
                <p className = "text-xs text-muted-foreground" > {
                  day.shortDescription
                } </p> </div>
              );
            })
          ) : ( < p > Failed to load forecast data. </p>)}
            </CardContent> </Card> </div> <div className = "grid gap-4 md:gap-8" >
            <Card >
            <CardHeader className = "flex flex-row items-center" >
            <div className = "grid gap-2" >
            <CardTitle > {
              t("market_prices")
            } </CardTitle> <CardDescription > {
              t("live_prices_from", {
                location: selectedFarm.location.name,
              })
            } </CardDescription> </div> 
            <Link href="/market-prices" className="ml-auto">
              <Button size="sm" className="gap-1">
                {t("view_all")}
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
            </CardHeader> <CardContent >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("crop")}</TableHead>
                  <TableHead className="text-right">{t("price_per_quintal")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedFarm.crops.slice(0, 3).map((crop) => (
                  <TableRow key={crop.name}>
                    <TableCell>
                      <div className="font-medium">{crop.name}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      ₹{crop.price.toLocaleString("en-IN")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent> </Card> <Card >
            <CardHeader >
            <CardTitle className = "flex items-center gap-2" >
            <TriangleAlert className = "text-destructive" / > {
              t("weather_alerts")
            } </CardTitle> </CardHeader> <CardContent className = "space-y-4" > {
              loading ? ( < p > Loading alerts... </p>) : weatherData && weatherData.healthForecast ? (
                weatherData.healthForecast.forecasts.map((alert: any) => ( 
                <div key = {
                    alert.type
                  }
                  className = {
                    `flex items-start gap-4 rounded-lg border p-4 ${
                  alert.level === "High"
                    ? "border-destructive/50 bg-destructive/10"
                    : "border-yellow-500/50 bg-yellow-500/10"
                }`
                  } >
                  <
                  TriangleAlert className = {
                    `size-5 mt-1 shrink-0 ${
                  alert.level === "High"
                    ? "text-destructive"
                    : "text-yellow-600 dark:text-yellow-500"
                }`
                  }
                  /> <div>
                  <h3 className = "font-semibold" > {
                    t(alert.displayName)
                  } </h3> <p className = "text-sm text-muted-foreground" > {
                    t(alert.healthRecommendations)
                  } </p> </div> </div>
                ))
              ) : ( < p > No weather alerts. </p>)}
                </CardContent> </Card> </div> </div> <div className = "grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4" > {
                  QUICK_LINKS.map((link) => ( <
                    Link href = {
                      link.href
                    }
                    key = {
                      link.title
                    }
                    className = "flex" >
                    <
                    Card className = "flex flex-col w-full hover:bg-muted/50 transition-colors" >
                    <
                    CardHeader >
                    <
                    div className = "mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary" >
                    <
                    link.icon className = "size-6" / >
                    </div> <CardTitle > {
                      t(link.title)
                    } </CardTitle> <CardDescription > {
                      t(link.description)
                    } </CardDescription> </CardHeader> <CardContent className = "mt-auto" >
                    <div className = "flex items-center text-sm font-medium text-primary" > {
                      t("go_to_feature")
                    } < ArrowUpRight className = "ml-2 h-4 w-4" / >
                    </div> </CardContent> </Card> </Link>
                  ))
                } </div> </div> </main>
            );
          }