import type { MetadataRoute } from "next";
import { VALID_LANGUAGES } from "@/lib/locale";

const STATIC_PATHS = ["", "/lectures", "/audio"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ruqyaliјecenje.com";
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const entries: MetadataRoute.Sitemap = [];

  for (const lang of VALID_LANGUAGES) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: `${siteUrl}/${lang}${path}`,
        changeFrequency: path === "" ? "weekly" : "daily",
        priority: path === "" ? 1 : 0.8,
      });
    }
  }

  // Best-effort: include individual lectures and audio items if the API is reachable
  try {
    const res = await fetch(`${apiBase}/api/lectures`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      const lectures = (data.lectures || []) as { slug?: string }[];
      for (const lang of VALID_LANGUAGES) {
        for (const lecture of lectures) {
          if (lecture.slug) {
            entries.push({
              url: `${siteUrl}/${lang}/lectures/${lecture.slug}`,
              changeFrequency: "monthly",
              priority: 0.6,
            });
          }
        }
      }
    }
  } catch {
    // API unavailable at build time — static routes above still cover the site
  }

  try {
    const res = await fetch(`${apiBase}/api/audio`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      const audioItems = (data.audio || []) as { slug?: string }[];
      for (const lang of VALID_LANGUAGES) {
        for (const item of audioItems) {
          if (item.slug) {
            entries.push({
              url: `${siteUrl}/${lang}/audio/${item.slug}`,
              changeFrequency: "monthly",
              priority: 0.6,
            });
          }
        }
      }
    }
  } catch {
    // API unavailable at build time — static routes above still cover the site
  }

  return entries;
}
