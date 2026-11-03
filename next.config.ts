import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
