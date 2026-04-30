import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

const AUDIO_BUCKET = "rukja-audio";

function getJwtRole(token: string): string | null {
  const parts = token.split(".");
  if (parts.length < 2) return null;

  try {
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf-8"));
    return typeof payload.role === "string" ? payload.role : null;
  } catch {
    return null;
  }
}

function getSupabaseAdminClient() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;

  if (!serviceRoleKey) {
    return { error: "Missing SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SERVICE_ROLE)" } as const;
  }

  if (!supabaseUrl) {
    return { error: "Missing SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)" } as const;
  }

  const keyRole = getJwtRole(serviceRoleKey);
  if (keyRole && keyRole !== "service_role") {
    return {
      error: `SUPABASE_SERVICE_ROLE_KEY has role "${keyRole}", expected "service_role".`,
    } as const;
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  return { supabaseAdmin } as const;
}

function getStoragePathFromPublicUrl(url: string): string | null {
  const marker = `/storage/v1/object/public/${AUDIO_BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx < 0) return null;

  return url.slice(idx + marker.length).split("?")[0] || null;
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existingAudio = await prisma.audio.findUnique({ where: { id } });
  if (!existingAudio) {
    return NextResponse.json({ error: "Audio not found" }, { status: 404 });
  }

  try {
    const formData = await request.formData();
    const titleEn = (formData.get("titleEn") as string)?.trim();
    const titleBs = (formData.get("titleBs") as string)?.trim();
    const descriptionEn = ((formData.get("descriptionEn") as string) || "").trim();
    const descriptionBs = ((formData.get("descriptionBs") as string) || "").trim();
    const file = formData.get("file");

    if (!titleEn || !titleBs) {
      return NextResponse.json(
        { error: "Title (English and Bosnian) is required" },
        { status: 400 },
      );
    }

    let nextUrl = existingAudio.url;
    const isFileProvided = file instanceof File && file.size > 0;
    if (isFileProvided) {
      const allowedTypes = [
        "audio/mpeg",
        "audio/wav",
        "audio/ogg",
        "audio/mp4",
        "audio/aac",
        "audio/x-m4a",
      ];
      if (!allowedTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|ogg|m4a|aac)$/i)) {
        return NextResponse.json({ error: "Only audio files are allowed" }, { status: 400 });
      }

      const supabaseResult = getSupabaseAdminClient();
      if ("error" in supabaseResult) {
        return NextResponse.json(
          { error: "Server misconfiguration", details: supabaseResult.error },
          { status: 500 },
        );
      }

      const fileExtension = file.name.split(".").pop()?.toLowerCase() || "mp3";
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExtension}`;
      const filePath = `audios/${fileName}`;

      const { error: uploadError } = await supabaseResult.supabaseAdmin.storage
        .from(AUDIO_BUCKET)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        return NextResponse.json(
          { error: "Failed to upload file", details: uploadError.message },
          { status: 500 },
        );
      }

      nextUrl = supabaseResult.supabaseAdmin.storage.from(AUDIO_BUCKET).getPublicUrl(filePath)
        .data.publicUrl;

      const oldPath = getStoragePathFromPublicUrl(existingAudio.url);
      if (oldPath) {
        await supabaseResult.supabaseAdmin.storage.from(AUDIO_BUCKET).remove([oldPath]);
      }
    }

    const audio = await prisma.audio.update({
      where: { id },
      data: {
        titleEn,
        titleBs,
        descriptionEn: descriptionEn || null,
        descriptionBs: descriptionBs || null,
        url: nextUrl,
      },
    });

    return NextResponse.json({ audio });
  } catch (error) {
    console.error("Audio update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
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

    const supabaseResult = getSupabaseAdminClient();
    if ("error" in supabaseResult) {
      return NextResponse.json(
        { error: "Server misconfiguration", details: supabaseResult.error },
        { status: 500 },
      );
    }

    const filePath = getStoragePathFromPublicUrl(audio.url);

    // Delete from Supabase Storage if we have the path
    if (filePath) {
      await supabaseResult.supabaseAdmin.storage.from(AUDIO_BUCKET).remove([filePath]);
    }

    // Delete from database
    await prisma.audio.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Audio deletion error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
