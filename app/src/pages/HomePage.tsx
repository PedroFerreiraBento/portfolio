import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
import {
  ArrowRight,
  Code2,
  Database,
  BarChart3,
  Zap,
  Github,
  Linkedin,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useImagePreloader } from "../hooks/useImagePreloader";

export function HomePage() {
  const { t, locale } = useI18n();

  // Preload key images for smoother reveals
  const imagesToPreload = [
    catProdutosDigitais,
    catDataScience,
    catDashboards,
    ...(projects.map(p => p.thumbnail).filter(Boolean) as string[])
  ];
  useImagePreloader(imagesToPreload);

  const orderedCategories = [...categories].sort((a, b) => a.order - b.order);
  const highlightedProject = projects.find((project) => project.highlight);
  const landingProject = projects.find(
    (project) => project.id === "proj-landing-saas-b2b"
  );
  const dashboardProject = projects.find(
    (project) => project.id === "proj-dashboard-operacao-logistica"
  );
  // Testimonial Carousel State
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const activeTestimonial = testimonials[currentTestimonialIndex];

  const categoryImages: Record<string, string> = {
    "cat-produtos-digitais": catProdutosDigitais,
    "cat-data-science": catDataScience,
    "cat-dashboards": catDashboards,
  };

  const categoryIcons: Record<string, React.ReactNode> = {
    "cat-produtos-digitais": <Code2 className="hp-service-icon" />,
    "cat-data-science": <Database className="hp-service-icon" />,
    "cat-dashboards": <BarChart3 className="hp-service-icon" />,
  };

  const stats = [
    { value: "5+", label: locale === "pt" ? "Anos de experiência" : "Years of experience" },
    { value: "15+", label: locale === "pt" ? "Projetos entregues" : "Projects delivered" },
    { value: "98%", label: locale === "pt" ? "Satisfação dos clientes" : "Client satisfaction" },
  ];

  const featuredProjects = [
    { project: highlightedProject, badge: t("home.sections.examplesHighlightedBadge") },
    { project: landingProject, badge: landingProject ? t(`projectContent.${landingProject.id}.client`) : "" },
    { project: dashboardProject, badge: dashboardProject ? t(`projectContent.${dashboardProject.id}.client`) : "" },
  ];

  return (
    <div className="hp-root">
      <Seo />

      {/* ═══════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════ */}
      <section className="hp-hero">
        <div className="hp-hero-content">
          <ScrollReveal className="hp-hero-left">
            <p className="hp-hero-greeting">
              {locale === "pt" ? "Olá, somos a" : "Hi, we are"}
            </p>
            <p className="hp-hero-name">{t("common.brandName")}</p>
            <h1 className="hp-hero-title">
              {locale === "pt" ? (
                <>
                  Engenharia de{" "}
                  <span className="hp-accent">Software</span>
                  <br />& Ciência de{" "}
                  <span className="hp-accent">Dados</span>
                </>
              ) : (
                <>
                  Software{" "}
                  <span className="hp-accent">Engineering</span>
                  <br />& Data{" "}
                  <span className="hp-accent">Science</span>
                </>
              )}
            </h1>

            <div className="hp-hero-social">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hp-social-link">
                <Github size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hp-social-link">
                <Linkedin size={18} />
              </a>
              <a href="mailto:contato@caosdomado.com" aria-label="Email" className="hp-social-link">
                <Mail size={18} />
              </a>
            </div>

            <div className="hp-hero-actions">
              <Link to="/projetos" className="hp-btn-primary">
                {t("home.hero.ctaPrimary")}
              </Link>
              <Link to="/contato" className="hp-btn-outline">
                {t("home.hero.ctaContact")}
              </Link>
            </div>

            {/* Stats bar */}
            <ScrollReveal delay={0.4} width="100%">
              <div className="hp-stats-bar">
                {stats.map((stat, i) => (
                  <div key={i} className="hp-stat">
                    <span className="hp-stat-value">{stat.value}</span>
                    <span className="hp-stat-label">{stat.label}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </ScrollReveal>

          <ScrollReveal direction="left" delay={0.2} className="hp-hero-right">
            <div className="hp-hero-image-wrapper">
              <img
                src={heroImage}
                alt={t("home.hero.imageAlt")}
                className="hp-hero-image"
                decoding="async"
                loading="eager"
                fetchPriority="high"
              />
              <div className="hp-hero-image-overlay" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SERVICES / CATEGORIES
      ═══════════════════════════════════════════ */}
      <section className="hp-section">
        <ScrollReveal width="100%">
          <div className="hp-section-header">
            <span className="hp-section-eyebrow">
              {t("home.sections.categoriesEyebrow")}
            </span>
            <h2 className="hp-section-title">
              {t("home.sections.categoriesTitle")}
            </h2>
          </div>
        </ScrollReveal>

        <div className="hp-services-grid">
          {orderedCategories.map((category, index) => (
            <ScrollReveal key={category.id} delay={index * 0.12}>
              <Link to="/projetos" className="hp-service-card">
                <div className="hp-service-card-img aspect-[16/9]">
                  <img
                    src={categoryImages[category.id]}
                    alt={category.name}
                    decoding="async"
                    loading="lazy"
                  />
                  <div className="hp-service-card-img-overlay" />
                </div>
                <div className="hp-service-card-body">
                  <div className="hp-service-card-icon-wrap">
                    {categoryIcons[category.id] || <Zap className="hp-service-icon" />}
                  </div>
                  <h3 className="hp-service-card-title">{category.name}</h3>
                  <p className="hp-service-card-desc">{category.description}</p>
                  <span className="hp-service-card-link">
                    {locale === "pt" ? "Explorar" : "Explore"}
                    <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURED PROJECTS
      ═══════════════════════════════════════════ */}
      <section className="hp-section">
        <ScrollReveal width="100%">
          <div className="hp-section-header">
            <span className="hp-section-eyebrow">
              {t("home.sections.examplesEyebrow")}
            </span>
            <h2 className="hp-section-title">
              {t("home.sections.examplesTitle")}
            </h2>
          </div>
        </ScrollReveal>

        <div className="hp-projects-grid">
          {featuredProjects.map(
            (card, index) =>
              card.project && (
                <ScrollReveal
                  key={card.project.id}
                  delay={index * 0.1}
                >
                  <Link
                    to={`/projetos/${card.project.slug}`}
                    className="hp-project-card"
                  >
                    <div className="hp-project-card-img aspect-[4/3]">
                      <img
                        src={card.project.thumbnail || fallbackProjectImg}
                        alt={t(`projectContent.${card.project.id}.title`)}
                        decoding="async"
                        loading="lazy"
                      />
                      <div className="hp-project-card-img-overlay" />
                    </div>
                    <div className="hp-project-card-body">
                      <span className="hp-project-badge">{card.badge}</span>
                      <h3 className="hp-project-card-title">
                        {t(`projectContent.${card.project.id}.title`)}
                      </h3>
                      <p className="hp-project-card-desc">
                        {t(`projectContent.${card.project.id}.subtitle`)}
                      </p>
                      <span className="hp-project-card-link">
                        {t("pages.projects.card.viewDetails")}
                        <ArrowRight size={14} />
                      </span>
                    </div>
                  </Link>
                </ScrollReveal>
              )
          )}
        </div>

        <div className="hp-projects-cta">
          <Link to="/projetos" className="hp-btn-outline hp-btn-outline--wide">
            {t("home.sections.examplesSeeCatalog")}
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TESTIMONIAL CAROUSEL
      ═══════════════════════════════════════════ */}
      {activeTestimonial && (
        <section className="hp-section">
          <ScrollReveal width="100%">
            <div className="hp-testimonial-card hp-testimonial-carousel">
              {testimonials.length > 1 && (
                <>
                  <button
                    onClick={prevTestimonial}
                    className="hp-carousel-btn hp-carousel-btn-prev"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextTestimonial}
                    className="hp-carousel-btn hp-carousel-btn-next"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              <div className="hp-testimonial-content-wrapper">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTestimonial.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="hp-testimonial-content"
                    style={{ willChange: "transform, opacity" }}
                  >
                    <blockquote className="hp-testimonial-quote">
                      "{activeTestimonial.quote[locale]}"
                    </blockquote>
                    <div className="hp-testimonial-author">
                      <span className="hp-testimonial-name">
                        {activeTestimonial.authorName}
                      </span>
                      <span className="hp-testimonial-role">
                        {activeTestimonial.authorRole}
                        {activeTestimonial.company
                          ? `, ${activeTestimonial.company}`
                          : ""}
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {testimonials.length > 1 && (
                <div className="hp-carousel-dots">
                  {testimonials.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentTestimonialIndex(idx)}
                      className={`hp-carousel-dot ${idx === currentTestimonialIndex ? "active" : ""
                        }`}
                      aria-label={`Go to testimonial ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </ScrollReveal>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════════ */}
      <section className="hp-section hp-cta-section">
        <ScrollReveal width="100%">
          <div className="hp-cta-card">
            <span className="hp-cta-eyebrow">
              {t("home.sections.finalCtaEyebrow")}
            </span>
            <h2 className="hp-cta-title">
              {locale === "pt"
                ? "Vamos domar o seu caos."
                : "Let's tame your chaos."}
            </h2>
            <p className="hp-cta-text">{t("home.sections.finalCtaText")}</p>
            <div className="hp-cta-actions">
              <Link to="/contato" className="hp-btn-primary hp-btn-primary--lg">
                {t("home.sections.finalCtaContactLabel")}
                <ArrowRight size={18} />
              </Link>
              <Link to="/projetos" className="hp-btn-outline">
                {t("home.sections.finalCtaProjectsLabel")}
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
