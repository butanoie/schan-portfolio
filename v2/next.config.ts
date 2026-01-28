import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow Next.js to optimize all local images
    // No external image domains needed for v2 (all images are local)

    // Image formats to support (Next.js will automatically convert to WebP/AVIF)
    formats: ['image/avif', 'image/webp'],

    // Device sizes for responsive images (matches common breakpoints)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],

    // Image sizes for different layouts
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Minimum cache TTL for optimized images (1 year)
    minimumCacheTTL: 31536000,

    // Enable image optimization even for static export (if applicable)
    unoptimized: false,
  },
};

export default nextConfig;
