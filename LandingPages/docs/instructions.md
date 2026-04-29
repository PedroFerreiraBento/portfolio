Abaixo está uma **documentação instrucional fechada** para você usar como base ao pedir para uma IA construir suas landing pages. A ideia é evitar páginas feitas “no improviso”, mas também não transformar cada landing em um projeto complexo demais.

A decisão de construção será:

> **Astro + Tailwind CSS + daisyUI, gerando páginas estáticas, com componentes reutilizáveis e o mínimo possível de JavaScript.**

Astro é adequado porque trabalha muito bem com páginas estáticas, componentes e layouts reutilizáveis; a própria documentação organiza projetos com `src/pages`, `src/components` e `src/layouts`, e os componentes `.astro` geram HTML sem runtime client-side por padrão. ([Astro Docs][1])
Tailwind será usado para velocidade visual, e a instalação atual recomendada no Astro usa o suporte ao Tailwind 4 via comando `astro add tailwind` ou plugin Vite. ([Astro Docs][2])
daisyUI entra como acelerador de componentes, porque é um plugin para Tailwind, framework agnostic e não exige bundle JavaScript próprio. ([daisyUI][3])

---

# Documentação instrucional para construção das landing pages

## 1. Objetivo do projeto

O objetivo é construir um conjunto de landing pages para portfólio comercial, com aparência profissional, moderna, responsiva e pronta para demonstrar capacidade de venda.

Cada landing page deve parecer um projeto real, não apenas uma tela conceitual.

A construção deve priorizar:

```txt
Velocidade de produção
Reaproveitamento de estrutura
Design consistente
Boa responsividade
Código simples de manter
Facilidade para alterar manualmente depois
Publicação estática
Boa aparência para portfólio
```

Não construir como sistema complexo.
Não criar backend.
Não usar autenticação.
Não criar dashboard funcional.
Não criar banco de dados.
Não criar lógica de negócio real.

A landing page deve ser visual, comercial e demonstrativa.

---

# 2. Arquitetura final obrigatória

A stack deve ser:

```txt
Astro
Tailwind CSS
daisyUI
HTML semântico
Componentes .astro
CSS global mínimo
JavaScript vanilla apenas quando necessário
Build estático
```

Não usar:

```txt
Next.js
React
Vue
Angular
Bootstrap
jQuery
Material UI
Chakra UI
shadcn/ui
Framer Motion
GSAP
Backend
Banco de dados
CMS
Autenticação
```

A lógica é simples:

```txt
Astro organiza o projeto.
Tailwind acelera a estilização.
daisyUI acelera componentes básicos.
Componentes Astro evitam repetição.
JavaScript vanilla resolve interações pequenas.
```

---

# 3. Estrutura de pastas obrigatória

O projeto deve seguir esta estrutura:

```txt
landing-portfolio/
  public/
    images/
      placeholders/
      projects/

  src/
    components/
      common/
        Navbar.astro
        Footer.astro
        SectionHeader.astro
        Button.astro
        Badge.astro
        Container.astro

      sections/
        Hero.astro
        TrustStrip.astro
        ProblemSection.astro
        SolutionSection.astro
        BenefitsGrid.astro
        ProcessSteps.astro
        Showcase.astro
        Testimonials.astro
        FAQ.astro
        FinalCTA.astro

      ui/
        Card.astro
        StatCard.astro
        FeatureCard.astro
        TestimonialCard.astro
        IconBox.astro

    layouts/
      BaseLayout.astro
      LandingLayout.astro

    pages/
      index.astro
      landing-clinica-estetica.astro
      landing-automacao-bi.astro
      landing-saas.astro
      landing-arquitetura.astro
      landing-curso.astro

    styles/
      global.css

  astro.config.mjs
  package.json
```

A regra principal é:

> **Toda estrutura repetida deve virar componente. Toda página deve apenas montar os componentes e alterar conteúdo, tema e composição.**

Isso evita que cada nova landing seja um arquivo gigante difícil de manter.

---

# 4. Instalação inicial

Use este fluxo:

```bash
npm create astro@latest landing-portfolio
cd landing-portfolio
npx astro add tailwind
npm install daisyui
npm run dev
```

Depois, configure o daisyUI no CSS global ou na configuração conforme o padrão usado pela versão instalada.

O arquivo `src/styles/global.css` deve conter Tailwind e seus estilos globais.

Exemplo base:

```css
@import "tailwindcss";
@plugin "daisyui";
```

Se a versão do projeto pedir configuração diferente, seguir a documentação atual do Tailwind/daisyUI, mas manter a decisão arquitetural: **Tailwind como base visual e daisyUI como acelerador de componentes**.

---

