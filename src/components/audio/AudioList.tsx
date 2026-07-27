"use client";

import { useState } from "react";
import { AudioListItem } from "@/components/audio/AudioListItem";

interface AudioItem {
  id: string;
  title_en: string;
  title_bs: string;
  description_en: string | null;
  description_bs: string | null;
  url: string | null;
  youtube_url: string | null;
  duration: number | null;
  type: string | null;
  slug: string | null;
  created_at: string;
}

interface AudioListProps {
  items: AudioItem[];
  lang: string;
  category: "lectures" | "recitations";
}

// Type badge helper
function getTypeInfo(type: string | null) {
  if (type === "ruqya" || type === "recitation" || !type) {
    return {
      label: "Ruqya",
      bgClass: "bg-secondary/15",
      textClass: "text-secondary",
      borderClass: "border-secondary/30",
    };
  }
  if (type === "lecture" || type === "educational") {
    return {
      label: "Education",
      bgClass: "bg-accent",
      textClass: "text-primary",
      borderClass: "border-primary/20",
    };
  }
  return {
    label: type,
    bgClass: "bg-background-elevated",
    textClass: "text-foreground-muted",
    borderClass: "border-border-subtle",
  };
}

// Date formatter
function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function AudioList({ items, lang }: AudioListProps) {
  const isBs = lang === "bs";
  const [playingId, setPlayingId] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const title = isBs ? item.title_bs : item.title_en;
        const description = isBs ? item.description_bs : item.description_en;
        const isPlaying = playingId === item.id;

        return (
          <AudioListItem
            key={item.id}
            title={title}
            description={description}
            url={item.url}
            youtubeUrl={item.youtube_url}
            fallbackDuration={item.duration}
            createdAtLabel={formatDate(item.created_at)}
            typeInfo={getTypeInfo(item.type)}
            isPlaying={isPlaying}
            onToggle={() => setPlayingId(isPlaying ? null : item.id)}
            onEnded={() => setPlayingId(null)}
          />
        );
      })}
    </div>
  );
}
