import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

const LECTURE_BUCKET = "rukja-lectures";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;

  if (!serviceRoleKey || !supabaseUrl) {
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    const { id } = await params;
    const lecture = await prisma.lecture.findUnique({ where: { id } });

    if (!lecture) {
      return NextResponse.json({ error: "Lecture not found" }, { status: 404 });
    }

    const formData = await request.formData();
    const titleEn = ((formData.get("titleEn") as string) || "").trim();
    const titleBs = ((formData.get("titleBs") as string) || "").trim();
    const descriptionEn = ((formData.get("descriptionEn") as string) || "").trim();
    const descriptionBs = ((formData.get("descriptionBs") as string) || "").trim();
    const imageFile = formData.get("image") as File | null;

    if (!titleEn || !titleBs) {
      return NextResponse.json(
        { error: "English title and Bosnian title are required" },
        { status: 400 },
      );
    }

    let imageUrl = lecture.imageUrl;

    if (imageFile && imageFile.size > 0 && imageFile.type.startsWith("image/")) {
      const extension = imageFile.name.split(".").pop()?.toLowerCase() || "jpg";
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;
      const filePath = `lectures/${fileName}`;

      const { error: uploadError } = await supabaseAdmin.storage
        .from(LECTURE_BUCKET)
        .upload(filePath, imageFile, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        console.error("Lecture image upload error:", uploadError);
        return NextResponse.json(
          { error: "Failed to upload new image", details: uploadError.message },
          { status: 500 },
        );
      }

      imageUrl = supabaseAdmin.storage.from(LECTURE_BUCKET).getPublicUrl(filePath).data.publicUrl;

      const oldMarker = `/storage/v1/object/public/${LECTURE_BUCKET}/`;
      const oldMarkerIndex = lecture.imageUrl.indexOf(oldMarker);
      if (oldMarkerIndex >= 0) {
        const oldFilePath = lecture.imageUrl.slice(oldMarkerIndex + oldMarker.length).split("?")[0];
        if (oldFilePath) {
          await supabaseAdmin.storage.from(LECTURE_BUCKET).remove([oldFilePath]);
        }
      }
    }

    const updatedLecture = await prisma.lecture.update({
      where: { id },
      data: {
        titleEn,
        titleBs,
        descriptionEn: descriptionEn || null,
        descriptionBs: descriptionBs || null,
        imageUrl,
      },
    });

    return NextResponse.json({ lecture: updatedLecture }, { status: 200 });
  } catch (error) {
    console.error("Lecture update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
