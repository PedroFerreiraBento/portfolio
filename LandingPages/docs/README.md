# Documentação do Portfólio de Landing Pages

Este diretório contém os guias estratégicos, visuais e técnicos para a construção de um portfólio de landing pages de alto nível, focado em conversão e estética premium.

## 📁 Guia de Arquivos

### 🎯 [Banco de Ideias (plan.md)](file:///d:/Projects/Empreender/Portifolio/LandingPages/docs/plan.md)
**Foco:** Nichos e composições para o portfólio.
- **Conteúdo:** 200 ideias de nichos, sugestão de roadmap para um portfólio inicial estratégico e lista de serviços extras para oferecer aos clientes.
- **Use quando:** Estiver buscando o que construir para compor seu portfólio ou quiser escolher um nicho lucrativo para atacar.

### 🎨 [Catálogo de Estilos (design_styles.md)](file:///d:/Projects/Empreender/Portifolio/LandingPages/docs/design_styles.md)
**Foco:** Inspiração e Fundamentos.
- **Conteúdo:** Princípios básicos de design (hierarquia, contraste) e uma lista exaustiva de mais de 180 estilos visuais categorizados.
- **Use quando:** Precisar de inspiração visual ou quiser variar a "vibe" das suas páginas para não parecerem todas iguais.

### 🛠️ [Manual de Implementação (main_styles.md)](file:///d:/Projects/Empreender/Portifolio/LandingPages/docs/main_styles.md)
**Foco:** O "Como Fazer" técnico (Design).
- **Conteúdo:** Especificações detalhadas para os 3 estilos mais lucrativos (*Clean Premium*, *SaaS/Bento* e *Dark Tech*), incluindo HEX das cores, fontes, espaçamentos e design de componentes.
- **Use quando:** Estiver com a "mão na massa" codando e quiser garantir que o layout siga padrões de design de alto nível.

### 📝 [Instruções de IA (instructions.md)](file:///d:/Projects/Empreender/Portifolio/LandingPages/docs/instructions.md)
**Foco:** Automação e Padrões de Código (Astro + Tailwind).
- **Conteúdo:** Documentação instrucional para IAs, stack oficial, estrutura de pastas e componentes reaproveitáveis, além de prompts prontos para geração de páginas.
- **Use quando:** For pedir para uma IA (como eu) construir uma nova landing page seguindo a arquitetura do projeto.

---

## 🏗️ Regras de Organização e Construção

Para cada página listada no [plan.md](file:///d:/Projects/Empreender/Portifolio/LandingPages/docs/plan.md), as seguintes diretrizes devem ser seguidas:

1.  **Estrutura de Pastas**: Cada landing page deve ser construída dentro da pasta `LandingPages/projects/` e deve ser numerada (ex: `LandingPages/projects/001-BarbeariaPremium`).
2.  **Escolha de Estilo**: Para cada página, deve-se escolher um tipo de design e estilo detalhado no [main_styles.md](file:///d:/Projects/Empreender/Portifolio/LandingPages/docs/main_styles.md).
3.  **Documentação Local**: Cada pasta da página deve conter um arquivo `README.md` documentando a escolha do estilo e as decisões de design.
4.  **Implementação Técnica**: A criação e construção devem seguir rigorosamente as diretrizes do [instructions.md](file:///d:/Projects/Empreender/Portifolio/LandingPages/docs/instructions.md).

---

## 🚀 Fluxo de Trabalho Sugerido

1. **Definição:** Escolha um nicho no `plan.md` (ex: "Clínica de Estética").
2. **Conceituação:** Procure referências no `design_styles.md` e regras visuais no `main_styles.md`.
3. **Geração/Execução:** Use os prompts e a arquitetura do `instructions.md` para orientar a IA na construção da página usando **Astro**.

---
> [!IMPORTANT]
> A meta é construir um portfólio que mostre que você domina tanto o **código** quanto a **estratégia visual** necessária para fazer o cliente do seu cliente comprar.
