"use client";

import { useEffect, useId, useRef, useState } from "react";
import { extractYouTubeVideoId } from "@/lib/youtube";
import { loadYouTubeIframeApi } from "@/lib/youtubeIframeApi";

interface TypeInfo {
  label: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
}

interface AudioListItemProps {
  title: string;
  description: string | null;
  url: string | null;
  youtubeUrl: string | null;
  fallbackDuration: number | null;
  createdAtLabel: string;
  typeInfo: TypeInfo;
  isPlaying: boolean;
  onToggle: () => void;
  onEnded: () => void;
}

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatFallbackDuration(seconds: number | null): string {
  if (!seconds || seconds <= 0) return "-";
  return formatTime(seconds);
}

// Audio waveform visualizer (decorative)
function WaveformVisualizer({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-0.5 ${className || ""}`}>
      {[...Array(24)].map((_, i) => {
        const height = [
          40, 65, 45, 80, 55, 70, 50, 90, 60, 75, 45, 85, 55, 70, 60, 80, 50, 65, 45, 75, 55, 85, 60, 70,
        ][i];
        return <div key={i} className="w-0.5 rounded-full bg-secondary/60" style={{ height: `${height}%` }} />;
      })}
    </div>
  );
}

export function AudioListItem({
  title,
  description,
  url,
  youtubeUrl,
  fallbackDuration,
  createdAtLabel,
  typeInfo,
  isPlaying,
  onToggle,
  onEnded,
}: AudioListItemProps) {
  const youtubeVideoId = youtubeUrl ? extractYouTubeVideoId(youtubeUrl) : null;
  const isYouTube = !!youtubeVideoId;

  const downloadHref = isYouTube
    ? `/api/download?type=youtube&src=${encodeURIComponent(youtubeUrl as string)}&title=${encodeURIComponent(title)}`
    : url
      ? `/api/download?type=file&src=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
      : null;

  const audioRef = useRef<HTMLAudioElement>(null);
  const ytPlayerRef = useRef<any>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const containerId = `yt-engine-${useId().replace(/:/g, "")}`;

  const [ytReady, setYtReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [mediaDuration, setMediaDuration] = useState(0);

  // Only create the underlying <audio> element / YouTube player once this item has
  // actually been played at least once. With 100+ items in the list, eagerly creating
  // a hidden YouTube player (or preloading every audio file) for every row at once
  // overwhelms the page and playback becomes unreliable for everything.
  const [activated, setActivated] = useState(false);
  useEffect(() => {
    if (isPlaying) setActivated(true);
  }, [isPlaying]);

  // Native audio: play/pause follows isPlaying
  useEffect(() => {
    if (isYouTube || !activated) return;
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying, isYouTube, activated]);

  // Native audio: track time/duration/end
  useEffect(() => {
    if (isYouTube || !activated) return;
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setMediaDuration(audio.duration);
    const onEndedEvent = () => {
      setCurrentTime(0);
      onEnded();
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEndedEvent);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEndedEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isYouTube, activated]);

  // YouTube: create the hidden engine once this item is activated
  useEffect(() => {
    if (!isYouTube || !activated) return;
    let cancelled = false;

    loadYouTubeIframeApi().then((YT) => {
      if (cancelled) return;
      ytPlayerRef.current = new YT.Player(containerId, {
        videoId: youtubeVideoId,
        playerVars: { controls: 0, disablekb: 1, modestbranding: 1 },
        events: {
          onReady: () => {
            if (cancelled) return;
            setYtReady(true);
            setMediaDuration(ytPlayerRef.current.getDuration());
          },
          onStateChange: (e: any) => {
            if (cancelled) return;
            if (e.data === 0) {
              // ended
              setCurrentTime(0);
              onEnded();
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      ytPlayerRef.current?.destroy?.();
      ytPlayerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isYouTube, activated, youtubeVideoId]);

  // YouTube: play/pause follows isPlaying
  useEffect(() => {
    if (!isYouTube || !activated || !ytReady) return;
    if (isPlaying) {
      ytPlayerRef.current?.playVideo?.();
    } else {
      ytPlayerRef.current?.pauseVideo?.();
    }
  }, [isYouTube, activated, ytReady, isPlaying]);

  // YouTube: poll playback position while playing
  useEffect(() => {
    if (!isYouTube || !isPlaying) return;
    const interval = window.setInterval(() => {
      if (ytPlayerRef.current?.getCurrentTime) {
        setCurrentTime(ytPlayerRef.current.getCurrentTime());
      }
    }, 500);
    return () => window.clearInterval(interval);
  }, [isYouTube, isPlaying]);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = progressBarRef.current;
    if (!bar || mediaDuration <= 0) return;

    const rect = bar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const time = pct * mediaDuration;

    if (isYouTube) {
      ytPlayerRef.current?.seekTo?.(time, true);
    } else if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
    setCurrentTime(time);
  };

  const totalDuration = mediaDuration || fallbackDuration || 0;
  const progressPercent = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  return (
    <div
      className={`group relative rounded-xl border transition-all duration-300 ${
        isPlaying
          ? "border-secondary/50 bg-accent/30 shadow-md shadow-secondary/10"
          : "border-border-subtle bg-card hover:border-secondary/50 hover:shadow-md"
      }`}
    >
      {/* Left accent bar */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl transition-colors ${
          isPlaying ? "bg-secondary" : "bg-primary"
        }`}
      />

      <div className="flex items-start gap-4 p-5 pl-6">
        {/* Play button with waveform */}
        <div className="flex-shrink-0">
          <div className="relative">
            <button
              onClick={onToggle}
              className={`relative h-14 w-14 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95 ${
                isPlaying
                  ? "bg-secondary shadow-lg shadow-secondary/30"
                  : "bg-primary hover:bg-primary/90 shadow-md shadow-primary/20"
              }`}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying && <div className="absolute inset-0 rounded-full animate-ping bg-secondary/20" />}
              {isPlaying ? (
                <svg className="h-5 w-5 text-secondary-foreground relative z-10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-primary-foreground ml-0.5 relative z-10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <div className="mt-2 flex justify-center">
              <WaveformVisualizer />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-heading font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
              {title}
            </h3>
            <div className="flex-shrink-0 flex items-center gap-2">
              <span
                className={`hidden sm:inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${typeInfo.bgClass} ${typeInfo.textClass} ${typeInfo.borderClass}`}
              >
                {typeInfo.label}
              </span>
              {downloadHref && (
                <a
                  href={downloadHref}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-border-subtle text-foreground-muted hover:border-secondary/50 hover:text-primary transition-colors"
                  aria-label="Download as MP3"
                  title="Download as MP3"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {description && (
            <p className="text-sm text-foreground-muted mt-1.5 line-clamp-2 leading-relaxed">{description}</p>
          )}

          <div className="flex items-center gap-4 mt-3 text-xs text-foreground-muted">
            <span className="flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {formatFallbackDuration(fallbackDuration)}
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {createdAtLabel}
            </span>
            <span className="flex items-center gap-1.5">
              {isYouTube ? (
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.041 0 12 0 12s0 3.959.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.959 24 12 24 12s0-3.959-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              ) : (
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
              )}
              {isYouTube ? "YouTube" : "Audio"}
            </span>
          </div>
        </div>
      </div>

      {/* Seekable progress bar - shown while this item is playing */}
      {isPlaying && (
        <div className="px-5 pb-5 pl-[4.75rem]">
          <div
            ref={progressBarRef}
            onClick={handleSeek}
            className="relative h-2 rounded-full bg-border-subtle cursor-pointer group/bar"
            role="slider"
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={totalDuration}
            aria-valuenow={currentTime}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-secondary transition-all"
              style={{ width: `${progressPercent}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-secondary border-2 border-card shadow opacity-0 group-hover/bar:opacity-100 transition-opacity"
              style={{ left: `calc(${progressPercent}% - 7px)` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1.5 text-xs text-foreground-muted font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(totalDuration)}</span>
          </div>
        </div>
      )}

      {/* Hidden playback engines - no visible controls of their own, created lazily on first play */}
      {activated && !isYouTube && url && (
        <audio ref={audioRef} src={url} preload="metadata" style={{ display: "none" }} />
      )}
      {activated && isYouTube && (
        <div
          style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", left: -9999, top: -9999 }}
          aria-hidden
        >
          <div id={containerId} />
        </div>
      )}
    </div>
  );
}
