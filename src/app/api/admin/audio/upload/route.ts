import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

const AUDIO_BUCKET = "rukja-audio";
const MAX_UPLOAD_ATTEMPTS = 3;
const YOUTUBE_URL_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/)|youtu\.be\/)[\w-]+/i;

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

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;
  if (!serviceRoleKey) {
    return NextResponse.json(
      {
        error: "Server misconfiguration",
        details: "Missing SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SERVICE_ROLE)",
      },
      { status: 500 },
    );
  }
  if (!supabaseUrl) {
    return NextResponse.json(
      {
        error: "Server misconfiguration",
        details: "Missing SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)",
      },
      { status: 500 },
    );
  }

  const keyRole = getJwtRole(serviceRoleKey);
  if (keyRole && keyRole !== "service_role") {
    return NextResponse.json(
      {
        error: "Server misconfiguration",
        details: `SUPABASE_SERVICE_ROLE_KEY has role "${keyRole}", expected "service_role".`,
      },
      { status: 500 },
    );
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const titleEn = formData.get("titleEn") as string;
    const titleBs = formData.get("titleBs") as string;
    const descriptionEn = (formData.get("descriptionEn") as string) || null;
    const descriptionBs = (formData.get("descriptionBs") as string) || null;
    const youtubeUrl = ((formData.get("youtubeUrl") as string) || "").trim() || null;
    const typeInput = (formData.get("type") as string) || "ruqya";
    const type = typeInput === "lecture" ? "lecture" : "ruqya";

    const isFileProvided = file instanceof File && file.size > 0;

    if (!titleEn || !titleBs) {
      return NextResponse.json(
        { error: "Title (both English and Bosnian) is required" },
        { status: 400 },
      );
    }

    if (!isFileProvided && !youtubeUrl) {
      return NextResponse.json(
        { error: "Provide either an audio file or a YouTube video link" },
        { status: 400 },
      );
    }

    if (youtubeUrl && !YOUTUBE_URL_REGEX.test(youtubeUrl)) {
      return NextResponse.json({ error: "That doesn't look like a valid YouTube link" }, { status: 400 });
    }

    let url: string | null = null;

    if (isFileProvided) {
      const file2 = file as File;
      // Validate file type
      const allowedTypes = [
        "audio/mpeg",
        "audio/wav",
        "audio/ogg",
        "audio/mp4",
        "audio/aac",
        "audio/x-m4a",
      ];
      if (!allowedTypes.includes(file2.type) && !file2.name.match(/\.(mp3|wav|ogg|m4a|aac)$/i)) {
        return NextResponse.json({ error: "Only audio files are allowed" }, { status: 400 });
      }

      // Generate unique file path
      const fileExtension = file2.name.split(".").pop()?.toLowerCase() || "mp3";
      const timestamp = Date.now();
      const fileName = `${timestamp}-${Math.random().toString(36).slice(2, 8)}.${fileExtension}`;
      const filePath = `audios/${fileName}`;

      // Upload to Supabase Storage with retries for transient network failures.
      let uploadError: { message: string } | null = null;
      for (let attempt = 1; attempt <= MAX_UPLOAD_ATTEMPTS; attempt += 1) {
        const result = await supabaseAdmin.storage.from(AUDIO_BUCKET).upload(filePath, file2, {
          cacheControl: "3600",
          upsert: false,
        });

        uploadError = result.error;

        if (!uploadError) break;

        const isNetworkReset =
          uploadError.message?.toLowerCase().includes("fetch failed") ||
          uploadError.message?.toLowerCase().includes("econnreset");
        if (!isNetworkReset || attempt === MAX_UPLOAD_ATTEMPTS) break;
      }

      if (uploadError) {
        console.error("Supabase upload error:", uploadError);
        const isRlsError = uploadError.message?.toLowerCase().includes("row-level security");
        return NextResponse.json(
          {
            error: "Failed to upload file",
            details: isRlsError
              ? "Storage RLS blocked the upload. Verify SUPABASE_SERVICE_ROLE_KEY is the service-role key (not anon key)."
              : uploadError.message,
          },
          { status: 500 },
        );
      }

      // Get public URL
      url = supabaseAdmin.storage.from(AUDIO_BUCKET).getPublicUrl(filePath).data.publicUrl;

      if (!url) {
        return NextResponse.json({ error: "Failed to get public URL" }, { status: 500 });
      }
    }

    // Save to database
    const audio = await prisma.audio.create({
      data: {
        titleEn,
        titleBs,
        descriptionEn,
        descriptionBs,
        url,
        youtubeUrl,
        type,
      },
    });

    return NextResponse.json({ audio }, { status: 201 });
  } catch (_error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error = _error as any;
    console.error("Audio creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