# 5. Princípio central de construção

Toda landing page deve ser construída como uma composição de seções.

Não pensar assim:

```txt
“Vou fazer uma página.”
```

Pensar assim:

```txt
“Vou montar uma jornada comercial em seções reutilizáveis.”
```

Estrutura padrão:

```txt
1. Navbar
2. Hero
3. Trust Strip
4. Problema
5. Solução
6. Benefícios
7. Como funciona
8. Demonstração visual
9. Prova social
10. FAQ
11. CTA final
12. Footer
```

Nem todas as páginas precisam ter exatamente a mesma ordem visual, mas para portfólio essa estrutura é muito boa porque demonstra domínio comercial.

---

# 6. Padrão de construção de cada página

Cada landing page deve ter três partes:

```txt
1. Dados da página
2. Montagem dos componentes
3. Ajustes específicos mínimos
```

Exemplo conceitual em Astro:

```astro
---
import LandingLayout from "../layouts/LandingLayout.astro";
import Hero from "../components/sections/Hero.astro";
import TrustStrip from "../components/sections/TrustStrip.astro";
import BenefitsGrid from "../components/sections/BenefitsGrid.astro";
import ProcessSteps from "../components/sections/ProcessSteps.astro";
import FAQ from "../components/sections/FAQ.astro";
import FinalCTA from "../components/sections/FinalCTA.astro";

const page = {
  title: "Landing Page Premium",
  description: "Página demonstrativa para portfólio.",
  theme: "premium-light",
};

const hero = {
  eyebrow: "Landing page demonstrativa",
  title: "Uma página moderna, clara e feita para converter.",
  description:
    "Estrutura visual profissional para apresentar serviços, gerar confiança e conduzir o visitante até a ação.",
  primaryCta: "Solicitar orçamento",
  secondaryCta: "Ver seções",
};

const benefits = [
  {
    title: "Design responsivo",
    description: "Experiência refinada em desktop, tablet e celular.",
  },
  {
    title: "Estrutura comercial",
    description: "Seções pensadas para apresentar valor e reduzir objeções.",
  },
  {
    title: "CTA bem posicionado",
    description: "Chamadas para ação no início, meio e final da página.",
  },
];
---

<LandingLayout title={page.title} description={page.description} theme={page.theme}>
  <Hero {...hero} />
  <TrustStrip />
  <BenefitsGrid items={benefits} />
  <ProcessSteps />
  <FAQ />
  <FinalCTA />
</LandingLayout>
```

A IA deve seguir esse raciocínio: **conteúdo como dados, visual como componentes**.

Isso facilita muito trocar nicho, texto e estilo sem reconstruir tudo.

---

# 7. Layout base

O `BaseLayout.astro` deve conter a estrutura principal do HTML:

```astro
---
import "../styles/global.css";

const {
  title = "Landing Page",
  description = "Landing page profissional.",
} = Astro.props;
---

<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>{title}</title>
    <meta name="description" content={description} />

    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

    <slot name="head" />
  </head>

  <body class="min-h-screen bg-base-100 text-base-content antialiased">
    <slot />
  </body>
</html>
```

Esse layout não deve conter regras específicas de uma landing. Ele é apenas a base.

---

# 8. LandingLayout

O `LandingLayout.astro` deve receber o conteúdo da página e adicionar estrutura comum:

```astro
---
import BaseLayout from "./BaseLayout.astro";
import Navbar from "../components/common/Navbar.astro";
import Footer from "../components/common/Footer.astro";

const {
  title,
  description,
  theme = "default",
} = Astro.props;
---

<BaseLayout title={title} description={description}>
  <div data-theme={theme} class="min-h-screen overflow-x-hidden">
    <Navbar />

    <main>
      <slot />
    </main>

    <Footer />
  </div>
</BaseLayout>
```

Regra:

```txt
BaseLayout cuida do HTML geral.
LandingLayout cuida da estrutura de landing.
A página cuida apenas de conteúdo e composição.
```

---

# 9. Sistema visual global

O arquivo `global.css` não deve virar um CSS gigante.
Ele deve conter apenas:

```txt
Import do Tailwind
Import/plugin do daisyUI
Tokens globais complementares
Comportamento de scroll
Classes auxiliares realmente necessárias
Animações globais simples
```

Exemplo:

```css
@import "tailwindcss";
@plugin "daisyui";

:root {
  --section-spacing: clamp(5rem, 10vw, 9rem);
}

html {
  scroll-behavior: smooth;
}

body {
  text-rendering: optimizeLegibility;
}

.section-padding {
  padding-block: var(--section-spacing);
}

.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity 700ms ease,
    transform 700ms ease;
}

.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation: none !important;
    transition: none !important;
  }

  .reveal {
    opacity: 1;
    transform: none;
  }
}
```

