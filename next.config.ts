import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/convertyoursite",
  images: {
    unoptimized: true,
  },
};

// Expose basePath as env var for raw HTML elements (video, img, etc.)
// that don't auto-prefix with Next.js basePath.
// configure-pages injects basePath into this config during CI build.
nextConfig.env = {
  NEXT_PUBLIC_BASE_PATH: nextConfig.basePath || "",
};

export default nextConfig;
