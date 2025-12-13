import { Link } from "react-router-dom";
import { useI18n } from "../../i18n";
import type { Project } from "../../types/domain";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { t } = useI18n();

  const baseKey = `projectContent.${project.id}`;
  const title = t(`${baseKey}.title`);
  const subtitle = t(`${baseKey}.subtitle`);
  const client = t(`${baseKey}.client`);

  const fallbackImage =
    "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800";
  const imageUrl = project.thumbnail || fallbackImage;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border-subtle bg-bg-card transition-all hover:border-brand-soft hover:shadow-md">
      <div className="relative h-40 w-full overflow-hidden bg-bg-soft">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-card/90 to-transparent opacity-60" />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <header className="space-y-1">
          <h3 className="text-base font-semibold text-text-strong line-clamp-2 group-hover:text-brand">
            {title}
          </h3>
          {subtitle && (
            <p className="line-clamp-3 text-sm text-text-soft">{subtitle}</p>
          )}
        </header>

        <div className="mt-auto pt-2">
          {client && (
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-bg-soft px-2.5 py-0.5 text-xs font-medium text-text-muted border border-border-subtle">
                {client}
              </span>
            </div>
          )}

          <footer className="flex flex-col gap-2 pt-2 border-t border-border-subtle">
            <Link
              to={`/projetos/${project.slug}`}
              className="inline-flex w-full items-center justify-center rounded-md bg-brand-soft px-3 py-2 text-sm font-medium text-brand transition-colors hover:bg-brand hover:text-white group/btn"
            >
              {t("pages.projects.card.viewDetails")}
              <svg
                className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1"
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
          </footer>
        </div>
      </div>
    </article>
  );
}
