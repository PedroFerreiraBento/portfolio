import { Link } from "react-router-dom";
import { useI18n } from "../i18n";
import { services } from "../mocks/services";
import { ServiceCard } from "../components/services/ServiceCard";
import { ScrollReveal } from "../components/common/ScrollReveal";
import { Seo } from "../components/common/Seo";

export function ServicesPage() {
  const { t } = useI18n();

  return (
    <div className="hp-root">
      <Seo
        title={t("nav.services")}
        description={t("pages.services.description")}
      />
      <section className="hp-section space-y-12">
        <ScrollReveal width="100%">
          <header className="flex flex-col gap-6 border-b border-border-subtle pb-8 sm:flex-row sm:items-start sm:justify-between services-header-visual">
            <div className="max-w-2xl">
              <p className="hp-section-eyebrow !text-left">
                {t("common.tagline")}
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-text-strong sm:text-4xl">
                {t("pages.services.title")}
              </h1>
              <p className="mt-4 text-base text-text-secondary leading-relaxed max-w-xl">
                {t("pages.services.description")}
              </p>
            </div>
            <div className="max-w-sm space-y-3 pt-2">
              <p className="text-sm text-text-secondary">
                {t("pages.services.introCta.primaryDescription")}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/contato"
                  className="hp-btn-primary"
                >
                  {t("pages.services.introCta.primaryLabel")}
                </Link>
                <Link
                  to="/projetos"
                  className="hp-btn-outline"
                >
                  {t("pages.services.introCta.secondaryLabel")}
                </Link>
              </div>
            </div>
          </header>
        </ScrollReveal>

        <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {services.map((service, index) => (
            <ScrollReveal key={service.id} delay={index * 0.1}>
              <ServiceCard service={service} />
            </ScrollReveal>
          ))}
        </section>

        <ScrollReveal width="100%">
          <section className="services-closing-cta relative overflow-hidden rounded-2xl border px-6 py-12 text-center md:px-12 md:py-16">
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
                  className="hp-btn-primary px-8 py-3"
                >
                  {t("pages.services.closingCta.contactLabel")}
                </Link>
              </div>
            </div>

            {/* Decorative background element */}
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-brand/5 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-brand/5 blur-3xl" />
          </section>
        </ScrollReveal>
      </section>
    </div>
  );
}
