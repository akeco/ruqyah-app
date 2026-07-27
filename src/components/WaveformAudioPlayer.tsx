"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface WaveformAudioPlayerProps {
  src: string;
}

export default function WaveformAudioPlayer({ src }: WaveformAudioPlayerProps) {
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [waveform, setWaveform] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Refs to track actual playback position — always in sync, never stale
  const currentTimeRef = useRef(0);
  const startTimeRef = useRef(0);
  const startCurrentTimeRef = useRef(0);

  // Keep currentTimeRef in sync with state
  useEffect(() => {
    currentTimeRef.current = currentTime;
  }, [currentTime]);

  const computeWaveform = useCallback(async (audioSrc: string) => {
    setIsLoading(true);
    setError(null);
    setWaveform([]);

    try {
      if (!audioBufferRef.current) {
        const response = await fetch(audioSrc);
        if (!response.ok) throw new Error(`Failed to fetch audio: ${response.status}`);
        const arrayBuffer = await response.arrayBuffer();

        if (!audioContextRef.current) {
          audioContextRef.current = new AudioContext();
        }
        audioBufferRef.current = await audioContextRef.current.decodeAudioData(arrayBuffer);
      }

      const audioBuffer = audioBufferRef.current;
      setDuration(audioBuffer.duration);

      const rawData = audioBuffer.getChannelData(0);
      const samples = Math.min(rawData.length, 5000);
      const blockSize = Math.floor(rawData.length / samples);
      const waveformData: number[] = [];

      for (let i = 0; i < samples; i++) {
        let sum = 0;
        for (let j = 0; j < blockSize; j++) {
          const offset = i * blockSize + j;
          if (offset < rawData.length) {
            sum += Math.abs(rawData[offset]);
          }
        }
        waveformData.push(sum / blockSize);
      }

      const max = Math.max(...waveformData, 1);
      const normalized = waveformData.map((v) => v / max);
      setWaveform(normalized);
      setIsLoading(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to process audio");
      setIsLoading(false);
    }
  }, []);

  // Fetch waveform on mount
  /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
  useEffect(() => {
    computeWaveform(src);
  }, [computeWaveform]);
  /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

  // Cleanup: stop source and free audio context when src changes or unmount
  useEffect(() => {
    return () => {
      if (sourceRef.current) {
        try {
          sourceRef.current.stop();
        } catch {
          // silent
        }
        sourceRef.current.disconnect();
        sourceRef.current = null;
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      if (audioContextRef.current?.state !== "closed") {
        audioContextRef.current?.close();
      }
      audioBufferRef.current = null;
      setIsPlaying(false);
      setCurrentTime(0);
      currentTimeRef.current = 0;
      startTimeRef.current = 0;
      startCurrentTimeRef.current = 0;
    };
  }, [src]);

  // Redraw when progress changes
  useEffect(() => {
    if (!canvasRef.current || waveform.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    ctx.clearRect(0, 0, width, height);

    const barWidth = width / waveform.length;
    const gap = 1.5;

    for (let i = 0; i < waveform.length; i++) {
      const x = i * barWidth;
      const barHeight = waveform[i] * height;
      const progress = currentTime / duration;
      const isPlayed = i / waveform.length <= progress;

      if (isPlayed) {
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, "#f97316");
        gradient.addColorStop(1, "#ea580c");
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = "#d1d5db";
      }

      ctx.fillRect(x, (height - barHeight) / 2, Math.max(barWidth - gap, 0.5), barHeight);
    }
  }, [waveform, currentTime, duration]);

  const stopSource = useCallback(() => {
    if (sourceRef.current) {
      try {
        sourceRef.current.stop();
      } catch {
        // silent
      }
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  }, []);

  const togglePlayPause = useCallback(async () => {
    if (!audioBufferRef.current) return;

    if (isPlaying) {
      // Pause: save current time from ref (never stale), stop source
      stopSource();
      setIsPlaying(false);
      return;
    }

    if (audioContextRef.current?.state === "suspended") {
      await audioContextRef.current.resume();
    }

    // Use ref for startCurrentTime — guaranteed up-to-date
    const startCurrentTime = currentTimeRef.current;
    const source = audioContextRef.current!.createBufferSource();
    source.buffer = audioBufferRef.current;
    source.connect(audioContextRef.current!.destination);
    source.start(0, startCurrentTime);
    sourceRef.current = source;

    // Store context time for elapsed calculation
    startTimeRef.current = audioContextRef.current!.currentTime;
    startCurrentTimeRef.current = startCurrentTime;

    source.onended = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      currentTimeRef.current = 0;
      sourceRef.current = null;
    };

    const updateProgress = () => {
      if (!audioContextRef.current || !sourceRef.current) return;
      const elapsed = audioContextRef.current.currentTime - startTimeRef.current + startCurrentTimeRef.current;
      if (elapsed >= duration) {
        setCurrentTime(0);
        currentTimeRef.current = 0;
        setIsPlaying(false);
        sourceRef.current = null;
        return;
      }
      setCurrentTime(elapsed);
      currentTimeRef.current = elapsed;
      animFrameRef.current = requestAnimationFrame(updateProgress);
    };
    animFrameRef.current = requestAnimationFrame(updateProgress);

    setIsPlaying(true);
  }, [currentTime, duration, isPlaying, stopSource]);

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!canvasRef.current || duration === 0) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const clickTime = (x / rect.width) * duration;
      setCurrentTime(clickTime);
      currentTimeRef.current = clickTime;

      // If currently playing, stop and restart from new position
      if (isPlaying) {
        stopSource();
        setIsPlaying(false);
        // Immediately restart from the new position
        setTimeout(() => {
          if (!audioBufferRef.current || !audioContextRef.current) return;
          if (audioContextRef.current.state === "suspended") {
            audioContextRef.current.resume();
          }
          const startCurrentTime = clickTime;
          const source = audioContextRef.current.createBufferSource();
          source.buffer = audioBufferRef.current;
          source.connect(audioContextRef.current.destination);
          source.start(0, startCurrentTime);
          sourceRef.current = source;

          startTimeRef.current = audioContextRef.current.currentTime;
          startCurrentTimeRef.current = startCurrentTime;

          source.onended = () => {
            setIsPlaying(false);
            setCurrentTime(0);
            currentTimeRef.current = 0;
            sourceRef.current = null;
          };

          const updateProgress = () => {
            if (!audioContextRef.current || !sourceRef.current) return;
            const elapsed = audioContextRef.current.currentTime - startTimeRef.current + startCurrentTimeRef.current;
            if (elapsed >= duration) {
              setCurrentTime(0);
              currentTimeRef.current = 0;
              setIsPlaying(false);
              sourceRef.current = null;
              return;
            }
            setCurrentTime(elapsed);
            currentTimeRef.current = elapsed;
            animFrameRef.current = requestAnimationFrame(updateProgress);
          };
          animFrameRef.current = requestAnimationFrame(updateProgress);
          setIsPlaying(true);
        }, 0);
      }
    },
    [duration, isPlaying, stopSource],
  );

  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    // Placeholder for native audio metadata events
  }, []);

  return (
    <div className="w-full max-w-2xl rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      {error ? (
        <div className="flex h-24 items-center justify-center rounded bg-red-50 text-red-600">
          {error}
        </div>
      ) : (
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          onLoadedMetadata={handleLoadedMetadata}
          className="h-24 w-full cursor-pointer touch-none"
          style={{ touchAction: "none" }}
        />
      )}

      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={togglePlayPause}
          disabled={isLoading || !!error}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <span className="min-w-[70px] text-xs tabular-nums text-gray-600">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={handleToggleMute}
            className="text-gray-400 transition hover:text-gray-600"
            aria-label="Toggle mute"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              {isMuted || volume === 0 ? (
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
              ) : volume < 0.5 ? (
                <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
              ) : (
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              )}
            </svg>
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-gray-200 accent-orange-500"
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  );
}
