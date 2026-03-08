import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig: NextConfig = {
  images: {
    // Allow Next.js to optimize all local images
    // No external image domains needed for v2 (all images are local)

    // Image formats to support (Next.js will automatically convert to WebP/AVIF)
    formats: ["image/avif", "image/webp"],

    // Device sizes for responsive images (aligned with Material-UI breakpoints)
    // xs: 640, sm: 768, md: 900, lg: 1024, xl: 1200, 2xl: 1536, 3xl: 1920, 4xl: 2560
    deviceSizes: [640, 768, 900, 1024, 1200, 1536, 1920, 2560],

    // Image sizes for different layouts
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Minimum cache TTL for optimized images (1 year)
    minimumCacheTTL: 31536000,

    // Enable image optimization even for static export (if applicable)
    unoptimized: false,
  },
};

/**
 * Wraps the Next.js config with bundle analyzer support.
 * Run `npm run analyze` (sets ANALYZE=true) to generate interactive
 * treemap visualizations of client and server bundle composition.
 */
const analyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default analyzer(nextConfig);
