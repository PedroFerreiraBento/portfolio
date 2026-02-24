import { useI18n } from "../i18n";
import { Seo } from "../components/common/Seo";
import { ScrollReveal } from "../components/common/ScrollReveal";
import { blogPosts } from "../mocks/blog";
import { categories } from "../mocks/categories";

import { BlogCard } from "../components/blog/BlogCard";

export function BlogPage() {
    const { t } = useI18n();

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": "Blog Caos Domado",
        "description": t("home.hero.subtitle"),
        "url": "https://caosdomado.com/blog",
        "blogPost": blogPosts.map((post) => ({
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "datePublished": post.date,
            "author": {
                "@type": "Organization",
                "name": "Caos Domado"
            },
            "url": `https://caosdomado.com/blog/${post.slug}`
        }))
    };

    return (
        <div className="hp-root">
            <Seo
                title="Blog"
                description={t("home.hero.subtitle")}
                jsonLd={jsonLd}
            />

            <section className="hp-section space-y-12">
                <ScrollReveal width="100%">
                    <header className="max-w-2xl border-b border-border-subtle pb-8">
                        <p className="hp-section-eyebrow">
                            {t("common.tagline")}
                        </p>
                        <h1 className="mt-2 text-4xl font-bold tracking-tight text-text-strong sm:text-5xl">
                            Blog
                        </h1>
                        <p className="mt-6 text-lg text-text-secondary leading-relaxed max-w-xl">
                            Insights sobre desenvolvimento de software, ciência de dados e como
                            domar o caos em operações complexas.
                        </p>
                    </header>
                </ScrollReveal>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {blogPosts.map((post, index) => {
                        const category = categories.find((c) =>
                            post.categoryIds.includes(c.id)
                        );
                        return (
                            <ScrollReveal key={post.id} delay={index * 0.1} className="flex flex-col h-full">
                                <BlogCard post={post} category={category} />
                            </ScrollReveal>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
