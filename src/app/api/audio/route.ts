import { NextResponse } from "next/server";
import { getAudioItems } from "@/lib/data/audio";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); // "lecture" | "ruqya"

  try {
    const audio = await getAudioItems({ type });
    return NextResponse.json({ audio });
  } catch (error) {
    console.error("Audio list error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
