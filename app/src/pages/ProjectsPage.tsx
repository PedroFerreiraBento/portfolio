import type { ChangeEvent } from "react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n";
import { categories } from "../mocks/categories";
import { projects } from "../mocks/projects";
import type { CategoryId } from "../types/domain";
import { ProjectCard } from "../components/projects/ProjectCard";

export function ProjectsPage() {
  const { t } = useI18n();
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    CategoryId | "all"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");

  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as CategoryId | "all";
    setSelectedCategoryId(value);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredProjects = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return projects.filter((project) => {
      if (
        selectedCategoryId !== "all" &&
        !project.categoryIds.includes(selectedCategoryId)
      ) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const baseKey = `projectContent.${project.id}`;
      const haystack = [
        t(`${baseKey}.title`),
        t(`${baseKey}.subtitle`),
        t(`${baseKey}.client`),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    });
  }, [searchTerm, selectedCategoryId, t]);

  const categoriesWithProjects = useMemo(
    () =>
      categories
        .map((category) => ({
          category,
          projects: filteredProjects.filter((project) =>
            project.categoryIds.includes(category.id)
          ),
        }))
        .filter((entry) => entry.projects.length > 0),
    [filteredProjects]
  );

  return (
    <section className="space-y-12">
      {/* HEADER - Matches ServicesPage style */}
      <header className="flex flex-col gap-6 border-b border-border-subtle pb-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            {t("common.tagline")}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-text-strong sm:text-4xl">
            {t("pages.projects.title")}
          </h1>
          <p className="mt-4 text-base text-text-soft leading-relaxed max-w-xl">
            {t("pages.projects.description")}
          </p>
        </div>
        <div className="max-w-sm space-y-3 pt-2">
          <p className="text-sm text-text-soft">
            {t("pages.projects.introCta.primaryDescription")}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/contato"
              className="inline-flex items-center justify-center rounded-md bg-brand px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/80"
            >
              {t("pages.projects.introCta.primaryLabel")}
            </Link>
            <Link
              to="/servicos"
              className="inline-flex items-center justify-center rounded-md border border-border-subtle bg-bg-card px-5 py-2.5 text-sm font-medium text-brand shadow-sm transition-colors hover:bg-bg-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/80"
            >
              {t("pages.projects.introCta.secondaryLabel")}
            </Link>
          </div>
        </div>
      </header>

      {/* FILTERS */}
      <section className="sticky top-[70px] z-30 -mx-4 px-4 py-2 bg-bg-page/95 backdrop-blur sm:static sm:top-0 sm:mx-0 sm:bg-transparent sm:p-0">
        <div className="flex flex-col gap-4 rounded-lg border border-border-subtle bg-bg-card/50 p-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="w-full sm:max-w-xs">
            <label
              htmlFor="projects-category-filter"
              className="block text-xs font-semibold uppercase tracking-wide text-text-muted"
            >
              {t("pages.projects.filters.categoryLabel")}
            </label>
            <div className="relative mt-1">
              <select
                id="projects-category-filter"
                value={selectedCategoryId}
                onChange={handleCategoryChange}
                className="block w-full appearance-none rounded-md border border-border-subtle bg-bg-card px-3 py-2 text-sm text-text-strong shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/80"
              >
                <option value="all">
                  {t("pages.projects.filters.categoryAll")}
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="w-full sm:max-w-xs">
            <label
              htmlFor="projects-search"
              className="block text-xs font-semibold uppercase tracking-wide text-text-muted"
            >
              {t("pages.projects.filters.searchLabel")}
            </label>
            <input
              id="projects-search"
              type="search"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder={t("pages.projects.filters.searchPlaceholder")}
              className="mt-1 block w-full rounded-md border border-border-subtle bg-bg-card px-3 py-2 text-sm text-text-strong shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/80"
            />
          </div>
        </div>
      </section>

      {/* PROJECT LIST */}
      <section className="space-y-12">
        {filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border-subtle py-12 text-center">
            <p className="text-base text-text-muted">
              {t("pages.projects.emptyState.message")}
            </p>
            <Link
              to="/contato"
              className="mt-4 inline-flex items-center justify-center rounded-md bg-brand-soft px-4 py-2 text-sm font-medium text-brand shadow-sm hover:bg-brand-soft/80"
            >
              {t("pages.projects.emptyState.contactCtaLabel")}
            </Link>
          </div>
        ) : (
          categoriesWithProjects.map(({ category, projects }) => (
            <div key={category.id} className="space-y-6">
              <header className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4 border-b border-border-subtle/50 pb-2">
                <h2 className="text-xl font-semibold text-text-strong">
                  {category.name}
                </h2>
                {category.description && (
                  <p className="text-sm text-text-soft">
                    {category.description}
                  </p>
                )}
              </header>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <div key={project.id} className="h-full">
                    <ProjectCard project={project} />
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </section>

      {/* CLOSING CTA */}
      <section className="relative overflow-hidden rounded-2xl border border-brand-soft bg-brand-soft/30 px-6 py-12 text-center md:px-12 md:py-16">
        <div className="relative z-10 mx-auto max-w-2xl space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-text-strong sm:text-3xl">
            {t("pages.projects.closingCta.eyebrow")}
          </h2>
          <p className="text-base text-text-soft md:text-lg">
            {t("pages.projects.closingCta.text")}
          </p>
          <div className="pt-2">
            <Link
              to="/contato"
              className="inline-flex items-center justify-center rounded-lg bg-brand px-8 py-3 text-base font-medium text-white shadow-md transition-all hover:bg-brand-hover hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/80"
            >
              {t("pages.projects.closingCta.contactLabel")}
            </Link>
          </div>
        </div>

        {/* Decorative background element */}
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-brand/5 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-brand/5 blur-3xl" />
      </section>
    </section>
  );
}
