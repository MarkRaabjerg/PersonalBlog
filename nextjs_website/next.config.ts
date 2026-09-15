import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['markraabjerg.blog', 'markraabjerg.blog/login'],
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8090",
        pathname: "/api/files/**",
      },
    ],
  },
};

export default nextConfig;
