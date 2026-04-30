"use client";

import WaveformAudioPlayer from "@/components/WaveformAudioPlayer";

interface AudioPlayerProps {
  src: string;
}

export default function AudioPlayer({ src }: AudioPlayerProps) {
  return <WaveformAudioPlayer src={src} />;
}