Evite criar classes globais para tudo.
O padrão principal deve ser Tailwind nos componentes.

---

# 10. Regra de uso do Tailwind

Tailwind deve ser usado para construir a maior parte do layout.

Use Tailwind para:

```txt
Espaçamento
Grid
Flex
Tipografia
Cores
Bordas
Radius
Sombras
Responsividade
Estados hover/focus
```

Exemplo bom:

```astro
<section class="relative overflow-hidden px-6 py-24 sm:py-32 lg:px-8">
  <div class="mx-auto max-w-7xl">
    <div class="grid items-center gap-16 lg:grid-cols-2">
      <div>
        <span class="mb-5 inline-flex rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-black/70">
          Landing pages premium
        </span>

        <h1 class="max-w-3xl text-5xl font-extrabold tracking-[-0.05em] text-neutral-950 sm:text-6xl lg:text-7xl">
          Uma página moderna feita para transformar atenção em contato.
        </h1>

        <p class="mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
          Estrutura visual refinada, responsiva e pensada para apresentar valor com clareza.
        </p>
      </div>
    </div>
  </div>
</section>
```

Evite classes Tailwind sem organização visual:

```astro
<div class="mt-3 ml-5 p-7 text-lg bg-blue-500 rounded-md shadow-md">
```

Prefira padrões consistentes:

```txt
px-6 em seções
py-24 / py-32 em blocos grandes
max-w-7xl para containers
gap-8 / gap-12 / gap-16 em grids
rounded-3xl para cards premium
shadow-xl ou shadow-2xl com moderação
```

---

# 11. Regra de uso do daisyUI

daisyUI deve acelerar, não comandar o design.

Use daisyUI para:

```txt
btn
card
badge
collapse
stats
input
textarea
select
navbar
mockup-browser
mockup-code
```

Mas personalize com Tailwind.

Exemplo básico demais:

```astro
<button class="btn btn-primary">Enviar</button>
```

Exemplo apropriado:

```astro
<a
  href="#contato"
  class="btn border-none bg-neutral-950 px-7 text-white shadow-xl shadow-black/10 hover:bg-neutral-800 rounded-full"
>
  Solicitar orçamento
</a>
```

Ou seja:

```txt
Usar daisyUI como base estrutural.
Usar Tailwind para acabamento premium.
Nunca deixar visual padrão sem personalização.
```

---

# 12. Navbar

A navbar deve ser simples e reutilizável.

Requisitos:

```txt
Sticky no topo
Blur sutil
Logo/nome à esquerda
Links no centro ou à direita
CTA à direita
Menu mobile funcional
Altura entre 72px e 84px
Sem excesso visual
```

Exemplo de comportamento:

```astro
<header class="sticky top-0 z-50 border-b border-black/10 bg-white/75 backdrop-blur-xl">
  <nav class="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
    <a href="/" class="text-lg font-extrabold tracking-tight">
      Portfolio<span class="text-primary">.</span>
    </a>

    <div class="hidden items-center gap-8 text-sm font-medium text-neutral-600 lg:flex">
      <a href="#beneficios" class="hover:text-neutral-950">Benefícios</a>
      <a href="#processo" class="hover:text-neutral-950">Processo</a>
      <a href="#faq" class="hover:text-neutral-950">FAQ</a>
    </div>

    <a href="#contato" class="btn hidden rounded-full border-none bg-neutral-950 px-6 text-white hover:bg-neutral-800 lg:inline-flex">
      Solicitar orçamento
    </a>

    <button class="btn btn-ghost lg:hidden" aria-label="Abrir menu">
      Menu
    </button>
  </nav>
</header>
```

Menu mobile pode ser simples. Não precisa criar um sistema complexo.

---

# 13. Hero section

O hero deve ser a seção mais forte da página.

Obrigatório ter:

```txt
Eyebrow/badge
Headline grande
Subheadline clara
CTA principal
CTA secundário
Prova curta
Visual forte
```

O hero deve responder:

```txt
O que é?
Para quem é?
Qual benefício entrega?
Qual ação o visitante deve tomar?
```

Estrutura recomendada:

