import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true
  },
  async redirects() {
    return [
      // The device picker was removed: "Apply" goes straight to the form.
      // Kept so old links and bookmarks still land somewhere useful.
      { source: "/apply/devices", destination: "/apply", permanent: true },
    ];
  }
};

export default nextConfig;
