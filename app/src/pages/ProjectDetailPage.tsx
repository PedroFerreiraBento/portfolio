import { Link, useParams } from "react-router-dom";
import { useI18n } from "../i18n";
import { projects } from "../mocks/projects";
import { categories } from "../mocks/categories";
import { techs } from "../mocks/techs";
import { services } from "../mocks/services";
import { testimonials } from "../mocks/testimonials";
import { ScrollReveal } from "../components/common/ScrollReveal";
import { Seo } from "../components/common/Seo";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  TrendingUp,
} from "lucide-react";

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, locale } = useI18n();

  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return (
      <div className="hp-root">
        <section className="hp-section page--project-detail">
          <header className="page-header">
            <h1>{t("pages.notFound.title")}</h1>
            <p>{t("pages.notFound.description")}</p>
          </header>

          <section className="page-section">
            <Link to="/projetos" className="hp-btn-primary">
              Voltar para a lista de projetos
            </Link>
          </section>
        </section>
      </div>
    );
  }

  const projectKey = `projectContent.${project.id}`;
  const title = t(`${projectKey}.title`);
  const subtitle = t(`${projectKey}.subtitle`);
  const problem = t(`${projectKey}.problem`);
  const solution = t(`${projectKey}.solution`);
  const client = t(`${projectKey}.client`);
  const businessContext = t(`${projectKey}.businessContext`);

  const projectHighlights = Array.from({ length: 8 })
    .map((_, index) => {
      const key = `${projectKey}.highlights.${index}`;
      const value = t(key);
      return value === key ? null : value;
    })
    .filter((value): value is string => Boolean(value));

  const projectModules = Array.from({ length: 8 })
    .map((_, index) => {
      const titleKey = `${projectKey}.modules.${index}.title`;
      const descriptionKey = `${projectKey}.modules.${index}.description`;
      const title = t(titleKey);
      const description = t(descriptionKey);

      if (title === titleKey || description === descriptionKey) {
        return null;
      }

      return { title, description };
    })
    .filter(
      (value): value is { title: string; description: string } =>
        value !== null
    );

  const projectCategories = categories.filter((category) =>
    project.categoryIds.includes(category.id)
  );

  const projectTechs = techs.filter((tech) =>
    project.techIds.includes(tech.id)
  );

  const projectServices = services.filter((service) =>
    service.relatedProjectIds?.includes(project.id)
  );

  const projectTestimonials = testimonials.filter(
    (testimonial) => testimonial.relatedProjectId === project.id
  );
  const repositoryUrl =
    project.id === "proj-pdv-offline-first"
      ? "https://github.com/PedroFerreiraBento/ProjetoPDV"
      : null;
  const labels = locale === "pt"
    ? {
      realProject: "Projeto real no GitHub",
      before: "Antes",
      after: "Depois",
      inActionTitle: "Interface em ação",
      inActionSubtitle:
        "Telas reais do projeto mostrando a experiência de ponta a ponta, do acesso ao caixa e à gestão.",
      screen: "Tela",
      resultTag: "Resultado",
    }
    : {
      realProject: "Real project on GitHub",
      before: "Before",
      after: "After",
      inActionTitle: "Interface in action",
      inActionSubtitle:
        "Real screens showing the end-to-end experience, from access and checkout to management.",
      screen: "Screen",
      resultTag: "Outcome",
    };

  return (
    <div className="hp-root">
      <Seo
        title={`${title} | ${t("pages.projects.title")}`}
        description={subtitle}
      />
      <section className="hp-section page--project-detail !pt-4">
        <header className="page-header py-8">
          <ScrollReveal>
            <div className="page-header__nav mb-8">
              <div className="flex flex-wrap items-center gap-3">
                <Link to="/projetos" className="flex items-center gap-2 text-hp-accent hover:opacity-80 transition-opacity font-medium">
                  <ArrowLeft size={18} />
                  {t("pages.projectDetail.backButton")}
                </Link>
                {repositoryUrl && (
                  <a
                    href={repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-bg-card px-4 py-2 text-xs font-semibold uppercase tracking-wide text-text-soft hover:border-brand hover:text-brand transition-colors"
                  >
                    {labels.realProject}
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
            <p className="hp-section-eyebrow">{t("pages.projects.title")}</p>
            <h1 className="text-4xl md:text-5xl font-bold text-text-strong mt-2">{title}</h1>
            <p className="text-xl text-text-secondary mt-4 max-w-2xl leading-relaxed">{subtitle}</p>

            <div className="project-meta grid grid-cols-2 md:grid-cols-4 gap-6 bg-bg-elevated/70 p-6 rounded-2xl border border-border-subtle mt-10">
              {client && (
                <div className="project-meta__item">
                  <span className="project-meta__label block text-xs uppercase tracking-wider text-text-muted mb-1">
                    {t("pages.projectDetail.meta.client")}
                  </span>
                  <span className="project-meta__value font-medium text-text-strong">{client}</span>
                </div>
              )}
              {project.year && (
                <div className="project-meta__item">
                  <span className="project-meta__label block text-xs uppercase tracking-wider text-text-muted mb-1">
                    {t("pages.projectDetail.meta.year")}
                  </span>
                  <span className="project-meta__value font-medium text-text-strong">{project.year}</span>
                </div>
              )}
              {project.duration && (
                <div className="project-meta__item">
                  <span className="project-meta__label block text-xs uppercase tracking-wider text-text-muted mb-1">
                    {t("pages.projectDetail.meta.duration")}
                  </span>
                  <span className="project-meta__value font-medium text-text-strong">{project.duration}</span>
                </div>
              )}
              {projectCategories.length > 0 && (
                <div className="project-meta__item">
                  <span className="project-meta__label block text-xs uppercase tracking-wider text-text-muted mb-1">
                    {t("pages.projectDetail.meta.categories")}
                  </span>
                  <span className="project-meta__value font-medium text-text-strong">
                    {projectCategories.map((c) => c.name).join(", ")}
                  </span>
                </div>
              )}
            </div>
          </ScrollReveal>
        </header>

        {project.thumbnail && (
          <ScrollReveal delay={0.2}>
            <div className="project-hero-image rounded-3xl overflow-hidden border border-border-subtle mb-14">
              <img
                src={project.thumbnail}
                alt={title}
                decoding="async"
                loading="eager"
                fetchPriority="high"
                className="w-full h-auto"
              />
            </div>
          </ScrollReveal>
        )}

        <div className="project-content space-y-16 md:space-y-20">
          <section className="project-section--transformation">
            <ScrollReveal>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <article className="rounded-2xl border border-border-subtle bg-bg-elevated p-7">
                  <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
                    <Sparkles size={14} />
                    {labels.before}
                  </p>
                  <h2 className="text-2xl font-bold text-text-strong mb-4">
                    {t("pages.projectDetail.problemTitle")}
                  </h2>
                  <p className="text-base leading-relaxed text-text-secondary">
                    {problem}
                  </p>
                </article>
                <article className="rounded-2xl border border-border-subtle bg-bg-elevated p-7">
                  <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
                    <TrendingUp size={14} />
                    {labels.after}
                  </p>
                  <h2 className="text-2xl font-bold text-text-strong mb-4">
                    {t("pages.projectDetail.solutionTitle")}
                  </h2>
                  <p className="text-base leading-relaxed text-text-secondary">
                    {solution}
                  </p>
                </article>
              </div>
              <div className="project-cta-inline mt-7 inline-flex flex-wrap items-center gap-4 bg-bg-elevated p-4 rounded-xl border border-border-subtle">
                <span className="text-text-secondary">{t("pages.projectDetail.ctas.problem")}</span>
                <Link to="/contato" className="text-hp-accent font-semibold hover:underline">
                  {t("pages.projectDetail.ctas.problemButton")} →
                </Link>
              </div>
            </ScrollReveal>
          </section>

          {businessContext !== `${projectKey}.businessContext` && (
            <section className="project-section--context">
              <ScrollReveal>
                <div className="rounded-2xl border border-border-subtle bg-gradient-to-br from-bg-elevated to-bg-card p-8">
                  <h2 className="text-2xl font-bold text-text-strong mb-4">
                    {t("pages.projectDetail.businessContextTitle")}
                  </h2>
                  <p className="text-base text-text-secondary leading-relaxed max-w-4xl">
                    {businessContext}
                  </p>
                </div>
              </ScrollReveal>
            </section>
          )}

          {projectHighlights.length > 0 && (
            <section className="project-section--highlights">
              <ScrollReveal>
                <h2 className="text-3xl font-bold text-text-strong mb-8">
                  {t("pages.projectDetail.highlightsTitle")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projectHighlights.map((highlight, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-border-subtle bg-bg-elevated p-5 text-text-secondary leading-relaxed flex items-start gap-3"
                    >
                      <CheckCircle2 size={18} className="mt-0.5 text-brand shrink-0" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </section>
          )}

          {projectModules.length > 0 && (
            <section className="project-section--modules">
              <ScrollReveal>
                <h2 className="text-3xl font-bold text-text-strong mb-8">
                  {t("pages.projectDetail.modulesTitle")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projectModules.map((module, index) => (
                    <article
                      key={index}
                      className="rounded-2xl border border-border-subtle bg-bg-elevated p-6 transition-all hover:-translate-y-1 hover:border-brand/40 hover:shadow-md"
                    >
                      <p className="mb-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-soft text-xs font-bold text-brand">
                        {index + 1}
                      </p>
                      <h3 className="text-lg font-semibold text-text-strong mb-2">{module.title}</h3>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {module.description}
                      </p>
                    </article>
                  ))}
                </div>
              </ScrollReveal>
            </section>
          )}

          {project.gallery && project.gallery.length > 0 && (
            <section className="project-section--gallery">
              <ScrollReveal>
                <h2 className="text-3xl font-bold text-text-strong mb-3">
                  {labels.inActionTitle}
                </h2>
                <p className="text-text-secondary mb-8 max-w-2xl">
                  {labels.inActionSubtitle}
                </p>
              </ScrollReveal>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {project.gallery.map((image, index) => (
                  <ScrollReveal key={index} delay={index * 0.1}>
                    <div className="gallery-item rounded-2xl overflow-hidden border border-border-subtle">
                      <img
                        src={image}
                        alt={`${title} gallery ${index + 1}`}
                        decoding="async"
                        loading="lazy"
                        className="w-full h-auto hover:scale-105 transition-transform duration-700"
                        style={{ willChange: "transform" }}
                      />
                      <div className="border-t border-border-subtle bg-bg-elevated px-4 py-3 text-xs font-medium uppercase tracking-wide text-text-muted">
                        {labels.screen} {index + 1}
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </section>
          )}

          {project.results.length > 0 && (
            <section className="project-section--results">
              <ScrollReveal>
                <h2 className="text-3xl font-bold text-text-strong mb-10">{t("pages.projectDetail.resultsTitle")}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {project.results.map((result, index) => {
                    const base = `${projectKey}.results.${index}`;
                    const label = t(`${base}.label`);
                    const description = t(`${base}.description`);

                    return (
                      <div key={index} className="result-card bg-gradient-to-br from-bg-elevated to-bg-card p-8 rounded-2xl border border-border-subtle hover:border-hp-accent/30 transition-colors">
                        <div className="result-card__header mb-4">
                          <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand">
                            <TrendingUp size={14} />
                            {labels.resultTag}
                          </p>
                          {typeof result.value === "number" && result.unit && (
                            <span className="result-card__value text-4xl font-bold text-hp-accent block mb-2">
                              {result.value}
                              <small className="text-lg ml-1 opacity-80">{result.unit}</small>
                            </span>
                          )}
                          <h3 className="result-card__label text-lg font-semibold text-text-strong">{label}</h3>
                        </div>
                        {description && (
                          <p className="result-card__description text-sm text-text-secondary leading-relaxed">{description}</p>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="project-cta-card mt-16 bg-gradient-to-r from-bg-elevated to-bg-card p-10 rounded-3xl border border-border-subtle text-center">
                  <h3 className="text-2xl font-bold text-text-strong mb-6">{t("pages.projectDetail.ctas.results")}</h3>
                  <Link to="/contato" className="hp-btn-primary px-10 py-4">
                    {t("pages.projectDetail.ctas.resultsButton")}
                  </Link>
                </div>
              </ScrollReveal>
            </section>
          )}

          {projectTestimonials.length > 0 && (
            <section className="project-section--testimonials">
              <ScrollReveal>
                <h2 className="text-3xl font-bold text-text-strong mb-10">{t("pages.projectDetail.testimonialsTitle")}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {projectTestimonials.map((testimonial) => (
                    <div key={testimonial.id} className="testimonial-card bg-bg-elevated p-8 rounded-2xl border border-border-subtle relative">
                      <div className="absolute top-8 right-8 text-4xl text-hp-accent opacity-20 font-serif">"</div>
                      <blockquote className="testimonial-card__quote text-lg italic text-text-strong mb-6 leading-relaxed">
                        "{testimonial.quote[locale]}"
                      </blockquote>
                      <div className="testimonial-card__author flex flex-col">
                        <strong className="text-text-strong">{testimonial.authorName}</strong>
                        <span className="text-sm text-text-muted">
                          {testimonial.authorRole}
                          {testimonial.company ? ` @ ${testimonial.company}` : ""}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </section>
          )}

          <div className="project-footer-info grid grid-cols-1 md:grid-cols-2 gap-12 pt-10 border-t border-border-subtle">
            {projectTechs.length > 0 && (
              <section className="project-section--techs">
                <ScrollReveal>
                  <h3 className="text-xl font-bold text-text-strong mb-6">{t("pages.projectDetail.techsTitle")}</h3>
                  <ul className="flex flex-wrap gap-2">
                    {projectTechs.map((tech) => (
                      <li key={tech.id} className="px-4 py-2 bg-hp-accent-soft text-hp-accent rounded-full text-sm font-medium border border-hp-accent-glow">
                        {tech.name}
                      </li>
                    ))}
                  </ul>
                </ScrollReveal>
              </section>
            )}

            {projectServices.length > 0 && (
              <section className="project-section--services">
                <ScrollReveal>
                  <h3 className="text-xl font-bold text-text-strong mb-6">{t("pages.projectDetail.servicesTitle")}</h3>
                  <ul className="space-y-3">
                    {projectServices.map((service) => (
                      <li key={service.id}>
                        <Link to="/servicos" className="text-text-secondary hover:text-hp-accent transition-colors flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-hp-accent"></span>
                          {t(`serviceContent.${service.id}.name`)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </ScrollReveal>
              </section>
            )}
          </div>
        </div>

        <ScrollReveal width="100%">
          <section className="project-cta-final mt-32 bg-hp-bg-elevated border border-hp-border p-16 rounded-[2.5rem] text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-text-strong mb-8">{t("pages.projectDetail.ctas.final")}</h2>
            <div className="project-cta-final__actions flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contato" className="hp-btn-primary px-12 py-4 text-lg">
                {t("pages.projectDetail.ctas.finalButton")}
              </Link>
              <Link to="/projetos" className="hp-btn-outline px-12 py-4 text-lg">
                {t("pages.projectDetail.backButton")}
              </Link>
            </div>
          </section>
        </ScrollReveal>
      </section>
    </div>
  );
}
