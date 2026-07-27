import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const lectures = await prisma.lecture.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ lectures });
  } catch (error) {
    console.error("Lecture list error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { titleEn, titleBs, contentEn, contentBs, excerptEn, excerptBs, authorEn, authorBs, categoryEn, categoryBs, slug, publishedAt, imageUrl } = body;

    const lecture = await prisma.lecture.create({
      data: {
        slug: slug || `lecture-${Date.now()}`,
        titleEn: titleEn || "",
        titleBs: titleBs || "",
        contentEn: contentEn || null,
        contentBs: contentBs || null,
        excerptEn: excerptEn || null,
        excerptBs: excerptBs || null,
        authorEn: authorEn || null,
        authorBs: authorBs || null,
        categoryEn: categoryEn || null,
        categoryBs: categoryBs || null,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
        imageUrl: imageUrl || "",
      },
    });

    return NextResponse.json({ lecture });
  } catch (error) {
    console.error("Lecture create error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Extract id from URL
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { titleEn, titleBs, contentEn, contentBs, excerptEn, excerptBs, authorEn, authorBs, categoryEn, categoryBs, slug, publishedAt, imageUrl } = body;

    const lecture = await prisma.lecture.update({
      where: { id },
      data: {
        slug: slug || `lecture-${Date.now()}`,
        titleEn: titleEn || "",
        titleBs: titleBs || "",
        contentEn: contentEn || null,
        contentBs: contentBs || null,
        excerptEn: excerptEn || null,
        excerptBs: excerptBs || null,
        authorEn: authorEn || null,
        authorBs: authorBs || null,
        categoryEn: categoryEn || null,
        categoryBs: categoryBs || null,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
        imageUrl: imageUrl || "",
      },
    });

    return NextResponse.json({ lecture });
  } catch (error) {
    console.error("Lecture update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Extract id from URL
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    await prisma.lecture.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lecture delete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
