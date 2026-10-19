import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The small "N" badge Next.js shows while developing (never on the
  // live site). Moved to the top so it doesn't cover the bottom tabs.
  devIndicators: { position: "top-right" },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
