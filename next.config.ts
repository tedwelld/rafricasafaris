import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // The Destinations / Activities / Tours index pages were merged into /explore.
    // Redirect the old routes (and any bookmarks) to the matching tab.
    return [
      { source: "/destinations", destination: "/explore?view=destinations", permanent: true },
      { source: "/activities", destination: "/explore?view=activities", permanent: true },
      { source: "/tours", destination: "/explore?view=tours", permanent: true },
    ];
  },
};

export default nextConfig;
