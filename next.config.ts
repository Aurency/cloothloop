import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Mengabaikan ESLint selama build
  },
};

export default nextConfig;