import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") || "en";
  const type = searchParams.get("type"); // "lecture" | "ruqya"

  try {
    const where: Prisma.AudioWhereInput = {};
    if (type) {
      where.type = type;
    }

    const audios = await prisma.audio.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    // Map to snake_case for frontend
    const mapped = audios.map((a) => ({
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
    }));

    return NextResponse.json({ audio: mapped });
  } catch (error) {
    console.error("Audio list error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
