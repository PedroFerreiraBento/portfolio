# Portfólio "Caos Domado" – Documentação de Produto e Frontend

## 1. Visão geral do projeto

### 1.1. Contexto da empresa

"Caos Domado" é uma empresa de **desenvolvimento de software** e **ciência de dados**. A marca comunica a ideia de pegar problemas complexos, confusos e cheios de variáveis (caos) e transformá‑los em **soluções estruturadas, elegantes e orientadas a dados** (domado).

O site será um **portfólio interativo**, estático, construido em **React**, focado em mostrar:

- **Qualidade técnica** dos projetos.
- **Clareza na comunicação de valor** (problema → solução → impacto).
- **Organização visual** (o "caos" é representado, mas sempre bem organizado e legível).

### 1.2. Objetivo do site

- **Principal**: Apresentar projetos e serviços da Caos Domado de forma visualmente atraente e organizada, permitindo que quem navega entenda rapidamente:
  - Que tipo de problemas a empresa resolve.
  - Que tecnologias domina.
  - Quais resultados entrega (impacto, métricas, diferenciais).
- **Secundário**: Demonstrar **boas práticas de frontend em React**, com:
  - Componentização consistente.
  - Navegação fluida (SPA com React Router, por exemplo).
  - Dados totalmente **mockados**, mas realistas.

### 1.3. Público-alvo

- **Tomadores de decisão de negócios** (diretores, gerentes, founders) sem necessariamente background técnico avançado.
- **Perfis técnicos** (engenheiros, cientistas de dados, CTOs) interessados em avaliar a maturidade técnica da empresa.
- **Recrutadores** ou parceiros técnicos que queiram entender o nível de qualidade do trabalho.

### 1.4. Diferenciais do portfólio

- Exposição dos projetos em **carrosséis por categoria**, permitindo navegação por tipo de trabalho (ex.: Produtos Digitais, Data Science, MLOps, Dashboards, Otimização de Processos, etc.).
- Cada projeto terá uma página detalhada com:
  - Contexto do cliente/negócio (fictício ou anonimizado).
  - Problema.
  - Abordagem e solução.
  - Stack utilizada.
  - Resultados (métricas ou benefícios qualitativos).
- Navegação simples, intuitiva e responsiva, com **foco na leitura confortável**.

### 1.5. Escopo inicial (MVP) e limitações

- **Inclui**:
  - Aplicação em React (SPA) com rotas para páginas principais.
  - Dados totalmente mockados (sem back-end, sem banco de dados, sem APIs externas).
  - Carrosséis por categoria na home, com cards de projetos clicáveis.
  - Página de detalhes por projeto.
  - Páginas institucionais básicas (Sobre, Serviços, Contato simulado).
  - Tema visual coerente com a marca "Caos Domado".
- **Não inclui (no MVP)**:
  - Autenticação.
  - Formulário de contato com envio real.
  - Painel de admin para cadastro de projetos.
  - Integração real com ferramentas de analytics.

---

## 2. Princípios de design e narrativa

### 2.1. Conceito de "Caos Domado" aplicado ao design

- Visualmente, o site pode explorar contrastes:
  - **Formas geométricas bem definidas** (ordem) sobre fundos com **gradientes, ruídos ou elementos abstratos** (caos).
  - Seções com **linhas guias, grids** e boa hierarquia tipográfica.
- A navegação é sempre clara, mesmo quando houver muitos projetos:
  - Filtros simples.
  - Categorias bem nomeadas.
  - Componentes reutilizáveis e organizados.

### 2.2. Tom de voz dos textos

- **Técnico, mas acessível**.
- Evitar jargão excessivo sem explicação.
- Destaque para **impacto de negócio**, não só tecnologia.
- Frases curtas, claras, orientadas a valor:
  - "Reduzimos tempo de processamento em 80%".
  - "Transformamos dados brutos em decisões acionáveis".

### 2.3. Mensagens principais

- Caos Domado consegue **organizar complexidade**.
- Capacidade de atuar em todo o ciclo:
  - Descoberta do problema.
  - Desenho de solução.
  - Implementação.
  - Medição de resultados.
- Equilíbrio entre **engenharia de software**, **ciência de dados** e **design de experiência**.

---

## 3. Arquitetura geral da aplicação

### 3.1. Stack técnica sugerida

