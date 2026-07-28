import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

function mapLecture(l: {
  id: string;
  slug: string | null;
  titleEn: string;
  titleBs: string;
  contentEn: string | null;
  contentBs: string | null;
  excerptEn: string | null;
  excerptBs: string | null;
  authorEn: string | null;
  authorBs: string | null;
  categoryEn: string | null;
  categoryBs: string | null;
  publishedAt: Date | null;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: l.id,
    slug: l.slug,
    title_en: l.titleEn,
    title_bs: l.titleBs,
    content_en: l.contentEn,
    content_bs: l.contentBs,
    excerpt_en: l.excerptEn,
    excerpt_bs: l.excerptBs,
    author_en: l.authorEn,
    author_bs: l.authorBs,
    category_en: l.categoryEn,
    category_bs: l.categoryBs,
    published_at: l.publishedAt?.toISOString(),
    image_url: l.imageUrl,
    created_at: l.createdAt.toISOString(),
    updated_at: l.updatedAt.toISOString(),
  };
}

export async function getLectures(options: { category?: string | null } = {}) {
  const where: Prisma.LectureWhereInput = {};
  if (options.category) {
    where.categoryEn = options.category;
  }

  const lectures = await prisma.lecture.findMany({
    where,
    orderBy: { publishedAt: "desc" },
  });

  return lectures.map(mapLecture);
}

export async function getLectureBySlug(slug: string) {
  const lecture = await prisma.lecture.findUnique({ where: { slug } });
  return lecture ? mapLecture(lecture) : null;
}

/** Lightweight slug list for generateStaticParams — avoids selecting full content at build time. */
export async function getAllLectureSlugs() {
  const lectures = await prisma.lecture.findMany({
    where: { slug: { not: null } },
    select: { slug: true },
  });
  return lectures.map((l) => l.slug as string);
}
