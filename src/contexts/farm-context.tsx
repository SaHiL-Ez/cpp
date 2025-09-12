"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Trees, Sun, Mountain } from "lucide-react";
import type { Feature } from 'geojson';

export type Crop = {
  name: string;
  price: number;
  trend: "up" | "down";
};

export type Weather = {
  temp: string;
  condition: string;
  uvIndex: string;
  uvAlert: string;
  wind: string;
  humidity: string;
};

export type Farm = {
  id: string;
  name: string;
  location: string;
  icon: React.ElementType;
  image: {
    src: string;
    alt: string;
    hint: string;
  };
  crops: Crop[];
  weather: Weather;
  bbox: [number, number, number, number];
  center: [number, number];
  fieldGeoJson: Feature;
};

const farmsData: Farm[] = [
  {
    id: "farm1",
    name: "Green Valley Farms",
    location: "Delhi Test Field",
    icon: Trees,
    image: {
      src: "https://picsum.photos/600/400",
      alt: "Lush green valley with crops",
      hint: "green valley",
    },
    crops: [
      { name: "Grapes", price: 6500, trend: "up" },
      { name: "Onion", price: 2500, trend: "up" },
      { name: "Tomato", price: 1800, trend: "down" },
    ],
    weather: {
      temp: "28°C",
      condition: "Mostly Sunny",
      uvIndex: "High",
      uvAlert: "Use sunscreen.",
      wind: "8 km/h",
      humidity: "60%",
    },
    bbox: [77.1000, 28.6500, 77.1050, 28.6550],
    center: [28.6525, 77.1025],
    fieldGeoJson: {
      "type": "Feature",
      "properties": {
        "name": "demo-field-1"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [77.1000, 28.6500],
            [77.1050, 28.6500],
            [77.1050, 28.6550],
            [77.1000, 28.6550],
            [77.1000, 28.6500]
          ]
        ]
      }
    }
  },
  {
    id: "farm2",
    name: "Sunshine Acres",
    location: "Solapur, Maharashtra",
    icon: Sun,
    image: {
      src: "https://picsum.photos/600/401",
      alt: "Sunny field of sunflowers",
      hint: "sunflower field",
    },
    crops: [
      { name: "Pomegranate", price: 8200, trend: "down" },
      { name: "Jowar", price: 2800, trend: "up" },
      { name: "Tur", price: 9500, trend: "up" },
    ],
    weather: {
      temp: "32°C",
      condition: "Sunny",
      uvIndex: "Very High",
      uvAlert: "Extra protection needed.",
      wind: "12 km/h",
      humidity: "45%",
    },
    bbox: [75.8, 17.6, 75.9, 17.7],
    center: [17.65, 75.85],
    fieldGeoJson: {
      "type": "Feature",
      "properties": { "name": "sunshine-field-1" },
      "geometry": { "type": "Polygon", "coordinates": [[[75.85, 17.65], [75.86, 17.65], [75.86, 17.66], [75.85, 17.66], [75.85, 17.65]]] }
    }
  },
  {
    id: "farm3",
    name: "Mountain View Orchards",
    location: "Kolhapur, Maharashtra",
    icon: Mountain,
    image: {
      src: "https://picsum.photos/601/400",
      alt: "Orchard with mountains in the background",
      hint: "orchard mountain",
    },
    crops: [
      { name: "Sugarcane", price: 3100, trend: "up" },
      { name: "Mango", price: 7500, trend: "down" },
      { name: "Rice", price: 3400, trend: "up" },
    ],
    weather: {
      temp: "26°C",
      condition: "Partly Cloudy",
      uvIndex: "Moderate",
      uvAlert: "Wear sunglasses.",
      wind: "6 km/h",
      humidity: "70%",
    },
    bbox: [74.2, 16.6, 74.3, 16.7],
    center: [16.65, 74.25],
    fieldGeoJson: {
      "type": "Feature",
      "properties": { "name": "mountain-field-1" },
      "geometry": { "type": "Polygon", "coordinates": [[[74.25, 16.65], [74.26, 16.65], [74.26, 16.66], [74.25, 16.66], [74.25, 16.65]]] }
    }
  },
];

interface FarmContextType {
  farms: Farm[];
  selectedFarm: Farm;
  setSelectedFarmById: (id: string) => void;
  addFarm: (farm: Farm) => void;
}

const FarmContext = createContext<FarmContextType | undefined>(undefined);

export const FarmProvider = ({ children }: { children: ReactNode }) => {
  const [farms, setFarms] = useState<Farm[]>(farmsData);
  const [selectedFarm, setSelectedFarm] = useState<Farm>(farmsData[0]);

  const setSelectedFarmById = (id: string) => {
    const farm = farms.find((f) => f.id === id);
    if (farm) {
      setSelectedFarm(farm);
    }
  };

  const addFarm = (farm: Farm) => {
    setFarms((prevFarms) => [...prevFarms, farm]);
  };

  return (
    <FarmContext.Provider
      value={{ farms, selectedFarm, setSelectedFarmById, addFarm }}
    >
      {children}
    </FarmContext.Provider>
  );
};

export const useFarm = (): FarmContextType => {
  const context = useContext(FarmContext);
  if (context === undefined) {
    throw new Error("useFarm must be used within a FarmProvider");
  }
  return context;
};