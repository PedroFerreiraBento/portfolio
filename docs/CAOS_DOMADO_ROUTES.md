# Caos Domado – Documentação de Rotas

Este documento descreve a arquitetura de rotas do portfólio **Caos Domado**, construído como uma **SPA em React** utilizando **React Router v6**.

O objetivo é:

- **Explicar claramente cada rota** (path, responsabilidade, componente principal).
- Documentar **parâmetros de rota** e comportamentos esperados.
- Mostrar **como as rotas se relacionam com o layout e com o sistema de i18n**.
- Servir como referência para futuras extensões (novas páginas, versões multi-idioma de URLs, etc.).

---

## 1. Stack e conceitos base

- **Biblioteca de roteamento**: `react-router-dom` v6.
- **Tipo de roteador**: `BrowserRouter` (history API do navegador).
- **Ponto de configuração principal**: `src/router/AppRouter.tsx`.
- **Layout raiz**: `src/layout/MainLayout.tsx`.
- **Sistema de tradução (i18n)**:
  - Baseado em `I18nProvider` em `src/i18n/I18nProvider.tsx`.
  - O idioma **não altera o path da URL** no MVP – apenas os textos renderizados.

### 1.1. Estrutura geral do router

Em `App.tsx`:

- `BrowserRouter` envolve toda a aplicação.
- `AppRouter` define as rotas e seus componentes.
- `I18nProvider` envolve o roteador, permitindo textos traduzidos em qualquer página.

Em `AppRouter.tsx` (visão conceitual):

- Rota raiz `/` utiliza `MainLayout`.
- Todas as páginas principais são **rotas filhas** de `/`, renderizadas dentro de `<Outlet />` provindo de `MainLayout`.

---

## 2. Tabela-resumo das rotas

| Path              | Nome lógico         | Componente          | Layout       | Parâmetros      | Descrição resumida                                                                                    |
| ----------------- | ------------------- | ------------------- | ------------ | --------------- | ----------------------------------------------------------------------------------------------------- |
| `/`               | Home                | `HomePage`          | `MainLayout` | –               | Landing principal, apresenta a proposta da Caos Domado e levará carrosséis por categoria de projetos. |
| `/projetos`       | Lista de projetos   | `ProjectsPage`      | `MainLayout` | –               | Lista geral de projetos, com espaço para filtros, busca e ordenação.                                  |
| `/projetos/:slug` | Detalhe de projeto  | `ProjectDetailPage` | `MainLayout` | `slug` (string) | Página de case detalhado de um projeto específico.                                                    |
| `/servicos`       | Serviços            | `ServicesPage`      | `MainLayout` | –               | Descreve os serviços oferecidos (software, data science, automação, etc.).                            |
| `/sobre`          | Sobre a Caos Domado | `AboutPage`         | `MainLayout` | –               | Conteúdo institucional: história, valores, equipe.                                                    |
| `/contato`        | Contato (simulado)  | `ContactPage`       | `MainLayout` | –               | Formulário de contato mockado (sem envio real).                                                       |
| `*`               | 404 (fallback)      | `NotFoundPage`      | `MainLayout` | –               | Página exibida quando a rota não corresponde a nenhuma das anteriores.                                |

Observação: todas as rotas estão, no MVP, **em português** (paths como `/projetos`, `/servicos` etc.), mesmo quando o conteúdo textual estiver em inglês (via i18n).

---

## 3. Rota raiz e layout principal

### 3.1. Rota raiz `/`

- **Path**: `/`
- **Componente principal**: `MainLayout` (rota pai) + `HomePage` (rota filha index).
- **Arquivo do layout**: `src/layout/MainLayout.tsx`.
- **Arquivo da página**: `src/pages/HomePage.tsx`.

`MainLayout` é responsável por:

- Renderizar o **header** com:
  - Logo/nome da marca (texto obtido via i18n: `common.brandName`).
  - Navegação principal (links para Home, Projetos, Serviços, Sobre, Contato).
  - `LanguageSwitcher`, componente de troca de idioma.
- Renderizar o **conteúdo da rota filha** via `<Outlet />`.
- Renderizar o **footer** com informações de copyright.

`HomePage` (rota index de `/`) é responsável por:

- Exibir o **hero** da aplicação:
  - Eyebrow/tagline (`common.tagline`).
  - Título e subtítulo (`home.hero.*`).
  - Botões/CTAs que direcionam para `/projetos` e `/servicos`.
- No futuro, exibir **seções com carrosséis de projetos por categoria**, alimentados pelos mocks.

### 3.2. Comportamento de navegação a partir da Home

- Ao clicar em **"Ver projetos"** → navega para `/projetos`.
- Ao clicar em **"Conhecer serviços"** → navega para `/servicos`.
- O menu do header também permite ir diretamente para qualquer página principal.

---

## 4. Rota `/projetos` – Lista de projetos

### 4.1. Detalhes da rota

