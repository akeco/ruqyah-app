import { NextResponse } from "next/server";
import { getLectures } from "@/lib/data/lectures";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  try {
    const lectures = await getLectures({ category });
    return NextResponse.json({ lectures });
  } catch (error) {
    console.error("Lecture list error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
