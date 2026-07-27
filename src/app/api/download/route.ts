import { NextRequest } from "next/server";
import { Readable } from "stream";
import ffmpegPath from "ffmpeg-static";
import ffmpeg from "fluent-ffmpeg";
import youtubedl from "youtube-dl-exec";
import { extractYouTubeVideoId } from "@/lib/youtube";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

if (ffmpegPath) {
  ffmpeg.setFfmpegPath(ffmpegPath);
}

function sanitizeFilename(title: string): string {
  const cleaned = title
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase()
    .slice(0, 80);
  return cleaned || "audio";
}

// Only proxy/transcode files that actually live in our own Supabase Storage bucket,
// to avoid turning this endpoint into an open fetch/conversion proxy for arbitrary URLs.
function isAllowedFileSource(url: string): boolean {
  try {
    const parsed = new URL(url);
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const allowedHost = supabaseUrl ? new URL(supabaseUrl).hostname : null;
    return parsed.hostname === allowedHost || parsed.hostname.endsWith(".supabase.co");
  } catch {
    return false;
  }
}

function transcodeToMp3Response(inputStream: Readable, contentDisposition: string): Response {
  const webStream = new ReadableStream({
    start(controller) {
      const command = ffmpeg(inputStream)
        .audioCodec("libmp3lame")
        .audioBitrate(128)
        .format("mp3")
        .on("error", (err: Error) => {
          console.error("ffmpeg transcoding error:", err);
          controller.error(err);
        })
        .on("end", () => {
          controller.close();
        });

      const output = command.pipe();
      output.on("data", (chunk: Buffer) => controller.enqueue(chunk));
      output.on("error", (err: Error) => controller.error(err));
    },
  });

  return new Response(webStream, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Disposition": contentDisposition,
    },
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); // "file" | "youtube"
  const src = searchParams.get("src");
  const title = searchParams.get("title") || "audio";
  const filename = `${sanitizeFilename(title)}.mp3`;
  const contentDisposition = `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`;

  if (!src) {
    return new Response("Missing src", { status: 400 });
  }

  if (type === "youtube") {
    const videoId = extractYouTubeVideoId(src);
    if (!videoId) {
      return new Response("Invalid YouTube URL", { status: 400 });
    }

    let streamUrl: string;
    try {
      const result = await youtubedl(`https://www.youtube.com/watch?v=${videoId}`, {
        format: "bestaudio",
        getUrl: true,
        noWarnings: true,
      });
      streamUrl = String(result).trim().split("\n")[0];
      if (!streamUrl) throw new Error("No stream URL returned");
    } catch (error) {
      console.error("YouTube extraction error:", error);
      return new Response("Failed to load YouTube audio", { status: 502 });
    }

    let res: Response;
    try {
      res = await fetch(streamUrl);
    } catch (error) {
      console.error("YouTube stream fetch error:", error);
      return new Response("Failed to fetch YouTube audio", { status: 502 });
    }

    if (!res.ok || !res.body) {
      return new Response("Failed to fetch YouTube audio", { status: 502 });
    }

    const inputStream = Readable.fromWeb(res.body as import("stream/web").ReadableStream<Uint8Array>);
    return transcodeToMp3Response(inputStream, contentDisposition);
  }

  if (!isAllowedFileSource(src)) {
    return new Response("Source not allowed", { status: 400 });
  }

  let res: Response;
  try {
    res = await fetch(src);
  } catch (error) {
    console.error("Download fetch error:", error);
    return new Response("Failed to fetch source audio", { status: 502 });
  }

  if (!res.ok || !res.body) {
    return new Response("Failed to fetch source audio", { status: 502 });
  }

  const isAlreadyMp3 =
    /\.mp3(\?|$)/i.test(src) || (res.headers.get("content-type") || "").includes("audio/mpeg");

  if (isAlreadyMp3) {
    // Already MP3 - stream through unchanged with download headers
    return new Response(res.body, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": contentDisposition,
      },
    });
  }

  const inputStream = Readable.fromWeb(res.body as import("stream/web").ReadableStream<Uint8Array>);
  return transcodeToMp3Response(inputStream, contentDisposition);
}
