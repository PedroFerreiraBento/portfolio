import type { Project } from "../types/domain";
import StockRepositionImg from "../assets/images/components/Project/Stock_Reposition.png";
import ClientKeepImg from "../assets/images/components/Project/Client_Keep.png";
import SellingPageImg from "../assets/images/components/Project/Selling Page.png";
import DeliverManagementImg from "../assets/images/components/Project/Deliver Management.png";
import SoftwareUsageMapImg from "../assets/images/components/Project/Software Usage Map.png";
import ClientRebuyImg from "../assets/images/components/Project/Client_Rebuy.png";
import ProductionRequiredImg from "../assets/images/components/Project/ProductionRequired.png";

// External Images
import ImgStockRepositionGallery from "../assets/images/external/stock-reposition.jpg";
import ImgClientKeepGallery from "../assets/images/external/client-keep.jpg";
import ImgClientRebuyGallery from "../assets/images/external/client-rebuy.jpg";
import ImgFraud1 from "../assets/images/external/fraud-detection-1.jpg";
import ImgFraud2 from "../assets/images/external/fraud-detection-2.jpg";
import ImgProductionReqGallery from "../assets/images/external/production-req.jpg";
import ImgLandingSaasGallery from "../assets/images/external/landing-saas-1.jpg";
import ImgPortalB2BThumb from "../assets/images/external/portal-b2b-1.jpg";
import ImgPortalB2BGallery from "../assets/images/external/portal-b2b-2.jpg";
import ImgAppSalesThumb from "../assets/images/external/app-sales-1.jpg";
import ImgAppSalesGallery from "../assets/images/external/app-sales-2.jpg";
import ImgBackofficeThumb from "../assets/images/external/backoffice-1.jpg";
import ImgBackofficeGallery from "../assets/images/external/backoffice-2.jpg";
import ImgMarketplaceThumb from "../assets/images/external/marketplace-1.jpg";
import ImgMarketplaceGallery from "../assets/images/external/marketplace-2.jpg";
import ImgDashExecThumb from "../assets/images/external/dash-exec-1.jpg";
import ImgDashExecGallery from "../assets/images/external/landing-saas-1.jpg"; // Reused in original
import ImgDashLogisticsGallery from "../assets/images/external/dash-logistics-1.jpg";
import ImgDashSaasGallery from "../assets/images/external/dash-saas-1.jpg";
import ImgDashMarketingThumb from "../assets/images/external/dash-marketing-1.jpg";
import ImgDashMarketingGallery from "../assets/images/external/stock-reposition.jpg"; // Reused in original
import ImgDashFinanceThumb from "../assets/images/external/dash-finance-1.jpg";
import ImgDashFinanceGallery from "../assets/images/external/dash-finance-2.jpg";
import ImgPdvLoginChoice from "../assets/images/external/pdv/01-login-escolha.png";
import ImgPdvLoginAdmin from "../assets/images/external/pdv/02-login-admin.png";
import ImgPdvPortal from "../assets/images/external/pdv/03-portal.png";
import ImgPdvDashboardOverview from "../assets/images/external/pdv/04-dashboard-overview.png";
import ImgPdvDashboardSales from "../assets/images/external/pdv/05-dashboard-vendas.png";
import ImgPdvBranchSettings from "../assets/images/external/pdv/06-dashboard-config-filiais.png";
import ImgPdvTerminal from "../assets/images/external/pdv/07-pdv.png";
import ImgPdvTabManagement from "../assets/images/external/pdv/08-pdv-fiados.png";

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
    thumbnail: StockRepositionImg,
    gallery: [ImgStockRepositionGallery],
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
    thumbnail: ClientKeepImg,
    gallery: [ImgClientKeepGallery],
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
    thumbnail: ClientRebuyImg,
    gallery: [ImgClientRebuyGallery],
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
    thumbnail: ImgFraud1,
    gallery: [ImgFraud2],
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
    thumbnail: ProductionRequiredImg,
    gallery: [ImgProductionReqGallery],
  },

  // PRODUTOS DIGITAIS
  {
    id: "proj-pdv-offline-first",
    slug: "pdv-offline-first-multiplataforma",
    categoryIds: ["cat-produtos-digitais"],
    results: [
      { value: 42, unit: "%" },
      { value: 63, unit: "%" },
      { value: 37, unit: "%" },
    ],
    techIds: ["react", "typescript", "fastapi"],
    year: 2025,
    duration: "5 mo",
    status: "em-producao",
    highlight: true,
    thumbnail: ImgPdvPortal,
    gallery: [
      ImgPdvPortal,
      ImgPdvDashboardOverview,
      ImgPdvDashboardSales,
      ImgPdvBranchSettings,
      ImgPdvTerminal,
      ImgPdvTabManagement,
      ImgPdvLoginChoice,
      ImgPdvLoginAdmin,
    ],
  },
  {
    id: "proj-landing-saas-b2b",
    slug: "landing-page-saas-b2b",
    categoryIds: ["cat-produtos-digitais"],
    results: [
      { value: 32, unit: "%" },
      { value: 18, unit: "%" },
    ],
    techIds: ["react", "typescript", "fastapi"],
    thumbnail: SellingPageImg,
    gallery: [ImgLandingSaasGallery],
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
    thumbnail: ImgPortalB2BThumb,
    gallery: [ImgPortalB2BGallery],
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
    thumbnail: ImgAppSalesThumb,
    gallery: [ImgAppSalesGallery],
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
    thumbnail: ImgBackofficeThumb,
    gallery: [ImgBackofficeGallery],
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
    thumbnail: ImgMarketplaceThumb,
    gallery: [ImgMarketplaceGallery],
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
    thumbnail: ImgDashExecThumb,
    gallery: [ImgDashExecGallery],
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
    thumbnail: DeliverManagementImg,
    gallery: [ImgDashLogisticsGallery],
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
    thumbnail: SoftwareUsageMapImg,
    gallery: [ImgDashSaasGallery],
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
    thumbnail: ImgDashMarketingThumb,
    gallery: [ImgDashMarketingGallery],
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
    thumbnail: ImgDashFinanceThumb,
    gallery: [ImgDashFinanceGallery],
  },
];
