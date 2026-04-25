import type { PlaceCategory } from "./PlaceCategory";

export type Place = {
  id: string;
  name: string;
  category: PlaceCategory;
  lat: number;
  lon: number;
  address?: string;
  cuisine?: string;
  stars?: string;
  phone?: string;
  website?: string;
  distanceKm: number;
};