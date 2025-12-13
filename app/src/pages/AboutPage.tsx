import { Link } from "react-router-dom";
import { useI18n } from "../i18n";
import { team } from "../mocks/team";
import {
  ShieldCheck,
  Eye,
  TrendingUp,
  Code2,
  Users,
  Lightbulb,
  ArrowRight,
} from "lucide-react";

export function AboutPage() {
  const { t, locale } = useI18n();

  return (
    <section className="page page--about-visual">
      {/* Hero Section with Background Image */}
      <header className="about-hero-visual">
        <div className="about-hero-visual__bg">
          <img
            src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Team meeting strategy"
          />
          <div className="about-hero-visual__overlay"></div>
        </div>
        <div className="about-hero-visual__content">
          <h1 className="about-hero-visual__title">
            {t("pages.about.hero.headline")}
          </h1>
          <p className="about-hero-visual__subtitle">
            {t("pages.about.hero.subheadline")}
          </p>
        </div>
      </header>

      <div className="about-container">
        {/* Story / Approach Section - Split Layout */}
        <section className="page-section about-section about-section--story-split">
          <div className="story-split__image">
            <img
              src="https://images.pexels.com/photos/17483874/pexels-photo-17483874.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Data analysis on screen"
            />
          </div>
          <div className="story-split__content">
            <div className="story-icon">
              <Lightbulb size={32} className="text-brand" />
            </div>
            <h2>{t("pages.about.story.title")}</h2>
            <p className="story-text">{t("pages.about.story.content")}</p>
          </div>
        </section>

        {/* Values Section - Added Icons */}
        <section className="page-section about-section about-section--values">
          <div className="section-header-center">
            <h2>{t("pages.about.values.title")}</h2>
          </div>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-card__icon">
                <ShieldCheck size={32} />
              </div>
              <h3>{t("pages.about.values.items.rigor.title")}</h3>
              <p>{t("pages.about.values.items.rigor.description")}</p>
            </div>
            <div className="value-card">
              <div className="value-card__icon">
                <Eye size={32} />
              </div>
              <h3>{t("pages.about.values.items.transparency.title")}</h3>
              <p>{t("pages.about.values.items.transparency.description")}</p>
            </div>
            <div className="value-card">
              <div className="value-card__icon">
                <TrendingUp size={32} />
              </div>
              <h3>{t("pages.about.values.items.impact.title")}</h3>
              <p>{t("pages.about.values.items.impact.description")}</p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="page-section about-section about-section--team">
          <div className="section-header">
            <div className="section-icon-wrapper">
              <Users size={32} className="text-brand" />
            </div>
            <div>
              <h2>{t("pages.about.team.title")}</h2>
              <p>{t("pages.about.team.subtitle")}</p>
            </div>
          </div>
          <div className="team-grid">
            {team.map((member) => (
              <div key={member.id} className="team-card">
                <div className="team-card__header">
                  <div className="team-card__avatar">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="team-card__avatar-img"
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
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="page-section about-cta-section">
          <div className="about-cta-card">
            <div className="about-cta-content">
              <h2>{t("pages.about.cta.title")}</h2>
            </div>
            <Link to="/contato" className="btn btn--white btn--large group">
              {t("pages.about.cta.button")}
              <ArrowRight
                size={20}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
}