- **Path**: `/projetos`
- **Componente**: `ProjectsPage`.
- **Arquivo**: `src/pages/ProjectsPage.tsx`.
- **Propósito**:
  - Exibir todos os projetos disponíveis no portfólio (dados mockados).
  - Disponibilizar filtros e busca local.

### 4.2. Comportamentos planejados

- **Lista principal**:
  - Grid ou lista de `ProjectCard`s, cada um representando um projeto.
  - Campos mínimos por card: título, subtítulo/cliente, categoria(s) e talvez tags de tecnologia.
- **Filtros (futuros)**:
  - Por categoria (via dropdown ou chips).
  - Por tecnologia (multi-select ou checkboxes).
  - Campo de busca por texto (título, cliente, palavras-chave).
- **Ação de clique**:
  - Clicar em um card de projeto deve navegar para `/projetos/:slug`, onde `slug` é exclusivo do projeto.

### 4.3. Integração com i18n

- Título e descrição da página vêm de `pages.projects.title` e `pages.projects.description`.
- O conteúdo dos cards pode ser **parcialmente traduzido** ou não, dependendo de como os mocks forem definidos:
  - Ex.: campos descritivos podem ter versões por idioma.

---

## 5. Rota `/projetos/:slug` – Detalhe do projeto

### 5.1. Detalhes da rota

- **Path**: `/projetos/:slug`
- **Componente**: `ProjectDetailPage`.
- **Arquivo**: `src/pages/ProjectDetailPage.tsx`.
- **Parâmetros**:
  - `slug` (string) – identificador único legível do projeto.

### 5.2. Comportamentos planejados

- No MVP atual, `ProjectDetailPage` apenas lê `slug` via `useParams` e mostra texto placeholder.
- Futuramente, a rota deve:
  - Buscar o projeto correspondente em `mocks/projects` usando o `slug`.
  - Exibir seções como:
    - Contexto / problema de negócio.
    - Abordagem e solução.
    - Tecnologias utilizadas.
    - Resultados (métricas e benefícios qualitativos).
    - Galeria de imagens/telas (mockadas).
  - Oferecer navegação de volta:
    - Para `/projetos`.
    - Para projetos relacionados.

### 5.3. Boas práticas para slugs

- Slugs devem ser:
  - Estáveis (não mudar com frequência).
  - Sem acentos e caracteres especiais.
  - Em minúsculas, separados por hífens (ex.: `otimizacao-estoque-ecommerce`).
- Ideal manter uma convenção: `tipoCliente-contexto-resultado`.

### 5.4. Integração com i18n

- Título geral da página pode continuar usando `pages.projects.title`.
- Os campos do projeto (descrição, problema, solução, resultados) podem ser:
  - Em um único idioma (pt) inicialmente.
  - Ou possuir campos específicos por locale (ex.: `descriptionPt`, `descriptionEn`).

---

## 6. Rota `/servicos` – Página de serviços

### 6.1. Detalhes da rota

- **Path**: `/servicos`
- **Componente**: `ServicesPage`.
- **Arquivo**: `src/pages/ServicesPage.tsx`.
- **Propósito**:
  - Explicar os tipos de serviço que a Caos Domado oferece:
    - Desenvolvimento de produtos digitais.
    - Data Science / Machine Learning.
    - Engenharia de dados.
    - Dashboards e visualização de dados.
    - Otimização de processos, automação, etc.

### 6.2. Conteúdo planejado

- Seção introdutória com título e descrição (`pages.services.*`).
- Lista de serviços em forma de cards (cada card vindo de `mocks/services`).
- Cada card de serviço pode ter:
  - Nome do serviço.
  - Descrição curta.
  - Exemplos de entregáveis.
  - Tecnologias associadas.
  - Links para projetos relacionados (`/projetos/:slug`).

---

## 7. Rota `/sobre` – Página institucional

### 7.1. Detalhes da rota

- **Path**: `/sobre`
- **Componente**: `AboutPage`.
- **Arquivo**: `src/pages/AboutPage.tsx`.
- **Propósito**:
  - Apresentar a visão, história e valores da Caos Domado.
  - Mostrar membros principais do time.

### 7.2. Conteúdo planejado

- Título e descrição (via `pages.about.*`).
- Seções possíveis:
  - "Por que Caos Domado": explicando o conceito.
  - "Nossa forma de trabalhar": princípios de entrega.
  - "Equipe": cards de membros (dados de `mocks/team`).

---

## 8. Rota `/contato` – Formulário simulado

### 8.1. Detalhes da rota

- **Path**: `/contato`
- **Componente**: `ContactPage`.
- **Arquivo**: `src/pages/ContactPage.tsx`.
- **Propósito**:
  - Simular um fluxo de contato, sem integração real com backend.

### 8.2. Comportamento atual

- Campos:
  - `Nome` (texto, obrigatório).
  - `E-mail` (texto, obrigatório, formato de e-mail).
  - `Empresa` (texto, opcional).
  - `Mensagem` (textarea, obrigatório).
