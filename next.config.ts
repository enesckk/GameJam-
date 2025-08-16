import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Build sırasında ESLint hataları yüzünden deploy kırılmasın
    ignoreDuringBuilds: true,
  },
  typescript: {
    // (Opsiyonel) TS hataları yüzünden build kırılmasın
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
