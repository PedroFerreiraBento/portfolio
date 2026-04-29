Perfeito. Vou tratar isso como um **manual de direção visual para você construir landing pages de portfólio com aparência realmente profissional**.

A base que vou usar aqui segue princípios sólidos de design visual: escala, hierarquia, equilíbrio, contraste e Gestalt, que ajudam tanto na estética quanto na usabilidade. Também é importante manter consistência de layout, tipografia, cor, movimento e acessibilidade; Material Design, Apple HIG e WCAG reforçam esses pontos como fundamentos de interfaces bem construídas. A WCAG, por exemplo, recomenda contraste mínimo de **4.5:1 para texto comum** e **3:1 para texto grande**, o que é essencial para a página parecer bonita e ser legível de verdade. ([Nielsen Norman Group][1])

Abaixo estão os estilos que eu considero mais fortes para você usar de modo geral em landing pages modernas.

---

# 1. Clean Premium / Neo-Minimalista

Esse é um dos estilos mais importantes para o seu portfólio, porque funciona para quase qualquer cliente. Ele transmite profissionalismo, clareza e valor. É o tipo de visual que passa a sensação de que o negócio é sério, confiável e bem posicionado.

Serve muito bem para:

Advogados, contadores, consultores, clínicas, biomédicas estetas, psicólogos, nutricionistas, arquitetos, corretores, empresas B2B, prestadores de serviço premium e profissionais liberais.

A ideia central desse estilo é: **menos elementos, mais precisão**.

Não é uma página vazia. É uma página onde cada elemento parece ter sido colocado com intenção.

## Sensação que o design precisa transmitir

A página precisa parecer:

Sofisticada, organizada, confiável, calma, cara, limpa, segura e fácil de entender.

O visitante deve sentir que está diante de uma empresa ou profissional que sabe exatamente o que está fazendo. Nada pode parecer improvisado.

## Direção visual

Use fundo claro, mas evite branco puro em excesso. Branco puro pode parecer frio ou genérico. Prefira tons como:

```txt
#FAFAF7
#F8F7F3
#F6F3EE
#F4F1EA
#FFFFFF apenas para cards e áreas de destaque
```

O texto deve ser quase preto, mas não preto absoluto:

```txt
Texto principal: #151515, #171717, #1C1C1C
Texto secundário: #5F5F5F, #666666, #737373
Bordas: #E6E2DA, #E5E5E5
```

A cor de destaque precisa ser discreta. Ela não deve gritar. Deve parecer escolhida com cuidado.

Boas opções:

```txt
Dourado queimado: #B88746
Verde escuro: #183D2D
Azul petróleo: #1E3A5F
Vinho fechado: #6F2D3A
Marrom sofisticado: #7A5C45
Laranja premium: #C76B2C
```

## Tipografia

Esse estilo depende muito da tipografia.

Uma combinação muito forte é:

```txt
Título com fonte elegante + texto com fonte extremamente legível
```

Exemplos:

```txt
Playfair Display + Inter
Cormorant Garamond + Manrope
Libre Baskerville + Plus Jakarta Sans
Fraunces + Satoshi
DM Serif Display + Inter
```

Para negócios mais sérios, como advogado ou contador, use menos personalidade:

```txt
Manrope + Inter
Plus Jakarta Sans + Inter
Satoshi + Inter
```

Para negócios mais premium, como estética, arquitetura e imóveis, você pode usar uma serifada elegante no título.

## Escala tipográfica recomendada

Desktop:

```txt
H1: 60px a 76px
H2: 42px a 52px
H3: 26px a 32px
Subtítulo do hero: 18px a 22px
Texto comum: 16px a 18px
Texto pequeno: 14px
```

Mobile:

```txt
H1: 36px a 44px
H2: 30px a 36px
H3: 22px a 26px
Texto: 16px
```

O erro comum é usar títulos pequenos demais. Em landing page moderna, o hero precisa ter presença.

## Layout

Use muito espaço.

A página precisa respirar. O espaçamento é um dos maiores sinais de design premium.

```txt
Padding lateral desktop: 80px a 120px
Padding lateral tablet: 40px
Padding lateral mobile: 20px a 24px

Espaço entre seções: 100px a 160px
Espaço entre título e subtítulo: 16px a 24px
Espaço entre texto e botão: 28px a 40px
Padding interno de cards: 28px a 40px
```

Use container centralizado:

```css
.container {
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 24px;
}
```

O layout ideal para esse estilo é simples:

```txt
Navbar limpa
Hero com texto forte e imagem/mockup
Seção de autoridade
Problema
Solução
Benefícios
Como funciona
Depoimentos
FAQ
CTA final
Rodapé elegante
```

## Hero section

O hero precisa ser extremamente claro.

Estrutura ideal:

```txt
Tag pequena acima do título
Headline grande
Subheadline explicativa
CTA principal
CTA secundário discreto
Prova de confiança
Imagem ou card visual
```

Exemplo de composição:

```txt
[Especialista em estética facial]

Realce sua beleza com naturalidade, segurança e sofisticação.

Tratamentos personalizados para quem busca resultados elegantes, atendimento humanizado e acompanhamento profissional.

[Agendar avaliação] [Conhecer tratamentos]

+500 atendimentos realizados | Avaliação personalizada | Atendimento com hora marcada
```

A tag pequena acima do título dá acabamento profissional. Pode ser uma pílula com borda:

```css
.badge {
  display: inline-flex;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid rgba(0,0,0,0.08);
  background: rgba(255,255,255,0.7);
  font-size: 14px;
}
```

## Cards

Cards nesse estilo precisam ser discretos.

```css
.card {
  background: #FFFFFF;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 28px;
  padding: 32px;
  box-shadow: 0 24px 70px rgba(0,0,0,0.06);
}
```

Evite sombra preta pesada. Use sombra suave, difusa e quase invisível.

## Imagens

Use imagens profissionais, com bastante luz natural e pouca saturação.

Tratamento recomendado:

```txt
Saturação levemente reduzida
Contraste suave
Temperatura levemente quente
Cortes bem enquadrados
Nada de imagens genéricas demais
```

