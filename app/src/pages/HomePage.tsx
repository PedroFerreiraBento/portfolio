import { Link } from "react-router-dom";
import { useI18n } from "../i18n";
import { Seo } from "../components/common/Seo";
import { ScrollReveal } from "../components/common/ScrollReveal";
import { categories } from "../mocks/categories";
import { projects } from "../mocks/projects";
import { testimonials } from "../mocks/testimonials";
import heroImage from "../assets/images/components/heroImageUrl.png";
import catProdutosDigitais from "../assets/images/components/categoryImages_cat-produtos-digitais.png";
import catDataScience from "../assets/images/components/categoryImages_cat-data-science.png";
import catDashboards from "../assets/images/components/categoryImages_cat-dashboards.png";
import fallbackProjectImg from "../assets/images/external/fallback-project.jpg";

export function HomePage() {
  const { t, locale } = useI18n();

  const orderedCategories = [...categories].sort((a, b) => a.order - b.order);
  const highlightedProject = projects.find((project) => project.highlight);
  const landingProject = projects.find(
    (project) => project.id === "proj-landing-saas-b2b"
  );
  const dashboardProject = projects.find(
    (project) => project.id === "proj-dashboard-operacao-logistica"
  );
  const primaryTestimonial = testimonials[0];

  const categoryImages: Record<string, string> = {
    "cat-produtos-digitais": catProdutosDigitais,
    "cat-data-science": catDataScience,
    "cat-dashboards": catDashboards,
  };

  const heroImageUrl = heroImage;

  return (
    <section className="space-y-12">
      <Seo />
      {/* HERO MAIS VISUAL */}
      <header className="grid gap-8 border-b border-border-subtle pb-8 md:grid-cols-[minmax(0,3fr)_minmax(0,2.2fr)] md:items-center">
        <ScrollReveal className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">
            {t("common.tagline")}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-text-strong md:text-4xl">
            {t("home.hero.title")}
          </h1>
          <p className="text-sm text-text-soft md:text-base">
            {t("home.hero.subtitle")}
          </p>
          <div className="flex flex-wrap gap-2 text-[0.7rem] text-text-muted">
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              <span>{t("home.hero.pill1")}</span>
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              <span>{t("home.hero.pill2")}</span>
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-3">
            <Link
              to="/projetos"
              className="inline-flex items-center justify-center rounded-md bg-brand px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/80"
            >
              {t("home.hero.ctaPrimary")}
            </Link>
            <Link
              to="/contato"
              className="inline-flex items-center justify-center rounded-md border border-brand bg-brand-soft px-4 py-2 text-sm font-medium text-brand shadow-sm hover:bg-brand-soft/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/80"
            >
              {t("home.hero.ctaContact")}
            </Link>
          </div>
        </ScrollReveal>
        <div className="md:justify-self-end">
          <ScrollReveal direction="left" delay={0.2} className="overflow-hidden rounded-xl border border-border-subtle bg-bg-soft shadow-sm">
            <img
              src={heroImageUrl}
              alt={t("home.hero.imageAlt")}
              className="h-56 w-full object-cover sm:h-64 md:h-72"
              decoding="async"
              loading="eager"
              fetchPriority="high"
            />
          </ScrollReveal>
        </div>
      </header>

      {/* TIPOS DE PROJETO (CATEGORIAS) */}
      <section className="space-y-4">
        <header className="flex items-baseline justify-between gap-3">
          <ScrollReveal>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                {t("home.sections.categoriesEyebrow")}
              </p>
              <h2 className="mt-1 text-sm font-semibold text-text-strong">
                {t("home.sections.categoriesTitle")}
              </h2>
            </div>
          </ScrollReveal>
          <Link
            to="/projetos"
            className="hidden rounded-md border border-brand bg-bg-card px-3 py-1 text-[0.7rem] font-medium text-brand shadow-sm hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/80 sm:inline-flex sm:items-center"
          >
            {t("home.sections.categoriesSeePortfolio")}
          </Link>
        </header>
        <div className="grid gap-4 sm:grid-cols-3">
          {orderedCategories.map((category, index) => (
            <ScrollReveal key={category.id} delay={index * 0.1}>
              <Link
                to="/projetos"
                className="block group overflow-hidden rounded-xl border border-border-subtle bg-bg-card/90 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative h-28 w-full overflow-hidden bg-bg-soft">
                  <img
                    src={categoryImages[category.id]}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-[1.03]"
                    decoding="async"
                    loading="lazy"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-text-strong/80 via-text-strong/15 to-transparent" />
                </div>
                <div className="p-3 text-xs">
                  <p className="font-semibold text-text-strong">
                    {category.name}
                  </p>
                  <p className="mt-1 line-clamp-2 text-[0.7rem] text-text-soft">
                    {category.description}
                  </p>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ALGUNS EXEMPLOS DE PROJETOS */}
      <section className="space-y-4">
        <header className="flex items-baseline justify-between gap-3">
          <ScrollReveal>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                {t("home.sections.examplesEyebrow")}
              </p>
              <h2 className="mt-1 text-sm font-semibold text-text-strong">
                {t("home.sections.examplesTitle")}
              </h2>
            </div>
          </ScrollReveal>
          <Link
            to="/projetos"
            className="inline-flex items-center rounded-md border border-brand bg-bg-card px-3 py-1 text-[0.7rem] font-medium text-brand shadow-sm hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/80"
          >
            {t("home.sections.examplesSeeCatalog")}
          </Link>
        </header>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              project: highlightedProject,
              badge: t("home.sections.examplesHighlightedBadge"),
              badgeColor: "text-brand",
              hasDot: true,
              buttonLabel: t("home.sections.examplesHighlightedLinkLabel"),
            },
            {
              project: landingProject,
              badge: landingProject
                ? t(`projectContent.${landingProject.id}.client`)
                : "",
              badgeColor: "text-text-muted",
              hasDot: false,
              buttonLabel: t("pages.projects.card.viewDetails"),
            },
            {
              project: dashboardProject,
              badge: dashboardProject
                ? t(`projectContent.${dashboardProject.id}.client`)
                : "",
              badgeColor: "text-text-muted",
              hasDot: false,
              buttonLabel: t("pages.projects.card.viewDetails"),
            },
          ].map(
            (card, index) =>
              card.project && (
                <ScrollReveal
                  key={card.project.id}
                  delay={index * 0.1}
                  className="flex flex-col overflow-hidden rounded-xl border border-border-subtle bg-bg-card/90 shadow-sm"
                >
                  <article className="flex h-full flex-col">
                    <div className="h-32 w-full overflow-hidden bg-bg-soft">
                      <img
                        src={
                          card.project.thumbnail ||
                          fallbackProjectImg
                        }
                        alt={t(`projectContent.${card.project.id}.title`)}
                        className="h-full w-full object-cover"
                        decoding="async"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-2 p-3 text-xs">
                      <p
                        className={`inline-flex items-center gap-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] ${card.badgeColor}`}
                      >
                        {card.hasDot && (
                          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                        )}
                        {card.badge}
                      </p>
                      <h3 className="text-sm font-semibold text-text-strong">
                        {t(`projectContent.${card.project.id}.title`)}
                      </h3>
                      <p className="line-clamp-3 text-[0.7rem] text-text-soft">
                        {t(`projectContent.${card.project.id}.subtitle`)}
                      </p>
                      <Link
                        to={`/projetos/${card.project.slug}`}
                        className="mt-auto inline-flex items-center rounded-md border border-border-strong bg-bg-card px-3 py-1 text-[0.7rem] font-medium text-brand shadow-sm hover:bg-bg-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/80"
                      >
                        {card.buttonLabel}
                      </Link>
                    </div>
                  </article>
                </ScrollReveal>
              )
          )}
        </div>
      </section>

      {/* FAIXA DE DEPOIMENTO ENXUTA */}
      {primaryTestimonial && (
        <section className="rounded-xl border border-border-subtle bg-bg-card/90 px-4 py-4 text-xs text-text-soft shadow-sm md:px-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p className="md:max-w-xl">“{primaryTestimonial.quote[locale]}”</p>
            <div className="flex flex-col items-start gap-1 text-[0.7rem] text-text-soft md:items-end">
              <span className="font-semibold text-text-strong">
                {primaryTestimonial.authorName}
              </span>
              <span>
                {primaryTestimonial.authorRole}
                {primaryTestimonial.company
                  ? `, ${primaryTestimonial.company}`
                  : ""}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* CTA FINAL SIMPLES */}
      <section className="rounded-xl border border-brand-soft bg-brand-soft px-4 py-5 text-sm text-text-strong shadow-sm md:px-6 md:py-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              {t("home.sections.finalCtaEyebrow")}
            </p>
            <p className="mt-1 text-sm">{t("home.sections.finalCtaText")}</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <Link
              to="/contato"
              className="inline-flex items-center justify-center rounded-md bg-brand px-4 py-2 font-medium text-white shadow-sm hover:bg-brand-hover"
            >
              {t("home.sections.finalCtaContactLabel")}
            </Link>
            <Link
              to="/projetos"
              className="inline-flex items-center justify-center rounded-md border border-border-strong bg-bg-card px-4 py-2 font-medium text-brand shadow-sm hover:bg-bg-soft"
            >
              {t("home.sections.finalCtaProjectsLabel")}
            </Link>
          </div>
        </div>
      </section>
    </section>
  );
}
