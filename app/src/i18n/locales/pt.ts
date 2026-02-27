import type { TranslationDictionary } from "../types";

export const pt: TranslationDictionary = {
  common: {
    brandName: "Caos Domado",
    tagline: "Domando complexidade com software e ciência de dados.",
    headerSubtitle: "Portfólio de projetos & soluções em dados",
    footerTagline: "Software & Data",
    language: {
      label: "Idioma",
      pt: "Português",
      en: "Inglês",
    },
    contact: "Entrar em contato",
  },
  nav: {
    home: "Início",
    projects: "Projetos",
    services: "Serviços",
    blog: "Blog",
    about: "Sobre",
    contact: "Contato",
  },
  home: {
    hero: {
      title: "Transformando caos em soluções orientadas a dados.",
      subtitle:
        "Portfólio de projetos de software e ciência de dados da Caos Domado.",
      ctaPrimary: "Ver projetos",
      ctaSecondary: "Conhecer serviços",
      pill1: "Landing pages, dashboards e produtos internos",
      pill2: "Da ideia ao experimento em produção",
      ctaContact: "Agendar conversa",
      imageAlt: "Visual de dashboards e aplicações em tela",
    },
    sections: {
      categoriesEyebrow: "Tipos de projeto",
      categoriesTitle: "Onde mais atuo hoje",
      categoriesSeePortfolio: "Ver portfólio",
      examplesEyebrow: "Alguns exemplos",
      examplesTitle: "O tipo de resultado que você pode esperar",
      examplesSeeCatalog: "Ver catálogo completo",
      examplesHighlightedBadge: "Case real",
      examplesHighlightedLinkLabel: "Ver detalhes do case",
      examplesCard1ImageAlt: "Exemplo de landing page de produto",
      examplesCard1Badge: "Página de venda SaaS",
      examplesCard1Title: "Conversão de trial e storytelling de produto",
      examplesCard1Description:
        "Landing page focada em destacar proposta de valor, prova social e CTA para contato/demonstração.",
      examplesCard2ImageAlt: "Exemplo de dashboard de operação",
      examplesCard2Badge: "Dashboard operacional",
      examplesCard2Title: "Monitoramento diário com alertas acionáveis",
      examplesCard2Description:
        "Painéis que conectam dados de diferentes fontes para apoiar decisões de operação e produto.",
      finalCtaEyebrow: "Próximo passo",
      finalCtaText:
        "Tem um cenário caótico em mente? Vamos olhar para os dados juntos.",
      finalCtaContactLabel: "Preencher formulário de contato",
      finalCtaProjectsLabel: "Ver catálogo de projetos",
    },
  },
  projectContent: {
    "proj-otimizacao-estoque-ecommerce": {
      title: "Estoque sem Desperdício",
      subtitle:
        "Como comprar apenas o que vende e não perder dinheiro com mercadoria parada.",
      client: "Loja de Moda Online",
      problem:
        "Dinheiro parado em produtos que não vendiam e falta frequente dos itens que os clientes mais procuravam.",
      solution:
        "Sistema que avisa a quantidade exata para comprar de cada produto, baseado no histórico de vendas real.",
      results: {
        "0": {
          label: "Menos vendas perdidas",
          description:
            "Produtos mais procurados passaram a estar sempre disponíveis.",
        },
        "1": {
          label: "Menos dinheiro parado",
          description: "Redução drástica de produtos encalhados no estoque.",
        },
      },
    },
    "proj-churn-saas-b2b": {
      title: "Fidelização de Clientes",
      subtitle: "Descobrir quem quer cancelar antes que o cliente vá embora.",
      client: "Empresa de Software Financeiro",
      problem:
        "Muitos clientes cancelavam o contrato logo no início e a empresa não sabia o motivo ou quem seria o próximo.",
      solution:
        "Ferramenta que identifica clientes insatisfeitos pelo comportamento de uso e avisa a equipe para entrar em contato.",
      results: {
        "0": {
          label: "Maior retenção no início",
          description: "Menos cancelamentos nos primeiros 3 meses de contrato.",
        },
        "1": {
          label: "Atendimento preventivo",
          description:
            "A equipe passou a ligar para resolver problemas antes do cliente reclamar.",
        },
      },
    },
    "proj-recomendacao-ecommerce": {
      title: "Venda Mais para o Mesmo Cliente",
      subtitle:
        "Sugerir o produto certo na hora certa para aumentar o valor do pedido.",
      client: "Loja de Eletrônicos",
      problem:
        "A loja mostrava os mesmos produtos para todo mundo, perdendo a chance de oferecer o que cada pessoa realmente queria.",
      solution:
        "Sistema que aprende o gosto de cada visitante e mostra ofertas personalizadas que aumentam a chance de compra.",
      results: {
        "0": {
          label: "Mais cliques nas ofertas",
          description:
            "Visitantes passaram a se interessar mais pelas vitrines de produtos.",
        },
        "1": {
          label: "Pedidos maiores",
          description:
            "Aumento significativo no valor médio gasto por cada cliente.",
        },
      },
    },
    "proj-deteccao-fraude-pagamentos": {
      title: "Proteção contra Prejuízo",
      subtitle:
        "Bloquear compras falsas sem impedir os clientes reais de comprar.",
      client: "Empresa de Pagamentos",
      problem:
        "Muito dinheiro perdido com golpes de cartão e problemas com bancos por aprovar vendas falsas.",
      solution:
        "Robô de segurança que analisa cada tentativa de compra em segundos e barra o que for suspeito.",
      results: {
        "0": {
          label: "Menos golpes aprovados",
          description:
            "Queda drástica no prejuízo financeiro causado por fraudes.",
        },
        "1": {
          label: "Melhor reputação bancária",
          description:
            "A operação ficou mais saudável e confiável para os parceiros financeiros.",
        },
      },
    },
    "proj-previsao-demanda-industria": {
      title: "Produção sob Medida",
      subtitle:
        "Fabricar exatamente o que o mercado vai pedir nas próximas semanas.",
      client: "Indústria de Bens de Consumo",
      problem:
        "A fábrica produzia demais do que não vendia e de menos do que o mercado queria, gerando custos extras.",
      solution:
        "Cálculo inteligente que prevê os pedidos da semana seguinte para ajustar a produção antecipadamente.",
      results: {
        "0": {
          label: "Acerto na produção",
          description:
            "Fim da correria para produzir itens urgentes de última hora.",
        },
        "1": {
          label: "Fábrica mais eficiente",
          description:
            "Menos horas extras pagas e menos máquinas paradas por falta de material.",
        },
      },
    },
    "proj-landing-saas-b2b": {
      title: "Página que Vende Sozinha",
      subtitle:
        "Explicar o produto de forma simples para atrair clientes qualificados.",
      client: "Empresa de Automação Financeira",
      problem:
        "O site era confuso e técnico, e os visitantes iam embora sem entender o que a empresa fazia.",
      solution:
        "Criação de uma nova página focada nos benefícios reais para o cliente, com botões claros para pedir orçamento.",
      results: {
        "0": {
          label: "Mais pedidos de orçamento",
          description:
            "Aumento direto no número de pessoas interessadas no produto.",
        },
        "1": {
          label: "Vendas mais fáceis",
          description:
            "Os clientes já chegavam para a reunião sabendo exatamente o que queriam.",
        },
      },
    },
    "proj-portal-clientes-b2b": {
      title: "Autoatendimento 24h",
      subtitle:
        "Permitir que o cliente resolva pendências sem ligar para o suporte.",
      client: "Empresa de Serviços",
      problem:
        "A equipe perdia o dia todo enviando 2ª via de boleto e cópia de contrato por e-mail.",
      solution:
        "Portal online onde o próprio cliente baixa faturas e documentos quando quiser.",
      results: {
        "0": {
          label: "Equipe menos sobrecarregada",
          description: "Fim das tarefas repetitivas de envio de documentos.",
        },
        "1": {
          label: "Cliente mais satisfeito",
          description:
            "Facilidade para acessar informações sem depender de horário comercial.",
        },
      },
    },
    "proj-app-campo-vendas": {
      title: "Vendas na Palma da Mão",
      subtitle:
        "Aplicativo para vendedores externos fecharem pedidos mais rápido.",
      client: "Indústria com Vendedores Externos",
      problem:
        "Os pedidos demoravam dias para chegar na empresa porque eram feitos no papel.",
      solution:
        "Aplicativo de celular que funciona mesmo sem internet para lançar pedidos na hora da visita.",
      results: {
        "0": {
          label: "Informação imediata",
          description:
            "A empresa passou a saber das vendas no momento em que elas acontecem.",
        },
        "1": {
          label: "Previsão de faturamento",
          description:
            "Ficou fácil saber quanto vai entrar de dinheiro no fim do mês.",
        },
      },
    },
    "proj-backoffice-operacoes": {
      title: "Controle Total da Operação",
      subtitle: "Organizar quem faz o quê e quando, sem perder nada de vista.",
      client: "Startup de Serviços",
      problem:
        "Ninguém sabia direito com quem estava cada tarefa, gerando atrasos e cobranças dos clientes.",
      solution:
        "Painel central que organiza todas as pendências em filas e mostra o status de cada uma em tempo real.",
      results: {
        "0": {
          label: "Fim do retrabalho",
          description:
            "Acabaram os casos de duas pessoas fazendo a mesma coisa sem saber.",
        },
        "1": {
          label: "Prazos cumpridos",
          description:
            "Os gerentes conseguem ver o que está atrasado e agir na hora.",
        },
      },
    },
    "proj-mvp-marketplace-nicho": {
      title: "Teste de Novo Negócio",
      subtitle: "Validar uma ideia de empresa gastando o mínimo possível.",
      client: "Empreendedor Individual",
      problem:
        "Dúvida se existia mercado para uma plataforma conectando compradores e vendedores específicos.",
      solution:
        "Versão simplificada do site apenas com o essencial para provar que a ideia funcionava.",
      results: {
        "0": {
          label: "Prova de interesse",
          description: "Confirmação de que as pessoas pagariam pelo serviço.",
        },
        "1": {
          label: "Economia de tempo e dinheiro",
          description:
            "Evitou gastar meses construindo algo que ninguém queria.",
        },
      },
    },
    "proj-dashboard-executivo": {
      title: "Painel de Controle da Empresa",
      subtitle: "Todos os números importantes do negócio em uma única tela.",
      client: "Empresa em Crescimento",
      problem:
        "Os sócios demoravam dias para juntar planilhas e saber se a empresa deu lucro ou prejuízo no mês.",
      solution:
        "Tela gerencial que atualiza sozinha e mostra vendas, gastos e lucro em tempo real.",
      results: {
        "0": {
          label: "Decisões rápidas",
          description:
            "Fim das reuniões longas apenas para apresentar números passados.",
        },
        "1": {
          label: "Visão única",
          description:
            "Todos os sócios passaram a olhar para os mesmos dados confiáveis.",
        },
      },
    },
    "proj-dashboard-operacao-logistica": {
      title: "Gestão de Entregas e Prazos",
      subtitle: "Monitorar onde está cada entrega para evitar reclamações.",
      client: "Transportadora Regional",
      problem:
        "A empresa só descobria que uma entrega atrasou quando o cliente ligava reclamando.",
      solution:
        "Painel que mostra em um mapa quais entregas estão em risco de atraso hoje.",
      results: {
        "0": {
          label: "Ação antes da reclamação",
          description:
            "A equipe passou a resolver problemas de rota antes que virassem atrasos.",
        },
        "1": {
          label: "Melhor uso da frota",
          description:
            "Entendimento de quais rotas eram mais problemáticas para ajustar o planejamento.",
        },
      },
    },
    "proj-dashboard-produto-saas": {
      title: "Mapa de Uso do Software",
      subtitle: "Entender quais ferramentas os clientes realmente usam.",
      client: "Empresa de Software B2B",
      problem:
        "Gastava-se muito dinheiro criando funções no sistema que ninguém usava.",
      solution:
        "Monitoramento que mostra exatamente onde os usuários clicam e onde eles travam.",
      results: {
        "0": {
          label: "Foco no que importa",
          description:
            "A equipe parou de criar funções inúteis e melhorou as que todos usam.",
        },
        "1": {
          label: "Melhoria na comunicação",
          description:
            "Ficou mais fácil mostrar o valor das novidades para os clientes.",
        },
      },
    },
    "proj-dashboard-marketing-performance": {
      title: "Retorno Real do Marketing",
      subtitle: "Saber qual anúncio traz dinheiro e qual só gasta orçamento.",
      client: "Agência de Marketing",
      problem:
        "Dificuldade em provar para o cliente que o investimento no Google e redes sociais estava dando lucro.",
      solution:
        "Painel que cruza o valor gasto em anúncios com as vendas reais no caixa.",
      results: {
        "0": {
          label: "Investimento inteligente",
          description:
            "Corte de verba em canais ruins e aumento onde dá retorno.",
        },
        "1": {
          label: "Confiança nos dados",
          description:
            "A diretoria passou a confiar nos números apresentados pelo marketing.",
        },
      },
    },
    "proj-dashboard-financeiro-cashflow": {
      title: "Previsibilidade Financeira",
      subtitle:
        "Enxergar com clareza se vai sobrar ou faltar dinheiro nos próximos meses.",
      client: "Pequena Empresa de Serviços",
      problem:
        "O dono da empresa vivia com medo de não ter dinheiro para pagar as contas no fim do mês.",
      solution:
        "Ferramenta visual que projeta as entradas e saídas futuras para evitar surpresas.",
      results: {
        "0": {
          label: "Fim das surpresas",
          description:
            "Antecipação de meses difíceis para cortar gastos a tempo.",
        },
        "1": {
          label: "Segurança para investir",
          description:
            "Clareza sobre o momento certo para contratar ou comprar equipamentos.",
        },
      },
    },
    "proj-pdv-offline-first": {
      title: "Sistema de Caixa e Gestão para Varejo",
      subtitle:
        "Um PDV pensado para vender mais com filas menores, operação estável e visão clara do que acontece na loja.",
      client: "Rede de lojas de varejo",
      businessContext:
        "Projeto real criado para lojas com alto movimento diário, onde alguns segundos no atendimento fazem diferença no faturamento do fim do dia.",
      problem:
        "A equipe perdia vendas por lentidão no caixa, internet instável e falta de visibilidade em tempo real. Isso gerava fila, estresse e decisões no escuro.",
      solution:
        "Foi implementado um PDV com fluxo simples para o operador, área gerencial para acompanhamento das vendas e controle de fiados. Mesmo quando a internet oscila, a loja continua vendendo sem parar.",
      highlights: {
        "0": "Atendimento mais rápido no caixa, reduzindo fila e aumentando a chance de conversão.",
        "1": "Operação mais segura em horários de pico, sem depender 100% da internet.",
        "2": "Mais controle financeiro com gestão de fiados no dia a dia.",
        "3": "Gestão com visão clara para agir rápido e corrigir gargalos da operação.",
      },
      modules: {
        "0": {
          title: "Entrada por perfil",
          description:
            "Cada pessoa entra no ambiente certo (admin ou caixa), com mais organização e menos erro.",
        },
        "1": {
          title: "Área administrativa",
          description:
            "Configurações e controles da loja em um só lugar, com foco em praticidade.",
        },
        "2": {
          title: "Painel de gestão",
          description:
            "Indicadores de vendas e operação para tomar decisão com rapidez.",
        },
        "3": {
          title: "Painel comercial",
          description:
            "Acompanhamento das vendas para identificar oportunidades e perdas.",
        },
        "4": {
          title: "Configuração de filiais",
          description:
            "Padronização da operação para manter consistência entre unidades.",
        },
        "5": {
          title: "Frente de caixa",
          description:
            "Tela objetiva para registrar pedidos com rapidez e menos atrito para o operador.",
        },
        "6": {
          title: "Controle de fiados",
          description:
            "Registro de pendências e recebimentos para melhorar o controle de caixa.",
        },
      },
      results: {
        "0": {
          label: "Redução no tempo médio de atendimento",
          description:
            "Com fluxo de caixa enxuto e atalhos operacionais, o checkout ficou mais rápido e diminuiu filas em horários de maior movimento.",
        },
        "1": {
          label: "Mais produtividade da equipe de caixa",
          description:
            "Padronização de processos e menor atrito no uso elevaram a capacidade de atendimento por operador ao longo do turno.",
        },
        "2": {
          label: "Menos perdas por indisponibilidade operacional",
          description:
            "A estratégia offline-first sustentou a continuidade das vendas mesmo com oscilações de internet, reduzindo impacto direto no faturamento.",
        },
      },
    },
  },
  serviceContent: {
    "service-produtos-digitais": {
      name: "Desenvolvimento de Produtos Digitais",
      shortDescription:
        "Da ideia ao produto em produção, com foco em experimento e aprendizado. Criamos soluções robustas e escaláveis.",
      longDescription:
        "Nossa abordagem para desenvolvimento de produtos digitais combina design centrado no usuário, engenharia de software de ponta e uma mentalidade ágil. Não apenas escrevemos código; construímos produtos que resolvem problemas reais. Desde a concepção e prototipagem até o lançamento e escala, atuamos em todas as etapas para garantir que o produto atinja seus objetivos de negócio.",
      deliverables: {
        "0": "Aplicações web responsivas e PWAs",
        "1": "APIs RESTful e GraphQL escaláveis",
        "2": "Arquitetura de microsserviços",
        "3": "Sistemas de Design",
      },
    },
    "service-data-science": {
      name: "Data Science & Machine Learning",
      shortDescription:
        "Transforme dados brutos em inteligência acionável. Modelos preditivos e análises avançadas.",
      longDescription:
        "Utilizamos técnicas avançadas de estatística e aprendizado de máquina para extrair valor dos seus dados. Seja para prever demandas, segmentar clientes, detectar fraudes ou otimizar processos, nossa equipe de cientistas de dados constrói modelos personalizados que se integram perfeitamente à sua operação.",
      deliverables: {
        "0": "Modelos de previsão de demanda",
        "1": "Motores de recomendação",
        "2": "Análise de churn e LTV",
        "3": "Processamento de Linguagem Natural (NLP)",
      },
    },
    "service-dashboards": {
      name: "Dashboards & Business Intelligence",
      shortDescription:
        "Visualizações de dados intuitivas para tomada de decisão rápida e assertiva.",
      longDescription:
        "Criamos painéis interativos e relatórios que contam a história por trás dos números. Focamos em UX de dados para garantir que as informações mais críticas estejam acessíveis e compreensíveis para os tomadores de decisão.",
      deliverables: {
        "0": "Dashboards executivos e operacionais",
        "1": "Relatórios automatizados",
        "2": "Storytelling com dados",
        "3": "Implementação de ferramentas de BI",
      },
    },
    "service-automacao": {
      name: "Automação e Otimização de Processos",
      shortDescription:
        "Elimine tarefas repetitivas e aumente a eficiência operacional com automação inteligente.",
      longDescription:
        "Identificamos gargalos e ineficiências em seus processos de negócio e implementamos soluções de automação que liberam sua equipe para focar em atividades de maior valor. Integramos sistemas díspares e criamos fluxos de trabalho contínuos.",
      deliverables: {
        "0": "RPA (Robotic Process Automation)",
        "1": "Integração de sistemas (APIs)",
        "2": "Scripts de automação customizados",
        "3": "Otimização de fluxos de trabalho",
      },
    },
  },
  pages: {
    projects: {
      title: "Projetos",
      description:
        "Explore os projetos que mostram como domamos o caos em diferentes contextos de negócio.",
      introCta: {
        primaryLabel: "Quero falar sobre um projeto",
        primaryDescription:
          "Me conte rapidamente o cenário e eu respondo com ideias de caminhos possíveis.",
        secondaryLabel: "Ver serviços",
      },
      filters: {
        categoryLabel: "Categoria",
        categoryAll: "Todas as categorias",
        techLabel: "Tecnologia",
        techAll: "Todas as tecnologias",
        searchLabel: "Busca",
        searchPlaceholder: "Buscar por título ou cliente",
      },
      emptyState: {
        message: "Nenhum projeto encontrado com os filtros atuais.",
        contactCtaLabel: "Mesmo assim, quero conversar sobre um projeto",
      },
      card: {
        viewDetails: "Ver detalhes",
        talkAboutSimilar: "Quero algo parecido",
        durationUnit: "meses",
      },
      closingCta: {
        eyebrow: "Pronto para o próximo passo?",
        text: "Se viu algum projeto que parece com o seu desafio (ou mesmo que não tenha visto algo idêntico), vale a pena conversar.",
        contactLabel: "Ir para a página de contato",
      },
    },
    services: {
      title: "Serviços",
      description:
        "O que a Caos Domado pode entregar em desenvolvimento de software, dados e automação. Atuamos em todo o ciclo de vida do produto.",
      deliverablesLabel: "O que entregamos",
      introCta: {
        primaryLabel: "Falar com especialista",
        primaryDescription:
          "Quer entender qual serviço se encaixa no seu momento?",
        secondaryLabel: "Ver projetos relacionados",
      },
      card: {
        actionLabel: "Tenho interesse",
      },
      closingCta: {
        eyebrow: "Vamos construir juntos?",
        text: "Cada serviço é adaptado para a realidade do seu negócio. Não vendemos pacotes fechados, vendemos solução.",
        contactLabel: "Solicitar proposta",
      },
    },
    about: {
      title: "Sobre a Caos Domado",
      description:
        "Somos especialistas em transformar complexidade em vantagem competitiva.",
      hero: {
        headline: "Nós não apenas escrevemos código. Nós resolvemos problemas.",
        subheadline:
          "Em um mundo onde dados e sistemas crescem desordenadamente, nossa missão é trazer estrutura, clareza e resultados previsíveis para sua operação.",
      },
      story: {
        title: "Nossa Abordagem",
        content:
          "A Caos Domado nasceu da observação de que muitas empresas se afogam em seus próprios dados e processos. Tecnologia não deve ser mais uma fonte de ansiedade. Nós combinamos engenharia de software rigorosa com ciência de dados pragmática para criar soluções que funcionam no mundo real, não apenas no ambiente de testes.",
      },
      values: {
        title: "Pilares da nossa entrega",
        items: {
          rigor: {
            title: "Rigor Técnico",
            description:
              "Não pegamos atalhos. Construímos bases sólidas que escalam com o seu negócio.",
          },
          transparency: {
            title: "Transparência Radical",
            description:
              "Você sempre saberá o que estamos fazendo, por que estamos fazendo e quanto vai custar.",
          },
          impact: {
            title: "Foco no Impacto",
            description:
              "Se não move o ponteiro do negócio, não priorizamos. Tecnologia é meio, não fim.",
          },
        },
      },
      team: {
        title: "Quem Doma o Caos",
        subtitle:
          "Um time multidisciplinar obcecados por eficiência e qualidade.",
      },
      cta: {
        title: "Sua empresa precisa dessa maturidade técnica?",
        button: "Converse com nossos engenheiros",
      },
    },
    contact: {
      title: "Vamos conversar",
      description:
        "Conte sobre seu desafio e receba uma resposta em até 24h úteis.",
      infoTitle: "Me conte sobre seu projeto",
      infoDescription:
        "Seja um novo projeto, consultoria ou dúvida — respondo em até 24h úteis.",
      emailLabel: "E-mail para contato",
      emailValue: "contato@caosdomado.com",
      locationLabel: "Localização",
      locationValue: "São Paulo, SP - Brasil",
      heroImageAlt: "Ambiente de escritório moderno com computador",
      heroQuote: '"Transformando dados em decisões."',
      form: {
        nameLabel: "Nome",
        namePlaceholder: "Como você prefere ser chamado?",
        emailLabel: "E-mail",
        emailPlaceholder: "voce@suaempresa.com",
        companyLabel: "Empresa (opcional)",
        companyPlaceholder: "Nome da sua empresa",
        messageLabel: "Mensagem",
        messagePlaceholder:
          "Conte um pouco sobre o desafio que você está enfrentando...",
        submit: "Enviar mensagem",
        sending: "Enviando...",
        success: "Mensagem enviada! Vou te responder em até 24h úteis.",
        errorMessage: "Falha ao enviar mensagem. Por favor, tente novamente.",
        sendAnother: "Enviar outra mensagem",
      },
    },
    projectDetail: {
      problemTitle: "Antes: o que estava travando as vendas",
      solutionTitle: "Depois: como a operação melhorou",
      businessContextTitle: "Onde este projeto gera valor",
      highlightsTitle: "Percepção de valor para o negócio",
      modulesTitle: "O que o sistema entrega no dia a dia",
      resultsTitle: "Resultados percebidos",
      techsTitle: "Tecnologias",
      servicesTitle: "Serviços Relacionados",
      testimonialsTitle: "O que dizem",
      backButton: "Voltar para projetos",
      meta: {
        client: "Cliente",
        year: "Ano",
        duration: "Duração",
        categories: "Categorias",
      },
      ctas: {
        problem: "Sua empresa enfrenta um desafio parecido?",
        problemButton: "Fale com um especialista",
        results: "Quer alcançar resultados similares no seu negócio?",
        resultsButton: "Agendar diagnóstico",
        final: "Pronto para domar o caos da sua operação?",
        finalButton: "Inicie seu projeto agora",
      },
    },
    notFound: {
      title: "Página não encontrada",
      description:
        "A rota que você tentou acessar não existe. Volte para a página inicial.",
      backToHome: "Voltar para a Home",
    },
  },
};