Para portfólio, você pode usar mockups, fotos de ambiente, close de produto, retratos profissionais ou screenshots fictícios.

## Botões

Botão principal:

```css
.btn-primary {
  background: #171717;
  color: #fff;
  border-radius: 999px;
  padding: 15px 26px;
  font-weight: 600;
  border: none;
}
```

Botão secundário:

```css
.btn-secondary {
  background: transparent;
  color: #171717;
  border: 1px solid rgba(0,0,0,0.14);
  border-radius: 999px;
  padding: 15px 26px;
  font-weight: 600;
}
```

Nada de botão quadrado sem intenção. Para esse estilo, arredondamento alto costuma funcionar muito bem.

## Detalhes que deixam mais trabalhado

Use linhas finas separando seções.

Use ícones outline, não ícones coloridos genéricos.

Use pequenas tags em cards:

```txt
Atendimento premium
Processo seguro
Resultado natural
Diagnóstico individual
```

Use blocos de estatística:

```txt
+500 clientes atendidos
98% de satisfação
7 anos de experiência
```

Use FAQ com accordion elegante.

Use um rodapé bem acabado, com links, contato, redes e uma frase institucional.

## Erros a evitar

Não use muitas cores.

Não coloque ícones aleatórios.

Não use sombra forte.

Não use gradiente chamativo.

Não use fontes demais.

Não centralize tudo sem critério.

Não deixe o botão com cor genérica tipo azul padrão de Bootstrap.

## Quando usar

Use esse estilo quando você quiser passar confiança, sofisticação e segurança.

É o estilo mais comercialmente versátil.

---

# 2. SaaS Moderno / Bento Grid

Esse é obrigatório no seu portfólio porque você é desenvolvedor. Ele mostra que você sabe criar páginas para sistemas, apps, dashboards, automações, IA, CRM, plataformas e produtos digitais.

O estilo SaaS moderno geralmente passa a sensação de produto tecnológico bem estruturado. O bento grid ajuda porque organiza várias informações em blocos modulares, deixando a página visualmente rica sem parecer bagunçada.

## Sensação que o design precisa transmitir

A página deve parecer:

Moderna, tecnológica, organizada, escalável, funcional, inteligente e confiável.

O visitante precisa olhar e pensar:

```txt
“Esse cara sabe construir produto digital.”
```

## Direção visual

Você pode fazer em fundo claro ou escuro.

Para SaaS claro:

```txt
Background: #F8FAFC
Surface: #FFFFFF
Texto principal: #0F172A
Texto secundário: #64748B
Borda: #E2E8F0
Destaque azul: #2563EB
Destaque roxo: #7C3AED
Destaque verde: #10B981
```

Para SaaS mais premium:

```txt
Background: #F6F8FB
Surface: #FFFFFF
Texto: #111827
Muted: #6B7280
Accent: #4F46E5
```

Para SaaS com cara de IA:

```txt
Background: #F8FAFC
Accent 1: #6366F1
Accent 2: #8B5CF6
Accent 3: #06B6D4
```

## Estrutura ideal da página

```txt
Navbar
Hero com headline + mockup
Logos ou prova social
Bento grid de funcionalidades
Seção problema → solução
Demonstração do dashboard
Como funciona
Integrações
Depoimentos
Planos ou CTA
FAQ
Rodapé
```

## Hero section

O hero precisa mostrar produto. Não basta texto.

Use:

```txt
Headline forte
Subheadline curta
Botão principal
Botão secundário
Mockup de dashboard
Cards flutuantes com métricas
```

Exemplo de headline:

```txt
Automatize sua operação e acompanhe seus indicadores em tempo real.
```

Exemplo de subheadline:

```txt
Uma plataforma simples para centralizar dados, reduzir tarefas manuais e transformar relatórios em decisões rápidas.
```

## Mockup

O mockup é o coração desse estilo.

Crie um dashboard fictício com:

```txt
Sidebar
Navbar interna
Cards de KPI
Gráfico de linha
Tabela de clientes/leads/vendas
Status tags
Avatar de usuários
Notificações
```

Mesmo que o sistema seja fictício, ele precisa parecer usável.

Exemplo de elementos:

```txt
Receita mensal: R$ 84.320
Leads captados: 1.248
Taxa de conversão: 18,7%
Tempo economizado: 42h/mês
Status: Sincronizado
```

## Bento grid

O bento grid é uma grade de cards em tamanhos diferentes.

Use 12 colunas no desktop:

```css
.bento {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 16px;
}
```

Distribuição:

```txt
Card principal: 6 colunas
Card médio: 4 colunas
Card pequeno: 3 colunas
Card largo: 8 colunas
Card full: 12 colunas
```

Exemplo:

```txt
Card 1 grande: Dashboard em tempo real
Card 2 médio: Integração com WhatsApp
Card 3 médio: Relatórios automáticos
Card 4 pequeno: Alertas inteligentes
Card 5 pequeno: Exportação Excel
Card 6 largo: Fluxo de automação
```

Cards:

```css
.bento-card {
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 28px;
  padding: 28px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.06);
  overflow: hidden;
}
```

## Detalhes visuais modernos

Use gradientes sutis no fundo:

```css
.hero {
  background:
    radial-gradient(circle at top right, rgba(99, 102, 241, 0.18), transparent 35%),
    radial-gradient(circle at top left, rgba(14, 165, 233, 0.12), transparent 30%),
    #F8FAFC;
}
```

Use pequenas pílulas:

```txt
Novo
Integração nativa
IA integrada
Sem planilhas manuais
Tempo real
```

Use bordas translúcidas.

Use cards com “mini interfaces” dentro.

Use gráficos minimalistas.

Use ícones outline com fundo colorido suave.

## Tipografia

Para SaaS, prefira fontes sans-serif modernas:

```txt
Inter
Satoshi
Manrope
Plus Jakarta Sans
Geist
DM Sans
```

Escala:

```txt
H1: 64px a 80px
H2: 44px a 56px
Texto hero: 18px a 22px
Texto comum: 16px
Texto de cards: 15px
Labels: 12px a 13px
```

