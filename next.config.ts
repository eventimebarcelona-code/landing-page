import type { NextConfig } from "next";

// No remote image domains are allowed, and no SVG is served through the image
// optimizer (logo is PNG, gallery photos are JPG), so `dangerouslyAllowSVG`
// is intentionally left off to avoid the SVG-via-optimizer XSS surface.
const nextConfig: NextConfig = {};

export default nextConfig;
