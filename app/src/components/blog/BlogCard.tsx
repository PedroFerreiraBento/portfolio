import { Link } from "react-router-dom";
import type { BlogPost } from "../../types/domain";
import type { Category } from "../../types/domain";
import { OptimizedImage } from "../common/OptimizedImage";

interface BlogCardProps {
    post: BlogPost;
    category?: Category;
}

export function BlogCard({ post, category }: BlogCardProps) {
    return (
        <Link
            to={`/blog/${post.slug}`}
            className="group flex flex-col h-full overflow-hidden rounded-2xl border border-border-subtle bg-bg-card shadow-sm transition-all hover:border-brand-soft hover:shadow-md blog-card"
        >
            <div className="aspect-video w-full overflow-hidden bg-bg-soft">
                {post.imageUrl ? (
                    <OptimizedImage
                        src={post.imageUrl}
                        alt={post.title}
                        width={600}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        decoding="async"
                        style={{ willChange: "transform, opacity" }}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-bg-soft text-text-muted">
                        No Image
                    </div>
                )}
            </div>
            <div className="flex flex-1 flex-col p-6">
                <div className="mb-4 flex items-center gap-3 text-xs text-text-muted">
                    <span>{post.date}</span>
                    {category && (
                        <span className="blog-post-tag">
                            {category.name}
                        </span>
                    )}
                    <span>{post.readTime} min read</span>
                </div>
                <h3 className="mb-3 text-xl font-semibold text-text-strong transition-colors group-hover:text-brand">
                    {post.title}
                </h3>
                <p className="line-clamp-3 text-sm text-text-secondary leading-relaxed">
                    {post.excerpt}
                </p>
                <div className="mt-6 pt-4 border-t border-hp-border text-sm font-semibold text-hp-accent flex items-center gap-2 group-hover:gap-3 transition-all">
                    Ler artigo <span>&rarr;</span>
                </div>
            </div>
        </Link>
    );
}
