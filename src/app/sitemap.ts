import type { MetadataRoute } from "next";
import { VALID_LANGUAGES } from "@/lib/locale";
import { getLectures } from "@/lib/data/lectures";
import { getAudioItems } from "@/lib/data/audio";

const STATIC_PATHS = ["", "/lectures", "/audio"];

// Refresh at most once an hour so newly published content appears in the sitemap
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mehlem-clinic.com";

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

  // Best-effort: include individual lectures and audio items
  try {
    const lectures = await getLectures();
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
  } catch {
    // DB unavailable at build time — static routes above still cover the site
  }

  try {
    const audioItems = await getAudioItems();
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
  } catch {
    // DB unavailable at build time — static routes above still cover the site
  }

  return entries;
}
