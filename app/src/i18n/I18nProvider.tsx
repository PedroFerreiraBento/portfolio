import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { en } from "./locales/en";
import { pt } from "./locales/pt";
import type { Locale, TranslationDictionary } from "./types";

const I18N_STORAGE_KEY = "caosDomado.locale";

const translations: Record<Locale, TranslationDictionary> = {
  pt,
  en,
};

export type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (path: string) => string;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

function resolvePath(dictionary: TranslationDictionary, path: string): string {
  const segments = path.split(".");
  let current: any = dictionary;

  for (const segment of segments) {
    if (current && typeof current === "object" && segment in current) {
      current = current[segment];
    } else {
      return path;
    }
  }

  return typeof current === "string" ? current : path;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("pt");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(
        I18N_STORAGE_KEY
      ) as Locale | null;
      if (stored === "pt" || stored === "en") {
        setLocaleState(stored);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(I18N_STORAGE_KEY, next);
    } catch {
      // ignore storage errors
    }
  };

  const value = useMemo<I18nContextValue>(() => {
    const dictionary = translations[locale];

    const t = (path: string) => resolvePath(dictionary, path);

    return {
      locale,
      setLocale,
      t,
    };
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18nContext() {
  const ctx = useContext(I18nContext);

  if (!ctx) {
    throw new Error("useI18nContext must be used within an I18nProvider");
  }

  return ctx;
}