- **Frontend**: React (preferencialmente com TypeScript, se desejado).
- **Bundler**: Vite ou Create React App (a documentação é agnóstica, mas Vite é mais moderno).
- **Roteamento**: React Router (v6+).
- **Estilização** (uma entre algumas opções):
  - CSS Modules, ou
  - Styled Components, ou
  - Tailwind CSS.
- **Estado**:
  - Predominantemente local (useState/useMemo/useEffect).
  - Context API para temas/globais (ex.: tema claro/escuro, idioma).
- **Dados**:
  - Mockados em arquivos `.ts` ou `.js` na pasta `src/mocks`.

### 3.2. Estrutura de pastas proposta

```text
src/
  assets/            # Imagens, ícones estáticos, ilustrações
  components/        # Componentes compartilhados (botões, cards, etc.)
    atoms/
    molecules/
    organisms/
    layout/
  pages/             # Páginas mapeadas para rotas
  router/            # Configuração das rotas
  mocks/             # Dados mockados
  types/             # Tipagens/Interfaces (se TypeScript)
  hooks/             # Hooks customizados (ex.: uso de carrossel, tema)
  context/           # Contextos globais (tema, idioma, etc.)
  styles/            # Estilos globais, tema, variáveis de design
  utils/             # Funções utilitárias
  main.tsx|jsx       # Ponto de entrada da aplicação
  App.tsx|jsx        # Shell principal da aplicação
```

### 3.3. Rotas principais

- `/` – Home (carrosséis por categoria + hero + seções-chave).
- `/projetos` – Listagem de todos os projetos, com filtros.
- `/projetos/:slug` – Detalhe de um projeto específico.
- `/servicos` – Descrição de serviços oferecidos.
- `/sobre` – Sobre a Caos Domado (história, valores, equipe).
- `/contato` – Página de contato (formulário simulado, sem envio real).
- `*` – Página 404 (rota de fallback).

### 3.4. Padrões de estado e dados mockados

- Dados carregados localmente a partir de `src/mocks`, ex.:
  - `projects.ts`
  - `categories.ts`
  - `services.ts`
  - `testimonials.ts`
- Cada módulo exporta arrays de objetos que simulam o retorno de uma API.
- A aplicação nunca faz requisições HTTP reais (apenas consumos locais).

---

## 4. Estrutura de navegação e páginas

### 4.1. Layout global

- **Header**:
  - Logo/tipografia da Caos Domado.
  - Menu de navegação principal (Home, Projetos, Serviços, Sobre, Contato).
  - Botão/ícone de alternância de tema (claro/escuro) – opcional.
- **Footer**:
  - Direitos autorais.
  - Links rápidos.
  - Links para redes (LinkedIn, GitHub, etc. – podem ser fictícios ou reais).
- **Componente de Layout** (`PageLayout`):
  - Recebe `children` e aplica header + footer + padding, etc.

### 4.2. Página Home (`/`)

Seções principais:

- **Hero**:
  - Headline: reforça o conceito de "Caos Domado".
  - Subheadline: o que a empresa faz em uma frase curta.
  - CTA principal: "Ver projetos" (leva para seção de carrosséis ou para `/projetos`).
- **Destaque de serviços**:
  - Pequenos cards resumindo macro-serviços (desenvolvimento de produtos, data science, MLOps, automação, dashboards, etc.).
- **Carrosséis por categoria**:
  - Para cada categoria de projeto (ex.: Produtos Digitais, Data Science, Dashboards, Otimização), um carrossel horizontal com cards de projetos.
  - Cada card clicável, levando à página de detalhes do projeto.
- **Depoimentos (opcional)**:
  - Alguns depoimentos de clientes fictícios ou genéricos, reforçando confiança.
- **Call-to-action final**:
  - Seção de fechamento convidando o visitante a explorar mais projetos ou entrar em contato.

### 4.3. Página Lista de Projetos (`/projetos`)

- Exibir todos os projetos em um layout de grid/lista.
- Opções de filtragem:
  - Por categoria.
  - Por tecnologia.
  - Talvez por tipo de resultado (ex.: aumento de receita, redução de custo, automação, etc.).
- Campo de busca por texto (titulo, cliente, palavras-chave).
- Ordenação (opcional): por data, por destaque, etc.

### 4.4. Página Detalhe do Projeto (`/projetos/:slug`)

Seções básicas para cada projeto:

