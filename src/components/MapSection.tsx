import { Suspense } from "react";
import { PlacesMap } from "./PlacesMap";
import { Loader2 } from "lucide-react";
import type { Place } from "../models/Place";

type Props = {
  coords: { lat: number; lon: number } | null;
  mounted: boolean;
  places: Place[];
  activeId: string | null;
  setActiveId: (id: string) => void;
  loading:boolean
};

export function MapSection({
  coords,
  mounted,
  places,
  activeId,
  setActiveId,
  loading
}: Props) {
  return (
    <main className="relative flex-1 min-h-100 mx-1.5 w-75%">
      {mounted && coords ? (
        <Suspense
          fallback={
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          }
        >
          <PlacesMap
            center={coords}
            places={places}
            activeId={activeId}
            setActiveId={setActiveId}
            loading={loading}
          />
        </Suspense>
      ) : (
        <div className="flex h-full items-center justify-center text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      )}
    </main>
  );
}