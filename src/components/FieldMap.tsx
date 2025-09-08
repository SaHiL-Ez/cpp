// src/components/FieldMap.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L, { Map as LeafletMap, LatLngBoundsExpression } from 'leaflet';
import { getNdVIMap } from '@/ai/flows/get-ndvi-map';
import type { Feature, Polygon } from 'geojson';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

type Props = {
  center: [number, number]; // [lat, lon]
  zoom?: number;
  geoJson?: Feature;
  width?: number; // NDVI image width px
  height?: number; // NDVI image height px
  mapId?: string;
};

/**
 * Utility: traverse geometry coordinates and return flattened array of [lon, lat] pairs.
 * Works for Polygon, MultiPolygon, etc.
 */
function extractLonLatPairs(geoJson?: Feature): [number, number][] {
  if (!geoJson) return [];
  const coords: [number, number][] = [];

  function collect(arr: any) {
    if (typeof arr[0] === 'number' && typeof arr[1] === 'number') {
      coords.push([arr[0], arr[1]]);
      return;
    }
    for (const item of arr) collect(item);
  }

  const geom = geoJson.geometry;
  if (!geom) return coords;
  collect((geom as any).coordinates);
  return coords;
}

/** bbox: [minLon, minLat, maxLon, maxLat] */
function bboxFromGeoJson(geoJson?: Feature): [number, number, number, number] | null {
  const pts = extractLonLatPairs(geoJson);
  if (!pts.length) return null;
  const lons = pts.map(p => p[0]);
  const lats = pts.map(p => p[1]);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  return [minLon, minLat, maxLon, maxLat];
}


export default function FieldMap({
  center,
  zoom = 15,
  geoJson,
  width = 512,
  height = 512,
  mapId = 'fieldmap'
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const imageOverlayRef = useRef<L.ImageOverlay | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ensure Leaflet default marker icon assets are available (fix for many bundlers)
  useEffect(() => {
    // only run on client
    try {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
      });
    } catch (e) {
      // ignore if require not available in environment
    }
  }, []);

  // Create / destroy map manually
  useEffect(() => {
    const wrapper = containerRef.current;
    if (!wrapper || mapRef.current) return; // Already initialized or no container

    // If there is an existing Leaflet map attached here — remove it first.
    if ((wrapper as any)._leaflet_id) {
        // This is a bit of a hack, but it's the most reliable way to handle hot-reloads
        wrapper.innerHTML = '';
    }

    const map = L.map(wrapper, {
      center,
      zoom,
    });
    mapRef.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(map);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // Re-run this effect if the mapId changes
  }, [center, zoom, mapId]);


  // Fetch NDVI and update map layers
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !geoJson) return;

    let cancelled = false;

    async function fetchAndUpdate() {
      setLoading(true);
      setError(null);

      try {
        const bbox = bboxFromGeoJson(geoJson);
        if (!bbox) {
            throw new Error("Could not calculate bounding box from GeoJSON.");
        }

        const result = await getNdVIMap({ geometry: geoJson!.geometry as Polygon, bbox });
        if (cancelled) return;
        
        if (!result?.imageUrl) {
          throw new Error('AI flow returned no "imageUrl".');
        }
        
        const [minLon, minLat, maxLon, maxLat] = bbox;
        const bounds: LatLngBoundsExpression = [[minLat, minLon], [maxLat, maxLon]];
        
        // Remove old layers
        if (imageOverlayRef.current) {
            map.removeLayer(imageOverlayRef.current);
        }
        if (geoJsonLayerRef.current) {
            map.removeLayer(geoJsonLayerRef.current);
        }

        // Add new layers
        imageOverlayRef.current = L.imageOverlay(result.imageUrl, bounds, { opacity: 0.7 }).addTo(map);
        geoJsonLayerRef.current = L.geoJSON(geoJson as any, {
            style: {
              color: '#00A3FF',
              weight: 2,
              opacity: 0.9,
              fillOpacity: 0.1,
            },
        }).addTo(map);

        map.fitBounds(bounds);

      } catch (err: any) {
        console.error(err);
        if(!cancelled) setError(err?.message || 'Unknown error fetching NDVI');
      } finally {
        if(!cancelled) setLoading(false);
      }
    }

    fetchAndUpdate();

    return () => {
        cancelled = true;
    }

  }, [geoJson]);

  return (
    <div className="h-full w-full relative">
       {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-[1000] rounded-lg">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">
                  Loading satellite map...
                </p>
            </div>
        )}
       {!loading && error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-[1000] rounded-lg p-8">
              <Alert variant="destructive" className="max-w-md">
                  <AlertTitle>Could Not Load Map</AlertTitle>
                  <AlertDescription>
                      {error}
                  </AlertDescription>
              </Alert>
            </div>
        )}
      <div id={mapId} ref={containerRef} style={{ height: '100%', width: '100%', zIndex: 0 }} className="rounded-lg" />
    </div>
  );
}
