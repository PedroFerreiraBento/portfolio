import { Link } from "react-router-dom";
import { useI18n } from "../i18n";

export function NotFoundPage() {
  const { t } = useI18n();

  return (
    <section className="page page--not-found">
      <header className="page-header">
        <h1>{t("pages.notFound.title")}</h1>
        <p>{t("pages.notFound.description")}</p>
      </header>

      <section className="page-section">
        <Link to="/" className="btn btn--primary">
          {t("pages.notFound.backToHome")}
        </Link>
      </section>
    </section>
  );
}
