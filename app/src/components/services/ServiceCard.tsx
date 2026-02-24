import { useI18n } from "../../i18n";
import type { Service } from "../../types/domain";
import { Link } from "react-router-dom";
import { OptimizedImage } from "../common/OptimizedImage";

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const { t } = useI18n();

  const baseKey = `serviceContent.${service.id}`;
  const name = t(`${baseKey}.name`);
  const shortDescription = t(`${baseKey}.shortDescription`);

  // Deliverables are indexed 0, 1, 2, 3 in the translation file
  // We'll try to fetch up to 3 of them
  const deliverables = [0, 1, 2]
    .map((i) => t(`${baseKey}.deliverables.${i}`))
    .filter((text) => text && !text.includes(baseKey)); // Filter out if translation key is returned

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border-subtle bg-bg-card transition-all hover:border-brand-soft hover:shadow-md service-card">
      {service.thumbnail && (
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-bg-soft">
          <OptimizedImage
            src={service.thumbnail}
            alt={name}
            width={800}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            decoding="async"
            style={{ willChange: "transform, opacity" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-card/80 to-transparent opacity-60" />
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold text-text-strong group-hover:text-brand">
          {name}
        </h3>

        <p className="mt-2 flex-1 text-sm text-text-soft">{shortDescription}</p>

        {deliverables.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-text-muted service-deliverable-label">
              {t("pages.services.deliverablesLabel") || "O que entregamos"}
            </p>
            <ul className="space-y-1">
              {deliverables.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-xs text-text-soft service-deliverable-item"
                >
                  <span className="block h-1 w-1 rounded-full bg-brand service-deliverable-bullet" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-border-subtle">
          <Link
            to="/contato"
            className="hp-btn-outline hp-btn-outline--wide"
          >
            {t("pages.services.card.actionLabel") || "Tenho interesse"}
            <svg
              className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
