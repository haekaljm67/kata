import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The small "N" badge Next.js shows while developing (never on the
  // live site) is turned off: every corner of the page is in use (logo,
  // Settings gear, bottom tabs). Errors still appear in a full overlay
  // and in the terminal.
  devIndicators: false,
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
