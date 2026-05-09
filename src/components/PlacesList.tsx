import { Loader2 } from "lucide-react";
import { useI18n } from "../localization/i18n";
import type { Place } from "../models/Place";
import { PlaceCard } from "./PlacesCard";

type Props = {
  places: Place[];
  activeId: string | null;
  setActiveId?: any;
  coords?: { lat: number; lon: number } | null;
  loading: boolean;
};

export function PlacesList({
  places,
  activeId,
  setActiveId,
  coords,
  loading,
}: Props) {
  const { t } = useI18n();

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center w-75">
        <span>{t("Loading...")}</span>
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }
  return (
    <div className="overflow-y-auto max-h-[500px] scrollbar">
      {places?.length > 0 ? (
        places?.map((place) => (
          <PlaceCard
            key={place.id}
            place={place}
            active={activeId === place.id}
            onClick={() => setActiveId(place.id)}
            coords={coords}
          />
        ))
      ) : (
        <div className="flex h-full items-center justify-center text-muted-foreground">
          <span>{t("NotFoundData")}</span>
        </div>
      )}
    </div>
  );
}
