import type { TranslationDictionary } from "../types";

export const en: TranslationDictionary = {
  common: {
    brandName: "Caos Domado",
    tagline: "Taming complexity with software and data science.",
    headerSubtitle: "Project portfolio & data solutions",
    footerTagline: "Software & Data",
    language: {
      label: "Language",
      pt: "Portuguese",
      en: "English",
    },
    contact: "Get in touch",
  },
  nav: {
    home: "Home",
    projects: "Projects",
    services: "Services",
    blog: "Blog",
    about: "About",
    contact: "Contact",
  },
  home: {
    hero: {
      title: "Turning chaos into data-driven solutions.",
      subtitle:
        "Portfolio of software and data science projects by Caos Domado.",
      ctaPrimary: "View projects",
      ctaSecondary: "Explore services",
      pill1: "Landing pages, dashboards and internal tools",
      pill2: "From idea to experiment in production",
      ctaContact: "Schedule a call",
      imageAlt: "Screens showing dashboards and applications",
    },
    sections: {
      categoriesEyebrow: "Project types",
      categoriesTitle: "Where I mostly operate today",
      categoriesSeePortfolio: "View portfolio",
      examplesEyebrow: "A few examples",
      examplesTitle: "The kind of outcome you can expect",
      examplesSeeCatalog: "View full catalog",
      examplesHighlightedBadge: "Real case",
      examplesHighlightedLinkLabel: "See case details",
      examplesCard1ImageAlt: "Example of product landing page",
      examplesCard1Badge: "SaaS sales page",
      examplesCard1Title: "Trial conversion and product storytelling",
      examplesCard1Description:
        "Landing page focused on highlighting the value proposition, social proof and a clear CTA to contact/request a demo.",
      examplesCard2ImageAlt: "Example of operations dashboard",
      examplesCard2Badge: "Operations dashboard",
      examplesCard2Title: "Daily monitoring with actionable alerts",
      examplesCard2Description:
        "Dashboards that connect data from different sources to support operations and product decisions.",
      finalCtaEyebrow: "Next step",
      finalCtaText:
        "Got a chaotic scenario in mind? Let’s look at the data together.",
      finalCtaContactLabel: "Fill out contact form",
      finalCtaProjectsLabel: "View project catalog",
    },
  },
  projectContent: {
    "proj-otimizacao-estoque-ecommerce": {
      title: "Zero-Waste Inventory",
      subtitle:
        "How to buy only what sells and stop losing money with dead stock.",
      client: "Online Fashion Store",
      problem:
        "Money tied up in products that didn't sell and frequent shortages of items customers wanted most.",
      solution:
        "Smart system that advises exactly how much to buy of each product, based on real sales history.",
      results: {
        "0": {
          label: "Fewer lost sales",
          description: "Popular items became consistently available.",
        },
        "1": {
          label: "Less tied-up capital",
          description: "Drastic reduction of dead stock in the warehouse.",
        },
      },
    },
    "proj-churn-saas-b2b": {
      title: "Customer Loyalty",
      subtitle: "Discovering who wants to cancel before the client leaves.",
      client: "Financial Software Company",
      problem:
        "Many clients canceled contracts early on, and the company didn't know why or who would be next.",
      solution:
        "Tool that identifies dissatisfied clients based on usage behavior and alerts the team to get in touch.",
      results: {
        "0": {
          label: "Higher retention at start",
          description: "Fewer cancellations in the first 3 months of contract.",
        },
        "1": {
          label: "Preventive service",
          description:
            "The team started calling to solve problems before the client complained.",
        },
      },
    },
    "proj-recomendacao-ecommerce": {
      title: "Sell More to the Same Client",
      subtitle:
        "Suggesting the right product at the right time to increase order value.",
      client: "Electronics Store",
      problem:
        "The store showed the same products to everyone, missing the chance to offer what each person really wanted.",
      solution:
        "System that learns each visitor's taste and shows personalized offers that increase the chance of purchase.",
      results: {
        "0": {
          label: "More clicks on offers",
          description: "Visitors became more interested in product showcases.",
        },
        "1": {
          label: "Larger orders",
          description: "Significant increase in average spend per customer.",
        },
      },
    },
    "proj-deteccao-fraude-pagamentos": {
      title: "Protection Against Loss",
      subtitle:
        "Blocking fake purchases without stopping real customers from buying.",
      client: "Payments Company",
      problem:
        "Money lost to credit card scams and issues with banks due to approving fake sales.",
      solution:
        "Security bot that analyzes every purchase attempt in seconds and blocks suspicious ones.",
      results: {
        "0": {
          label: "Fewer approved scams",
          description: "Drastic drop in financial loss caused by fraud.",
        },
        "1": {
          label: "Better bank reputation",
          description:
            "The operation became healthier and more trusted by financial partners.",
        },
      },
    },
    "proj-previsao-demanda-industria": {
      title: "Made-to-Order Production",
      subtitle:
        "Manufacturing exactly what the market will ask for in the coming weeks.",
      client: "Consumer Goods Industry",
      problem:
        "The factory produced too much of what didn't sell and too little of what the market wanted, creating extra costs.",
      solution:
        "Smart calculation that predicts next week's orders to adjust production in advance.",
      results: {
        "0": {
          label: "Production accuracy",
          description:
            "End of the rush to produce urgent items at the last minute.",
        },
        "1": {
          label: "More efficient factory",
          description:
            "Less overtime paid and fewer machines stopped due to lack of material.",
        },
      },
    },
    "proj-landing-saas-b2b": {
      title: "Page That Sells by Itself",
      subtitle: "Explaining the product simply to attract qualified clients.",
      client: "Financial Automation Company",
      problem:
        "The website was confusing and technical, and visitors left without understanding what the company did.",
      solution:
        "Creation of a new page focused on real benefits for the client, with clear buttons to request a quote.",
      results: {
        "0": {
          label: "More quote requests",
          description:
            "Direct increase in the number of people interested in the product.",
        },
        "1": {
          label: "Easier sales",
          description:
            "Clients arrived at meetings knowing exactly what they wanted.",
        },
      },
    },
    "proj-portal-clientes-b2b": {
      title: "24h Self-Service",
      subtitle: "Allowing the client to solve issues without calling support.",
      client: "Services Company",
      problem:
        "The team wasted the whole day sending bill copies and contract copies via email.",
      solution:
        "Online portal where the client downloads invoices and documents whenever they want.",
      results: {
        "0": {
          label: "Less overwhelmed team",
          description: "End of repetitive document sending tasks.",
        },
        "1": {
          label: "Happier client",
          description:
            "Ease of accessing information without depending on business hours.",
        },
      },
    },
    "proj-app-campo-vendas": {
      title: "Sales in the Palm of Your Hand",
      subtitle: "App for field salespeople to close deals faster.",
      client: "Industry with External Sales",
      problem:
        "Orders took days to reach the company because they were done on paper.",
      solution:
        "Mobile app that works even without internet to enter orders right at the visit.",
      results: {
        "0": {
          label: "Immediate information",
          description:
            "The company started knowing about sales the moment they happen.",
        },
        "1": {
          label: "Revenue forecast",
          description:
            "It became easy to know how much money will come in at the end of the month.",
        },
      },
    },
    "proj-backoffice-operacoes": {
      title: "Total Operation Control",
      subtitle:
        "Organizing who does what and when, without losing track of anything.",
      client: "Services Startup",
      problem:
        "No one really knew who had which task, causing delays and client complaints.",
      solution:
        "Central board that organizes all pending items in queues and shows the status of each one in real time.",
      results: {
        "0": {
          label: "End of rework",
          description:
            "No more cases of two people doing the same thing without knowing.",
        },
        "1": {
          label: "Deadlines met",
          description: "Managers can see what is late and act immediately.",
        },
      },
    },
    "proj-mvp-marketplace-nicho": {
      title: "New Business Test",
      subtitle: "Validating a business idea spending as little as possible.",
      client: "Individual Entrepreneur",
      problem:
        "Doubt if there was a market for a platform connecting specific buyers and sellers.",
      solution:
        "Simplified version of the site with only the essentials to prove the idea worked.",
      results: {
        "0": {
          label: "Proof of interest",
          description: "Confirmation that people would pay for the service.",
        },
        "1": {
          label: "Time and money saving",
          description:
            "Avoided spending months building something no one wanted.",
        },
      },
    },
    "proj-dashboard-executivo": {
      title: "Company Control Panel",
      subtitle: "All important business numbers on a single screen.",
      client: "Growing Company",
      problem:
        "Partners took days to merge spreadsheets and know if the company made a profit or loss in the month.",
      solution:
        "Management screen that updates itself and shows sales, expenses, and profit in real time.",
      results: {
        "0": {
          label: "Quick decisions",
          description: "End of long meetings just to present past numbers.",
        },
        "1": {
          label: "Single view",
          description:
            "All partners started looking at the same reliable data.",
        },
      },
    },
    "proj-dashboard-operacao-logistica": {
      title: "Delivery and Deadline Management",
      subtitle: "Monitoring where each delivery is to avoid complaints.",
      client: "Regional Carrier",
      problem:
        "The company only found out a delivery was late when the client called complaining.",
      solution:
        "Panel showing on a map which deliveries are at risk of delay today.",
      results: {
        "0": {
          label: "Action before complaint",
          description:
            "The team started solving route problems before they became delays.",
        },
        "1": {
          label: "Better fleet usage",
          description:
            "Understanding which routes were most problematic to adjust planning.",
        },
      },
    },
    "proj-dashboard-produto-saas": {
      title: "Software Usage Map",
      subtitle: "Understanding which tools clients actually use.",
      client: "B2B Software Company",
      problem:
        "A lot of money was spent creating system functions that no one used.",
      solution:
        "Monitoring that shows exactly where users click and where they get stuck.",
      results: {
        "0": {
          label: "Focus on what matters",
          description:
            "The team stopped creating useless functions and improved the ones everyone uses.",
        },
        "1": {
          label: "Better communication",
          description:
            "It became easier to show the value of updates to clients.",
        },
      },
    },
    "proj-dashboard-marketing-performance": {
      title: "Real Marketing Return",
      subtitle: "Knowing which ad brings money and which just wastes budget.",
      client: "Marketing Agency",
      problem:
        "Difficulty proving to the client that investment in Google and social media was making a profit.",
      solution:
        "Panel that crosses amount spent on ads with real sales at the register.",
      results: {
        "0": {
          label: "Smart investment",
          description:
            "Cutting budget on bad channels and increasing where there is return.",
        },
        "1": {
          label: "Trust in data",
          description:
            "The board started trusting the numbers presented by marketing.",
        },
      },
    },
    "proj-dashboard-financeiro-cashflow": {
      title: "Financial Predictability",
      subtitle:
        "Clearly seeing if money will be left over or missing in the coming months.",
      client: "Small Services Business",
      problem:
        "The business owner lived in fear of not having money to pay bills at the end of the month.",
      solution:
        "Visual tool that projects future inflows and outflows to avoid surprises.",
      results: {
        "0": {
          label: "End of surprises",
          description: "Anticipating difficult months to cut costs in time.",
        },
        "1": {
          label: "Security to invest",
          description: "Clarity on the right moment to hire or buy equipment.",
        },
      },
    },
    "proj-pdv-offline-first": {
      title: "Retail Checkout and Store Management System",
      subtitle:
        "A POS built to sell more with shorter lines, stable operation, and clear day-to-day management visibility.",
      client: "Retail store chain",
      businessContext:
        "Real project built for high-traffic stores where a few seconds at checkout can materially impact daily revenue.",
      problem:
        "Sales were being lost due to slow checkout, unstable internet, and low operational visibility. The outcome was longer lines, more stress, and reactive decisions.",
      solution:
        "An easy-to-use POS was implemented with a fast cashier flow, a management area for sales visibility, and tabs control. Even with internet oscillation, stores keep selling without interruption.",
      highlights: {
        "0": "Faster checkout flow, reducing queues and increasing conversion opportunity.",
        "1": "More stable operation during peak hours, with less dependency on internet quality.",
        "2": "Better cash control through integrated tabs tracking.",
        "3": "Clearer management visibility to identify and fix bottlenecks quickly.",
      },
      modules: {
        "0": {
          title: "Role-based entry",
          description:
            "Each user lands in the right area (admin or cashier), improving organization and reducing mistakes.",
        },
        "1": {
          title: "Management area",
          description:
            "Store settings and controls in one place, focused on day-to-day practicality.",
        },
        "2": {
          title: "Management dashboard",
          description:
            "Sales and operations indicators to support quick business decisions.",
        },
        "3": {
          title: "Sales dashboard",
          description:
            "Track performance and identify opportunities or losses across the day.",
        },
        "4": {
          title: "Branch Configuration",
          description:
            "Standardized operation across stores to keep execution consistent.",
        },
        "5": {
          title: "POS Terminal",
          description:
            "Objective checkout screen for faster order processing with less friction.",
        },
        "6": {
          title: "Tabs Management",
          description:
            "Open balance and payment tracking to improve day-to-day cash predictability.",
        },
      },
      results: {
        "0": {
          label: "Lower average checkout time",
          description:
            "With a streamlined cashier flow and operational shortcuts, checkout became faster and reduced peak-hour queues.",
        },
        "1": {
          label: "Higher cashier team productivity",
          description:
            "Standardized flows and lower UI friction increased each operator's throughput across the shift.",
        },
        "2": {
          label: "Fewer losses from operational downtime",
          description:
            "The offline-first approach kept sales running during internet oscillations, reducing direct revenue impact.",
        },
      },
    },
  },
  serviceContent: {
    "service-produtos-digitais": {
      name: "Digital Product Development",
      shortDescription:
        "From idea to production, with focus on experimentation and learning. We create robust and scalable solutions.",
      longDescription:
        "Our approach to digital product development combines user-centered design, cutting-edge software engineering, and an agile mindset. We don't just write code; we build products that solve real problems. From conception and prototyping to launch and scale, we operate at every stage to ensure the product meets its business goals.",
      deliverables: {
        "0": "Responsive web applications and PWAs",
        "1": "Scalable RESTful and GraphQL APIs",
        "2": "Microservices architecture",
        "3": "Design Systems",
      },
    },
    "service-data-science": {
      name: "Data Science & Machine Learning",
      shortDescription:
        "Transform raw data into actionable intelligence. Predictive models and advanced analytics.",
      longDescription:
        "We use advanced statistical and machine learning techniques to extract value from your data. Whether forecasting demand, segmenting customers, detecting fraud, or optimizing processes, our team of data scientists builds custom models that integrate seamlessly into your operation.",
      deliverables: {
        "0": "Demand forecasting models",
        "1": "Recommendation engines",
        "2": "Churn and LTV analysis",
        "3": "Natural Language Processing (NLP)",
      },
    },
    "service-dashboards": {
      name: "Dashboards & Business Intelligence",
      shortDescription:
        "Intuitive data visualizations for fast and assertive decision making.",
      longDescription:
        "We create interactive dashboards and reports that tell the story behind the numbers. We focus on data UX to ensure critical information is accessible and understandable for decision-makers.",
      deliverables: {
        "0": "Executive and operational dashboards",
        "1": "Automated reports",
        "2": "Data storytelling",
        "3": "BI tools implementation",
      },
    },
    "service-automacao": {
      name: "Process Automation & Optimization",
      shortDescription:
        "Eliminate repetitive tasks and increase operational efficiency with intelligent automation.",
      longDescription:
        "We identify bottlenecks and inefficiencies in your business processes and implement automation solutions that free up your team to focus on higher-value activities. We integrate disparate systems and create seamless workflows.",
      deliverables: {
        "0": "RPA (Robotic Process Automation)",
        "1": "System integration (APIs)",
        "2": "Custom automation scripts",
        "3": "Workflow optimization",
      },
    },
  },
  pages: {
    projects: {
      title: "Projects",
      description:
        "Explore projects that show how we tame chaos in different business contexts.",
      introCta: {
        primaryLabel: "Talk about a project",
        primaryDescription:
          "Briefly tell me about your scenario and I’ll reply with possible paths.",
        secondaryLabel: "View services",
      },
      filters: {
        categoryLabel: "Category",
        categoryAll: "All categories",
        techLabel: "Technology",
        techAll: "All technologies",
        searchLabel: "Search",
        searchPlaceholder: "Search by title or client",
      },
      emptyState: {
        message: "No projects found for the current filters.",
        contactCtaLabel: "I still want to talk about a project",
      },
      card: {
        viewDetails: "View details",
        talkAboutSimilar: "I want something like this",
        durationUnit: "months",
      },
      closingCta: {
        eyebrow: "Ready for the next step?",
        text: "If you saw any project that looks like your challenge (or simply liked the way of working), it’s worth starting a conversation.",
        contactLabel: "Go to contact page",
      },
    },
    services: {
      title: "Services",
      description:
        "What Caos Domado can deliver in software development, data and automation. We act throughout the entire product lifecycle.",
      deliverablesLabel: "What we deliver",
      introCta: {
        primaryLabel: "Talk to an expert",
        primaryDescription:
          "Want to understand which service fits your moment?",
        secondaryLabel: "View related projects",
      },
      card: {
        actionLabel: "I'm interested",
      },
      closingCta: {
        eyebrow: "Let's build together?",
        text: "Each service is adapted to your business reality. We don't sell closed packages, we sell solutions.",
        contactLabel: "Request proposal",
      },
    },
    about: {
      title: "About Caos Domado",
      description:
        "We are experts in turning complexity into competitive advantage.",
      hero: {
        headline: "We don't just write code. We solve problems.",
        subheadline:
          "In a world where data and systems grow disorderly, our mission is to bring structure, clarity, and predictable results to your operation.",
      },
      story: {
        title: "Our Approach",
        content:
          "Caos Domado was born from the observation that many companies drown in their own data and processes. Technology shouldn't be another source of anxiety. We combine rigorous software engineering with pragmatic data science to create solutions that work in the real world, not just in the test environment.",
      },
      values: {
        title: "Pillars of our delivery",
        items: {
          rigor: {
            title: "Technical Rigor",
            description:
              "We don't cut corners. We build solid foundations that scale with your business.",
          },
          transparency: {
            title: "Radical Transparency",
            description:
              "You will always know what we are doing, why we are doing it, and how much it will cost.",
          },
          impact: {
            title: "Focus on Impact",
            description:
              "If it doesn't move the business needle, we don't prioritize it. Technology is a means, not an end.",
          },
        },
      },
      team: {
        title: "Who Tames the Chaos",
        subtitle:
          "A multidisciplinary team obsessed with efficiency and quality.",
      },
      cta: {
        title: "Does your company need this technical maturity?",
        button: "Talk to our engineers",
      },
    },
    contact: {
      title: "Let's talk",
      description:
        "Tell us about your challenge — we'll reply within 24 business hours.",
      infoTitle: "Tell us about your project",
      infoDescription:
        "New project, consulting, or just a question — we'll reply within 24 business hours.",
      emailLabel: "Contact email",
      emailValue: "contact@caosdomado.com",
      locationLabel: "Location",
      locationValue: "São Paulo, SP - Brazil",
      heroImageAlt: "Modern office workspace with computer",
      heroQuote: '"Turning data into decisions."',
      form: {
        nameLabel: "Name",
        namePlaceholder: "How should we call you?",
        emailLabel: "Email",
        emailPlaceholder: "you@yourcompany.com",
        companyLabel: "Company (optional)",
        companyPlaceholder: "Your company name",
        messageLabel: "Message",
        messagePlaceholder:
          "Tell us a bit about the challenge you are facing...",
        submit: "Send message",
        sending: "Sending...",
        success: "Message sent! We'll reply within 24 business hours.",
        errorMessage: "Failed to send message. Please try again.",
        sendAnother: "Send another message",
      },
    },
    projectDetail: {
      problemTitle: "Before: what was slowing sales down",
      solutionTitle: "After: how operations improved",
      businessContextTitle: "Where this project creates value",
      highlightsTitle: "Business value perception",
      modulesTitle: "What the system delivers daily",
      resultsTitle: "Perceived outcomes",
      techsTitle: "Technologies",
      servicesTitle: "Related Services",
      testimonialsTitle: "What they say",
      backButton: "Back to projects",
      meta: {
        client: "Client",
        year: "Year",
        duration: "Duration",
        categories: "Categories",
      },
      ctas: {
        problem: "Does your company face a similar challenge?",
        problemButton: "Talk to an expert",
        results: "Want to achieve similar results in your business?",
        resultsButton: "Schedule diagnosis",
        final: "Ready to tame the chaos in your operation?",
        finalButton: "Start your project now",
      },
    },
    notFound: {
      title: "Page not found",
      description:
        "The route you tried to access does not exist. Go back to the home page.",
      backToHome: "Back to Home",
    },
  },
};
