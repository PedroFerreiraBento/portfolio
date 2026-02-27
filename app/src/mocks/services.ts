import type { Service } from "../types/domain";

export const services: Service[] = [
  {
    id: "service-produtos-digitais",
    slug: "produtos-digitais",
    techIds: ["react", "typescript", "fastapi", "python"],
    relatedProjectIds: [
      "proj-otimizacao-estoque-ecommerce",
      "proj-pdv-offline-first",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426&ixlib=rb-4.0.3",
  },
  {
    id: "service-data-science",
    slug: "data-science",
    techIds: ["python", "dbt", "airflow"],
    thumbnail:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3",
  },
  {
    id: "service-dashboards",
    slug: "dashboards",
    techIds: ["python", "dbt"],
    thumbnail:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3",
  },
  {
    id: "service-automacao",
    slug: "automacao",
    techIds: ["python", "airflow", "fastapi"],
    thumbnail:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3",
  },
];
