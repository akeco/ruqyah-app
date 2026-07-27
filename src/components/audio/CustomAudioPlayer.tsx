"use client";

import { useState, useRef, useEffect, useCallback, useId } from "react";

interface CustomAudioPlayerProps {
  src: string;
  title: string;
  description?: string;
  lang: string;
  compact?: boolean;
  currentTime?: number;
  isPlaying?: boolean;
  onPause?: () => void;
}

export function CustomAudioPlayer({
  src,
  title,
  description,
  lang,
  compact = false,
  currentTime: initialTime = 0,
  isPlaying: externalIsPlaying,
  onPause,
}: CustomAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isExpanded, setIsExpanded] = useState(false);

  // Sync external isPlaying prop with internal state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (externalIsPlaying !== undefined && externalIsPlaying) {
      // Defer setState to avoid cascading render warning
      setTimeout(() => {
        setIsPlaying(true);
        // Resume playback when inline player mounts
        audio.play().catch(() => {
          // Autoplay blocked — show play button
          setIsPlaying(false);
        });
      }, 0);
    }
  }, [externalIsPlaying]);

  // Unique ID for this player instance (for global play state)
  const instanceId = useId().replace(/:/g, "");

  // Track global playing state — only one player at a time
  const globalPlayingRef = useRef<string | null>(null);

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Stop any other playing instance
    if (globalPlayingRef.current && globalPlayingRef.current !== instanceId) {
      const prevAudio = document.querySelector(`[data-audio-instance="${globalPlayingRef.current}"]`) as HTMLAudioElement | null;
      if (prevAudio) {
        prevAudio.pause();
        prevAudio.currentTime = 0;
      }
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      onPause?.();
      globalPlayingRef.current = null;
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
        globalPlayingRef.current = instanceId;
      }).catch(() => {
        // Autoplay blocked — show play button
        setIsPlaying(false);
      });
    }
  }, [isPlaying]);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const bar = progressRef.current;
    if (!audio || !bar || !audio.duration) return;

    const rect = bar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pos * audio.duration;
  };

  const handleVolume = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const bar = volumeRef.current;
    if (!audio || !bar) return;

    const rect = bar.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.volume = pos;
    setVolume(pos);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Restore playback position on mount (for inline player that remounts)
    if (initialTime > 0 && !isNaN(initialTime)) {
      audio.currentTime = initialTime;
    }

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => {
      setIsPlaying(false);
      globalPlayingRef.current = null;
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    audio.volume = volume;

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, [initialTime]);

  // Progress percentage
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      data-audio-instance={instanceId}
      className={`rounded-xl border border-border-subtle bg-card overflow-hidden ${
        compact ? "" : "shadow-sm"
      }`}
    >
      {/* Compact view */}
      {!isExpanded && (
        <div className="flex items-center gap-3 p-3">
          {/* Play button */}
          <button
            onClick={togglePlay}
            className="flex-shrink-0 h-10 w-10 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center shadow-sm transition-all active:scale-95"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg className="h-4 w-4 text-primary-foreground" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="h-4 w-4 text-primary-foreground ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Title & time */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{title}</p>
            <p className="text-xs text-foreground-muted">
              {formatTime(currentTime)} / {formatTime(duration)}
            </p>
          </div>

          {/* Expand button */}
          <button
            onClick={() => setIsExpanded(true)}
            className="flex-shrink-0 p-1.5 rounded-lg text-foreground-muted hover:text-primary hover:bg-accent transition-colors"
            aria-label="Expand player"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 3 21 3 21 9" />
              <polyline points="9 21 3 21 3 15" />
              <line x1="21" y1="3" x2="14" y2="10" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
          </button>
        </div>
      )}

      {/* Expanded view */}
      {isExpanded && (
        <div className="p-4">
          {/* Title */}
          <div className="mb-4">
            <h4 className="text-sm font-heading font-bold text-foreground">{title}</h4>
            {description && (
              <p className="text-xs text-foreground-muted mt-1 line-clamp-2">{description}</p>
            )}
          </div>

          {/* Progress bar */}
          <div
            ref={progressRef}
            onClick={handleSeek}
            className="relative h-2 bg-border-subtle rounded-full cursor-pointer mb-3 group"
            role="slider"
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={duration}
            aria-valuenow={currentTime}
          >
            <div
              className="absolute inset-y-0 left-0 bg-secondary rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
            {/* Thumb */}
            <div
              className="absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-secondary border-2 border-card shadow opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `calc(${progressPercent}% - 8px)` }}
            />
          </div>

          {/* Time & controls */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-foreground-muted font-mono">{formatTime(currentTime)}</span>
            <span className="text-xs text-foreground-muted font-mono">{formatTime(duration)}</span>
          </div>

          {/* Volume bar */}
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={() => {
                const audio = audioRef.current;
                if (!audio) return;
                const newVol = audio.volume > 0 ? 0 : volume;
                audio.volume = newVol;
                setVolume(newVol);
              }}
              className="flex-shrink-0 text-foreground-muted hover:text-primary transition-colors"
              aria-label="Mute"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                {volume > 0 && (
                  <>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </>
                )}
                {volume === 0 && (
                  <>
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </>
                )}
              </svg>
            </button>
            <div
              ref={volumeRef}
              onClick={handleVolume}
              className="flex-1 h-1.5 bg-border-subtle rounded-full cursor-pointer relative"
              role="slider"
              aria-label="Volume"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(volume * 100)}
            >
              <div
                className="absolute inset-y-0 left-0 bg-primary rounded-full"
                style={{ width: `${volume * 100}%` }}
              />
            </div>
          </div>

          {/* Play/Pause + Close */}
          <div className="flex items-center justify-between">
            <button
              onClick={togglePlay}
              className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center shadow-md transition-all active:scale-95"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg className="h-5 w-5 text-primary-foreground" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-primary-foreground ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <button
              onClick={() => setIsExpanded(false)}
              className="p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-background-elevated transition-colors"
              aria-label="Collapse player"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Hidden audio element */}
      <audio ref={audioRef} src={src} preload="metadata" />
    </div>
  );
}
