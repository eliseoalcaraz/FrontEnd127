import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/:path*", // Catch all requests starting with /api
        // IMPORTANT: Use process.env.NEXT_PUBLIC_BACKEND_URL here
        // This will resolve to http://backend:5000 inside Docker
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/:path*`,
      },
    ];
  },
  // Other Next.js configurations...
  // For example, if you want to suppress the <img> warnings during build:
  images: {
    unoptimized: true, // This will turn off Next.js image optimization warnings for <img>
  },
};

export default nextConfig;
