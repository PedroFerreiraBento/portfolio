import { Link } from "react-router-dom";
import { useI18n } from "../i18n";
import { categories } from "../mocks/categories";
import { projects } from "../mocks/projects";
import { testimonials } from "../mocks/testimonials";

export function HomePage() {
  const { t, locale } = useI18n();

  const orderedCategories = [...categories].sort((a, b) => a.order - b.order);
  const highlightedProject = projects.find((project) => project.highlight);
  const primaryTestimonial = testimonials[0];

  const categoryImages: Record<string, string> = {
    "cat-produtos-digitais":
      "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800",
    "cat-data-science":
      "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800",
    "cat-dashboards":
      "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800",
  };

  const heroImageUrl =
    "https://images.pexels.com/photos/6476584/pexels-photo-6476584.jpeg?auto=compress&cs=tinysrgb&w=1200";

  return (
    <section className="space-y-12">
      {/* HERO MAIS VISUAL */}
      <header className="grid gap-8 border-b border-border-subtle pb-8 md:grid-cols-[minmax(0,3fr)_minmax(0,2.2fr)] md:items-center">
        <div className="space-y-4">
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
        </div>
        <div className="md:justify-self-end">
          <div className="overflow-hidden rounded-xl border border-border-subtle bg-bg-soft shadow-sm">
            <img
              src={heroImageUrl}
              alt={t("home.hero.imageAlt")}
              className="h-56 w-full object-cover sm:h-64 md:h-72"
            />
          </div>
        </div>
      </header>

      {/* TIPOS DE PROJETO (CATEGORIAS) */}
      <section className="space-y-4">
        <header className="flex items-baseline justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
              {t("home.sections.categoriesEyebrow")}
            </p>
            <h2 className="mt-1 text-sm font-semibold text-text-strong">
              {t("home.sections.categoriesTitle")}
            </h2>
          </div>
          <Link
            to="/projetos"
            className="hidden text-xs font-medium text-accent hover:text-accent sm:inline-flex"
          >
            {t("home.sections.categoriesSeePortfolio")}
          </Link>
        </header>
        <div className="grid gap-4 sm:grid-cols-3">
          {orderedCategories.map((category) => (
            <Link
              key={category.id}
              to="/projetos"
              className="group overflow-hidden rounded-xl border border-border-subtle bg-bg-card/90 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative h-28 w-full overflow-hidden bg-bg-soft">
                <img
                  src={categoryImages[category.id]}
                  alt={category.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-[1.03]"
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
          ))}
        </div>
      </section>

      {/* ALGUNS EXEMPLOS DE PROJETOS */}
      <section className="space-y-4">
        <header className="flex items-baseline justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
              {t("home.sections.examplesEyebrow")}
            </p>
            <h2 className="mt-1 text-sm font-semibold text-text-strong">
              {t("home.sections.examplesTitle")}
            </h2>
          </div>
          <Link
            to="/projetos"
            className="text-xs font-medium text-accent hover:text-accent"
          >
            {t("home.sections.examplesSeeCatalog")}
          </Link>
        </header>
        <div className="grid gap-4 md:grid-cols-3">
          {highlightedProject && (
            <article className="flex flex-col overflow-hidden rounded-xl border border-border-subtle bg-bg-card/90 shadow-sm">
              <div className="h-32 w-full overflow-hidden bg-bg-soft">
                <img
                  src={
                    highlightedProject.thumbnail ||
                    "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800"
                  }
                  alt={t(`projectContent.${highlightedProject.id}.title`)}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2 p-3 text-xs">
                <p className="inline-flex items-center gap-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-brand">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                  {t("home.sections.examplesHighlightedBadge")}
                </p>
                <h3 className="text-sm font-semibold text-text-strong">
                  {t(`projectContent.${highlightedProject.id}.title`)}
                </h3>
                <p className="line-clamp-3 text-[0.7rem] text-text-soft">
                  {t(`projectContent.${highlightedProject.id}.subtitle`)}
                </p>
                <Link
                  to={`/projetos/${highlightedProject.slug}`}
                  className="mt-auto inline-flex text-[0.7rem] font-medium text-accent hover:text-accent"
                >
                  {t("home.sections.examplesHighlightedLinkLabel")}
                </Link>
              </div>
            </article>
          )}

          <article className="flex flex-col overflow-hidden rounded-xl border border-border-subtle bg-bg-card/90 shadow-sm">
            <div className="h-32 w-full overflow-hidden bg-bg-soft">
              <img
                src="https://images.pexels.com/photos/6476587/pexels-photo-6476587.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt={t("home.sections.examplesCard1ImageAlt")}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col gap-2 p-3 text-xs">
              <p className="inline-flex items-center gap-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-text-muted">
                {t("home.sections.examplesCard1Badge")}
              </p>
              <h3 className="text-sm font-semibold text-text-strong">
                {t("home.sections.examplesCard1Title")}
              </h3>
              <p className="line-clamp-3 text-[0.7rem] text-text-soft">
                {t("home.sections.examplesCard1Description")}
              </p>
            </div>
          </article>

          <article className="flex flex-col overflow-hidden rounded-xl border border-border-subtle bg-bg-card/90 shadow-sm">
            <div className="h-32 w-full overflow-hidden bg-bg-soft">
              <img
                src="https://images.pexels.com/photos/1181670/pexels-photo-1181670.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt={t("home.sections.examplesCard2ImageAlt")}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col gap-2 p-3 text-xs">
              <p className="inline-flex items-center gap-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-text-muted">
                {t("home.sections.examplesCard2Badge")}
              </p>
              <h3 className="text-sm font-semibold text-text-strong">
                {t("home.sections.examplesCard2Title")}
              </h3>
              <p className="line-clamp-3 text-[0.7rem] text-text-soft">
                {t("home.sections.examplesCard2Description")}
              </p>
            </div>
          </article>
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
