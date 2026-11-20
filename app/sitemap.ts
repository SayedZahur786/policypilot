import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.APP_URL ?? "http://localhost:3000";
  return [
    "",
    "/privacy",
    "/terms",
    "/privacy-policy-for-nextjs",
    "/s/orbit-notes",
  ].map((p) => ({ url: base + p, lastModified: "2026-11-21" }));
}