- Ao enviar:
  - Previne `submit` real do formulário.
  - Define estado de `isSubmitting = true`.
  - Usa `setTimeout` (~800ms) para simular processamento.
  - Ao fim, marca `hasSubmitted = true` e exibe mensagem de sucesso.

### 8.3. Integração com i18n

- Textos de título/descrição/botão/mensagem de sucesso vêm de `pages.contact.*`.
- Os rótulos dos campos (`Nome`, `E-mail`, etc.) por enquanto estão hardcoded em português e podem ser migrados para o dicionário de tradução futuramente.

### 8.4. Possíveis evoluções futuras

- Envio real usando uma API (por exemplo, backend próprio ou serviço de e-mail).
- Validações mais sofisticadas (ex.: tamanho mínimo de mensagem).
- Campos adicionais vinculados a tipo de projeto, orçamento estimado, etc.

---

## 9. Rota `*` – Página 404 (NotFound)

### 9.1. Detalhes da rota

- **Path**: `*` (wildcard)
- **Componente**: `NotFoundPage`.
- **Arquivo**: `src/pages/NotFoundPage.tsx`.
- **Propósito**:
  - Exibir uma página amigável quando a rota acessada não existe.

### 9.2. Comportamento

- Mostra título e descrição via `pages.notFound.*`.
- Renderiza um botão/`Link` para `/` com o texto `pages.notFound.backToHome`.
- Continua usando o mesmo `MainLayout` (logo, menu, footer), para não "quebrar" a identidade visual ao cair em erro de rota.

---

## 10. Relação entre rotas, layout e i18n

### 10.1. Hierarquia de componentes

1. `main.tsx` monta `<App />` na `div#root`.
2. `App.tsx` envolve toda a aplicação em:
   - `<I18nProvider>` → provê `locale` e função `t`.
   - `<BrowserRouter>` → gerencia a navegação.
   - `<AppRouter />` → define quais páginas aparecem para cada path.
3. `AppRouter` define rota raiz com `element={<MainLayout />}`.
4. `MainLayout` renderiza header/nav/footer e `<Outlet />`.
5. Dependendo da rota, `<Outlet />` recebe:
   - `HomePage`, `ProjectsPage`, `ProjectDetailPage`, etc.

### 10.2. i18n

- O idioma atual é armazenado em estado global (`I18nProvider`) e em `localStorage`.
- Rotas **não mudam de path** ao mudar o idioma; muda apenas o conteúdo textual das páginas.
- O seletor de idioma (`LanguageSwitcher`) fica no header, disponível em todas as rotas.

### 10.3. SEO e internacionalização de paths (futuro)

Caso seja desejado, é possível avançar para URLs traduzidas por idioma, por exemplo:

- Em português: `/projetos`, `/servicos`, `/sobre`, `/contato`.
- Em inglês: `/projects`, `/services`, `/about`, `/contact`.

Opções técnicas para isso no futuro:

- Duplicar rotas com prefixos de idioma: `/pt/...` e `/en/...`.
- Sincronizar o `locale` com o prefixo de rota.
- Redirecionar automaticamente com base em preferência do usuário ou idioma do navegador.

No MVP atual, a escolha foi **priorizar paths em português** pela simplicidade e por refletir o mercado-alvo principal, mantendo a tradução de conteúdo para apoiar visitantes que preferem inglês.

---

## 11. Roteamento e fluxos de navegação principais

### 11.1. Fluxo "Conhecer a empresa e ver projetos"

1. Usuário entra em `/`.
2. Lê hero, entende rapidamente o que a Caos Domado faz.
3. Clica em "Ver projetos" → `/projetos`.
4. Seleciona um projeto e entra em `/projetos/:slug`.
5. A partir da página de detalhe, pode:
   - Voltar para `/projetos`.
   - Navegar para outro projeto.
   - Ir para `/contato`.

### 11.2. Fluxo "Descer pela navegação superior"

- Em qualquer página, o usuário pode:
  - Ir para `/servicos` para entender a oferta.
  - Ir para `/sobre` para validar credibilidade e contexto.
  - Ir para `/contato` para iniciar uma conversa.

### 11.3. Fluxo "Erro de rota / Digitação incorreta"

- Usuário acessa uma URL inexistente (ex.: `/projtos`).
- React Router cai na rota `*`.
- `NotFoundPage` é exibida com opção clara de voltar para `/`.

---

## 12. Extensões futuras de rotas

Sugestões de novas rotas alinhadas à visão do portfólio:

- `/blog` ou `/insights` – artigos curtos sobre projetos, técnicas, aprendizados.
- `/cases` – eventualmente separar cases estratégicos de projetos menores.
- Rotas aninhadas em `/projetos`:
  - `/projetos/categoria/:categorySlug` para listar somente uma categoria.
- Rotas específicas de serviços:
  - `/servicos/:slug` para detalhar um serviço com cases relacionados.

Qualquer nova rota deve ser adicionada em `AppRouter.tsx` e, se fizer parte da navegação principal, refletida também em `MainLayout.tsx` (menu) e no dicionário de traduções (`i18n/locales/*.ts`).
