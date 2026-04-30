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
