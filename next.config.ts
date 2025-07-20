import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "platter-media-store.s3.eu-north-1.amazonaws.com",
      "staging.api.platter.picatech.co",
    ],
  },
};

export default nextConfig;
