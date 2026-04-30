import type { Metadata } from "next";
import AudioLibraryPage from "@/app/audio/AudioLibraryPage";

export const metadata: Metadata = {
  title: "Audio Library",
  description: "Listen to all available audio recordings.",
  alternates: {
    canonical: "/en/audio",
    languages: {
      en: "/en/audio",
      bs: "/bs/audio",
      "x-default": "/audio",
    },
  },
};

export default async function EnglishAudioPage() {
  return <AudioLibraryPage language="en" />;
}
