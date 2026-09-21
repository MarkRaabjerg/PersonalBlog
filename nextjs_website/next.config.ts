import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["markraabjerg.blog"],

  

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pb.markraabjerg.blog",
        pathname: "/api/files/**",
      },
    ],
  },
};

export default nextConfig;