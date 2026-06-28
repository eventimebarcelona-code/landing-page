// Canonical site origin, used for metadataBase, OpenGraph images, sitemap and
// robots. On Vercel this resolves to the production domain at build time; falls
// back to localhost for local builds. Set NEXT_PUBLIC_SITE_URL to override.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
