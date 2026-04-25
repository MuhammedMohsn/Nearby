// hooks/useNearbyPlaces.ts
import { useEffect, useMemo, useState } from "react";
import type { Place } from "../models/Place";
import type { PlaceCategory } from "../models/PlaceCategory";
import { fetchNearbyPlaces } from "../services/places";


type Filter = "all" | PlaceCategory;

export function useNearbyPlaces(
  coords: { lat: number; lon: number } | null,
  radius: number,
) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!coords) return;
    setLoading(true);
    setError(null);

    try {
      const data = await fetchNearbyPlaces(coords.lat, coords.lon, radius);
      setPlaces(data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [coords?.lat, coords?.lon, radius]);

  const getFiltered = (filter: Filter, query: string) =>
    places.filter((p) => {
      if (filter !== "all" && p.category !== filter) return false;
      if (query && !p.name.toLowerCase().includes(query.toLowerCase()))
        return false;
      return true;
    });

  const counts = useMemo(() => {
    const c: Record<string, number> = {
      all: places.length,
      hotel: 0,
      restaurant: 0,
      cafe: 0,
    };
    places.forEach((p) => (c[p.category] = (c[p.category] ?? 0) + 1));
    return c;
  }, [places]);

  return { places, loading, error, load, getFiltered, counts };
}
