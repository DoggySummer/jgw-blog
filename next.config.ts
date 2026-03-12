import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx"],
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "frontend-blog.sfo3.digitaloceanspaces.com",
        pathname: "/**",
      },
    ],
  },
};


export default nextConfig;