```astro
<section class="relative overflow-hidden px-6 py-24 sm:py-32 lg:px-8">
  <div class="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.18),transparent_35%)]"></div>

  <div class="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
    <div>
      <span class="inline-flex rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-neutral-700 shadow-sm">
        Landing page profissional
      </span>

      <h1 class="mt-6 text-5xl font-extrabold tracking-[-0.06em] text-neutral-950 sm:text-6xl lg:text-7xl">
        Transforme visitantes em contatos com uma página clara, moderna e estratégica.
      </h1>

      <p class="mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
        Uma estrutura visual refinada para apresentar seu serviço, construir confiança e conduzir o visitante até a ação.
      </p>

      <div class="mt-9 flex flex-col gap-4 sm:flex-row">
        <a href="#contato" class="btn rounded-full border-none bg-neutral-950 px-8 text-white hover:bg-neutral-800">
          Solicitar orçamento
        </a>
        <a href="#beneficios" class="btn rounded-full border border-black/10 bg-white px-8 text-neutral-950 hover:bg-neutral-50">
          Ver como funciona
        </a>
      </div>

      <div class="mt-8 flex flex-wrap gap-3 text-sm font-medium text-neutral-500">
        <span>Responsivo</span>
        <span>•</span>
        <span>Pronto para anúncios</span>
        <span>•</span>
        <span>Integração com WhatsApp</span>
      </div>
    </div>

    <div class="relative">
      <!-- Visual ou mockup -->
    </div>
  </div>
</section>
```

A IA deve sempre criar um visual forte no hero. Pode ser:

```txt
Mockup de dashboard
Imagem profissional
Card de métricas
Preview de página
Interface fictícia
Composição de cards
```

Nunca deixar o hero só com texto.

---

# 14. SectionHeader

Toda seção deve ter um cabeçalho consistente.

Componente:

```astro
---
const {
  eyebrow,
  title,
  description,
  align = "center",
} = Astro.props;

const alignClass = align === "left" ? "text-left mx-0" : "text-center mx-auto";
---

<div class={`max-w-3xl ${alignClass}`}>
  {eyebrow && (
    <span class="mb-4 inline-flex rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-neutral-600">
      {eyebrow}
    </span>
  )}

  <h2 class="text-4xl font-extrabold tracking-[-0.04em] text-neutral-950 sm:text-5xl">
    {title}
  </h2>

  {description && (
    <p class="mt-5 text-lg leading-8 text-neutral-600">
      {description}
    </p>
  )}
</div>
```

Regra:

```txt
Toda seção importante deve ter título claro.
A descrição deve explicar o valor da seção.
Não usar títulos genéricos demais.
```

Evitar:

```txt
Nossos serviços
Benefícios
Sobre nós
```

Melhor:

```txt
Tudo que sua página precisa para transformar interesse em contato
Uma estrutura pensada para apresentar valor antes de pedir ação
Do primeiro clique ao pedido de orçamento, cada bloco tem uma função
```

---

# 15. Trust Strip

A Trust Strip é uma faixa curta de credibilidade.

Pode conter:

```txt
Logos fictícios
Indicadores
Selos
Benefícios curtos
Diferenciais
```

Exemplo:

```astro
<section class="border-y border-black/10 bg-white/60 px-6 py-6">
  <div class="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-6 text-sm font-semibold text-neutral-500">
    <span>Design responsivo</span>
    <span class="hidden text-neutral-300 sm:inline">•</span>
    <span>SEO básico</span>
    <span class="hidden text-neutral-300 sm:inline">•</span>
    <span>WhatsApp integrado</span>
    <span class="hidden text-neutral-300 sm:inline">•</span>
    <span>Pronta para tráfego pago</span>
  </div>
</section>
```

Ela ajuda a página parecer mais completa sem ocupar muito espaço.

---

# 16. Seção de problema

A seção de problema não deve ser dramática demais.
Ela deve contextualizar o motivo da landing existir.

Estrutura:

```txt
Título claro
Descrição curta
3 a 4 cards de dores
Visual simples
```

Exemplo de card:

```astro
<div class="rounded-3xl border border-black/10 bg-white p-8 shadow-xl shadow-black/5">
  <div class="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-950 text-white">
    <!-- SVG -->
  </div>

  <h3 class="text-xl font-bold text-neutral-950">
    O visitante não entende seu valor
  </h3>

  <p class="mt-3 leading-7 text-neutral-600">
    Quando a página não comunica com clareza, o usuário sai antes mesmo de considerar entrar em contato.
  </p>
</div>
```

Regra:

```txt
Problema deve ser específico.
Não escrever textos genéricos.
Não exagerar com medo, urgência falsa ou promessas absurdas.
```

---

# 17. Seção de solução

A solução deve mostrar como a página resolve o problema.

Ela pode ter:

```txt
Texto explicativo
Lista de diferenciais
Imagem/mockup
Cards
Checklist visual
```

Estrutura recomendada:

