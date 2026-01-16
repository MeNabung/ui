import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Enable View Transitions API for smooth page navigation
    viewTransition: true,
  },
  turbopack: {
    // Set root to prevent workspace detection issues
    root: __dirname,
  },
};

export default nextConfig;
