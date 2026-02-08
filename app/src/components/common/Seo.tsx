import { Helmet } from "react-helmet-async";
import { useI18n } from "../../i18n";

interface SeoProps {
    title?: string;
    description?: string;
    image?: string;
    type?: "website" | "article" | "profile";
    url?: string;
    jsonLd?: Record<string, any> | Record<string, any>[];
}

export function Seo({
    title,
    description,
    image = "/og-image.jpg",
    type = "website",
    url,
    jsonLd
}: SeoProps) {
    const { t, locale } = useI18n();
    const siteName = t("common.brandName");
    const defaultDescription = t("home.hero.subtitle");

    const fullTitle = title ? `${title} | ${siteName}` : siteName;
    const metaDescription = description || defaultDescription;
    const canonicalUrl = url || window.location.href;

    return (
        <Helmet>
            {/* Basic Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={metaDescription} />
            <link rel="canonical" href={canonicalUrl} />
            <html lang={locale === "pt" ? "pt-BR" : "en"} />

            {/* OpenGraph */}
            <meta property="og:site_name" content={siteName} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={image} />
            <meta property="og:type" content={type} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:locale" content={locale === "pt" ? "pt_BR" : "en_US"} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={image} />

            {/* JSON-LD Structured Data */}
            {jsonLd && (
                <script type="application/ld+json">
                    {JSON.stringify(jsonLd)}
                </script>
            )}
        </Helmet>
    );
}
