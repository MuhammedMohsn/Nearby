import { Hotel, UtensilsCrossed, Coffee, MapPin } from "lucide-react";
import type { PlaceCategory } from "../models/PlaceCategory";

export const categories = {
  all: {
    label: "all",
    icon: MapPin,
    color: "rgb(76, 135, 166)",
  },
  hotel: {
    label: "hotels",
    icon: Hotel,
    color: "rgb(74, 140, 150)",
  },
  restaurant: {
    label: "restaurants",
    icon: UtensilsCrossed,
    color: "rgb(230, 190, 60)",
  },
  cafe: {
    label: "cafes",
    icon: Coffee,
    color: "rgb(200, 70, 120)",
  },
} as const satisfies Record<
  PlaceCategory | "all",
  {
    label: string;
    icon: any;
    color: string;
  }
>;