## Motion

Esse estilo combina muito com animação.

Use:

```txt
Cards entrando em fade-up
Mockup subindo suavemente
Números animando
Hover nos cards
Tabs alternando funcionalidades
FAQ com expansão suave
```

Configuração:

```css
transition: transform 0.25s ease, box-shadow 0.25s ease;
```

Hover:

```css
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 28px 80px rgba(15, 23, 42, 0.10);
}
```

## Erros a evitar

Não faça bento grid sem hierarquia.

Não coloque todos os cards do mesmo tamanho.

Não use dashboard genérico demais.

Não exagere em roxo/azul neon.

Não deixe textos longos dentro de cards.

Não faça a página parecer template de startup sem propósito.

## Quando usar

Use para:

```txt
SaaS
CRM
App financeiro
Dashboard
Automação
IA
BI
Ferramenta interna
Produto digital técnico
```

Esse estilo é um dos mais fortes para você vender como desenvolvedor.

---

# 3. Dark Tech Premium

Esse estilo é excelente para tecnologia, automação, inteligência artificial, cybersecurity, dados, BI, sistemas, infraestrutura, APIs e produtos voltados para performance.

Ele passa uma sensação mais avançada, técnica e poderosa.

## Sensação que o design precisa transmitir

A página precisa parecer:

Futurista, técnica, confiável, sofisticada, inteligente e robusta.

O risco desse estilo é parecer “gamer” ou exagerado. Para ficar premium, o segredo é usar fundo escuro, contraste bom, poucos brilhos e bastante organização.

## Paleta

Nunca use preto puro como fundo principal. Prefira pretos azulados ou grafite.

```txt
Background principal: #070A12
Background secundário: #0B0F19
Surface: #111827
Surface 2: #151A27
Texto principal: #F8FAFC
Texto secundário: #94A3B8
Borda: rgba(255,255,255,0.10)
```

Cores de destaque:

```txt
Roxo: #8B5CF6
Azul: #38BDF8
Verde: #22C55E
Laranja: #F97316
Ciano: #06B6D4
```

Use no máximo duas cores de destaque. Exemplo:

```txt
Roxo + ciano
Verde + azul
Laranja + roxo
```

## Background

Use efeitos radiais com opacidade baixa:

```css
background:
  radial-gradient(circle at top right, rgba(139, 92, 246, 0.22), transparent 30%),
  radial-gradient(circle at bottom left, rgba(6, 182, 212, 0.12), transparent 35%),
  #070A12;
```

Use grid sutil:

```css
background-image:
  linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
  linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
background-size: 48px 48px;
```

O grid precisa ser quase invisível. Ele deve dar textura, não competir com o conteúdo.

## Cards

Cards escuros precisam de borda e contraste.

```css
.dark-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: 28px;
  padding: 32px;
  box-shadow: 0 24px 80px rgba(0,0,0,0.35);
}
```

Para card com efeito premium:

```css
.dark-card-featured {
  background:
    linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03));
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: 32px;
}
```

## Hero

O hero desse estilo deve ter impacto.

Estrutura:

```txt
Badge técnica
Headline forte
Subheadline objetiva
CTA principal
CTA secundário
Interface técnica visual
```

Exemplo:

```txt
[Automação inteligente para operações críticas]

Transforme processos manuais em fluxos automatizados, rastreáveis e escaláveis.

Crie integrações, dashboards e rotinas inteligentes para reduzir tempo operacional e aumentar controle sobre a operação.
```

## Elementos visuais que funcionam muito bem

Use elementos que pareçam software real:

```txt
Terminal fake
Logs de execução
API request
Dashboard
Cards de status
Monitoramento em tempo real
Alertas
Fluxo de automação
Gráfico de performance
Tabela escura
Timeline de eventos
```

Exemplo de terminal fake:

```txt
> sync_reports --daily
✓ Base atualizada
✓ Validação concluída
✓ Dashboard publicado
Tempo total: 2m 41s
```

Isso dá muita força para portfólio de desenvolvedor.

## Tipografia

Use fontes técnicas, mas não difíceis de ler.

```txt
Título: Geist, Satoshi, Manrope, Space Grotesk
Texto: Inter, DM Sans, Plus Jakarta Sans
Código/terminal: JetBrains Mono, IBM Plex Mono
```

Evite usar fonte monoespaçada em tudo. Use só nos detalhes técnicos.

## Botões

Botão principal pode ter gradiente:

```css
.btn-tech {
  background: linear-gradient(135deg, #8B5CF6, #06B6D4);
  color: white;
  border-radius: 999px;
  padding: 15px 26px;
  font-weight: 700;
  box-shadow: 0 0 40px rgba(139, 92, 246, 0.28);
}
```

Botão secundário:

```css
.btn-tech-secondary {
  background: rgba(255,255,255,0.04);
  color: #F8FAFC;
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: 999px;
  padding: 15px 26px;
}
```

## Motion

Dark Tech combina com motion mais sofisticado:

```txt
Glow pulsando lentamente
Cards subindo no hover
Linhas de conexão animadas
Indicador “online” piscando suavemente
Números animando
Background gradient se movendo muito lentamente
```

Cuidado: animações rápidas demais deixam amador.

## Erros a evitar

Não use neon em tudo.

Não use preto puro com texto branco puro em excesso.

Não coloque sombra colorida em todos os cards.

Não use ícones gamer.

Não use fundos muito poluídos.

Não deixe o design parecer capa de canal de tecnologia genérico.

## Quando usar

Use para:

```txt
Automação
IA
SaaS técnico
Cybersecurity
BI
Dashboard
Dev tools
APIs
Monitoramento
Infraestrutura
```

Para seu portfólio, eu faria pelo menos uma landing page nesse estilo.

---

# 4. Editorial Premium

Esse estilo é excelente para passar valor alto. Ele parece menos “template de landing page” e mais “marca sofisticada”.

