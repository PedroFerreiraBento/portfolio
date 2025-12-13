# Caos Domado – Modelo de Dados e Mocks

Este documento descreve o **modelo de dados** que será usado no portfólio Caos Domado e como esses dados serão representados em **mocks locais** (sem backend, sem banco de dados).

A ideia é tratar os mocks como se fossem o contrato de uma API real, de forma que, no futuro, a migração para um backend seja mais simples.

---

## 1. Princípios gerais do modelo de dados

- **Estático e local no MVP**:
  - Todos os dados vêm de arquivos em `src/mocks/*.ts`.
  - Não há requisições HTTP reais.
- **Fortemente tipado (TypeScript)**:
  - Tipos/Interfaces para cada entidade (Project, Category, Service, Tech, etc.).
  - Facilita refatoração e uso correto dos dados em componentes.
- **Pensado para crescer**:
  - Campos já preveem informações de negócio (problema, solução, resultados, tecnologias).
  - Espaço para extensões (mais idiomas, mais entidades, integrações reais).
- **Multi-idioma nos dados**:
  - No MVP, os dados podem estar em um idioma base (pt) e serem mostrados em ambos os idiomas.
  - Para textos mais longos e específicos de projetos, o modelo já considera a possibilidade de armazenar variações por idioma.

---

## 2. Estrutura de arquivos de mocks sugerida

Na pasta `src/mocks/`:

````text
src/
  mocks/
    projects.ts
    categories.ts
    services.ts
    techs.ts
    testimonials.ts
    team.ts
``

Opcionalmente, os tipos podem ficar em `src/types/`, por exemplo:

```text
src/
  types/
    project.ts
    category.ts
    service.ts
    tech.ts
    testimonial.ts
    team.ts
    common.ts         # Tipos compartilhados (Locale, LocalizedString, etc.)
````

Para simplificar, é possível definir os tipos no próprio arquivo de mocks e extrair depois, se necessário.

---

## 3. Convenções de IDs, slugs e datas

### 3.1. IDs

- `id` sempre em formato `string`.
- Pode ser um identificador estável, legível ou um UUID, mas com preferência para algo curto e amigável:
  - Ex.: `"proj-caos-ecommerce-otimizacao-estoque"`, `"cat-data-science"`, `"service-dashboards"`.

### 3.2. Slugs

- Usados para compor URLs (ex.: `/projetos/:slug`).
- Convenções:
  - Minúsculo.
  - Sem acentos.
  - Palavras separadas por hífens.
  - Sem espaços e caracteres especiais.
- Exemplo:
  - Título: `"Otimização de estoque para e-commerce"` → slug: `"otimizacao-estoque-ecommerce"`.

### 3.3. Datas e tempo

- Para o portfólio, **não há necessidade de datas completas** (timestamp) no MVP.
- Suficiente:
  - `year: number` (ex.: 2023).
  - `duration: string` (ex.: "3 meses", "6 semanas").
- Caso precise de maior precisão, pode-se evoluir para:
  - `startDate: string` e `endDate: string` no formato ISO (`YYYY-MM-DD`).

---

## 4. Tipos auxiliares

### 4.1. Locale e LocalizedString

Para campos que podem variar por idioma:

```ts
export type Locale = "pt" | "en";

export type LocalizedString = {
  pt: string;
  en: string;
};
```

Uso recomendado:

- Para textos mais longos e específicos de projetos (ex.: descrição do problema, solução, resultados), podemos usar `LocalizedString`.
- Para textos simples, é aceitável usar apenas `string` no idioma principal, deixando a tradução para i18n posterior.

---

## 5. Entidade Category (Categoria de projetos)

Representa agrupamentos de projetos (ex.: Produtos Digitais, Data Science, Dashboards, Automação, MLOps, etc.).

### 5.1. Tipo

```ts
export type CategoryId = string;

