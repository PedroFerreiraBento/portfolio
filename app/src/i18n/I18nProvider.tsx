import { useEffect, useMemo, useState, type ReactNode } from "react";
import { en } from "./locales/en";
import { pt } from "./locales/pt";
import { I18nContext, type I18nContextValue } from "./I18nContext";
import type { Locale, TranslationDictionary } from "./types";

const I18N_STORAGE_KEY = "caosDomado.locale";

const translations: Record<Locale, TranslationDictionary> = {
  pt,
  en,
};

function resolvePath(dictionary: TranslationDictionary, path: string): string {
  const segments = path.split(".");
  let current: unknown = dictionary;

  for (const segment of segments) {
    if (current && typeof current === "object") {
      const record = current as Record<string, unknown>;
      if (segment in record) {
        current = record[segment];
        continue;
      }
    }

    return path;
  }

  return typeof current === "string" ? current : path;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    try {
      const stored = window.localStorage.getItem(
        I18N_STORAGE_KEY
      ) as Locale | null;
      if (stored === "pt" || stored === "en") {
        return stored;
      }
    } catch {
      // ignore storage errors
    }

    return "pt";
  });

  useEffect(() => {
    const lang = locale === "pt" ? "pt-BR" : "en";
    document.documentElement.lang = lang;
  }, [locale]);

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
