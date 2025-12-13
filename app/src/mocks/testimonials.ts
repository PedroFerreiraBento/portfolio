import type { Testimonial } from "../types/domain";

export const testimonials: Testimonial[] = [
  {
    id: "testi-ecommerce-otimizacao-estoque",
    authorName: "Ana Silva",
    authorRole: "Head de Operações",
    company: "E-commerce de Moda X",
    quote: {
      pt: "Conseguimos reduzir rupturas de estoque sem aumentar o capital imobilizado. O time da Caos Domado trouxe clareza e dados em todas as decisões.",
      en: "We reduced stock-outs without increasing tied-up capital. Caos Domado brought clarity and data to every decision.",
    },
    relatedProjectId: "proj-otimizacao-estoque-ecommerce",
  },
];