export interface Category {
  id: CategoryId;
  slug: string;
  name: string;
  description: string;
  icon?: string;
  order: number;
}
```

### 5.2. Regras

- `id` e `slug` devem ser únicos.
- `order` define a ordenação em que as categorias aparecem na Home e em filtros.
- `icon` pode ser:
  - Nome de um ícone (se usar uma lib de ícones).
  - Caminho para um asset em `src/assets`.

### 5.3. Exemplo de mocks (`categories.ts`)

```ts
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
```

---

## 6. Entidade Tech (Tecnologia)

Representa tecnologias, frameworks, bibliotecas ou ferramentas utilizadas nos projetos.

### 6.1. Tipo

```ts
export type TechId = string;

export type TechType =
  | "frontend"
  | "backend"
  | "data-science"
  | "data-engineering"
  | "mlops"
  | "devops"
  | "design";

export interface Tech {
  id: TechId;
  name: string;
  type: TechType;
  icon?: string;
}
```

### 6.2. Exemplos (`techs.ts`)

```ts
export const techs: Tech[] = [
  { id: "react", name: "React", type: "frontend", icon: "react" },
  {
    id: "typescript",
    name: "TypeScript",
    type: "frontend",
    icon: "typescript",
  },
  { id: "python", name: "Python", type: "data-science", icon: "python" },
  { id: "fastapi", name: "FastAPI", type: "backend", icon: "fastapi" },
  { id: "dbt", name: "dbt", type: "data-engineering", icon: "dbt" },
  { id: "airflow", name: "Apache Airflow", type: "mlops", icon: "airflow" },
];
```

### 6.3. Uso

- Em `Project`, guardamos apenas `techIds: TechId[]`.
- Em componentes, fazemos o `join` usando `techs`.

---

## 7. Entidade Project (Projeto)

Coração do portfólio: cada case ou projeto entregue.

### 7.1. Tipo base

```ts
export type ProjectId = string;

export type ProjectStatus = "interno" | "poc" | "em-producao";

export interface ProjectResultMetric {
  label: string;
  value?: number;
  unit?: string;
  description?: string;
}

export interface Project {
  id: ProjectId;
  slug: string;
  title: LocalizedString;
  subtitle: LocalizedString;
  categoryIds: CategoryId[];
  client: string;
  problem: LocalizedString;
  solution: LocalizedString;
  results: ProjectResultMetric[];
  techIds: TechId[];
  duration?: string;
  year?: number;
  status?: ProjectStatus;
  highlight?: boolean;
  thumbnail?: string;
  gallery?: string[];
}
```

### 7.2. Comentários sobre multi-idioma

- `title`, `subtitle`, `problem` e `solution` usam `LocalizedString`:
  - Facilita exibir textos completos tanto em pt quanto en, respeitando o idioma atual do i18n.
- `results` pode misturar números e descrições, e geralmente funciona bem traduzindo apenas o `label`/`description`.

### 7.3. Exemplo de projeto mock (`projects.ts`)

```ts
export const projects: Project[] = [
  {
    id: "proj-otimizacao-estoque-ecommerce",
    slug: "otimizacao-estoque-ecommerce",
    title: {
      pt: "Otimização de estoque para e-commerce",
      en: "Inventory optimization for e-commerce",
    },
    subtitle: {
      pt: "Redução de ruptura e excesso de estoque em uma grande operação online.",
      en: "Reducing stock-outs and overstock in a large online operation.",
    },
    categoryIds: ["cat-data-science"],
    client: "E-commerce fictício do segmento de moda",
    problem: {
      pt: "O cliente sofria com rupturas de estoque em itens de alta demanda e excesso de estoque em produtos de baixa saída.",
      en: "The client faced stock-outs for high-demand items and overstock for slow-moving products.",
    },
    solution: {
      pt: "Construímos um modelo de previsão de demanda e uma política de reposição otimizada por SKU e loja.",
      en: "We built a demand forecasting model and an optimized replenishment policy per SKU and store.",
    },
    results: [
      {
        label: "Redução de ruptura",
        value: 35,
        unit: "%",
        description:
          "Queda nas ocorrências de falta de estoque em SKUs críticos.",
      },
      {
        label: "Redução de capital imobilizado",
        value: 18,
        unit: "%",
        description:
          "Menor volume médio de estoque em produtos de baixa saída.",
      },
    ],
    techIds: ["python", "dbt", "airflow"],
    duration: "4 meses",
    year: 2024,
    status: "em-producao",
    highlight: true,
    thumbnail: "/assets/projects/otimizacao-estoque-cover.png",
    gallery: ["/assets/projects/otimizacao-estoque-1.png"],
  },
];
```

---

## 8. Entidade Service (Serviço)

Representa tipos de serviços oferecidos pela Caos Domado.

### 8.1. Tipo

```ts
export type ServiceId = string;

