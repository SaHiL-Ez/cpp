'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MapPin, Star } from 'lucide-react';
import { useFarm } from '@/contexts/farm-context';

// Interface for the place data returned from our API route
interface Place {
  place_id: string;
  name: string;
  vicinity: string;
  rating?: number;
  user_ratings_total?: number;
  location: {
    lat: number;
    lng: number;
  };
}

// The main component that will be placed on the dashboard
export function StoreLocator() {
  const [stores, setStores] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { selectedFarm } = useFarm(); // Get selected farm for its location

  const fetchStores = async () => {
    // Ensure a farm with a location is selected
    if (!selectedFarm?.center) {
        setError("A farm with a location must be selected first.");
        setLoading(false);
        return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/nearby-places', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lat: selectedFarm.center[0], // Correctly access latitude
          lng: selectedFarm.center[1], // Correctly access longitude
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch nearby stores");
      }

      const data: Place[] = await response.json();
      setStores(data);

    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching stores:", err);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch stores only when the dialog is opened
  useEffect(() => {
    if (isOpen) {
      fetchStores();
    }
  }, [isOpen, selectedFarm]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="text-primary" />
              Find Nearby Stores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Locate nurseries, fertilizer shops, and agricultural stores near your selected farm.
            </p>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-md md:max-w-lg h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Nearby Nurseries & Farming Stores</DialogTitle>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto pr-4 -mr-4">
          {loading ? (
            <p className="text-center text-muted-foreground">Finding stores near your farm...</p>
          ) : error ? (
            <p className="text-center text-red-500">Error: {error}</p>
          ) : stores.length > 0 ? (
            <ul className="space-y-4">
              {stores.map((store) => (
                <li key={store.place_id} className="border-b pb-4 last:border-b-0">
                  <h3 className="font-semibold text-lg">{store.name}</h3>
                  <p className="text-sm text-muted-foreground">{store.vicinity}</p>
                  <div className="flex items-center gap-1 mt-1 text-sm">
                    {store.rating ? (
                      <>
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-bold">{store.rating}</span>
                        <span className="text-muted-foreground">({store.user_ratings_total || 0} reviews)</span>
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground">No rating available</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-muted-foreground">
              No relevant stores found within a 20km radius of your farm.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}