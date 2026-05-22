import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
      },
    ],
  },
  experimental: {
    proxyClientMaxBodySize: '50mb',
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
};

export default nextConfig;
