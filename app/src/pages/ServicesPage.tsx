import { Link } from "react-router-dom";
import { useI18n } from "../i18n";
import { services } from "../mocks/services";
import { ServiceCard } from "../components/services/ServiceCard";

export function ServicesPage() {
  const { t } = useI18n();

  return (
    <section className="space-y-12">
      <header className="flex flex-col gap-6 border-b border-border-subtle pb-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            {t("common.tagline")}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-text-strong sm:text-4xl">
            {t("pages.services.title")}
          </h1>
          <p className="mt-4 text-base text-text-soft leading-relaxed max-w-xl">
            {t("pages.services.description")}
          </p>
        </div>
        <div className="max-w-sm space-y-3 pt-2">
          <p className="text-sm text-text-soft">
            {t("pages.services.introCta.primaryDescription")}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/contato"
              className="inline-flex items-center justify-center rounded-md bg-brand px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/80"
            >
              {t("pages.services.introCta.primaryLabel")}
            </Link>
            <Link
              to="/projetos"
              className="inline-flex items-center justify-center rounded-md border border-border-subtle bg-bg-card px-5 py-2.5 text-sm font-medium text-brand shadow-sm transition-colors hover:bg-bg-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/80"
            >
              {t("pages.services.introCta.secondaryLabel")}
            </Link>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {services.map((service) => (
          <div key={service.id} className="h-full">
            <ServiceCard service={service} />
          </div>
        ))}
      </section>

      <section className="relative overflow-hidden rounded-2xl border border-brand-soft bg-brand-soft/30 px-6 py-12 text-center md:px-12 md:py-16">
        <div className="relative z-10 mx-auto max-w-2xl space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-text-strong sm:text-3xl">
            {t("pages.services.closingCta.eyebrow")}
          </h2>
          <p className="text-base text-text-soft md:text-lg">
            {t("pages.services.closingCta.text")}
          </p>
          <div className="pt-2">
            <Link
              to="/contato"
              className="inline-flex items-center justify-center rounded-lg bg-brand px-8 py-3 text-base font-medium text-white shadow-md transition-all hover:bg-brand-hover hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/80"
            >
              {t("pages.services.closingCta.contactLabel")}
            </Link>
          </div>
        </div>

        {/* Decorative background element */}
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-brand/5 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-brand/5 blur-3xl" />
      </section>
    </section >
  );
}
