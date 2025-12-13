export type Locale = "pt" | "en";

export type TranslationDictionary = {
  common: {
    brandName: string;
    tagline: string;
    headerSubtitle: string;
    footerTagline: string;
    language: {
      label: string;
      pt: string;
      en: string;
    };
    contact: string;
  };
  nav: {
    home: string;
    projects: string;
    services: string;
    about: string;
    contact: string;
  };
  home: {
    hero: {
      title: string;
      subtitle: string;
      ctaPrimary: string;
      ctaSecondary: string;
      pill1: string;
      pill2: string;
      ctaContact: string;
      imageAlt: string;
    };
    sections: {
      categoriesEyebrow: string;
      categoriesTitle: string;
      categoriesSeePortfolio: string;
      examplesEyebrow: string;
      examplesTitle: string;
      examplesSeeCatalog: string;
      examplesHighlightedBadge: string;
      examplesHighlightedLinkLabel: string;
      examplesCard1ImageAlt: string;
      examplesCard1Badge: string;
      examplesCard1Title: string;
      examplesCard1Description: string;
      examplesCard2ImageAlt: string;
      examplesCard2Badge: string;
      examplesCard2Title: string;
      examplesCard2Description: string;
      finalCtaEyebrow: string;
      finalCtaText: string;
      finalCtaContactLabel: string;
      finalCtaProjectsLabel: string;
    };
  };
  projectContent: Record<
    string,
    {
      title: string;
      subtitle: string;
      client: string;
      problem: string;
      solution: string;
      results: Record<
        string,
        {
          label: string;
          description?: string;
        }
      >;
    }
  >;
  serviceContent: Record<
    string,
    {
      name: string;
      shortDescription: string;
      longDescription: string;
      deliverables: Record<string, string>;
    }
  >;
  pages: {
    projects: {
      title: string;
      description: string;
      introCta: {
        primaryLabel: string;
        primaryDescription: string;
        secondaryLabel: string;
      };
      filters: {
        categoryLabel: string;
        categoryAll: string;
        searchLabel: string;
        searchPlaceholder: string;
      };
      emptyState: {
        message: string;
        contactCtaLabel: string;
      };
      card: {
        viewDetails: string;
        talkAboutSimilar: string;
        durationUnit: string;
      };
      closingCta: {
        eyebrow: string;
        text: string;
        contactLabel: string;
      };
    };
    services: {
      title: string;
      description: string;
      deliverablesLabel: string;
      introCta: {
        primaryLabel: string;
        primaryDescription: string;
        secondaryLabel: string;
      };
      card: {
        actionLabel: string;
      };
      closingCta: {
        eyebrow: string;
        text: string;
        contactLabel: string;
      };
    };
    about: {
      title: string;
      description: string;
      hero: {
        headline: string;
        subheadline: string;
      };
      story: {
        title: string;
        content: string;
      };
      values: {
        title: string;
        items: Record<
          string,
          {
            title: string;
            description: string;
          }
        >;
      };
      team: {
        title: string;
        subtitle: string;
      };
      cta: {
        title: string;
        button: string;
      };
    };
    contact: {
      title: string;
      description: string;
      infoTitle: string;
      infoDescription: string;
      emailLabel: string;
      emailValue: string;
      locationLabel: string;
      locationValue: string;
      heroImageAlt: string;
      heroQuote: string;
      form: {
        nameLabel: string;
        namePlaceholder: string;
        emailLabel: string;
        emailPlaceholder: string;
        companyLabel: string;
        companyPlaceholder: string;
        messageLabel: string;
        messagePlaceholder: string;
        submit: string;
        sending: string;
        success: string;
        errorMessage: string;
        sendAnother: string;
      };
    };
    projectDetail: {
      problemTitle: string;
      solutionTitle: string;
      resultsTitle: string;
      techsTitle: string;
      servicesTitle: string;
      testimonialsTitle: string;
      backButton: string;
      meta: {
        client: string;
        year: string;
        duration: string;
        categories: string;
      };
      ctas: {
        problem: string;
        problemButton: string;
        results: string;
        resultsButton: string;
        final: string;
        finalButton: string;
      };
    };
    notFound: {
      title: string;
      description: string;
      backToHome: string;
    };
  };
};