export interface Service {
  id: ServiceId;
  slug: string;
  name: LocalizedString;
  shortDescription: LocalizedString;
  longDescription: LocalizedString;
  deliverables: LocalizedString[];
  techIds?: TechId[];
  relatedProjectIds?: ProjectId[];
}
```

### 8.2. Exemplo (`services.ts`)

```ts
export const services: Service[] = [
  {
    id: "service-produtos-digitais",
    slug: "produtos-digitais",
    name: {
      pt: "Desenvolvimento de Produtos Digitais",
      en: "Digital Product Development",
    },
    shortDescription: {
      pt: "Da ideia ao produto em produção, com foco em experimento e aprendizado.",
      en: "From idea to production, with focus on experimentation and learning.",
    },
    longDescription: {
      pt: "Apoiamos desde a descoberta do problema até a implementação e medição de resultados.",
      en: "We support from problem discovery to implementation and result measurement.",
    },
    deliverables: [
      {
        pt: "Aplicações web responsivas",
        en: "Responsive web applications",
      },
      {
        pt: "APIs escaláveis",
        en: "Scalable APIs",
      },
    ],
    techIds: ["react", "typescript", "fastapi"],
    relatedProjectIds: ["proj-otimizacao-estoque-ecommerce"],
  },
];
```

---

## 9. Entidade Testimonial (Depoimento)

Opicional, mas interessante para dar credibilidade aos cases.

### 9.1. Tipo

```ts
export type TestimonialId = string;

export interface Testimonial {
  id: TestimonialId;
  authorName: string;
  authorRole: string;
  company?: string;
  quote: LocalizedString;
  relatedProjectId?: ProjectId;
}
```

### 9.2. Exemplo (`testimonials.ts`)

```ts
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
```

---

## 10. Entidade TeamMember (Membro do time)

Para uso na página "Sobre".

### 10.1. Tipo

```ts
export type TeamMemberId = string;

