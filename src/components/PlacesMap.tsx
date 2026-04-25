import { useEffect, useMemo, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  CircleMarker,
} from "react-leaflet";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { Hotel, UtensilsCrossed, Coffee } from "lucide-react";
import { useI18n } from "../localization/i18n";
import type { PlaceCategory } from "../models/PlaceCategory";
import type { Place } from "../models/Place";
import { categories } from "./CategoriesConfig";
import { cn } from "../utils/cn";

const iconFor: Record<PlaceCategory, typeof Hotel> = {
  hotel: Hotel,
  restaurant: UtensilsCrossed,
  cafe: Coffee,
};

function buildIcon(category: PlaceCategory, active: boolean) {
  const Icon = iconFor[category];
  const color = categories[category].color;
  const size = active ? 44 : 36;
  const html = renderToStaticMarkup(
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50% 50% 50% 0",
        background: color,
        transform: "rotate(-45deg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: active
          ? "0 8px 24px -4px rgba(0,0,0,0.35), 0 0 0 4px rgba(255,255,255,0.9)"
          : "0 4px 12px -2px rgba(0,0,0,0.3), 0 0 0 3px rgba(255,255,255,0.85)",
        border: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <div className={cn("rotate-45", "text-white", "flex")}>
        <Icon size={size * 0.45} strokeWidth={2.4} />
      </div>
    </div>,
  );
  return L.divIcon({
    html,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

function FlyTo({
  lat,
  lon,
  zoom = 16,
}: {
  lat: number | null;
  lon: number | null;
  zoom?: number;
}) {
  const map = useMap();
  useEffect(() => {
    if (lat != null && lon != null) {
      map.flyTo([lat, lon], zoom, { duration: 0.8 });
    }
  }, [lat, lon, zoom, map]);
  return null;
}

type Props = {
  center: { lat: number; lon: number };
  places: Place[];
  activeId: string | null;
  setActiveId: (id: string) => void;
  loading: boolean;
};

export function PlacesMap({
  center,
  places,
  activeId,
  setActiveId,
  loading,
}: Props) {
  const { t } = useI18n();
  const markerRefs = useRef<Record<string, L.Marker | null>>({});

  const active = useMemo(
    () => places.find((p) => p.id === activeId) ?? null,
    [places, activeId],
  );

  useEffect(() => {
    if (activeId && markerRefs.current[activeId]) {
      markerRefs.current[activeId]?.openPopup();
    }
  }, [activeId]);

  return (
    <>
      <div className="relative h-full w-full">
        {loading && (
          <div className="absolute inset-0 z-1000 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-white border-t-transparent" />
          </div>
        )}
        <MapContainer
          center={[center.lat, center.lon]}
          zoom={15}
          scrollWheelZoom
          className="h-full w-full"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <CircleMarker
            center={[center.lat, center.lon]}
            radius={10}
            pathOptions={{
              color: "white",
              weight: 3,
              fillColor: "oklch(0.55 0.13 195)",
              fillOpacity: 1,
            }}
          >
            <Popup>{t("yourLocation")}</Popup>
          </CircleMarker>

          {places.map((p) => (
            <Marker
              key={p.id}
              position={[p.lat, p.lon]}
              icon={buildIcon(p.category, p.id === activeId)}
              ref={(ref) => {
                markerRefs.current[p.id] = ref;
              }}
              eventHandlers={{ click: () => setActiveId(p.id) }}
            >
              <Popup>
                <div className="min-w-50">
                  <div className="font-semibold text-foreground">{p.name}</div>
                  {p.address && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {p.address}
                    </div>
                  )}
                  <div className="text-xs mt-2 text-primary font-medium">
                    {p.distanceKm.toFixed(2)} km {t("away")}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          <FlyTo
            lat={active?.lat ?? null}
            lon={active?.lon ?? null}
            zoom={17}
          />
        </MapContainer>
      </div>
    </>
  );
}