```astro
<section class="section-padding px-6">
  <div class="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
    <div>
      <SectionHeader
        align="left"
        eyebrow="A solução"
        title="Uma página construída para explicar, valorizar e converter."
        description="Cada seção é pensada para conduzir o visitante com clareza: primeiro entendimento, depois confiança, depois ação."
      />

      <ul class="mt-8 space-y-4">
        <li class="flex gap-3">
          <span class="mt-1 h-6 w-6 rounded-full bg-neutral-950 text-white"></span>
          <span class="text-neutral-700">Headline clara e específica.</span>
        </li>
      </ul>
    </div>

    <div class="rounded-[2rem] border border-black/10 bg-white p-6 shadow-2xl shadow-black/10">
      <!-- mockup -->
    </div>
  </div>
</section>
```

---

# 18. BenefitsGrid

Benefícios devem ser fáceis de escanear.

Requisitos:

```txt
3 a 6 benefícios
Cards consistentes
Ícone simples
Título curto
Descrição objetiva
```

Componente:

```astro
---
const { items = [] } = Astro.props;
---

<section id="beneficios" class="section-padding px-6">
  <div class="mx-auto max-w-7xl">
    <SectionHeader
      eyebrow="Benefícios"
      title="Tudo que uma landing page profissional precisa entregar"
      description="Mais do que aparência, a página precisa organizar a mensagem e facilitar a tomada de decisão."
    />

    <div class="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <article class="rounded-3xl border border-black/10 bg-white p-8 shadow-xl shadow-black/5 transition hover:-translate-y-1 hover:shadow-2xl">
          <div class="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-950 text-white">
            <!-- SVG -->
          </div>

          <h3 class="text-xl font-bold text-neutral-950">{item.title}</h3>
          <p class="mt-3 leading-7 text-neutral-600">{item.description}</p>
        </article>
      ))}
    </div>
  </div>
</section>
```

Regra:

```txt
Cada benefício deve vender um ganho real.
Não listar características técnicas sem explicar valor.
```

Ruim:

```txt
HTML semântico
CSS moderno
Layout responsivo
```

Melhor:

```txt
Carrega rápido e transmite mais profissionalismo.
Funciona bem no celular, onde a maioria dos visitantes chega.
Organiza a mensagem para o cliente entender antes de chamar no WhatsApp.
```

---

# 19. ProcessSteps

Toda landing deve ter uma seção “como funciona”.

Isso ajuda o visitante a entender o processo.

Estrutura:

```txt
3 ou 4 passos
Números grandes
Cards limpos
Texto curto
```

Exemplo:

```astro
<section id="processo" class="section-padding bg-neutral-950 px-6 text-white">
  <div class="mx-auto max-w-7xl">
    <SectionHeader
      eyebrow="Processo"
      title="Um fluxo simples para tirar sua página do papel"
      description="Da definição da mensagem até a publicação, o processo é direto e focado em resultado."
    />

    <div class="mt-14 grid gap-6 md:grid-cols-3">
      <article class="rounded-3xl border border-white/10 bg-white/5 p-8">
        <span class="text-5xl font-black tracking-[-0.06em] text-white/20">01</span>
        <h3 class="mt-6 text-xl font-bold">Diagnóstico</h3>
        <p class="mt-3 leading-7 text-white/60">
          Entendimento do serviço, público, objetivo e principal chamada da página.
        </p>
      </article>
    </div>
  </div>
</section>
```

Seção de processo é muito importante para vender serviço.

---

# 20. Showcase visual

Toda landing de portfólio precisa ter uma área visual forte.

Essa seção pode mostrar:

```txt
Preview da página
Mockup de celular
Dashboard fictício
Cards de interface
Prints simulados
Comparação antes/depois
Fluxo visual
```

O objetivo é mostrar capacidade visual.

Exemplo:

```astro
<section class="section-padding px-6">
  <div class="mx-auto max-w-7xl">
    <div class="rounded-[2.5rem] border border-black/10 bg-white p-4 shadow-2xl shadow-black/10">
      <div class="rounded-[2rem] bg-neutral-950 p-6">
        <div class="flex gap-2">
          <span class="h-3 w-3 rounded-full bg-red-400"></span>
          <span class="h-3 w-3 rounded-full bg-yellow-400"></span>
          <span class="h-3 w-3 rounded-full bg-green-400"></span>
        </div>

        <div class="mt-8 grid gap-6 lg:grid-cols-3">
          <div class="rounded-2xl bg-white/10 p-6"></div>
          <div class="rounded-2xl bg-white/10 p-6 lg:col-span-2"></div>
        </div>
      </div>
    </div>
  </div>
</section>
```

Regra:

```txt
Nunca deixar a landing sem uma demonstração visual marcante.
```

---

# 21. Testimonials

Depoimentos podem ser fictícios no portfólio, desde que claramente genéricos e sem fingir clientes reais.

