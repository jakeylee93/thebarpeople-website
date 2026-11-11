import type { NextConfig } from "next";

// AnyVendor's editor frames the draft page (/preview) and nothing else. The
// allowed origins are a deployment setting, empty by default: until one is set,
// only this site can frame the page. Same test as the bridge script: an exact
// https origin, no port, path or wildcard.
const EDITOR_ORIGIN = /^https:\/\/[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/;
const editorOrigins = [...new Set((process.env.ANYVENDOR_EDITOR_ORIGINS ?? "").split(",").map((o) => o.trim()).filter((o) => EDITOR_ORIGIN.test(o)))].slice(0, 4);

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // The draft page: its address carries a draft token.
        source: "/preview",
        headers: [
          { key: "Content-Security-Policy", value: ["frame-ancestors 'self'", ...editorOrigins].join(" ") },
          { key: "Cache-Control", value: "private, no-store, max-age=0" },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
    ];
  },
  images: {
    // Photos Jake uploads in AnyVendor are served from its public website-media
    // bucket (site content contract v1). Only that bucket path is allowed.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rsqgsnfyusqhtgcwbddc.supabase.co",
        pathname: "/storage/v1/object/public/website-media/**",
      },
    ],
  },
};

export default nextConfig;
