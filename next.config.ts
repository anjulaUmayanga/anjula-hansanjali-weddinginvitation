import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Allow graceful client fallback when placeholder photos are missing.
    unoptimized: true,
  },
};

export default nextConfig;
