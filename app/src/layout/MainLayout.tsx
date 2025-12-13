import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { LanguageSwitcher } from "../components/common/LanguageSwitcher";
import { useI18n } from "../i18n";
import logoImage from "../assets/images/logo.png";

const navLinkBase =
  "relative inline-flex items-center px-2 py-1 text-sm font-medium text-text-soft transition-colors";
const navLinkActive =
  "text-text-strong after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-brand";
const navLinkInactive = "hover:text-brand";

export function MainLayout() {
  const { t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { to: "/", labelKey: "nav.home" },
    { to: "/projetos", labelKey: "nav.projects" },
    { to: "/servicos", labelKey: "nav.services" },
    { to: "/sobre", labelKey: "nav.about" },
    { to: "/contato", labelKey: "nav.contact" },
  ];

  const toggleMobile = () => setMobileOpen((open) => !open);
  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <div className="flex min-h-screen flex-col bg-bg-page text-text-strong antialiased">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-border-subtle bg-bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo + título */}
          <div className="flex items-center gap-3">
            <NavLink to="/" className="group flex items-center gap-2">
              <img
                src={logoImage}
                alt={t("common.brandName")}
                className="h-9 w-auto"
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

          {/* Ações (idioma + menu mobile) */}
          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border-subtle bg-bg-card text-text-soft shadow-sm hover:bg-bg-soft md:hidden"
              onClick={toggleMobile}
              aria-label={mobileOpen ? "Fechar navegação" : "Abrir navegação"}
            >
              <span className="sr-only">
                {mobileOpen ? "Fechar menu" : "Abrir menu"}
              </span>
              {mobileOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Navegação mobile */}
        {mobileOpen && (
          <div className="border-t border-border-subtle bg-bg-card/95 px-4 pb-4 pt-2 shadow-sm md:hidden">
            <nav className="flex flex-col gap-1 text-sm">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      "flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
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
            <div className="mt-3 border-t border-border-subtle pt-3">
              <LanguageSwitcher />
            </div>
          </div>
        )}
      </header>

      {/* MAIN */}
      <main className="flex-1 bg-gradient-to-b from-bg-page to-bg-soft">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-border-subtle bg-bg-card/90 shadow-sm shadow-slate-200/70 backdrop-blur-sm">
            <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
              <Outlet />
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
