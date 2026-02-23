import { useState } from "react";
import type { FormEvent } from "react";
import { useI18n } from "../i18n";
import { Seo } from "../components/common/Seo";
import contactImage from "../assets/images/components/contact.png";
import {
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  Building,
  User,
  MessageSquare,
  ArrowRight,
  Loader2,
} from "lucide-react";

export function ContactPage() {
  const { t, locale } = useI18n();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const formHelpLabel =
    locale === "pt"
      ? "Resposta em até 24h úteis · Sem spam"
      : "Reply within 24 business hours · No spam";

  const emailAlternativeLabel =
    locale === "pt" ? "Ou envie um e-mail para" : "Or email us at";

  const helperTextId = "contact-form-helper";
  const messageHintId = "contact-form-message-hint";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setHasSubmitted(false);
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    const data = {
      name: String(formData.get("name") ?? "").trim(),
      company: String(formData.get("company") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
    };

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setHasSubmitted(true);
      event.currentTarget.reset();
    } catch (error) {
      console.error("Error sending message:", error);
      setErrorMessage(
        t("pages.contact.form.errorMessage") ||
        "Failed to send message. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": t("nav.contact"),
    "description": t("pages.contact.description"),
    "url": "https://caosdomado.com/contato",
    "mainEntity": {
      "@type": "Organization",
      "name": "Caos Domado",
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "contato@caosdomado.com",
        "contactType": "customer service",
        "areaServed": "BR",
        "availableLanguage": ["Portuguese", "English"]
      }
    }
  };

  return (
    <div className="hp-root">
      <section className="hp-section page--contact-visual">
        <Seo
          title={t("nav.contact")}
          description={t("pages.contact.description")}
          jsonLd={jsonLd}
        />
        {/* Background Decor */}
        <div className="contact-bg-gradient" aria-hidden="true" />

        <header className="contact-page-header">
          <h1 className="contact-title">
            {t("pages.contact.title")}
            <span className="text-brand">.</span>
          </h1>
          <p className="contact-description">{t("pages.contact.description")}</p>
        </header>

        <div className="contact-container">
          <div className="contact-form-wrapper" id="contact-form">
            <div className="contact-form-card">
              <div className="form-header">
                <h2 className="form-header-title">
                  {t("pages.contact.infoTitle")}
                </h2>
                <p className="form-header-subtitle">
                  {t("pages.contact.infoDescription")}
                </p>
              </div>

              {hasSubmitted ? (
                <div className="success-message" role="status" aria-live="polite">
                  <div className="success-icon-wrapper">
                    <CheckCircle2 size={48} className="text-success" />
                  </div>
                  <h3>{t("pages.contact.form.success")}</h3>
                  <button
                    type="button"
                    onClick={() => setHasSubmitted(false)}
                    className="btn btn--ghost btn--small mt-4"
                  >
                    {t("pages.contact.form.sendAnother")}
                  </button>
                </div>
              ) : (
                <form
                  className="modern-form"
                  onSubmit={handleSubmit}
                  aria-busy={isSubmitting}
                  aria-describedby={helperTextId}
                >
                  <div className="form-helper">
                    <p id={helperTextId} className="form-helper-text">
                      {formHelpLabel}
                    </p>
                    <p className="form-helper-text">
                      {emailAlternativeLabel}{" "}
                      <a
                        href={`mailto:${t("pages.contact.emailValue")}`}
                        className="underline"
                      >
                        {t("pages.contact.emailValue")}
                      </a>
                      .
                    </p>
                  </div>
                  {errorMessage && (
                    <div
                      role="alert"
                      className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400"
                    >
                      <p>{errorMessage}</p>
                    </div>
                  )}
                  <div className="form-row-split">
                    <div className="form-group">
                      <label htmlFor="name" className="form-label">
                        {t("pages.contact.form.nameLabel")}
                      </label>
                      <div className="input-wrapper">
                        <User size={18} className="input-icon" />
                        <input
                          id="name"
                          name="name"
                          type="text"
                          autoComplete="name"
                          required
                          disabled={isSubmitting}
                          placeholder={t("pages.contact.form.namePlaceholder")}
                          className="form-input has-icon"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="company" className="form-label">
                        {t("pages.contact.form.companyLabel")}
                      </label>
                      <div className="input-wrapper">
                        <Building size={18} className="input-icon" />
                        <input
                          id="company"
                          name="company"
                          type="text"
                          autoComplete="organization"
                          disabled={isSubmitting}
                          placeholder={t("pages.contact.form.companyPlaceholder")}
                          className="form-input has-icon"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      {t("pages.contact.form.emailLabel")}
                    </label>
                    <div className="input-wrapper">
                      <Mail size={18} className="input-icon" />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        inputMode="email"
                        autoCapitalize="none"
                        autoComplete="email"
                        required
                        disabled={isSubmitting}
                        placeholder={t("pages.contact.form.emailPlaceholder")}
                        className="form-input has-icon"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message" className="form-label">
                      {t("pages.contact.form.messageLabel")}
                    </label>
                    <div className="input-wrapper textarea-wrapper">
                      <MessageSquare size={18} className="input-icon mt-3" />
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        autoComplete="off"
                        spellCheck={true}
                        required
                        disabled={isSubmitting}
                        placeholder={t("pages.contact.form.messagePlaceholder")}
                        aria-describedby={messageHintId}
                        className="form-textarea has-icon"
                      />
                    </div>
                    <p id={messageHintId} className="form-field-hint">
                      {locale === "pt"
                        ? "Dica: inclua prazo, objetivo e links relevantes (se houver)."
                        : "Tip: include timeline, goals and relevant links (if any)."}
                    </p>
                  </div>

                  <button
                    className="hp-btn-primary hp-btn-primary--wide mt-6"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 size={18} className="animate-spin" />
                        {t("pages.contact.form.sending")}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        {t("pages.contact.form.submit")} <Send size={18} />
                      </span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="contact-info">
            <div className="contact-cards-grid">
              <a
                href={`mailto:${t("pages.contact.emailValue")}`}
                className="contact-card-item group"
              >
                <div className="contact-card-icon">
                  <Mail size={24} />
                </div>
                <div className="contact-card-content">
                  <h3>{t("pages.contact.emailLabel")}</h3>
                  <p>{t("pages.contact.emailValue")}</p>
                </div>
                <div className="contact-card-arrow">
                  <ArrowRight size={20} />
                </div>
              </a>

              <div className="contact-card-item">
                <div className="contact-card-icon">
                  <MapPin size={24} />
                </div>
                <div className="contact-card-content">
                  <h3>{t("pages.contact.locationLabel")}</h3>
                  <p>{t("pages.contact.locationValue")}</p>
                </div>
              </div>
            </div>

            <div className="contact-visual-image-wrapper">
              <img
                src={contactImage}
                alt={t("pages.contact.heroImageAlt")}
                className="contact-visual-image"
                decoding="async"
                loading="lazy"
              />
              <div className="contact-visual-overlay">
                <p className="font-semibold text-white">
                  {t("pages.contact.heroQuote")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