- **Header do projeto**:
  - Título do projeto.
  - Subtítulo (resumo curto do que foi feito).
  - Categoria(s) e tags principais.
- **Contexto**:
  - Problema de negócio.
  - Situação inicial.
- **Solução**:
  - Abordagem adotada.
  - Arquitetura em alto nível.
  - Principais componentes implementados.
- **Tecnologias**:
  - Lista de stacks, libs, frameworks (tanto de software quanto de data science).
- **Resultados**:
  - Métricas (mesmo que mockadas): tempo, performance, acurácia, ROI, etc.
  - Benefícios qualitativos.
- **Galeria/Mock de telas** (opcional):
  - Imagens estáticas ou placeholders representando dashboards, app, etc.
- **Projetos relacionados**:
  - Sugestão de outros projetos da mesma categoria ou tecnologia.
- Botão de **voltar** para a lista de projetos/categoria anterior.

### 4.5. Página Serviços (`/servicos`)

- Lista estruturada dos **serviços oferecidos**, por exemplo:
  - Desenvolvimento de produtos digitais.
  - Data Science e Machine Learning.
  - Engenharia de Dados.
  - Dashboards e Data Visualization.
  - Otimização de processos com automação.
- Para cada serviço:
  - Descrição curta.
  - Exemplos de entregáveis.
  - Tecnologias com as quais a Caos Domado trabalha.

### 4.6. Página Sobre (`/sobre`)

- **História/propósito** da Caos Domado.
- Valores principais (ex.: curiosidade, rigor, transparência, experimentação controlada).
- Mini-bios de membros principais (mockados):
  - Nome.
  - Papel (ex.: Engenheiro de Software, Cientista de Dados).
  - Resumo curto de experiência.

### 4.7. Página Contato (`/contato`)

- **Formulário simulado** com campos:
  - Nome.
  - E-mail.
  - Empresa (opcional).
  - Mensagem.
  - Tipo de interesse (ex.: Projeto de software, Data Science, Consultoria, Outro).
- Validação de campos em frontend.
- Ao enviar:
  - Não há envio real.
  - Exibir mensagem de sucesso mockada (ex.: "Obrigado! Retornaremos em breve.").
  - Opcionalmente, simular um `loading` de poucos segundos.

### 4.8. Página 404 (`*`)

- Mensagem amigável indicando que a rota não existe.
- Botão para voltar à Home ou para a lista de projetos.

### 4.9. Páginas futuras (opcionais)

- Blog/Insights.
- Página específica para cada serviço com cases relacionados.
- Página de FAQ.

---

## 5. Modelo de dados mockados

### 5.1. Entidade Categoria (`Category`)

Representa grupos de projetos (ex.: Produtos Digitais, Data Science, Dashboards, Automação).

Campos sugeridos:

- `id`: string.
- `slug`: string (ex.: `produtos-digitais`).
- `name`: string.
- `description`: string.
- `icon`: string ou referência a um ícone.
- `order`: número para ordenação de exibição.

### 5.2. Entidade Projeto (`Project`)

Campos sugeridos:

- `id`: string.
- `slug`: string para a URL.
- `title`: título do projeto.
- `subtitle`: frase curta explicando o case.
- `categoryId`: ou lista de categorias.
- `client`: nome do cliente (pode ser genérico ou fictício).
- `problem`: descrição do problema.
- `solution`: descrição da solução.
- `results`: array de itens, cada um com título + descrição + (opcional) valor numérico/percentual.
- `technologies`: array de strings ou objetos `Tech`.
- `duration`: texto (ex.: "3 meses").
- `year`: ano da entrega.
- `status`: "em_producao", "poC", "interno" etc.
- `highlight`: boolean (projeto destacado).
- `thumbnail`: caminho para imagem ou placeholder.
- `gallery`: array de imagens (mockadas).

### 5.3. Entidade Serviço (`Service`)

Campos sugeridos:

- `id`: string.
- `slug`: string.
- `name`: string.
- `shortDescription`: string.
- `longDescription`: string.
- `deliverables`: array de strings.
- `technologies`: array de strings ou `Tech`.
- `relatedProjectIds`: array de IDs de projetos.

### 5.4. Entidade Tecnologia (`Tech`)

- `id`: string.
- `name`: string (React, Python, FastAPI, dbt, etc.).
- `type`: ex.: `frontend`, `backend`, `data-science`, `infra`, `mlops`.
- `icon`: string (classe de ícone ou caminho).