Funciona muito bem para arquitetura, imóveis, moda, estética premium, consultoria, branding, fotografia, eventos de luxo, profissionais de alto ticket e marcas pessoais.

## Sensação que o design precisa transmitir

A página precisa parecer:

Autoral, elegante, sofisticada, memorável, artística e bem dirigida.

Esse estilo deve parecer uma revista premium, não um site comum.

## Direção visual

Aqui, a composição importa muito.

Você vai usar:

```txt
Títulos grandes
Imagens grandes
Poucos textos por seção
Muito espaço negativo
Grid assimétrico
Frases fortes
Blocos editoriais
```

A página não precisa ter muitos cards. Ela precisa ter presença.

## Paleta

Cores boas:

```txt
Off-white: #F7F3EC
Preto suave: #161616
Cinza quente: #6D6A64
Marrom: #7A5C45
Dourado escuro: #A67C3D
Verde profundo: #1F3A2E
Areia: #D8C7B0
```

Para algo mais moderno:

```txt
Background: #F4F0E8
Texto: #181818
Accent: #8B5E34
Muted: #77716A
```

Para algo mais luxuoso:

```txt
Background: #111111
Texto: #F6F1E8
Accent: #C4A46B
Muted: #A7A29A
```

## Tipografia

Esse estilo depende muito de título bonito.

Boas fontes:

```txt
Playfair Display
Cormorant Garamond
Libre Baskerville
Fraunces
DM Serif Display
Lora
```

Para texto:

```txt
Inter
Satoshi
Manrope
Neue Haas-like
Plus Jakarta Sans
```

Títulos podem ser enormes:

```txt
H1: 72px a 104px
H2: 52px a 72px
Texto editorial: 20px a 26px
Texto comum: 16px a 18px
```

No mobile, reduza sem perder impacto:

```txt
H1: 42px a 52px
H2: 34px a 42px
```

## Layout

Use composições como:

```txt
60% imagem / 40% texto
40% texto / 60% imagem
Imagem fullscreen com texto sobreposto
Texto central estreito
Duas colunas assimétricas
Seções com numeração grande
```

Exemplo de estrutura:

```txt
Hero editorial
Manifesto da marca
Serviços principais
Seção visual com imagem grande
Processo
Cases ou resultados
Depoimentos
CTA final sofisticado
Rodapé minimalista
```

## Hero

O hero deve parecer capa de revista.

Exemplo:

```txt
Arquitetura pensada para transformar espaços em experiências.

Projetos residenciais e comerciais com estética refinada, funcionalidade e atenção aos detalhes.
```

Pode usar uma headline curta e poderosa:

```txt
Design que transforma presença em valor.
```

Ou:

```txt
Espaços que não apenas impressionam. Permanecem.
```

## Imagens

As imagens precisam ser excelentes.

Use:

```txt
Ambientes amplos
Composições limpas
Fotografia com luz natural
Texturas sofisticadas
Pessoas bem enquadradas
Produto em contexto
```

Tratamento:

```txt
Saturação reduzida
Contraste suave
Preto e branco elegante
Tons quentes
Grão sutil
```

Uma imagem ruim destrói esse estilo.

## Componentes

Use poucos componentes, mas muito bem desenhados.

```txt
Seções numeradas
Linhas finas
Cards sem sombra
Blocos com borda inferior
Textos grandes
Botões discretos
Galeria horizontal
Depoimento em formato editorial
```

Exemplo de card:

```css
.editorial-card {
  border-top: 1px solid rgba(0,0,0,0.14);
  padding-top: 24px;
}
```

Sem sombra pesada. Editorial premium usa mais linha, espaço e tipografia.

## Botões

Botão elegante:

```css
.btn-editorial {
  border: 1px solid currentColor;
  border-radius: 999px;
  padding: 14px 26px;
  background: transparent;
  color: inherit;
  font-weight: 500;
}
```

Também funciona botão preenchido discreto:

```css
.btn-filled {
  background: #181818;
  color: #F7F3EC;
  border-radius: 999px;
  padding: 14px 26px;
}
```

## Detalhes que deixam premium

Use numeração nas seções:

```txt
01 — Diagnóstico
02 — Conceito
03 — Execução
04 — Entrega
```

Use frases grandes entre seções.

Use imagens intercaladas.

Use letras pequenas em uppercase para labels:

```txt
SERVIÇOS
PROCESSO
EXPERIÊNCIA
RESULTADOS
```

Use linhas finas horizontais.

Use um rodapé simples e elegante.

## Erros a evitar

Não usar imagem ruim.

Não usar ícones genéricos.

Não colocar muitos cards coloridos.

Não deixar a página parecida com template corporativo.

Não exagerar em animações.

Não escrever textos longos demais por seção.

## Quando usar

Use para:

```txt
Arquitetura
Imobiliária premium
Estética high-ticket
Fotografia
Branding
Moda
Consultoria premium
Eventos sofisticados
```

Esse estilo aumenta muito a percepção de valor.

---

# 5. Organic Soft UI

Esse estilo é muito vendável para saúde, estética, bem-estar e negócios que precisam transmitir cuidado.

Funciona para biomédica esteta, psicóloga, nutricionista, clínica, spa, pilates, fisioterapia, yoga, produtos naturais, terapeutas e marcas femininas.

## Sensação que o design precisa transmitir

A página precisa parecer:

Acolhedora, humana, calma, natural, confiável, leve e segura.

A pessoa precisa sentir que está entrando em um ambiente confortável.

## Paleta

Use cores naturais e suaves.

```txt
Creme: #FFF9F0
Areia: #F3E7D8
Verde sálvia: #A8BFA3
Verde oliva suave: #7D8F69
Rosa queimado: #D9A6A1
Terracota clara: #C9876A
Marrom claro: #8A6A4F
```

Combinações boas:

```txt
Creme + verde sálvia + marrom
Areia + terracota + preto suave
Off-white + rosa queimado + dourado fosco
Creme + verde oliva + bege
```

## Tipografia

Use fontes elegantes, mas amigáveis.

```txt
Títulos: Fraunces, Cormorant, Playfair Display, Lora
Texto: Inter, Manrope, DM Sans, Nunito Sans
```

