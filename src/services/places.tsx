import axios from "axios";
import type { Place } from "../models/Place";
import type { PlaceCategory } from "../models/PlaceCategory";

type OverpassElement = {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

type OverpassResponse = { elements: OverpassElement[] };

const ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];

export function haversineKm(
  a: { lat: number; lon: number },
  b: { lat: number; lon: number }
) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;

  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);

  return 2 * R * Math.asin(Math.sqrt(x));
}

function categorize(tags: Record<string, string>): PlaceCategory | null {
  if (
    tags.tourism === "hotel" ||
    tags.tourism === "guest_house" ||
    tags.tourism === "hostel"
  )
    return "hotel";

  if (tags.amenity === "restaurant" || tags.amenity === "fast_food")
    return "restaurant";

  if (tags.amenity === "cafe") return "cafe";

  return null;
}

export async function fetchNearbyPlaces(
  lat: number,
  lon: number,
  radiusKm: number
): Promise<Place[]> {
  const r = Math.round(radiusKm * 1000);

  const query = `
    [out:json][timeout:25];
    (
      node["tourism"~"^(hotel|guest_house|hostel)$"](around:${r},${lat},${lon});
      way["tourism"~"^(hotel|guest_house|hostel)$"](around:${r},${lat},${lon});
      node["amenity"~"^(restaurant|fast_food|cafe)$"](around:${r},${lat},${lon});
      way["amenity"~"^(restaurant|fast_food|cafe)$"](around:${r},${lat},${lon});
    );
    out center tags 100;
  `;

  let lastErr: unknown;

  for (const url of ENDPOINTS) {
    try {
      const res = await axios.post<OverpassResponse>(
        url,
        query,
        {
          headers: {
            "Content-Type": "text/plain",
          },
        }
      );

      return mapElements(res.data.elements, lat, lon);
    } catch (e) {
      lastErr = e;
    }
  }

  throw lastErr ?? new Error("Failed to fetch places");
}

function mapElements(
  elements: OverpassElement[],
  userLat: number,
  userLon: number
): Place[] {
  const places: Place[] = [];

  for (const el of elements) {
    const tags = el.tags ?? {};

    const name = tags.name || tags["name:en"] || tags["name:ar"];
    if (!name) continue;

    const cat = categorize(tags);
    if (!cat) continue;

    const lat = el.lat ?? el.center?.lat;
    const lon = el.lon ?? el.center?.lon;

    if (lat == null || lon == null) continue;

    places.push({
      id: `${el.type}-${el.id}`,
      name,
      category: cat,
      lat,
      lon,
      address:
        [tags["addr:street"], tags["addr:city"]]
          .filter(Boolean)
          .join(", ") || undefined,
      cuisine: tags.cuisine,
      stars: tags.stars,
      phone: tags.phone || tags["contact:phone"],
      website: tags.website || tags["contact:website"],
      distanceKm: haversineKm(
        { lat: userLat, lon: userLon },
        { lat, lon }
      ),
    });
  }

  return places.sort((a, b) => a.distanceKm - b.distanceKm);
}