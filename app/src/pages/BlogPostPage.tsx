import { useParams, Link } from "react-router-dom";
import { Seo } from "../components/common/Seo";
import { ScrollReveal } from "../components/common/ScrollReveal";
import { blogPosts } from "../mocks/blog";
import { categories } from "../mocks/categories";
import { NotFoundPage } from "./NotFoundPage";

export function BlogPostPage() {
    const { slug } = useParams();
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
        <article className="mx-auto max-w-3xl space-y-8">
            <Seo
                title={post.title}
                description={post.excerpt}
                image={post.imageUrl}
                type="article"
                jsonLd={jsonLd}
            />

            <ScrollReveal>
                <header className="space-y-4 text-center">
                    <div className="flex items-center justify-center gap-3 text-sm text-text-muted">
                        <span>{post.date}</span>
                        {category && (
                            <span className="rounded-full bg-bg-soft px-3 py-1 font-medium text-text-soft">
                                {category.name}
                            </span>
                        )}
                        <span>{post.readTime} min read</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-text-strong sm:text-4xl md:text-5xl">
                        {post.title}
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-text-soft leading-relaxed">
                        {post.excerpt}
                    </p>
                </header>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
                {post.imageUrl && (
                    <div className="overflow-hidden rounded-2xl border border-border-subtle bg-bg-soft shadow-sm">
                        <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="h-auto w-full object-cover"
                            loading="eager"
                        />
                    </div>
                )}
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
                <div className="prose prose-slate max-w-none dark:prose-invert prose-headings:font-semibold prose-a:text-brand prose-a:no-underline hover:prose-a:underline">
                    {/* In a real app, use a Markdown renderer like react-markdown */}
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />

                    {/* Fallback content for the mock if content is just a placeholder */}
                    {post.content === "Conteúdo do post..." && (
                        <div className="space-y-4 text-text-soft">
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </p>
                            <h2>Subtítulo importante</h2>
                            <p>
                                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </p>
                            <ul>
                                <li>Ponto importante número um</li>
                                <li>Outra consideração relevante</li>
                                <li>Conclusão prática para o negócio</li>
                            </ul>
                            <p>
                                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                            </p>
                        </div>
                    )}
                </div>
            </ScrollReveal>

            <ScrollReveal>
                <div className="mt-12 border-t border-border-subtle pt-8 text-center">
                    <Link
                        to="/blog"
                        className="inline-flex items-center text-sm font-medium text-brand hover:text-brand-hover hover:underline"
                    >
                        &larr; Voltar para o blog
                    </Link>
                </div>
            </ScrollReveal>
        </article>
    );
}
