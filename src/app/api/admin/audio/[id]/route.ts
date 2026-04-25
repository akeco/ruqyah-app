import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    // Get the audio to find the file path
    const audio = await prisma.audio.findUnique({
      where: { id },
    });

    if (!audio) {
      return NextResponse.json({ error: "Audio not found" }, { status: 404 });
    }

    // Extract file path from URL (https://<supabase-url>/storage/v1/object/public/audios/<path>)
    const urlParts = audio.url.split("/storage/v1/object/");
    let filePath = null;
    if (urlParts.length > 1) {
      filePath = "audios/" + urlParts[1].split("?")[0].replace("object/public/", "");
    }

    // Delete from Supabase Storage if we have the path
    if (filePath) {
      await supabase.storage.from("audios").remove([filePath]);
    }

    // Delete from database
    await prisma.audio.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Audio deletion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