Para algo mais acolhedor, Nunito Sans funciona bem.

Para algo mais premium, use Fraunces ou Cormorant nos títulos.

## Formas

Esse estilo usa muitos cantos arredondados.

```txt
Cards: 28px a 40px
Botões: 999px
Imagens: 28px a 40px
Blocos grandes: 40px
```

Exemplo:

```css
.soft-card {
  background: #FFF9F0;
  border: 1px solid rgba(138, 106, 79, 0.12);
  border-radius: 36px;
  padding: 36px;
}
```

## Layout

Use composições suaves:

```txt
Hero com imagem humana
Cards arredondados
Seções alternando texto e imagem
Benefícios com ícones simples
Processo em etapas
Depoimentos acolhedores
FAQ
CTA para agendamento
```

Estrutura:

```txt
Hero
Benefícios emocionais
Tratamentos/serviços
Como funciona o atendimento
Sobre a profissional
Depoimentos
Dúvidas frequentes
CTA final
```

## Hero

Exemplo:

```txt
Cuidado estético com naturalidade, segurança e atenção aos detalhes.

Tratamentos personalizados para valorizar sua beleza de forma leve, elegante e respeitando sua individualidade.
```

Botões:

```txt
Agendar avaliação
Conhecer tratamentos
Falar pelo WhatsApp
```

Evite CTAs agressivos como:

```txt
Compre agora
Últimas vagas
Oferta imperdível
```

A não ser que seja página de campanha.

## Imagens

Use imagens com:

```txt
Luz natural
Pele real
Ambiente claro
Toques de natureza
Texturas suaves
Expressões tranquilas
```

Evite:

```txt
Fotos muito artificiais
Pele plástica
Antes/depois agressivo
Cores muito saturadas
Banco de imagem genérico demais
```

## Ícones

Use ícones finos, arredondados e outline.

Exemplos de ideias:

```txt
Folha
Coração
Rosto
Agenda
Escudo
Brilho
Mãos
Check circular
```

Mas sempre discretos.

## Motion

Use motion suave.

```txt
Fade-in lento
Elementos subindo pouco
Imagens com hover quase imperceptível
FAQ abrindo suavemente
```

Duração:

```txt
0.5s a 0.8s
```

Nada de animação brusca.

## Detalhes que deixam profissional

Use textura sutil no fundo.

Use formas orgânicas atrás de imagens.

Use cards com tons alternados.

Use selo de confiança:

```txt
Atendimento individualizado
Avaliação personalizada
Ambiente seguro
Procedimentos com acompanhamento
```

Use seção “como funciona” em 3 passos:

```txt
1. Avaliação
2. Plano personalizado
3. Acompanhamento
```

## Erros a evitar

Não deixar infantil.

Não usar rosa em excesso.

Não usar verde muito saturado.

Não usar ícones fofinhos demais.

Não colocar muita decoração floral.

Não comprometer contraste.

## Quando usar

Use para:

```txt
Estética
Psicologia
Nutrição
Saúde
Bem-estar
Pilates
Clínica
Spa
Terapias
Produtos naturais
```

Esse estilo vende muito bem para negócios locais com atendimento humanizado.

---

# 6. Bold Conversion / Neo-Brutalismo Refinado

Esse estilo é ótimo para mostrar que você consegue fazer páginas com impacto visual e foco em conversão.

Funciona muito bem para cursos, mentorias, infoprodutos, eventos, agências, criativos, lançamentos, produtos digitais, comunidades e campanhas de tráfego pago.

A ideia é ser forte, direto e memorável.

## Sensação que o design precisa transmitir

A página deve parecer:

Energética, direta, ousada, comercial, jovem, marcante e persuasiva.

Mas precisa ser refinada. Neo-brutalismo ruim parece bagunça. Neo-brutalismo bom parece proposital.

## Paleta

Cores fortes:

```txt
Preto: #111111
Branco: #FFFFFF
Amarelo: #FFD84D
Laranja: #FF6B35
Azul royal: #315CFF
Rosa forte: #FF4D8D
Verde ácido: #B6FF4D
Creme: #FFF3D6
```

Combinações:

```txt
Preto + amarelo + branco
Azul royal + creme + preto
Laranja + preto + branco
Rosa forte + preto + off-white
Verde ácido + grafite + branco
```

Use poucas cores, mas com força.

## Tipografia

Use fontes pesadas e diretas.

```txt
Archivo Black
Space Grotesk
Anton
Bebas Neue
Sora
Inter Tight
Manrope ExtraBold
```

Use títulos grandes:

```txt
H1: 72px a 96px
H2: 48px a 64px
Texto: 18px
```

Mobile:

```txt
H1: 42px a 52px
```

## Componentes

Neo-brutalismo usa:

```txt
Bordas grossas
Sombras duras
Cards com contraste
Elementos inclinados com moderação
Tags chamativas
Botões grandes
Tipografia forte
```

Card:

```css
.brutal-card {
  background: #FFFFFF;
  border: 2px solid #111111;
  border-radius: 18px;
  padding: 28px;
  box-shadow: 8px 8px 0 #111111;
}
```

Botão:

```css
.brutal-btn {
  background: #FFD84D;
  color: #111111;
  border: 2px solid #111111;
  border-radius: 14px;
  padding: 16px 28px;
  font-weight: 800;
  box-shadow: 5px 5px 0 #111111;
}
```

Hover:

```css
.brutal-btn:hover {
  transform: translate(2px, 2px);
  box-shadow: 3px 3px 0 #111111;
}
```

## Layout

Estrutura ideal:

```txt
Hero com headline muito forte
Oferta clara
Benefícios diretos
Para quem é
O que você recebe
Prova social
Bônus
Garantia
FAQ
CTA final
```

Esse estilo é muito bom para páginas de venda.

## Hero

Exemplo:

```txt
Pare de perder clientes com páginas bonitas que não vendem.

Landing pages rápidas, estratégicas e feitas para transformar clique em contato.
```

Ou para curso:

