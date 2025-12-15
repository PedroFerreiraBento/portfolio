import { useEffect, useId, useRef, useState } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { useI18n } from "../../i18n";
import type { Locale } from "../../i18n";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleSelect = (newLocale: Locale) => {
    setLocale(newLocale);
    setIsOpen(false);
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const languages: { code: Locale; label: string }[] = [
    { code: "pt", label: t("common.language.pt") },
    { code: "en", label: t("common.language.en") },
  ];

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={toggleMenu}
        className="flex items-center gap-2 rounded-md border border-border-subtle bg-bg-card px-3 py-2 text-sm font-medium text-text-soft transition-colors hover:bg-bg-soft hover:text-text-strong focus:outline-none focus:ring-2 focus:ring-brand/50"
        aria-label={t("common.language.label")}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={menuId}
      >
        <Globe size={16} />
        <span className="uppercase">{locale}</span>
        <ChevronDown
          size={14}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          id={menuId}
          role="menu"
          aria-label={t("common.language.label")}
          className="absolute right-0 mt-2 w-40 origin-top-right rounded-md border border-border-subtle bg-bg-card shadow-lg ring-1 ring-black/5 focus:outline-none z-50"
        >
          <div className="py-1">
            {languages.map((lang) => (
              <button
                type="button"
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                role="menuitemradio"
                aria-checked={locale === lang.code}
                className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm hover:bg-bg-soft ${
                  locale === lang.code
                    ? "font-medium text-brand"
                    : "text-text-soft"
                }`}
              >
                {lang.label}
                {locale === lang.code && (
                  <Check size={14} className="text-brand" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