Para portfólio demonstrativo, use algo como:

```txt
Exemplo de depoimento demonstrativo
```

Mas visualmente a seção deve existir.

Estrutura:

```txt
3 depoimentos
Nome fictício
Cargo/nicho
Texto curto
Avatar abstrato ou iniciais
```

Exemplo:

```astro
<article class="rounded-3xl border border-black/10 bg-white p-8 shadow-xl shadow-black/5">
  <p class="leading-8 text-neutral-700">
    “A página ficou clara, elegante e facilitou muito a apresentação do serviço para novos clientes.”
  </p>

  <div class="mt-6 flex items-center gap-4">
    <div class="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-950 text-sm font-bold text-white">
      AM
    </div>

    <div>
      <strong class="block text-neutral-950">Ana Martins</strong>
      <span class="text-sm text-neutral-500">Exemplo demonstrativo</span>
    </div>
  </div>
</article>
```

---

# 22. FAQ

FAQ deve ser componente reutilizável.

Use daisyUI `collapse` para acelerar.

Exemplo:

```astro
---
const { items = [] } = Astro.props;
---

<section id="faq" class="section-padding px-6">
  <div class="mx-auto max-w-4xl">
    <SectionHeader
      eyebrow="Dúvidas frequentes"
      title="Perguntas que ajudam o visitante a decidir"
      description="Uma boa landing page antecipa objeções antes do contato."
    />

    <div class="mt-12 space-y-4">
      {items.map((item) => (
        <div class="collapse collapse-plus rounded-3xl border border-black/10 bg-white shadow-sm">
          <input type="checkbox" />
          <div class="collapse-title text-lg font-bold text-neutral-950">
            {item.question}
          </div>
          <div class="collapse-content leading-7 text-neutral-600">
            <p>{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
```

Perguntas padrão para serviços:

```txt
Quanto tempo demora para entregar?
A página funciona bem no celular?
É possível integrar com WhatsApp?
A página pode ter formulário?
Você ajuda com textos?
A página é boa para anúncios?
Consigo alterar depois?
Preciso ter domínio e hospedagem?
```

---

# 23. CTA final

A CTA final deve fechar a página com força.

Estrutura:

```txt
Título forte
Descrição curta
Botão principal
Botão secundário opcional
Fundo visualmente diferente
```

Exemplo:

```astro
<section id="contato" class="px-6 py-24">
  <div class="mx-auto max-w-7xl rounded-[2.5rem] bg-neutral-950 px-8 py-20 text-center text-white shadow-2xl shadow-black/20">
    <span class="inline-flex rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white/70">
      Pronto para começar?
    </span>

    <h2 class="mx-auto mt-6 max-w-3xl text-4xl font-extrabold tracking-[-0.04em] sm:text-5xl">
      Transforme sua presença digital em uma página clara, bonita e comercial.
    </h2>

    <p class="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/60">
      Uma landing page bem construída ajuda o visitante a entender seu valor e facilita o próximo passo.
    </p>

    <div class="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
      <a href="#" class="btn rounded-full border-none bg-white px-8 text-neutral-950 hover:bg-neutral-200">
        Solicitar orçamento
      </a>
      <a href="#faq" class="btn rounded-full border border-white/15 bg-white/5 px-8 text-white hover:bg-white/10">
        Tirar dúvidas
      </a>
    </div>
  </div>
</section>
```

Regra:

```txt
A página deve terminar com uma ação clara.
Nunca terminar apenas com rodapé.
```

---

# 24. Footer

Footer deve passar acabamento.

Obrigatório conter:

```txt
Nome/marca
Frase curta
Links principais
Contato
Direitos
```

Exemplo:

```astro
<footer class="border-t border-black/10 px-6 py-10">
  <div class="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
    <div>
      <strong class="text-lg font-extrabold tracking-tight">Portfolio.</strong>
      <p class="mt-2 text-sm text-neutral-500">
        Landing pages modernas, responsivas e focadas em conversão.
      </p>
    </div>

    <div class="flex flex-wrap gap-5 text-sm font-medium text-neutral-500">
      <a href="#beneficios" class="hover:text-neutral-950">Benefícios</a>
      <a href="#processo" class="hover:text-neutral-950">Processo</a>
      <a href="#faq" class="hover:text-neutral-950">FAQ</a>
    </div>
  </div>
</footer>
```

---

# 25. Imagens

Para portfólio, as imagens podem ser placeholders, mas devem parecer bem escolhidas.

Regras:

```txt
Usar imagens coerentes com o nicho
Evitar imagens muito genéricas
Usar object-cover
Usar border-radius grande
Usar loading="lazy" fora do hero
Usar alt descritivo
Evitar imagens pesadas demais
```

