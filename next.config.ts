import type { NextConfig } from "next";

// Files in /public are served with `max-age=0` by default, so browsers and
// CDNs re-check them on every visit. Uploads and brand assets rarely change,
// so let them be cached for a day and served stale while revalidating.
const STATIC_ASSET_CACHE = "public, max-age=86400, stale-while-revalidate=604800";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com" }],
    // AVIF is ~20% smaller than WebP; browsers without AVIF get WebP.
    formats: ["image/avif", "image/webp"],
    // Optimized images are keyed by URL and uploads are never edited in
    // place, so cache them for 30 days instead of the 4-hour default.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async headers() {
    return [
      { source: "/uploads/:path*", headers: [{ key: "Cache-Control", value: STATIC_ASSET_CACHE }] },
      { source: "/:file(STEM-logo.*\\.png)", headers: [{ key: "Cache-Control", value: STATIC_ASSET_CACHE }] },
    ];
  },
};

export default nextConfig;
