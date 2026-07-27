import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep these out of the server bundle so their binary/path resolution
  // (ffmpeg-static's __dirname lookup in particular) stays correct at runtime.
  serverExternalPackages: ["ffmpeg-static", "fluent-ffmpeg", "youtube-dl-exec"],
};

export default nextConfig;
