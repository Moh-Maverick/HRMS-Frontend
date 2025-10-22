import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Exclude AIinterviewBot folder from build
  webpack: (config, { isServer }) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/AIinterviewBot/**', '**/node_modules/**'],
    };
    return config;
  },
};

export default nextConfig;
