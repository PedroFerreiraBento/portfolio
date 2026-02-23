import { useParams, Link } from "react-router-dom";
import { useI18n } from "../i18n";
import { Seo } from "../components/common/Seo";
import { ScrollReveal } from "../components/common/ScrollReveal";
import { blogPosts } from "../mocks/blog";
import { categories } from "../mocks/categories";
import { NotFoundPage } from "./NotFoundPage";
import { ArrowLeft } from "lucide-react";

export function BlogPostPage() {
    const { slug } = useParams();
    const { t } = useI18n();
    const post = blogPosts.find((p) => p.slug === slug);

    if (!post) {
        return <NotFoundPage />;
    }

    const category = categories.find((c) => post.categoryIds.includes(c.id));

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt,
        "image": post.imageUrl,
        "datePublished": post.date,
        "author": {
            "@type": "Organization",
            "name": "Caos Domado"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Caos Domado",
            "logo": {
                "@type": "ImageObject",
                "url": "https://caosdomado.com/logo.png"
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://caosdomado.com/blog/${post.slug}`
        }
    };

    return (
        <div className="hp-root">
            <Seo
                title={post.title}
                description={post.excerpt}
                image={post.imageUrl}
                type="article"
                jsonLd={jsonLd}
            />

            <article className="hp-section mx-auto max-w-3xl space-y-12 blog-post-detail">
                <ScrollReveal width="100%">
                    <header className="space-y-6 text-center blog-post-header">
                        <div className="page-header__nav mb-8 text-left">
                            <Link to="/blog" className="flex items-center gap-2 text-hp-accent hover:opacity-80 transition-opacity font-medium">
                                <ArrowLeft size={18} />
                                {t("pages.projectDetail.backButton") || "Voltar"}
                            </Link>
                        </div>
                        <div className="flex items-center justify-center gap-4 text-sm text-text-muted">
                            <time dateTime={post.date}>{post.date}</time>
                            {category && (
                                <span className="blog-post-tag">
                                    {category.name}
                                </span>
                            )}
                            <span>{post.readTime} min read</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-text-strong !mt-4">
                            {post.title}
                        </h1>
                        <p className="mx-auto max-w-2xl text-xl text-text-secondary leading-relaxed !mt-6">
                            {post.excerpt}
                        </p>
                    </header>
                </ScrollReveal>

                <ScrollReveal width="100%" delay={0.1}>
                    {post.imageUrl && (
                        <div className="overflow-hidden rounded-2xl border border-border-subtle bg-bg-soft shadow-xl">
                            <img
                                src={post.imageUrl}
                                alt={post.title}
                                className="h-auto w-full object-cover"
                                loading="eager"
                                fetchPriority="high"
                            />
                        </div>
                    )}
                </ScrollReveal>

                <ScrollReveal width="100%" delay={0.2}>
                    <div className="blog-post-content space-y-6">
                        {/* In a real app, use a Markdown renderer like react-markdown */}
                        <div
                            className="prose prose-lg dark:prose-invert prose-headings:text-text-strong prose-p:text-text-secondary prose-a:text-hp-accent prose-strong:text-text-strong max-w-none"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {/* Fallback content for the mock if content is just a placeholder */}
                        {post.content === "Conteúdo do post..." && (
                            <div className="space-y-8 text-text-secondary">
                                <p className="text-lg leading-relaxed">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </p>
                                <h2 className="text-2xl font-bold text-text-strong">Estratégias para Domar o Caos</h2>
                                <p className="text-lg leading-relaxed">
                                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                </p>
                                <ul className="space-y-3 list-disc pl-5">
                                    <li>Ponto importante número um: Automação inteligente</li>
                                    <li>Outra consideração relevante: Design System escalável</li>
                                    <li>Conclusão prática para o negócio: Foco em performance</li>
                                </ul>
                                <p className="text-lg leading-relaxed border-l-4 border-hp-accent pl-6 italic bg-hp-bg-elevated py-4 rounded-r-lg">
                                    "O caos não é um abismo, é uma oportunidade de engenharia quando você tem as ferramentas certas."
                                </p>
                                <p className="text-lg leading-relaxed">
                                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                                </p>
                            </div>
                        )}
                    </div>
                </ScrollReveal>

                <ScrollReveal width="100%">
                    <div className="mt-16 border-t border-hp-border pt-12 text-center">
                        <Link
                            to="/blog"
                            className="hp-btn-outline"
                        >
                            &larr; Voltar para o blog
                        </Link>
                    </div>
                </ScrollReveal>
            </article>
        </div>
    );
}
