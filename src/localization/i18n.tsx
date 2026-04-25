import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import en from "./locales/en.json";
import ar from "./locales/ar.json";
export type Lang = "en" | "ar";

const dict = {
  en,
  ar,
} as const;

type Dict = typeof dict.en;

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof Dict) => string;
  dir: "ltr" | "rtl";
};

const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", lang);
  }, [lang]);

  const t = (key: keyof Dict) => dict[lang][key];

  return (
    <I18nContext.Provider
      value={{ lang, setLang, t, dir: lang === "ar" ? "rtl" : "ltr" }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}
