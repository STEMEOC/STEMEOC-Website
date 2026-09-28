import type { NextConfig } from "next";

// Files in /public are served with `max-age=0` by default, so browsers and
// CDNs re-check them on every visit. Uploads and brand assets rarely change,
// so let them be cached for a day and served stale while revalidating.
const STATIC_ASSET_CACHE = "public, max-age=86400, stale-while-revalidate=604800";

const nextConfig: NextConfig = {
  experimental: {
    // The 1MB default rejects most photos uploaded through admin forms.
    serverActions: { bodySizeLimit: "10mb" },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      // Admin uploads when hosted on Vercel (see lib/uploads.ts).
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
    // AVIF is ~20% smaller than WebP; browsers without AVIF get WebP.
    formats: ["image/avif", "image/webp"],
    // Only 90 is allowed, so every <Image> is served at 90 (Next rounds other
    // values to the closest allowed one). At the default 75 photos looked soft.
    qualities: [90],
    // Optimized images are keyed by URL and uploads are never edited in
    // place, so cache them for 30 days instead of the 4-hour default.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async headers() {
    return [
      { source: "/uploads/:path*", headers: [{ key: "Cache-Control", value: STATIC_ASSET_CACHE }] },
      // Files uploaded by the public: always download, never render on this site,
      // so a disguised file can't run scripts with an admin's session.
      {
        source: "/uploads/forms/:formId/:file",
        headers: [
          { key: "Content-Disposition", value: "attachment" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Content-Security-Policy", value: "default-src 'none'; sandbox" },
        ],
      },
      { source: "/:file(STEM-logo.*\\.png)", headers: [{ key: "Cache-Control", value: STATIC_ASSET_CACHE }] },
    ];
  },
};

export default nextConfig;
