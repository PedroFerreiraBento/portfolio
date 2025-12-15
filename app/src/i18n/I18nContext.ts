import { createContext, useContext } from "react";
import type { Locale } from "./types";

export type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (path: string) => string;
};

export const I18nContext = createContext<I18nContextValue | undefined>(
  undefined
);

export function useI18nContext() {
  const ctx = useContext(I18nContext);

  if (!ctx) {
    throw new Error("useI18nContext must be used within an I18nProvider");
  }

  return ctx;
}
