import type { MetadataRoute } from "next";
import { siteUrl } from "./site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${siteUrl}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    {
      url: `${siteUrl}/eventos/ice-dylan`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
