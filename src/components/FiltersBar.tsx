import { useI18n } from "../localization/i18n";
import { cn } from "../utils/cn";
import { categories } from "./CategoriesConfig";

type Props = {
  query: string;
  setQuery: (v: string) => void;
  filter: string;
  setFilter: (v: any) => void;
  radius: number;
  setRadius: (v: number) => void;
  counts: Record<string, number>;
  onRefresh: () => void;
  loading: boolean;
  coords: any;
};

export function FiltersBar({
  query,
  setQuery,
  filter,
  setFilter,
  radius,
  setRadius,
  counts,
  onRefresh,
  loading,
  coords,
}: Props) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-3 px-4 pb-3 md:flex-row md:items-center">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("search")}
        className="flex-1 rounded-xl border px-3 py-2 text-sm outline-none focus:border-primary"
      />

      {/* CATEGORIES */}
      <div className="flex gap-2 flex-wrap">
        {Object.entries(categories).map(([key, c]) => {
          const Icon = c.icon;

          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={cn(
                "flex items-center cursor-pointer gap-1 rounded-full border px-3 py-1.5 text-xs transition whitespace-nowrap",
                filter === key
                  ? "bg-cyan-600 text-black"
                  : "bg-background hover:border-primary/40",
              )}
            >
              <Icon className="h-3.5 w-3.5" />

              <span>{t(c.label)}</span>

              <span className="ml-1 rounded-full bg-muted px-1.5 text-[10px] bg-blue-400 text-white">
                {counts[key] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex gap-1">
        {[1, 2, 5, 10].map((r) => (
          <button
            key={r}
            onClick={() => setRadius(r)}
            className={cn(
              "rounded-md px-2 py-1 text-xs border cursor-pointer",
              radius === r
                ? "bg-cyan-600 text-black"
                : "bg-background hover:border-primary/40",
            )}
          >
            {r} km
          </button>
        ))}
      </div>

      <button
        onClick={onRefresh}
        disabled={loading || !coords}
        className="rounded-lg border px-3 py-1 text-xs hover:bg-primary disabled:opacity-50 cursor-pointer"
      >
        {t("refresh")}
      </button>
    </div>
  );
}
