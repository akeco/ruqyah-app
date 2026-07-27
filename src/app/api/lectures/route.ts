import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") || "en";
  const category = searchParams.get("category");

  try {
    const where: Prisma.LectureWhereInput = {};
    if (category) {
      where.categoryEn = category;
    }

    const lectures = await prisma.lecture.findMany({
      where,
      orderBy: { publishedAt: "desc" },
    });

    // Map to snake_case for frontend
    const mapped = lectures.map((l) => ({
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
    }));

    return NextResponse.json({ lectures: mapped });
  } catch (error) {
    console.error("Lecture list error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
