import { Link, useParams } from "react-router-dom";
import { useI18n } from "../i18n";
import { projects } from "../mocks/projects";
import { categories } from "../mocks/categories";
import { techs } from "../mocks/techs";
import { services } from "../mocks/services";
import { testimonials } from "../mocks/testimonials";

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, locale } = useI18n();

  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return (
      <section className="page page--project-detail">
        <header className="page-header">
          <h1>{t("pages.notFound.title")}</h1>
          <p>{t("pages.notFound.description")}</p>
        </header>

        <section className="page-section">
          <Link to="/projetos" className="btn btn--primary">
            Voltar para a lista de projetos
          </Link>
        </section>
      </section>
    );
  }

  const projectKey = `projectContent.${project.id}`;
  const title = t(`${projectKey}.title`);
  const subtitle = t(`${projectKey}.subtitle`);
  const problem = t(`${projectKey}.problem`);
  const solution = t(`${projectKey}.solution`);
  const client = t(`${projectKey}.client`);

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

  return (
    <section className="page page--project-detail">
      <header className="page-header">
        <div className="page-header__nav">
          <Link to="/projetos" className="btn-back">
            ← {t("pages.projectDetail.backButton")}
          </Link>
        </div>
        <p className="page-header__eyebrow">{t("pages.projects.title")}</p>
        <h1 className="page-header__title">{title}</h1>
        <p className="page-header__subtitle">{subtitle}</p>

        <div className="project-meta">
          {client && (
            <div className="project-meta__item">
              <span className="project-meta__label">
                {t("pages.projectDetail.meta.client")}
              </span>
              <span className="project-meta__value">{client}</span>
            </div>
          )}
          {project.year && (
            <div className="project-meta__item">
              <span className="project-meta__label">
                {t("pages.projectDetail.meta.year")}
              </span>
              <span className="project-meta__value">{project.year}</span>
            </div>
          )}
          {project.duration && (
            <div className="project-meta__item">
              <span className="project-meta__label">
                {t("pages.projectDetail.meta.duration")}
              </span>
              <span className="project-meta__value">{project.duration}</span>
            </div>
          )}
          {projectCategories.length > 0 && (
            <div className="project-meta__item">
              <span className="project-meta__label">
                {t("pages.projectDetail.meta.categories")}
              </span>
              <span className="project-meta__value">
                {projectCategories.map((c) => c.name).join(", ")}
              </span>
            </div>
          )}
        </div>
      </header>

      {project.thumbnail && (
        <div className="project-hero-image">
          <img src={project.thumbnail} alt={title} />
        </div>
      )}

      <div className="project-content">
        <section className="page-section project-section project-section--problem">
          <h2>{t("pages.projectDetail.problemTitle")}</h2>
          <p>{problem}</p>
          <div className="project-cta-inline">
            <span>{t("pages.projectDetail.ctas.problem")}</span>
            <Link to="/contato" className="btn-link">
              {t("pages.projectDetail.ctas.problemButton")} →
            </Link>
          </div>
        </section>

        <section className="page-section project-section project-section--solution">
          <h2>{t("pages.projectDetail.solutionTitle")}</h2>
          <p>{solution}</p>
        </section>

        {project.gallery && project.gallery.length > 0 && (
          <section className="page-section project-section project-section--gallery">
            <div className="project-gallery-grid">
              {project.gallery.map((image, index) => (
                <div key={index} className="gallery-item">
                  <img src={image} alt={`${title} gallery ${index + 1}`} />
                </div>
              ))}
            </div>
          </section>
        )}

        {project.results.length > 0 && (
          <section className="page-section project-section project-section--results">
            <h2>{t("pages.projectDetail.resultsTitle")}</h2>
            <div className="project-results-grid">
              {project.results.map((result, index) => {
                const base = `${projectKey}.results.${index}`;
                const label = t(`${base}.label`);
                const description = t(`${base}.description`);

                return (
                  <div key={index} className="result-card">
                    <div className="result-card__header">
                      {typeof result.value === "number" && result.unit && (
                        <span className="result-card__value">
                          {result.value}
                          <small>{result.unit}</small>
                        </span>
                      )}
                      <h3 className="result-card__label">{label}</h3>
                    </div>
                    {description && (
                      <p className="result-card__description">{description}</p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="project-cta-card">
              <h3>{t("pages.projectDetail.ctas.results")}</h3>
              <Link to="/contato" className="btn btn--primary">
                {t("pages.projectDetail.ctas.resultsButton")}
              </Link>
            </div>
          </section>
        )}

        {projectTestimonials.length > 0 && (
          <section className="page-section project-section project-section--testimonials">
            <h2>{t("pages.projectDetail.testimonialsTitle")}</h2>
            <div className="testimonials-grid">
              {projectTestimonials.map((testimonial) => (
                <div key={testimonial.id} className="testimonial-card">
                  <blockquote className="testimonial-card__quote">
                    "{testimonial.quote[locale]}"
                  </blockquote>
                  <div className="testimonial-card__author">
                    <strong>{testimonial.authorName}</strong>
                    <span>
                      {testimonial.authorRole}
                      {testimonial.company ? ` @ ${testimonial.company}` : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="project-footer-info">
          {projectTechs.length > 0 && (
            <section className="project-section project-section--techs">
              <h3>{t("pages.projectDetail.techsTitle")}</h3>
              <ul className="tags-list">
                {projectTechs.map((tech) => (
                  <li key={tech.id} className="tag">
                    {tech.name}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {projectServices.length > 0 && (
            <section className="project-section project-section--services">
              <h3>{t("pages.projectDetail.servicesTitle")}</h3>
              <ul className="links-list">
                {projectServices.map((service) => (
                  <li key={service.id}>
                    <Link to="/servicos">
                      {t(`serviceContent.${service.id}.name`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>

      <section className="page-section page-section--actions project-cta-final">
        <h2>{t("pages.projectDetail.ctas.final")}</h2>
        <div className="project-cta-final__actions">
          <Link to="/contato" className="btn btn--primary btn--large">
            {t("pages.projectDetail.ctas.finalButton")}
          </Link>
          <Link to="/projetos" className="btn btn--ghost">
            {t("pages.projectDetail.backButton")}
          </Link>
        </div>
      </section>
    </section>
  );
}
