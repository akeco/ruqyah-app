import { NextResponse } from "next/server";
import { getAudioBySlug } from "@/lib/data/audio";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const audio = await getAudioBySlug(slug);

    if (!audio) {
      return NextResponse.json({ error: "Audio not found" }, { status: 404 });
    }

    return NextResponse.json({ audio });
  } catch (error) {
    console.error("Audio detail error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
