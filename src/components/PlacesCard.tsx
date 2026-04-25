import { MapPin, Phone, Globe, Navigation } from "lucide-react";
import { useI18n } from "../localization/i18n";
import type { Place } from "../models/Place";
import { cn } from "../utils/cn";
import { categories } from "./CategoriesConfig";

type Props = {
  place: Place;
  active: boolean;
  onClick: () => void;
  coords: { lat: number; lon: number } | null | undefined;
};

export function PlaceCard({ place, active, onClick, coords }: Props) {
  const { t, lang } = useI18n();
  let Icon = categories[place.category]?.icon;
  const from = { lat: coords?.lat, lon: coords?.lon };
  const to = { lat: place.lat, lon: place.lon };

  const directionsUrl = `https://www.openstreetmap.org/directions?from=${from.lat}%2C${from.lon}&to=${to.lat}%2C${to.lon}`;
  return (
    <div className="md:w-75 my-1.5">
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "w-full text-start group relative overflow-hidden rounded-xl border bg-card p-4 transition-[transform,box-shadow,border-color] duration-300",
          "hover:-translate-y-0.5 hover:border-primary/40",
          active && "border-primary ring-2 ring-primary/20 -translate-y-0.5",
        )}
      >
        <div className="flex items-start gap-3">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white"
            style={{ background: categories[place.category]?.color }}
          >
            <Icon className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="truncate font-semibold text-foreground">
                {place.name}
              </h3>
              <span className="shrink-0 text-xs font-medium text-primary">
                {place.distanceKm < 1
                  ? `${Math.round(place.distanceKm * 1000)} m`
                  : `${place.distanceKm.toFixed(1)} ${t("km")}`}
              </span>
            </div>

            {place.address && (
              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">{place.address}</span>
              </div>
            )}

            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {place.cuisine && (
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
                  {place.cuisine}
                </span>
              )}
              {place.stars && (
                <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-medium text-accent-foreground">
                  ★ {place.stars}
                </span>
              )}
            </div>

            <div className="mt-3 flex items-center gap-3 text-xs">
              {place.phone && (
                <a
                  href={`tel:${place.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="h-3 w-3" />
                  <span dir={lang === "ar" ? "ltr" : undefined}>
                    {place.phone}
                  </span>
                </a>
              )}
              {place.website && (
                <a
                  href={place.website}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Globe className="h-3 w-3" />
                  <span>web</span>
                </a>
              )}
              <a
                href={directionsUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="ms-auto flex items-center gap-1 font-medium text-primary hover:underline"
              >
                <Navigation className="h-3 w-3" />
                {t("directions")}
              </a>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}
