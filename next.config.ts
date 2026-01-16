import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Enable View Transitions API for smooth page navigation
    viewTransition: true,
  },
};

export default nextConfig;
