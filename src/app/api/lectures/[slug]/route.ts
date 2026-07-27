import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") || "en";

  try {
    const lecture = await prisma.lecture.findUnique({
      where: { slug },
    });

    if (!lecture) {
      return NextResponse.json({ error: "Lecture not found" }, { status: 404 });
    }

    // Map to snake_case for frontend
    const mapped = {
      id: lecture.id,
      slug: lecture.slug,
      title_en: lecture.titleEn,
      title_bs: lecture.titleBs,
      content_en: lecture.contentEn,
      content_bs: lecture.contentBs,
      excerpt_en: lecture.excerptEn,
      excerpt_bs: lecture.excerptBs,
      author_en: lecture.authorEn,
      author_bs: lecture.authorBs,
      category_en: lecture.categoryEn,
      category_bs: lecture.categoryBs,
      published_at: lecture.publishedAt?.toISOString(),
      image_url: lecture.imageUrl,
      created_at: lecture.createdAt.toISOString(),
      updated_at: lecture.updatedAt.toISOString(),
    };

    return NextResponse.json({ lecture: mapped });
  } catch (error) {
    console.error("Lecture detail error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
