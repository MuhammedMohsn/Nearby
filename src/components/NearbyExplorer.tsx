import { useEffect, useMemo, useState } from "react";
import { useGeolocation } from "../hooks/useGeoLocation";
import { useI18n } from "../localization/i18n";
import type { PlaceCategory } from "../models/PlaceCategory";
import { useNearbyPlaces } from "../hooks/useNearbyPlaces";
import { FiltersBar } from "./FiltersBar";
import { PlacesList } from "./PlacesList";
import { MapSection } from "./MapSection";

export function NearbyExplorer() {
  const { t, lang, setLang } = useI18n();
  const { coords, loading: locLoading, error: locError } = useGeolocation();

  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | PlaceCategory>("all");
  const [radius, setRadius] = useState(2);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  const { places, loading, error, load, getFiltered, counts } = useNearbyPlaces(
    coords,
    radius,
  );

  const filtered = useMemo(
    () => getFiltered(filter, query),
    [places, filter, query],
  );

  return (
    <div className="flex flex-col">
      <header>
        <button onClick={() => setLang(lang === "en" ? "ar" : "en")}>
          {t("toggleLang")}
        </button>

        <FiltersBar
          query={query}
          setQuery={setQuery}
          filter={filter}
          setFilter={setFilter}
          radius={radius}
          setRadius={setRadius}
          counts={counts}
          onRefresh={load}
          loading={loading}
          coords={coords}
        />
      </header>

      <div className="flex flex-1">
        <PlacesList
          places={filtered}
          activeId={activeId}
          setActiveId={setActiveId}
          coords={coords}
          loading={loading}
        />

        <MapSection
          coords={coords}
          mounted={mounted}
          places={filtered}
          activeId={activeId}
          setActiveId={setActiveId}
          loading={loading}
        />
      </div>
    </div>
  );
}