### 5.5. Entidade Depoimento (`Testimonial`)

- `id`: string.
- `authorName`: string.
- `authorRole`: string.
- `company`: string.
- `quote`: texto do depoimento.
- `relatedProjectId`: id de projeto opcional.

### 5.6. Entidade Membro de Time (`TeamMember`)

- `id`: string.
- `name`: string.
- `role`: string.
- `bio`: texto curto.
- `photo`: caminho para avatar ou inicial.
- `skills`: array de strings.

### 5.7. Local de armazenamento dos mocks

Sugestão de arquivos:

- `src/mocks/projects.ts` ou `.js`.
- `src/mocks/categories.ts`.
- `src/mocks/services.ts`.
- `src/mocks/testimonials.ts`.
- `src/mocks/team.ts`.

Cada arquivo exporta um array tipado (se TypeScript) ou bem documentado.

---

## 6. UX detalhada por fluxo

### 6.1. Fluxo de descoberta de projetos

1. Usuário acessa a **Home**.
2. Lê rapidamente o **Hero** e entende o posicionamento da Caos Domado.
3. Rola até os **carrosséis por categoria**:
   - Visualiza os principais projetos, organizados por tema.
   - Pode interagir com o carrossel (setas, swipe em mobile).
4. Clica em um card de projeto e é levado para a página de detalhes (`/projetos/:slug`).

### 6.2. Fluxo de leitura de case completo

1. Ao abrir a página de detalhe, o usuário:
   - Vê um resumo do projeto (título, subtítulo, tags, cliente).
   - Enxerga rapidamente o **problema** que foi resolvido.
2. Em seguida, percorre seções em uma ordem clara:
   - Contexto → Solução → Resultados → Tecnologias → Projetos relacionados.
3. Ao final, pode:
   - Voltar para a lista de projetos filtrada.
   - Navegar para outro projeto sugerido.
   - Ir para a página de contato.

### 6.3. Fluxo de contato simulado

1. Usuário acessa `/contato`.
2. Preenche formulário com validação de campos obrigatórios.
3. Clica em "Enviar":
   - Frontend mostra um breve `loading`.
   - Em seguida, uma mensagem de sucesso.
4. Opcionalmente, o formulário pode ser resetado.

### 6.4. Responsividade

- **Mobile-first**.
- Breakpoints principais (ex.: 480px, 768px, 1024px).
- Comportamento dos carrosséis em mobile:
  - Swipe horizontal.
  - Indicação visual de que a lista é rolável.

### 6.5. Acessibilidade

- Uso apropriado de semântica HTML (header, main, section, nav, footer, etc.).
- Labels associados a inputs.
- Contraste adequado entre texto e fundo.
- Foco visível para navegação via teclado.

---

## 7. Componentização em React

### 7.1. Componentes básicos (atoms)

- **Button**: variações (primário, secundário, texto, ícone).
- **Tag/Badge**: para categorias, status, tecnologias.
- **Heading/Text**: componentes tipográficos para padronizar títulos e textos.
- **Icon**: wrapper genérico para ícones.
- **Avatar**: para membros de time ou depoimentos.
- **Input/TextArea/Select**: campos de formulário base.

### 7.2. Componentes compostos (molecules)

- **ProjectCard**:
  - Thumbnail.
  - Título.
  - Subtítulo/cliente.
  - Tags principais.
- **CategoryCarousel**:
  - Recebe uma categoria e lista de projetos.
  - Internamente usa `ProjectCard`.
- **ServiceCard**:
  - Nome do serviço.
  - Descrição curta.
  - Ícone.
- **TestimonialCard**.
- **TeamMemberCard**.
- **FilterBar** (barra de filtros de projetos).

### 7.3. Seções / Organisms

