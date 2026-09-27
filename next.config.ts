import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Don't write AGENTS.md / CLAUDE.md into the repo during `next dev`.
  agentRules: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Keep links from the previous version of the site working.
  async redirects() {
    return [
      { source: '/experience', destination: '/#experience', permanent: true },
      { source: '/projects', destination: '/#work', permanent: true },
      { source: '/contact', destination: '/#contact', permanent: true },
      { source: '/uses', destination: '/about', permanent: true },
      { source: '/work/constraint-engine', destination: '/#work', permanent: true },
      { source: '/work/versioned-constraints', destination: '/#work', permanent: true },
      { source: '/work/timeline-debugger', destination: '/work/plant-data-mapping', permanent: true },
      { source: '/work/tag-timelines', destination: '/work/plant-data-mapping', permanent: true },
      { source: '/work/insights-charts', destination: '/work/million-point-charts', permanent: true },
    ];
  },
};

export default nextConfig;
