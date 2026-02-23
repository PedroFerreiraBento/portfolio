import type { Testimonial } from "../types/domain";

export const testimonials: Testimonial[] = [
  {
    id: "testi-ecommerce-otimizacao-estoque",
    authorName: "Mariana Souza",
    authorRole: "Diretora de Supply",
    company: "Grupo de Moda Varejista",
    quote: {
      pt: "Antes da consultoria, perdíamos vendas toda semana por furos na grade, enquanto o estoque geral só inchava. O algoritmo de previsão que a Caos Domado construiu estabilizou nosso overstock e cortou as rupturas pela metade em apenas 3 meses.",
      en: "Before the consultancy, we lost sales every week due to lack of sizing, while total inventory kept swelling. The forecasting algorithm Caos Domado built stabilized our overstock and cut stock-outs in half in just 3 months.",
    },
    relatedProjectId: "proj-otimizacao-estoque-ecommerce",
  },
  {
    id: "testi-dashboard-logistica",
    authorName: "Carlos Mendes",
    authorRole: "Diretor de Logística",
    company: "TransNacional Express",
    quote: {
      pt: "O painel de monitoramento que construíram revolucionou nossa operação técnica. Temos visibilidade em tempo real, economizando horas de relatórios manuais por semana.",
      en: "The tracking dashboard they built revolutionized our technical operation. We have real-time visibility, saving hours of manual reporting every week.",
    },
    relatedProjectId: "proj-dashboard-operacao-logistica",
  },
  {
    id: "testi-landing-saas",
    authorName: "Juliana Costa",
    authorRole: "CMO",
    company: "TechNexus B2B",
    quote: {
      pt: "Trabalhar com a equipe foi sensacional. Desde o primeiro dia provaram profundo entendimento técnico. A nova arquitetura aumentou nossas conversões em 40%.",
      en: "Working with the team was sensational. From day one they proved deep technical understanding. The new architecture increased our conversions by 40%.",
    },
    relatedProjectId: "proj-landing-saas-b2b",
  },
];