export interface TeamMember {
  id: TeamMemberId;
  name: string;
  role: string;
  bio: LocalizedString;
  photo?: string;
  skills?: string[];
}
```

### 10.2. Exemplo (`team.ts`)

```ts
export const team: TeamMember[] = [
  {
    id: "member-joao",
    name: "João Pereira",
    role: "Engenheiro de Software",
    bio: {
      pt: "Especializado em arquitetura de aplicações web e boas práticas de engenharia.",
      en: "Specialized in web application architecture and software engineering best practices.",
    },
    skills: ["React", "TypeScript", "Arquitetura"],
  },
  {
    id: "member-maria",
    name: "Maria Costa",
    role: "Cientista de Dados",
    bio: {
      pt: "Focada em modelos preditivos e experimentação orientada a métricas de negócio.",
      en: "Focused on predictive models and metric-driven experimentation.",
    },
    skills: ["Python", "Machine Learning", "Experimentação"],
  },
];
```

---

## 11. Relações entre entidades

### 11.1. Mapa geral

- **Category 1—N Project**
  - Uma categoria possui vários projetos.
  - Um projeto pode pertencer a mais de uma categoria (`categoryIds: CategoryId[]`).
- **Tech N—N Project**
  - Um projeto usa várias tecnologias.
  - Uma tecnologia aparece em vários projetos.
- **Service N—N Project** (via `relatedProjectIds`)
  - Um serviço pode referenciar diversos projetos que ilustram aquele tipo de entrega.
  - Um projeto pode aparecer em múltiplos serviços.
- **Testimonial 1—(0|1) Project**
  - Um depoimento pode estar ligado a um projeto específico.
- **TeamMember**
  - Associado conceitualmente a projetos/serviços, mas no MVP não precisamos amarrar isso via IDs.

---

## 12. Uso do modelo nas páginas

### 12.1. Home (`/`)

- Consome:
  - `categories` + `projects` para montar **carrosséis por categoria**:
    - Para cada categoria, filtra `projects` por `categoryIds`.
  - Possíveis destaques:
    - Projetos com `highlight === true` como "Projetos em evidência".

### 12.2. Lista de projetos (`/projetos`)

- Consome:
  - `projects`, `categories`, `techs`.
- Filtros possíveis:
  - Por categoria (dropdown baseado em `categories`).
  - Por tecnologia (multi-select baseado em `techs`).
  - Por texto (título, cliente, resumo).

### 12.3. Detalhe do projeto (`/projetos/:slug`)

- Encontra o projeto pelo `slug`.
- Enriquece com:
  - Categorias do projeto (`categoryIds`).
  - Tecnologias (`techIds` → `techs`).
  - Serviços relacionados (`services` que contenham esse `ProjectId` em `relatedProjectIds`).
  - Depoimentos associados (`testimonials` por `relatedProjectId`).

### 12.4. Serviços (`/servicos`)

- Lista `services`.
- Para cada serviço:
  - Mostra nome, descrições e entregáveis.
  - Opcionalmente, projetos relacionados (cards/link para `/projetos/:slug`).

### 12.5. Sobre (`/sobre`)

- Consome `team` para mostrar membros do time.
- Pode também exibir contadores agregados derivados de `projects` (ex.: número de projetos, anos de experiência combinada, etc.).

---

## 13. Funções utilitárias para trabalhar com mocks

Sugere-se criar funções em `src/utils/` ou hooks em `src/hooks/` para centralizar a lógica sobre os mocks.

### 13.1. Exemplos de utilitários

```ts
// Filtra projetos por categoria
export function getProjectsByCategory(
  projects: Project[],
  categoryId: CategoryId
) {
  return projects.filter((project) => project.categoryIds.includes(categoryId));
}

// Busca projeto pelo slug
export function getProjectBySlug(projects: Project[], slug: string) {
  return projects.find((project) => project.slug === slug) ?? null;
}

// Filtra projetos por termo de busca
export function searchProjects(projects: Project[], term: string) {
  const normalized = term.trim().toLowerCase();
  if (!normalized) return projects;

  return projects.filter((project) => {
    const haystack = [
      project.title.pt,
      project.title.en,
      project.subtitle.pt,
      project.subtitle.en,
      project.client,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalized);
  });
}
```

Essas funções podem ser usadas em hooks como `useFilteredProjects`, que conectam os dados a estados de filtro na UI.

---

## 14. Roadmap de evolução do modelo

1. **MVP (fase atual)**

   - Mocks estáticos em arquivos `.ts`.
   - Dados suficientes para demonstrar:
     - Lista de projetos.
     - Carrosséis por categoria.
     - Detalhe de projeto.
     - Lista de serviços.
     - Time e depoimentos básicos.

2. **Fase 2 – Enriquecimento**

   - Mais campos em `Project` (ex.: tamanho do time, stack de infra, complexidade técnica).
   - Mais `Testimonial`s.
   - Relacionar explicitamente `TeamMember` a projetos.

3. **Fase 3 – API real**

   - Criar um backend (ex.: FastAPI, NestJS, etc.) expondo endpoints que respeitam o modelo aqui documentado.
   - Substituir `mocks/*` por chamadas de API, mantendo o mesmo shape de dados.

4. **Fase 4 – CMS/Admin**
   - Implementar uma camada administrativa para gerenciar projetos, serviços, depoimentos e time.
   - Opcionalmente, armazenar dados em um banco real (PostgreSQL, etc.), mantendo o contrato do frontend.

Este modelo de dados foi desenhado para suportar o portfólio que você descreveu, com ênfase em **clareza de casos**, **narrativa de valor** e **capacidade de evolução para um cenário real de produção**.
