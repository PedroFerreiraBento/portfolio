import type { Category } from "../types/domain";

export const categories: Category[] = [
  {
    id: "cat-produtos-digitais",
    slug: "produtos-digitais",
    name: "Produtos Digitais",
    description: "Aplicações web e mobile do zero, com foco em produto.",
    icon: "app-window",
    order: 1,
  },
  {
    id: "cat-data-science",
    slug: "data-science",
    name: "Data Science & ML",
    description: "Modelos de machine learning e análise avançada de dados.",
    icon: "sparkles",
    order: 2,
  },
  {
    id: "cat-dashboards",
    slug: "dashboards",
    name: "Dashboards & BI",
    description: "Visualizações e painéis para tomada de decisão.",
    icon: "bar-chart",
    order: 3,
  },
];
