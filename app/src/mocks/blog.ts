import type { BlogPost } from "../types/domain";

export const blogPosts: BlogPost[] = [
    {
        id: "post-1",
        slug: "como-automatizar-processos",
        title: "Como identificar processos que precisam de automação na sua empresa",
        excerpt:
            "Nem tudo deve ser automatizado. Aprenda a identificar gargalos reais e calcular o ROI de automações antes de escrever uma linha de código.",
        content: "Conteúdo do post...",
        authorId: "member-1", // Assuming member-1 exists in team mock, or just string
        date: "2023-10-15",
        readTime: 5,
        categoryIds: ["cat-produtos-digitais"],
        imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000",
    },
    {
        id: "post-2",
        slug: "data-science-na-pratica",
        title: "Data Science além do hype: resolvendo problemas reais",
        excerpt:
            "Esqueça a IA generativa por um minuto. Vamos falar sobre como regressão linear e estatística básica podem salvar o caixa da sua empresa.",
        content: "Conteúdo do post...",
        authorId: "member-2",
        date: "2023-11-02",
        readTime: 8,
        categoryIds: ["cat-data-science"],
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000",
    },
    {
        id: "post-3",
        slug: "dashboards-que-funcionam",
        title: "Por que seus dashboards não são usados pela diretoria?",
        excerpt:
            "O problema não é a ferramenta (PowerBI, Metabase, Tableau), é o design de informação. Veja como criar painéis que geram ação.",
        content: "Conteúdo do post...",
        authorId: "member-1",
        date: "2023-11-20",
        readTime: 6,
        categoryIds: ["cat-dashboards"],
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000",
    },
];