- **HeroSection**.
- **ProjectsByCategorySection** (usa vários `CategoryCarousel`).
- **ServicesSection**.
- **TestimonialsSection**.
- **ContactFormSection`**.

### 7.4. Layout e Páginas

- **Layout**:
  - `PageLayout`: aplica header + footer + container.
- **Páginas**:
  - `HomePage`.
  - `ProjectsPage`.
  - `ProjectDetailPage`.
  - `ServicesPage`.
  - `AboutPage`.
  - `ContactPage`.
  - `NotFoundPage`.

### 7.5. Hooks e lógica reutilizável (opcional)

- `useCarousel` – controle de índice, navegação, etc.
- `useTheme` – controle de tema claro/escuro.
- `useFilteredProjects` – lógica de filtragem por categoria/tecnologia.

---

## 8. Comportamentos locais e interações

### 8.1. Carrosséis por categoria

- Navegação por setas em desktop.
- Swipe em mobile.
- Animações suaves (transitions CSS ou libs leves de animação).

### 8.2. Filtros e busca local

- Nenhum filtro faz requisição externa.
- Todos os filtros atuam sobre arrays em memória.
- Opções de filtros:
  - Dropdown para categoria.
  - Multi-select de tecnologias.
  - Campo de texto para busca.

### 8.3. Favoritos / Destaque local (opcional)

- Usuário pode marcar projetos como "favoritos".
- Persistência em `localStorage` (ex.: array de IDs).

### 8.4. Tema claro/escuro (opcional)

- Toggle no header.
- Preferência salva em `localStorage`.
- Classes/variáveis de tema aplicadas globalmente.

### 8.5. Microinterações e animações

- Hovers em botões e cards.
- Transição de entrada de seções.
- Skeletons para simular carregamento (ainda que os dados sejam locais, para demonstrar boas práticas de UX).

---

## 9. Identidade visual

### 9.1. Paleta de cores (sugestão)

- **Primária**: Tons escuros (azul petróleo, roxo profundo) representando profundidade técnica.
- **Secundária**: Acentos em cores vivas (ciano, verde-neon) remetendo à energia do "caos".
- **Neutros**: Cinzas para texto, bordas e fundos.
- **Feedback**: Verde (sucesso), amarelo (atenção), vermelho (erro) em pequena escala.

### 9.2. Tipografia

- Fonte sem serifa moderna para texto (ex.: Inter, Roboto, etc.).
- Variação de peso para reforçar hierarquia (títulos mais pesados, corpo intermediário).

### 9.3. Ícones e metáforas visuais

- Ícones simples que remetam a:
  - Dados (gráficos, tabelas, nós de rede).
  - Software (blocos, código, janelas).
  - Organização (grids, linhas, caixas).

### 9.4. Exemplos de seções

- Seção "Antes e Depois":
  - Representações visuais do estado caótico vs. organizado.
- Seção "Pipeline de Dados" (para projetos de data science):
  - Linha do tempo com estágios (coleta → tratamento → modelagem → deploy → monitoramento).

---

## 10. Boas práticas, qualidade e manutenção

### 10.1. Padrões de código

- Componentes pequenos e com uma responsabilidade clara.
- Evitar duplicação de lógica.
- Props bem tipadas (se TypeScript) ou bem documentadas.
- Nomes descritivos para componentes, funções e variáveis.

### 10.2. Testes possíveis (opcional)

- Testes de snapshot para componentes visuais críticos.
- Testes unitários de hooks que contenham lógica mais complexa (ex.: filtragem de projetos).

### 10.3. Evolução futura do projeto

- Conexão dos mocks com uma API real.
- Painel administrativo para cadastrar/editar projetos.
- Autenticação básica para área administrativa.
- Internacionalização (pt-BR, en-US).

### 10.4. Ideias de integração real futura

- Integração com ferramentas de analytics (ex.: Google Analytics, Plausible, etc.).
- Envio real de formulários de contato para e-mail/CRM.

---

## 11. Roadmap sugerido de implementação

### Etapa 1 – Fundamentos

- Configurar projeto React.
- Configurar roteamento.
- Criar estrutura de pastas.
- Implementar layout global (header, footer, PageLayout).

### Etapa 2 – Modelo de dados e mocks

- Definir interfaces/types das entidades principais.
- Criar arquivos de mocks (projetos, categorias, serviços, depoimentos, time).

### Etapa 3 – Páginas principais (MVP)

- Home com carrosséis por categoria (dados reais dos mocks).
- Página de lista de projetos com filtros simples.
- Página de detalhe de projeto.
- Páginas institucionais básicas (Sobre, Serviços, Contato com formulário simulado).

### Etapa 4 – Polimento

- Responsividade completa.
- Acessibilidade básica.
- Microinterações e animações leves.
- Ajustes de conteúdo textual (refinamento da narrativa).
