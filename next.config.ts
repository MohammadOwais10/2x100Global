import type { NextConfig } from "next";

const API_BASE_URL =
  process.env.API_BASE_URL?.replace(/\/api\/v1$/, "") ??
  process.env.BACKEND_API_URL?.replace(/\/api\/v1$/, "") ??
  "http://localhost:4000";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  reactCompiler: true,
  generateEtags: false,
  // Prevent browsers and upstream CDNs from caching HTML/API responses.
  // _next/static chunks remain immutable and long-cached because their names are hashed —
  // production only: in dev Turbopack chunk names are stable, and an immutable
  // header there makes the browser keep serving stale client bundles.
  async headers() {
    const headers = [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, no-cache, no-store, must-revalidate, max-age=0, s-maxage=0",
          },
        ],
      },
    ];
    if (!isDev) {
      headers.push({
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      });
    }
    return headers;
  },
  // Proxy uploaded images through the Next server so the browser never needs
  // to know the backend's origin. /uploads/posts/xxx.jpg -> backend/uploads/posts/xxx.jpg
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: `${API_BASE_URL}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
