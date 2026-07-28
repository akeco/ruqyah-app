import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

function mapAudio(a: {
  id: string;
  slug: string | null;
  titleEn: string | null;
  titleBs: string | null;
  descriptionEn: string | null;
  descriptionBs: string | null;
  type: string | null;
  duration: number | null;
  url: string | null;
  youtubeUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: a.id,
    slug: a.slug,
    title_en: a.titleEn,
    title_bs: a.titleBs,
    description_en: a.descriptionEn,
    description_bs: a.descriptionBs,
    type: a.type,
    duration: a.duration,
    url: a.url,
    youtube_url: a.youtubeUrl,
    created_at: a.createdAt.toISOString(),
    updated_at: a.updatedAt.toISOString(),
  };
}

export async function getAudioItems(options: { type?: string | null } = {}) {
  const where: Prisma.AudioWhereInput = {};
  if (options.type) {
    where.type = options.type;
  }

  const audios = await prisma.audio.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return audios.map(mapAudio);
}

export async function getAudioBySlug(slug: string) {
  const audio = await prisma.audio.findUnique({ where: { slug } });
  return audio ? mapAudio(audio) : null;
}
