import type { NextConfig } from "next";

// The first dschippert.com stays live at v1.dschippert.com (interview decks, gated case studies).
const V1 = "https://v1.dschippert.com";

// Old case-study slugs → the v2 pages.
const projectSlugs: Record<string, string> = {
  "unified-ai-surfaces": "unified-ai-surfaces",
  "ai-driven-help": "ai-driven-help",
  "pricing-packaging": "pricing-and-packaging",
  "sales-onboarding": "sales-and-onboarding",
  "internal-tools": "internal-tools",
};

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async redirects() {
    return [
      ...Object.entries(projectSlugs).map(([from, to]) => ({
        source: `/projects/${from}`,
        destination: `/work/${to}`,
        permanent: true,
      })),
      { source: "/projects", destination: "/", permanent: true },
      { source: "/square", destination: "/", permanent: true },
      { source: "/resume", destination: "/derrick-schippert-resume.pdf", permanent: false },
      // Interview decks and their login live on the v1 site.
      { source: "/slides", destination: `${V1}/slides`, permanent: false },
      { source: "/slides/:path*", destination: `${V1}/slides/:path*`, permanent: false },
      { source: "/slides2", destination: `${V1}/slides2`, permanent: false },
      { source: "/slides3", destination: `${V1}/slides3`, permanent: false },
      { source: "/slides4", destination: `${V1}/slides4`, permanent: false },
      { source: "/login", destination: `${V1}/login`, permanent: false },
      { source: "/hero-lab", destination: `${V1}/hero-lab`, permanent: false },
    ];
  },
};

export default nextConfig;
