import { Link } from "react-router-dom";
import { useI18n } from "../i18n";
import { Seo } from "../components/common/Seo";
import { team } from "../mocks/team";
import { ScrollReveal } from "../components/common/ScrollReveal";
import {
  ShieldCheck,
  Eye,
  TrendingUp,
  Code2,
  Users,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import aboutHeroImg from "../assets/images/external/about-hero.jpg";
import aboutStoryImg from "../assets/images/external/about-story.jpg";

export function AboutPage() {
  const { t, locale } = useI18n();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": t("pages.about.title"),
    "description": t("pages.about.description"),
    "url": "https://caosdomado.com/sobre",
    "mainEntity": {
      "@type": "Organization",
      "name": "Caos Domado",
      "logo": "https://caosdomado.com/logo.png",
      "foundingDate": "2023",
      "url": "https://caosdomado.com",
      "sameAs": [
        "https://www.linkedin.com/company/caosdomado",
        "https://github.com/caosdomado"
      ]
    }
  };

  return (
    <div className="hp-root">
      <section className="hp-section page--about-visual">
        <Seo
          title={t("nav.about")}
          description={t("pages.about.hero.subheadline")}
          jsonLd={jsonLd}
        />
        {/* Hero Section with Background Image */}
        <header className="about-hero-visual">
          <div className="about-hero-visual__bg">
            <img
              src={aboutHeroImg}
              alt="Team meeting strategy"
              decoding="async"
              loading="eager"
              fetchPriority="high"
            />
            <div className="about-hero-visual__overlay"></div>
          </div>
          <div className="about-hero-visual__content">
            <ScrollReveal direction="down">
              <h1 className="about-hero-visual__title">
                {t("pages.about.hero.headline")}
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <p className="about-hero-visual__subtitle">
                {t("pages.about.hero.subheadline")}
              </p>
            </ScrollReveal>
          </div>
        </header>

        <div className="about-container">
          {/* Story / Approach Section - Split Layout */}
          <section className="page-section about-section about-section--story-split">
            <ScrollReveal direction="left" className="story-split__image">
              <img
                src={aboutStoryImg}
                alt="Data analysis on screen"
                decoding="async"
                loading="lazy"
              />
            </ScrollReveal>
            <ScrollReveal direction="right" className="story-split__content">
              <div className="story-icon">
                <Lightbulb size={32} className="text-brand" />
              </div>
              <h2>{t("pages.about.story.title")}</h2>
              <p className="story-text">{t("pages.about.story.content")}</p>
            </ScrollReveal>
          </section>

          {/* Values Section - Added Icons */}
          <section className="page-section about-section about-section--values">
            <ScrollReveal width="100%" className="section-header-center">
              <h2>{t("pages.about.values.title")}</h2>
            </ScrollReveal>
            <div className="values-grid">
              <ScrollReveal delay={0.1} className="value-card">
                <div className="value-card__icon">
                  <ShieldCheck size={32} />
                </div>
                <h3>{t("pages.about.values.items.rigor.title")}</h3>
                <p>{t("pages.about.values.items.rigor.description")}</p>
              </ScrollReveal>
              <ScrollReveal delay={0.2} className="value-card">
                <div className="value-card__icon">
                  <Eye size={32} />
                </div>
                <h3>{t("pages.about.values.items.transparency.title")}</h3>
                <p>{t("pages.about.values.items.transparency.description")}</p>
              </ScrollReveal>
              <ScrollReveal delay={0.3} className="value-card">
                <div className="value-card__icon">
                  <TrendingUp size={32} />
                </div>
                <h3>{t("pages.about.values.items.impact.title")}</h3>
                <p>{t("pages.about.values.items.impact.description")}</p>
              </ScrollReveal>
            </div>
          </section>

          {/* Team Section */}
          <section className="page-section about-section about-section--team">
            <ScrollReveal width="100%" className="section-header">
              <div className="section-icon-wrapper">
                <Users size={32} className="text-brand" />
              </div>
              <div>
                <h2>{t("pages.about.team.title")}</h2>
                <p>{t("pages.about.team.subtitle")}</p>
              </div>
            </ScrollReveal>
            <div className="team-grid">
              {team.map((member, index) => (
                <ScrollReveal key={member.id} delay={index * 0.1} className="team-card">
                  <div className="team-card__header">
                    <div className="team-card__avatar">
                      {member.photo ? (
                        <img
                          src={member.photo}
                          alt={member.name}
                          className="team-card__avatar-img"
                          decoding="async"
                          loading="lazy"
                        />
                      ) : (
                        member.name.charAt(0)
                      )}
                    </div>
                    <div>
                      <h3>{member.name}</h3>
                      <span className="team-card__role">{member.role}</span>
                    </div>
                  </div>
                  <p className="team-card__bio">{member.bio[locale]}</p>
                  <div className="team-card__skills">
                    {member.skills?.map((skill) => (
                      <span key={skill} className="skill-tag">
                        <Code2 size={12} className="skill-icon" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>

          {/* Final CTA */}
          <section className="page-section about-cta-section">
            <ScrollReveal width="100%" className="about-cta-card">
              <div className="about-cta-content">
                <h2>{t("pages.about.cta.title")}</h2>
              </div>
              <Link to="/contato" className="hp-btn-primary group">
                {t("pages.about.cta.button")}
                <ArrowRight
                  size={20}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </ScrollReveal>
          </section>
        </div>
      </section>
    </div>
  );
}
