import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

const LECTURE_BUCKET = "images";
const MAX_UPLOAD_ATTEMPTS = 3;

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
    const image = formData.get("image") as File;
    const titleEn = (formData.get("titleEn") as string)?.trim();
    const titleBs = (formData.get("titleBs") as string)?.trim();
    const descriptionEn = ((formData.get("descriptionEn") as string) || "").trim();
    const descriptionBs = ((formData.get("descriptionBs") as string) || "").trim();

    if (!image || !titleEn || !titleBs) {
      return NextResponse.json(
        { error: "Image, English title, and Bosnian title are required" },
        { status: 400 },
      );
    }

    if (!image.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
    }

    const extension = image.name.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;
    const filePath = `lectures/${fileName}`;

    let uploadError: { message: string } | null = null;
    for (let attempt = 1; attempt <= MAX_UPLOAD_ATTEMPTS; attempt += 1) {
      const result = await supabaseAdmin.storage.from(LECTURE_BUCKET).upload(filePath, image, {
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
      console.error("Lecture image upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload image", details: uploadError.message },
        { status: 500 },
      );
    }

    const imageUrl = supabaseAdmin.storage.from(LECTURE_BUCKET).getPublicUrl(filePath)
      .data.publicUrl;

    if (!imageUrl) {
      return NextResponse.json({ error: "Failed to get image URL" }, { status: 500 });
    }

    const lecture = await prisma.lecture.create({
      data: {
        titleEn,
        titleBs,
        descriptionEn: descriptionEn || null,
        descriptionBs: descriptionBs || null,
        imageUrl,
      },
    });

    return NextResponse.json({ lecture }, { status: 201 });
  } catch (error) {
    console.error("Lecture creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
