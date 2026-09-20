import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep Next.js compiler output out of the project root. This path is already
  // covered by the node_modules ignore rule and can be discarded at any time.
  distDir: "node_modules/.cache/next",
  images: {
    // Serve files directly from /public instead of generating and caching
    // optimized copies under .next/cache/images.
    unoptimized: true,
  },
};

export default nextConfig;