```txt
Aprenda Excel do zero ao avançado sem enrolação.
```

## Detalhes que deixam profissional

Use stickers visuais:

```txt
Novo
Direto ao ponto
Sem enrolação
Vagas abertas
100% prático
```

Use setas desenhadas.

Use marcações tipo highlight.

Use blocos grandes com frases curtas.

Use contraste entre seções.

Use FAQ direto.

## Erros a evitar

Não usar 10 cores.

Não deixar tudo desalinhado.

Não exagerar em elementos tortos.

Não usar fonte difícil de ler.

Não fazer textos longos demais.

Não usar esse estilo para advogado, médico sério ou consultoria muito formal.

## Quando usar

Use para:

```txt
Curso
Mentoria
Evento
Agência
Produto digital
Criador de conteúdo
Página de VSL
Campanha jovem
Lançamento
```

Esse estilo chama atenção no portfólio, mas deve ser usado com critério.

---

# 7. Glassmorphism Controlado

Glassmorphism pode ficar muito bonito, mas também pode ficar amador rapidamente. O segredo é usar como detalhe, não como estilo inteiro.

Funciona bem para apps, SaaS, fintechs, IA, eventos modernos, produtos digitais e páginas com visual mais tecnológico.

## Sensação que o design precisa transmitir

A página deve parecer:

Leve, digital, moderna, fluida, elegante e tecnológica.

## Como usar corretamente

Use vidro em:

```txt
Navbar
Cards flutuantes
Mockups
Formulários
Caixas de métricas
Depoimentos
Menus
```

Não use em todos os blocos da página.

## Fundo

Glassmorphism precisa de fundo com variação. Se o fundo for branco puro, o efeito quase não aparece.

Bons fundos:

```txt
Gradiente azul + roxo
Gradiente verde + azul
Gradiente creme + laranja suave
Fundo escuro com manchas coloridas
Imagem desfocada com overlay
```

Exemplo:

```css
.background {
  background:
    radial-gradient(circle at top left, rgba(99,102,241,0.35), transparent 30%),
    radial-gradient(circle at bottom right, rgba(14,165,233,0.25), transparent 30%),
    #F8FAFC;
}
```

## Card glass claro

```css
.glass-card-light {
  background: rgba(255,255,255,0.65);
  border: 1px solid rgba(255,255,255,0.75);
  backdrop-filter: blur(20px);
  border-radius: 28px;
  box-shadow: 0 24px 70px rgba(15,23,42,0.10);
}
```

## Card glass escuro

```css
.glass-card-dark {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.16);
  backdrop-filter: blur(20px);
  border-radius: 28px;
}
```

## Legibilidade

Aqui está o maior ponto: texto sobre vidro precisa ter contraste.

Use fundos internos levemente mais sólidos quando houver texto longo.

Exemplo:

```css
.glass-readable {
  background: rgba(255,255,255,0.78);
}
```

Para dark:

```css
.glass-readable-dark {
  background: rgba(7,10,18,0.72);
}
```

## Onde fica mais bonito

Hero com mockup flutuante.

Cards de métricas sobre fundo gradiente.

Navbar fixa com blur.

Formulário de contato em card glass.

Depoimento destacado.

## Erros a evitar

Não usar blur demais.

Não colocar texto cinza claro em fundo translúcido.

Não usar glass em seção inteira sem necessidade.

Não misturar com sombra pesada.

Não usar em página muito corporativa.

## Quando usar

Use para:

```txt
Fintech
App
SaaS
IA
Produto digital
Evento moderno
Dashboard
Landing de tecnologia
```

É bom para portfólio, mas como estilo secundário.

---

# 8. Dashboard UI / Data Product

Esse estilo é uma variação do SaaS moderno, mas com foco maior em dados, indicadores, relatórios e sistemas.

Para você, esse estilo é extremamente estratégico porque conversa com sua experiência em BI, automações, relatórios e sistemas internos.

## Sensação que o design precisa transmitir

A página precisa parecer:

Analítica, inteligente, precisa, operacional, confiável e orientada a resultado.

## Nichos onde funciona

```txt
Power BI
Dashboards
Automação de relatórios
CRM
Gestão comercial
Financeiro
Operações
Logística
Produtividade
Sistemas internos
Consultoria de dados
```

## Direção visual

Use muitos elementos de interface:

```txt
KPIs
Gráficos
Filtros
Tabelas
Status
Cards
Tags
Indicadores de crescimento
Menus laterais
Calendário
Atividades recentes
```

## Paleta

Clara:

```txt
Background: #F8FAFC
Card: #FFFFFF
Texto: #0F172A
Muted: #64748B
Borda: #E2E8F0
Azul: #2563EB
Verde: #16A34A
Vermelho: #DC2626
Amarelo: #F59E0B
```

Escura:

```txt
Background: #0B0F19
Card: #111827
Texto: #F8FAFC
Muted: #94A3B8
Borda: rgba(255,255,255,0.10)
```

## Como construir o hero

O hero pode ter uma frase forte e um dashboard grande.

Exemplo:

```txt
Relatórios automáticos para empresas que precisam decidir mais rápido.

Transforme dados espalhados em dashboards claros, atualizados e prontos para ação.
```

Ao lado, mostre um dashboard fictício.

## Componentes importantes

Card de KPI:

```txt
Receita
Produtividade
Tempo economizado
Chamados resolvidos
SLA
Conversão
```

Tabela:

```txt
Cliente
Status
Responsável
Última atualização
Valor
```

Gráfico:

```txt
Linha para evolução
Barra para comparação
Donut para distribuição
```

Timeline:

```txt
08:30 — Base extraída
08:32 — Validação concluída
08:35 — Relatório enviado
```

## O que faz parecer bem trabalhado

Use microdetalhes:

```txt
Ícones de tendência
Tags de status
Filtros no topo
Data de atualização
Avatar do responsável
Indicador online
Skeleton loading
```

Exemplo de tag:

```css
.status-success {
  background: rgba(22, 163, 74, 0.10);
  color: #15803D;
  border: 1px solid rgba(22, 163, 74, 0.18);
}
```

