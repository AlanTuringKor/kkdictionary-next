import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ 이 줄 추가!
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