Exemplo:

```astro
<img
  src="/images/placeholders/example.jpg"
  alt="Ambiente profissional moderno com atendimento personalizado"
  class="h-full w-full rounded-[2rem] object-cover"
  loading="lazy"
/>
```

Se usar Unsplash ou similar no protótipo, depois baixar/substituir ou organizar no `/public/images`.

---

# 26. Responsividade

Responsividade deve ser tratada como parte do design, não como ajuste final.

Padrões:

```txt
Desktop: layout amplo, duas colunas, cards em grid
Tablet: reduzir gaps, ajustar hero, quebrar grids
Mobile: uma coluna, botões maiores, títulos menores, espaçamento reduzido
```

Classes comuns:

```txt
px-6 lg:px-8
py-20 sm:py-24 lg:py-32
grid gap-10 lg:grid-cols-2
text-4xl sm:text-5xl lg:text-7xl
max-w-7xl mx-auto
```

No mobile:

```txt
Botões podem ocupar largura total
Cards devem ficar em uma coluna
Hero visual deve vir depois do texto
Navbar deve ser simplificada
Evitar grids complexos
Evitar textos longos centralizados demais
```

---

# 27. Acessibilidade mínima

Toda landing deve respeitar:

```txt
HTML semântico
Alt em imagens
Contraste adequado
Botões reais quando houver interação
Links com texto claro
Foco visível
Labels em formulários
aria-label em botões de ícone
prefers-reduced-motion
```

Exemplo de foco:

```css
:focus-visible {
  outline: 3px solid rgba(0, 0, 0, 0.35);
  outline-offset: 4px;
}
```

Não criar elementos clicáveis com `div`.

Errado:

```html
<div onclick="...">Abrir menu</div>
```

Certo:

```html
<button type="button" aria-label="Abrir menu">...</button>
```

---

# 28. JavaScript

JavaScript deve ser mínimo.

Usar apenas para:

```txt
Menu mobile
Animações reveal no scroll
Pequenas interações que o daisyUI não resolver
Troca simples de abas, se necessário
```

Reveal no scroll:

```html
<script>
  const revealElements = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((element) => observer.observe(element));
</script>
```

Evitar:

```txt
Animações complexas
Manipulação pesada de DOM
Carrossel automático
Biblioteca de animação
Dependência para menu simples
```

---

# 29. SEO básico

Cada página deve receber:

```txt
Title único
Description única
Open Graph
Lang pt-BR
Headings em ordem lógica
Apenas um H1
URLs legíveis
```

Exemplo:

```astro
<LandingLayout
  title="Landing Page para Clínica Estética | Exemplo de Portfólio"
  description="Exemplo de landing page moderna, responsiva e focada em agendamentos para clínica estética."
>
```

Hierarquia:

```txt
H1 no hero
H2 nas seções principais
H3 nos cards
```

Não usar múltiplos H1.

---

# 30. Performance

Regras:

```txt
Não usar vídeo de fundo
Não usar bibliotecas pesadas
Não carregar muitas fontes
Não usar imagens gigantes
Não usar animações excessivas
Não colocar JavaScript desnecessário
Usar SVG inline para ícones simples
Usar lazy loading em imagens abaixo da primeira dobra
```

Fonte:

```txt
Usar no máximo 1 ou 2 famílias
Usar pesos necessários apenas
Evitar carregar 10 variações
```

---

# 31. Como construir com IA de forma eficiente

O melhor fluxo não é pedir tudo de uma vez sem controle.

Use este processo:

```txt
1. Pedir a estrutura do projeto
2. Pedir os layouts base
3. Pedir os componentes comuns
4. Pedir os componentes de seção
5. Pedir a primeira landing completa
6. Revisar visualmente
7. Corrigir padrões
8. Duplicar para novas páginas
```

## Prompt 1 — Estrutura do projeto

```txt
Crie a estrutura inicial de um projeto Astro para um portfólio de landing pages.

Use Astro + Tailwind CSS + daisyUI.

Quero uma arquitetura simples, estática, rápida e fácil de reaproveitar.

Crie a estrutura de pastas e os arquivos base:
- BaseLayout.astro
- LandingLayout.astro
- Navbar.astro
- Footer.astro
- SectionHeader.astro
- Button.astro
- global.css
- index.astro

Não use React.
Não use Next.
Não use Bootstrap.
Não use jQuery.
Não use backend.

A estrutura deve ser pensada para criar várias landing pages reutilizando componentes.
```

## Prompt 2 — Componentes principais

