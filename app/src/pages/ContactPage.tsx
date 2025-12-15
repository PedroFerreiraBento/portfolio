import { useState } from "react";
import type { FormEvent } from "react";
import { useI18n } from "../i18n";
import {
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  Building,
  User,
  MessageSquare,
  ArrowRight,
} from "lucide-react";

export function ContactPage() {
  const { t } = useI18n();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setHasSubmitted(false);
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get("name"),
      company: formData.get("company"),
      email: formData.get("email"),
      message: formData.get("message"),
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

  return (
    <section className="page page--contact-visual">
      {/* Background Decor */}
      <div className="contact-bg-gradient" aria-hidden="true" />

      <div className="contact-container">
        {/* Left Side: Info & Visuals */}
        <div className="contact-info">
          <div className="contact-info__header">
            <h1 className="contact-title">
              {t("pages.contact.title")}
              <span className="text-brand">.</span>
            </h1>
            <p className="contact-description">
              {t("pages.contact.description")}
            </p>
          </div>

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

          {/* New Visual Element */}
          <div className="contact-visual-image-wrapper">
            <img
              src="https://images.pexels.com/photos/37347/office-freelancer-computer-business-37347.jpeg?auto=compress&cs=tinysrgb&w=800"
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

        {/* Right Side: Form */}
        <div className="contact-form-wrapper">
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
              <form className="modern-form" onSubmit={handleSubmit}>
                {errorMessage && (
                  <div
                    role="alert"
                    className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400"
                  >
                    {errorMessage}
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
                        required
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
                      required
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
                      required
                      placeholder={t("pages.contact.form.messagePlaceholder")}
                      className="form-textarea has-icon"
                    />
                  </div>
                </div>

                <button
                  className="btn btn--primary btn--full btn--large"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
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
      </div>
    </section>
  );
}
