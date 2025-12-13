import type { Project } from "../types/domain";

export const projects: Project[] = [
  // DATA SCIENCE & ML
  {
    id: "proj-otimizacao-estoque-ecommerce",
    slug: "otimizacao-estoque-ecommerce",
    categoryIds: ["cat-data-science"],
    results: [
      { value: 35, unit: "%" },
      { value: 18, unit: "%" },
    ],
    techIds: ["python", "dbt", "airflow"],
    highlight: true,
    thumbnail:
      "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800",
    gallery: [
      "https://images.pexels.com/photos/6476587/pexels-photo-6476587.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
  },
  {
    id: "proj-churn-saas-b2b",
    slug: "reducao-churn-saas-b2b",
    categoryIds: ["cat-data-science"],
    results: [
      { value: 22, unit: "%" },
      { value: 15, unit: "%" },
    ],
    techIds: ["python", "dbt", "airflow"],
    thumbnail:
      "https://images.pexels.com/photos/3861972/pexels-photo-3861972.jpeg?auto=compress&cs=tinysrgb&w=800",
    gallery: [
      "https://images.pexels.com/photos/3184299/pexels-photo-3184299.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
  },
  {
    id: "proj-recomendacao-ecommerce",
    slug: "recomendacao-produtos-ecommerce",
    categoryIds: ["cat-data-science"],
    results: [
      { value: 27, unit: "%" },
      { value: 12, unit: "%" },
    ],
    techIds: ["python", "dbt", "airflow"],
    thumbnail:
      "https://images.pexels.com/photos/5632371/pexels-photo-5632371.jpeg?auto=compress&cs=tinysrgb&w=800",
    gallery: [
      "https://images.pexels.com/photos/4464438/pexels-photo-4464438.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
  },
  {
    id: "proj-deteccao-fraude-pagamentos",
    slug: "deteccao-fraude-pagamentos",
    categoryIds: ["cat-data-science"],
    results: [
      { value: 40, unit: "%" },
      { value: 25, unit: "%" },
    ],
    techIds: ["python", "airflow"],
    thumbnail:
      "https://images.pexels.com/photos/4968391/pexels-photo-4968391.jpeg?auto=compress&cs=tinysrgb&w=800",
    gallery: [
      "https://images.pexels.com/photos/3943725/pexels-photo-3943725.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
  },
  {
    id: "proj-previsao-demanda-industria",
    slug: "previsao-demanda-industria",
    categoryIds: ["cat-data-science"],
    results: [
      { value: 19, unit: "%" },
      { value: 8, unit: "%" },
    ],
    techIds: ["python", "dbt", "airflow"],
    thumbnail:
      "https://images.pexels.com/photos/37347/office-freelancer-computer-business-37347.jpeg?auto=compress&cs=tinysrgb&w=800",
    gallery: [
      "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
  },

  // PRODUTOS DIGITAIS
  {
    id: "proj-landing-saas-b2b",
    slug: "landing-page-saas-b2b",
    categoryIds: ["cat-produtos-digitais"],
    results: [
      { value: 32, unit: "%" },
      { value: 18, unit: "%" },
    ],
    techIds: ["react", "typescript", "fastapi"],
    thumbnail:
      "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=800",
    gallery: [
      "https://images.pexels.com/photos/1181670/pexels-photo-1181670.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
  },
  {
    id: "proj-portal-clientes-b2b",
    slug: "portal-clientes-b2b",
    categoryIds: ["cat-produtos-digitais"],
    results: [
      { value: 45, unit: "%" },
      { value: 30, unit: "%" },
    ],
    techIds: ["react", "typescript", "fastapi"],
    thumbnail:
      "https://images.pexels.com/photos/1181345/pexels-photo-1181345.jpeg?auto=compress&cs=tinysrgb&w=800",
    gallery: [
      "https://images.pexels.com/photos/1181304/pexels-photo-1181304.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
  },
  {
    id: "proj-app-campo-vendas",
    slug: "app-campo-equipe-vendas",
    categoryIds: ["cat-produtos-digitais"],
    results: [
      { value: 25, unit: "%" },
      { value: 17, unit: "%" },
    ],
    techIds: ["react", "typescript"],
    thumbnail:
      "https://images.pexels.com/photos/1181243/pexels-photo-1181243.jpeg?auto=compress&cs=tinysrgb&w=800",
    gallery: [
      "https://images.pexels.com/photos/1181265/pexels-photo-1181265.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
  },
  {
    id: "proj-backoffice-operacoes",
    slug: "backoffice-operacoes",
    categoryIds: ["cat-produtos-digitais"],
    results: [
      { value: 35, unit: "%" },
      { value: 20, unit: "%" },
    ],
    techIds: ["react", "typescript", "fastapi"],
    thumbnail:
      "https://images.pexels.com/photos/1181275/pexels-photo-1181275.jpeg?auto=compress&cs=tinysrgb&w=800",
    gallery: [
      "https://images.pexels.com/photos/1181356/pexels-photo-1181356.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
  },
  {
    id: "proj-mvp-marketplace-nicho",
    slug: "mvp-marketplace-nicho",
    categoryIds: ["cat-produtos-digitais"],
    results: [
      { value: 12, unit: "%" },
      { value: 28, unit: "%" },
    ],
    techIds: ["react", "typescript", "fastapi"],
    thumbnail:
      "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800",
    gallery: [
      "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
  },

  // DASHBOARDS & BI
  {
    id: "proj-dashboard-executivo",
    slug: "dashboard-executivo-c-level",
    categoryIds: ["cat-dashboards"],
    results: [
      { value: 60, unit: "%" },
      { value: 50, unit: "%" },
    ],
    techIds: ["react", "typescript", "dbt"],
    thumbnail:
      "https://images.pexels.com/photos/669619/pexels-photo-669619.jpeg?auto=compress&cs=tinysrgb&w=800",
    gallery: [
      "https://images.pexels.com/photos/1181670/pexels-photo-1181670.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
  },
  {
    id: "proj-dashboard-operacao-logistica",
    slug: "dashboard-operacao-logistica",
    categoryIds: ["cat-dashboards"],
    results: [
      { value: 22, unit: "%" },
      { value: 15, unit: "%" },
    ],
    techIds: ["react", "typescript", "dbt"],
    thumbnail:
      "https://images.pexels.com/photos/1181460/pexels-photo-1181460.jpeg?auto=compress&cs=tinysrgb&w=800",
    gallery: [
      "https://images.pexels.com/photos/1181317/pexels-photo-1181317.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
  },
  {
    id: "proj-dashboard-produto-saas",
    slug: "dashboard-produto-saas",
    categoryIds: ["cat-dashboards"],
    results: [
      { value: 18, unit: "%" },
      { value: 14, unit: "%" },
    ],
    techIds: ["react", "typescript", "dbt"],
    thumbnail:
      "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800",
    gallery: [
      "https://images.pexels.com/photos/6476584/pexels-photo-6476584.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
  },
  {
    id: "proj-dashboard-marketing-performance",
    slug: "dashboard-marketing-performance",
    categoryIds: ["cat-dashboards"],
    results: [
      { value: 25, unit: "%" },
      { value: 35, unit: "%" },
    ],
    techIds: ["react", "typescript", "dbt"],
    thumbnail:
      "https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg?auto=compress&cs=tinysrgb&w=800",
    gallery: [
      "https://images.pexels.com/photos/6476587/pexels-photo-6476587.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
  },
  {
    id: "proj-dashboard-financeiro-cashflow",
    slug: "dashboard-financeiro-cashflow",
    categoryIds: ["cat-dashboards"],
    results: [
      { value: 30, unit: "%" },
      { value: 20, unit: "%" },
    ],
    techIds: ["react", "typescript", "dbt"],
    thumbnail:
      "https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg?auto=compress&cs=tinysrgb&w=800",
    gallery: [
      "https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
  },
];