## Erros a evitar

Não usar gráfico sem contexto.

Não colocar dados aleatórios demais.

Não deixar dashboard poluído.

Não usar cores fortes demais em todos os indicadores.

Não usar tabela com linhas pesadas.

## Quando usar

Use para uma landing page do seu próprio serviço de automação, BI ou desenvolvimento de sistemas.

Essa pode ser uma das páginas mais importantes do seu portfólio.

---

# 9. High-Ticket / Luxury Sales Page

Esse estilo é uma mistura de Clean Premium, Editorial e conversão. Serve para vender serviços caros.

Funciona para mentoria, consultoria, estética premium, imóveis, arquitetura, eventos exclusivos, serviços personalizados e marcas pessoais.

## Sensação que precisa transmitir

Exclusividade, autoridade, desejo, transformação e confiança.

A página não pode parecer “barata”. Ela deve parecer seletiva.

## Paleta

```txt
Preto + dourado fosco
Off-white + marrom + verde escuro
Creme + vinho + preto suave
Cinza quente + champagne
```

Exemplo:

```txt
Background: #F6F1E8
Texto: #171717
Accent: #A67C3D
Muted: #6D6A64
Surface: #FFFFFF
```

Ou dark luxury:

```txt
Background: #0E0D0B
Texto: #F6F1E8
Accent: #C4A46B
Surface: #181613
```

## Estrutura ideal

```txt
Hero aspiracional
Dor ou desejo principal
Autoridade
Método
Transformação prometida
O que está incluso
Para quem é
Depoimentos
Aplicação/diagnóstico
FAQ
CTA final
```

## Hero

Exemplo:

```txt
Uma presença digital à altura do valor que você entrega.

Landing pages premium para profissionais e empresas que precisam transmitir autoridade, confiança e desejo desde o primeiro clique.
```

## Componentes

Use:

```txt
Seção manifesto
Bloco “para quem é”
Bloco “não é para quem”
Linha do tempo do método
Depoimentos longos
CTA de aplicação
FAQ elegante
```

## Detalhes visuais

Use:

```txt
Numeração elegante
Linhas finas
Serifas em títulos
Poucas cores
Fotos bem tratadas
Cards grandes
Espaço abundante
```

## Botão

Evite “Comprar agora” para high-ticket.

Use:

```txt
Solicitar diagnóstico
Agendar conversa
Aplicar para o projeto
Receber proposta
```

## Erros a evitar

Não parecer ostentação falsa.

Não exagerar em dourado.

Não usar muitas promessas.

Não usar elementos baratos de urgência.

Não usar pop-ups agressivos.

## Quando usar

Use para vender serviços mais caros.

Esse estilo pode ser aplicado ao seu próprio site.

---

# Sistema geral para qualquer página parecer “bem trabalhada”

Agora, independentemente do estilo, existe uma camada de qualidade que precisa aparecer em todas as landing pages.

## 1. Crie uma hierarquia antes de desenhar

Antes de abrir o Figma ou codar, defina:

```txt
Qual é a ação principal?
Qual é a promessa da página?
Qual é o público?
Qual é a objeção principal?
Qual é a prova?
Qual é a sensação visual desejada?
```

Uma página bonita sem hierarquia vira decoração.

A hierarquia visual deve guiar o olhar para os elementos mais importantes, usando contraste, escala, agrupamento, cor e espaçamento. A NN/g define hierarquia visual justamente como a organização dos elementos para conduzir o olhar na ordem de importância. ([Nielsen Norman Group][2])

## 2. Use uma estrutura de seções consistente

Uma landing page comercial completa pode seguir:

```txt
1. Navbar
2. Hero
3. Prova de confiança
4. Problema
5. Solução
6. Benefícios
7. Como funciona
8. Demonstração visual
9. Depoimentos/cases
10. Oferta ou serviço
11. FAQ
12. CTA final
13. Rodapé
```

Nem toda página precisa ter tudo, mas seu portfólio deve mostrar que você sabe montar uma jornada.

## 3. Trabalhe com design tokens

Defina padrões antes de sair criando componentes.

```txt
Cores
Fontes
Tamanhos
Espaçamentos
Radius
Sombras
Bordas
Ícones
Animações
```

Exemplo:

```css
:root {
  --bg: #F8F7F3;
  --surface: #FFFFFF;
  --text: #171717;
  --muted: #666666;
  --border: rgba(0,0,0,0.08);
  --accent: #B88746;

  --radius-sm: 12px;
  --radius-md: 20px;
  --radius-lg: 28px;
  --radius-xl: 40px;

  --shadow-soft: 0 24px 70px rgba(0,0,0,0.06);
}
```

Isso deixa o projeto coeso.

## 4. Use uma escala de espaçamento

Evite valores aleatórios.

Use algo assim:

```txt
4px
8px
12px
16px
24px
32px
48px
64px
96px
128px
160px
```

Exemplo:

```txt
Entre título e subtítulo: 16px
Entre subtítulo e CTA: 32px
Entre cards: 24px
Entre seções: 120px
```

## 5. Use uma escala de radius

Não use radius aleatório.

```txt
Botões pequenos: 12px
Cards comuns: 24px
Cards premium: 32px
Blocos grandes: 40px
Botão pill: 999px
```

## 6. Use no máximo 2 famílias de fonte

Regra segura:

```txt
Uma fonte para títulos
Uma fonte para corpo
```

Ou uma única fonte com vários pesos.

Muito portfólio parece amador porque mistura fontes demais.

## 7. Cuide do contraste

Não use texto cinza claro demais.

Referência prática:

```txt
Texto principal precisa ser forte.
Texto secundário pode ser mais suave.
Texto em botão precisa ser muito legível.
Texto sobre imagem precisa ter overlay.
Texto sobre glass precisa ter fundo suficiente.
```

A WCAG recomenda contraste mínimo de 4.5:1 para texto comum e 3:1 para texto grande no critério de contraste mínimo, então isso deve virar regra prática no seu processo. ([W3C][3])

## 8. Faça o mobile parecer desenhado, não apenas adaptado

