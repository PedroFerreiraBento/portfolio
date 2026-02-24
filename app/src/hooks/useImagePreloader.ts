import { useEffect, useState } from "react";

/**
 * Hook to preload a list of images.
 * Useful for ensuring images are in the browser cache before they are revealed by animations.
 */
export function useImagePreloader(imageUrls: string[]) {
    const [imagesPreloaded, setImagesPreloaded] = useState(false);

    useEffect(() => {
        if (!imageUrls || imageUrls.length === 0) {
            setImagesPreloaded(true);
            return;
        }

        let isMounted = true;
        let loadedCount = 0;
        const totalCount = imageUrls.length;

        const handleImageLoad = () => {
            loadedCount++;
            if (loadedCount === totalCount && isMounted) {
                setImagesPreloaded(true);
            }
        };

        const handleImageError = () => {
            // Even if an image fails, we increment count to not block the overall state
            handleImageLoad();
        };

        imageUrls.forEach((url) => {
            if (!url) {
                handleImageLoad();
                return;
            }
            const img = new Image();
            img.src = url;
            img.onload = handleImageLoad;
            img.onerror = handleImageError;
        });

        return () => {
            isMounted = false;
        };
    }, [imageUrls]);

    return imagesPreloaded;
}
