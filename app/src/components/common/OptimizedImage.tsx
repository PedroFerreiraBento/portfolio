import { useState, useMemo } from "react";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    width?: number;
    quality?: number;
    reveal?: boolean;
}

/**
 * Component to leverage Vercel's Image Optimization API.
 * Automatically constructs optimized URLs and handles reveal animations.
 */
export function OptimizedImage({
    src,
    width,
    quality = 75,
    reveal = true,
    className = "",
    onLoad,
    ...props
}: OptimizedImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);

    const optimizedSrc = useMemo(() => {
        // Fallback to original src if we're in local dev or it's already a Vercel image
        if (
            import.meta.env.DEV ||
            src.startsWith("/") ||
            src.includes("_vercel/image")
        ) {
            return src;
        }

        // Construct Vercel Image Optimization URL
        const params = new URLSearchParams();
        params.append("url", src);
        if (width) params.append("w", width.toString());
        params.append("q", quality.toString());

        return `/_vercel/image?${params.toString()}`;
    }, [src, width, quality]);

    const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        setIsLoaded(true);
        if (onLoad) onLoad(e);
    };

    const revealClasses = reveal ? `hp-img-reveal ${isLoaded ? "is-loaded" : ""}` : "";

    return (
        <img
            src={optimizedSrc}
            onLoad={handleLoad}
            className={`${revealClasses} ${className}`}
            {...props}
        />
    );
}
