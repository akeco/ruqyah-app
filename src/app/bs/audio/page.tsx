import type { Metadata } from "next";
import AudioLibraryPage from "@/app/audio/AudioLibraryPage";

export const metadata: Metadata = {
  title: "Audio Biblioteka",
  description: "Poslušajte sve dostupne audio snimke.",
  alternates: {
    canonical: "/bs/audio",
    languages: {
      en: "/en/audio",
      bs: "/bs/audio",
      "x-default": "/audio",
    },
  },
};

export default async function BosnianAudioPage() {
  return <AudioLibraryPage language="bos" />;
}
