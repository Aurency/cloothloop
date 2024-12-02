import { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true, // Pastikan ini diaktifkan untuk mendukung struktur app directory
  },
  typescript: {
    // Mengabaikan error TypeScript saat build (opsional)
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
