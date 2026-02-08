import { Link } from "react-router-dom";
import { useI18n } from "../i18n";
import { Seo } from "../components/common/Seo";
import { ScrollReveal } from "../components/common/ScrollReveal";
import { blogPosts } from "../mocks/blog";
import { categories } from "../mocks/categories";

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
        <section className="space-y-12">
            <Seo
                title="Blog"
                description={t("home.hero.subtitle")}
                jsonLd={jsonLd}
            />

            <ScrollReveal>
                <header className="max-w-2xl border-b border-border-subtle pb-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                        {t("common.tagline")}
                    </p>
                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-text-strong sm:text-4xl">
                        Blog
                    </h1>
                    <p className="mt-4 text-base text-text-soft leading-relaxed max-w-xl">
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
                            <Link
                                to={`/blog/${post.slug}`}
                                className="group flex flex-col h-full overflow-hidden rounded-xl border border-border-subtle bg-bg-card shadow-sm transition-all hover:border-brand-soft hover:shadow-md"
                            >
                                <div className="aspect-video w-full overflow-hidden bg-bg-soft">
                                    {post.imageUrl ? (
                                        <img
                                            src={post.imageUrl}
                                            alt={post.title}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-bg-soft text-text-muted">
                                            No Image
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-1 flex-col p-5">
                                    <div className="mb-3 flex items-center gap-3 text-xs text-text-muted">
                                        <span>{post.date}</span>
                                        {category && (
                                            <span className="rounded-full bg-bg-soft px-2 py-0.5 font-medium text-text-soft">
                                                {category.name}
                                            </span>
                                        )}
                                        <span>{post.readTime} min read</span>
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold text-text-strong transition-colors group-hover:text-brand">
                                        {post.title}
                                    </h3>
                                    <p className="line-clamp-3 text-sm text-text-soft">
                                        {post.excerpt}
                                    </p>
                                    <div className="mt-auto pt-4 text-sm font-medium text-brand">
                                        Ler artigo &rarr;
                                    </div>
                                </div>
                            </Link>
                        </ScrollReveal>
                    );
                })}
            </div>
        </section>
    );
}