```txt
Agora crie os componentes principais de seções para as landing pages:

- Hero.astro
- TrustStrip.astro
- ProblemSection.astro
- SolutionSection.astro
- BenefitsGrid.astro
- ProcessSteps.astro
- Showcase.astro
- Testimonials.astro
- FAQ.astro
- FinalCTA.astro

Use Astro + Tailwind + daisyUI.
Os componentes devem aceitar props e arrays de dados.
Não deixe conteúdo fixo demais dentro dos componentes.
Quero conseguir reutilizar em várias landing pages mudando apenas os dados.
```

## Prompt 3 — Primeira landing

```txt
Agora crie uma página Astro completa usando os componentes já definidos.

A página deve montar uma landing page comercial completa.
Use dados no topo do arquivo para hero, benefícios, processo, FAQ e depoimentos.
A página deve parecer real, profissional, responsiva e pronta para portfólio.

Não crie novos componentes desnecessários.
Use os componentes existentes.
Apenas adicione ajustes específicos quando realmente necessário.
```

## Prompt 4 — Refinamento visual

```txt
Revise a landing page como um designer sênior.

Melhore:
- Hierarquia visual
- Espaçamento
- Responsividade
- Consistência dos cards
- Força do hero
- CTA
- Seção visual de demonstração
- Mobile
- Acabamento do footer

Não altere a arquitetura.
Não adicione dependências.
Mantenha Astro + Tailwind + daisyUI.
```

---

# 32. Regra de ouro para IA

Sempre pedir para a IA trabalhar com este princípio:

```txt
Não crie uma página isolada e bagunçada.
Crie uma landing page modular, com componentes reutilizáveis, conteúdo organizado em dados e design consistente.
```

Isso muda muito o resultado.

---

# 33. Padrão de qualidade visual

Toda landing precisa ter:

```txt
Hero forte
Visual principal bem trabalhado
CTA claro
Cards consistentes
Seções com respiro
Tipografia grande e moderna
Mobile bem ajustado
FAQ
Footer completo
Microinterações suaves
```

A página não deve parecer:

```txt
Template Bootstrap
Site institucional antigo
Página apertada
Layout genérico
Página feita só com texto
Página sem prova visual
Página sem CTA
Protótipo inacabado
```

---

# 34. Checklist final antes de publicar

Antes de considerar uma landing pronta, validar:

```txt
O H1 explica a proposta rapidamente?
Existe CTA visível no hero?
A página tem uma jornada lógica?
As seções têm espaçamento suficiente?
O visual principal impressiona?
Os cards seguem um padrão?
A tipografia está consistente?
As cores estão coerentes?
O mobile está bonito?
Não há overflow horizontal?
O FAQ funciona?
A navbar funciona?
O footer está completo?
Os textos não parecem Lorem Ipsum?
As imagens têm alt?
Os botões têm foco visível?
A página carrega rápido?
O código está componentizado?
A página pode ser duplicada para outro nicho?
```

---

# 35. Instrução final para usar como padrão

Use este bloco sempre que for pedir uma nova landing para a IA:

```txt
Construa esta landing page dentro do projeto Astro já existente.

Use os componentes reutilizáveis sempre que possível.
Use Tailwind CSS para estilização.
Use daisyUI apenas como base para botões, cards, accordion, inputs e elementos simples.
Não use React, Next, Bootstrap, jQuery ou bibliotecas pesadas.
Não crie backend.
Não crie lógica desnecessária.

A landing deve ser estática, responsiva, moderna, comercial e pronta para portfólio.

Organize o conteúdo da página em constantes no topo do arquivo:
- page
- hero
- trustItems
- problems
- benefits
- processSteps
- testimonials
- faqItems
- finalCta

Depois monte a página usando os componentes:
- LandingLayout
- Hero
- TrustStrip
- ProblemSection
- SolutionSection
- BenefitsGrid
- ProcessSteps
- Showcase
- Testimonials
- FAQ
- FinalCTA

Priorize:
- Design refinado
- Espaçamento generoso
- Boa hierarquia visual
- CTA claro
- Mobile muito bem ajustado
- Código limpo e reaproveitável
```

Essa é a documentação base que eu seguiria. O ponto principal é: **não construir landing page como arquivo isolado**, e sim como um pequeno sistema de componentes para criar várias páginas rapidamente, mantendo qualidade visual e sem cair em complexidade de aplicação.

[1]: https://docs.astro.build/en/basics/project-structure/?utm_source=chatgpt.com "Project structure - Astro Docs"
[2]: https://docs.astro.build/en/guides/styling/?utm_source=chatgpt.com "Styles and CSS - Astro Docs"
[3]: https://daisyui.com/?lang=en&utm_source=chatgpt.com "Tailwind CSS Component Library daisyUI"
