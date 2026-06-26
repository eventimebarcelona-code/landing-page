import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The logo is an SVG served from /public; allow next/image to handle it.
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