Mobile não pode ser “desktop espremido”.

No mobile:

```txt
Reduza títulos
Empilhe colunas
Aumente áreas clicáveis
Simplifique grids
Diminua efeitos
Dê mais espaço vertical
Evite imagens pequenas demais
```

Exemplo:

```css
@media (max-width: 768px) {
  .hero-title {
    font-size: 40px;
    line-height: 1.05;
  }

  .section {
    padding: 80px 0;
  }

  .grid {
    grid-template-columns: 1fr;
  }
}
```

## 9. Use imagens com o mesmo tratamento

Não misture:

```txt
Uma foto fria
Uma foto quente
Uma foto saturada
Uma foto preto e branco
Uma ilustração 3D
Um ícone flat
```

Escolha um tratamento e mantenha.

Exemplo:

```txt
Todas as imagens com tom quente
Todas com baixa saturação
Todas com fundo claro
Todas com borda arredondada de 32px
```

## 10. Dê acabamento ao rodapé

Rodapé ruim passa impressão de site incompleto.

Rodapé bom tem:

```txt
Logo/nome
Frase curta
Links principais
Contato
Redes
Direitos
Política de privacidade
CTA pequeno
```

## 11. Use FAQ

FAQ aumenta percepção de página completa.

Perguntas boas:

```txt
Quanto tempo demora para entregar?
A página funciona no celular?
Posso integrar com WhatsApp?
A página pode ter formulário?
Você configura domínio?
Preciso ter textos e imagens prontos?
É possível instalar pixel?
A página é otimizada para anúncios?
```

## 12. Use microcopy profissional

Em vez de:

```txt
Enviar
```

Use:

```txt
Solicitar orçamento
Agendar avaliação
Receber proposta
Falar com especialista
Quero minha landing page
```

Em vez de:

```txt
Saiba mais
```

Use:

```txt
Ver como funciona
Conhecer os benefícios
Explorar soluções
```

## 13. Não exagere em animação

Animação boa parece natural.

Use:

```txt
Fade-up
Hover suave
Accordion
Contador
Tabs
Navbar com blur
```

Evite:

```txt
Zoom exagerado
Parallax pesado
Elementos pulando
Animação em tudo
Carrossel automático rápido
```

A Apple trata motion como recurso para orientar, dar feedback e melhorar a experiência, não como enfeite gratuito; essa é uma boa regra para landing pages também. ([Apple Developer][4])

---

# Combinações ideais para seu portfólio

Para montar um portfólio realmente atrativo, eu faria assim:

## Página 1 — Clínica estética premium

```txt
Estilo: Organic Soft UI + Clean Premium
Paleta: creme, rosa queimado, marrom, verde sálvia
Foco: agendamento pelo WhatsApp
Diferencial: fotos elegantes, seção de tratamentos, FAQ e CTA suave
```

## Página 2 — SaaS fictício de produtividade

```txt
Estilo: SaaS Moderno + Bento Grid
Paleta: branco, azul, roxo, cinza claro
Foco: produto digital
Diferencial: dashboard fake, bento grid, cards de métricas
```

## Página 3 — Automação/BI

```txt
Estilo: Dark Tech Premium + Dashboard UI
Paleta: fundo escuro, ciano, roxo, verde
Foco: mostrar sua força técnica
Diferencial: terminal fake, dashboard, fluxo de automação
```

## Página 4 — Arquitetura/interiores

```txt
Estilo: Editorial Premium
Paleta: off-white, preto suave, marrom, areia
Foco: estética e sofisticação
Diferencial: imagens grandes, grid assimétrico, tipografia serifada
```

## Página 5 — Advogado ou contador

```txt
Estilo: Clean Premium
Paleta: branco quente, azul petróleo, cinza, preto suave
Foco: confiança e autoridade
Diferencial: clareza, prova de experiência, formulário objetivo
```

## Página 6 — Curso ou mentoria

```txt
Estilo: Bold Conversion refinado
Paleta: preto, amarelo, branco
Foco: conversão
Diferencial: headline forte, oferta clara, FAQ, CTA repetido
```

## Página 7 — Imobiliária ou apartamento na planta

```txt
Estilo: High-Ticket + Editorial Premium
Paleta: creme, dourado fosco, verde escuro
Foco: captar leads
Diferencial: galeria, localização, benefícios, formulário de interesse
```

## Página 8 — App financeiro

```txt
Estilo: Glassmorphism Controlado + SaaS
Paleta: azul, branco, verde, gradiente suave
Foco: app moderno
Diferencial: mockup mobile, cards glass, métricas financeiras
```

---

# Checklist final de qualidade

Antes de publicar qualquer exemplo no portfólio, valide:

```txt
A página tem uma promessa clara?
O hero parece forte nos primeiros 5 segundos?
Existe uma ação principal evidente?
A tipografia parece intencional?
A paleta tem coerência?
O espaçamento está generoso?
Os cards seguem o mesmo sistema?
O mobile parece desenhado?
As imagens têm o mesmo tratamento?
O contraste está legível?
A página tem prova de confiança?
Existe CTA no começo, meio e fim?
O FAQ está bem acabado?
O rodapé parece profissional?
As animações são suaves?
A página não parece template genérico?
```

A impressão de “algo bem trabalhado” vem principalmente de **consistência**. O cliente pode nem saber explicar, mas ele percebe quando espaçamento, cor, fonte, sombra, cards, botões, imagens e textos parecem fazer parte do mesmo sistema.

[1]: https://www.nngroup.com/articles/principles-visual-design/?utm_source=chatgpt.com "5 Principles of Visual Design in UX"
[2]: https://www.nngroup.com/articles/visual-hierarchy-ux-definition/?utm_source=chatgpt.com "Visual Hierarchy in UX: Definition"
[3]: https://www.w3.org/TR/WCAG22/?utm_source=chatgpt.com "Web Content Accessibility Guidelines (WCAG) 2.2"
[4]: https://developer.apple.com/design/human-interface-guidelines?utm_source=chatgpt.com "Human Interface Guidelines"
