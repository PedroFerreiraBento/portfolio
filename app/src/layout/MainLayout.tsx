import { Suspense, useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { LanguageSwitcher } from "../components/common/LanguageSwitcher";
import { ThemeToggle } from "../components/common/ThemeToggle";
import { WhatsAppButton } from "../components/common/WhatsAppButton";
import { useI18n } from "../i18n";

const navLinkBase =
  "relative inline-flex items-center px-2 py-1 text-sm font-medium text-text-soft transition-colors";
const navLinkActive =
  "text-text-strong after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-brand";
const navLinkInactive = "hover:text-brand";

export function MainLayout() {
  const { t, locale } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const loadingLabel = locale === "pt" ? "Carregando…" : "Loading…";
  const mobileNavLabel = mobileOpen
    ? locale === "pt"
      ? "Fechar navegação"
      : "Close navigation"
    : locale === "pt"
      ? "Abrir navegação"
      : "Open navigation";
  const mobileMenuLabel = mobileOpen
    ? locale === "pt"
      ? "Fechar menu"
      : "Close menu"
    : locale === "pt"
      ? "Abrir menu"
      : "Open menu";

  const navItems = [
    { to: "/", labelKey: "nav.home" },
    { to: "/projetos", labelKey: "nav.projects" },
    { to: "/servicos", labelKey: "nav.services" },
    { to: "/blog", labelKey: "nav.blog" },
    { to: "/sobre", labelKey: "nav.about" },
    { to: "/contato", labelKey: "nav.contact" },
  ];

  const toggleMobile = () => setMobileOpen((open) => !open);
  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <div className="flex min-h-screen flex-col bg-bg-page text-text-strong antialiased transition-colors duration-300">
      <WhatsAppButton />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-bg-card focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-text-strong focus:shadow"
      >
        {locale === "pt" ? "Pular para o conteúdo" : "Skip to content"}
      </a>
      {/* HEADER */}
      <header
        className={`sticky top-0 z-40 border-b border-border-subtle bg-bg-card/80 backdrop-blur transition-all duration-300 ${isScrolled ? "is-scrolled" : ""
          }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo + título */}
          <div className="flex items-center gap-3 pl-4 sm:pl-0">
            <NavLink to="/" className="group flex items-center gap-2">
              <img
                src="/logo.png"
                alt={t("common.brandName")}
                className="h-9 w-auto"
                decoding="async"
                loading="eager"
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold tracking-tight text-text-strong group-hover:text-brand">
                  {t("common.brandName")}
                </span>
                <span className="hidden text-[0.7rem] font-medium text-text-muted sm:inline">
                  {t("common.headerSubtitle")}
                </span>
              </div>
            </NavLink>
          </div>

          {/* Navegação desktop */}
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive}`
                }
              >
                {t(item.labelKey)}
              </NavLink>
            ))}
          </nav>

          {/* Ações (idioma + tema + menu mobile) */}
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-3 md:flex">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle />
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border-subtle bg-bg-card text-text-soft shadow-sm hover:bg-bg-soft"
                onClick={toggleMobile}
                aria-label={mobileNavLabel}
                aria-controls="mobile-navigation"
                aria-expanded={mobileOpen}
              >
                <span className="sr-only">{mobileMenuLabel}</span>
                {mobileOpen ? (
                  <X className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Menu className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Navegação mobile */}
        {mobileOpen && (
          <div
            id="mobile-navigation"
            className="border-t border-border-subtle bg-bg-card/95 px-4 pb-4 pt-2 shadow-sm md:hidden"
          >
            <nav className="flex flex-col gap-1 text-sm">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      "flex items-center justify-between rounded-md px-4 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-brand-soft text-brand"
                        : "text-text-soft hover:bg-bg-soft hover:text-brand",
                    ].join(" ")
                  }
                  onClick={closeMobileMenu}
                >
                  {t(item.labelKey)}
                </NavLink>
              ))}
            </nav>
            <div className="mt-3 border-t border-border-subtle px-4 pt-3">
              <LanguageSwitcher />
            </div>
          </div>
        )}
      </header>

      {/* MAIN */}
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 bg-gradient-to-b from-bg-page to-bg-soft"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-border-subtle bg-bg-card/90 shadow-sm shadow-slate-200/70 backdrop-blur-sm">
            <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
              <Suspense
                fallback={
                  <div
                    className="py-12 text-center text-sm text-text-muted"
                    role="status"
                    aria-live="polite"
                  >
                    {loadingLabel}
                  </div>
                }
              >
                <Outlet />
              </Suspense>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border-subtle bg-bg-card/90">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-text-muted sm:flex-row sm:px-6 lg:px-8">
          <small className="text-[0.7rem]">
            © {new Date().getFullYear()} {t("common.brandName")}
          </small>
          <span className="text-[0.7rem] uppercase tracking-[0.18em] text-text-muted">
            {t("common.brandName")} · {t("common.footerTagline")}
          </span>
        </div>
      </footer>
    </div>
  );
}
