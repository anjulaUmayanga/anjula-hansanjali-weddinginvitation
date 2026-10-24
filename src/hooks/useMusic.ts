"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "wedding-music-on";

type UseMusicOptions = {
  src?: string;
  enabled?: boolean;
};

export function useMusic({ src = "/music.mp3", enabled = true }: UseMusicOptions = {}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const fadeRef = useRef<number | null>(null);
  const wantPlayRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    const audio = new Audio(src);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0;
    audioRef.current = audio;

    const onCanPlay = () => setReady(true);
    const onError = () => setReady(false);
    audio.addEventListener("canplaythrough", onCanPlay);
    audio.addEventListener("error", onError);

    const stored = localStorage.getItem(STORAGE_KEY);
    wantPlayRef.current = stored !== "0";

    return () => {
      audio.removeEventListener("canplaythrough", onCanPlay);
      audio.removeEventListener("error", onError);
      audio.pause();
      audioRef.current = null;
      if (fadeRef.current) cancelAnimationFrame(fadeRef.current);
    };
  }, [src, enabled]);

  const fadeTo = useCallback((target: number, durationMs: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (fadeRef.current) cancelAnimationFrame(fadeRef.current);
    const start = audio.volume;
    const startTime = performance.now();

    const step = (now: number) => {
      const t = Math.min(1, (now - startTime) / durationMs);
      audio.volume = start + (target - start) * t;
      if (t < 1) {
        fadeRef.current = requestAnimationFrame(step);
      } else if (target === 0) {
        audio.pause();
        setPlaying(false);
      }
    };
    fadeRef.current = requestAnimationFrame(step);
  }, []);

  const play = useCallback(
    async (fadeMs = 2000) => {
      const audio = audioRef.current;
      if (!audio) return;
      wantPlayRef.current = true;
      localStorage.setItem(STORAGE_KEY, "1");
      try {
        await audio.play();
        setPlaying(true);
        fadeTo(0.55, fadeMs);
      } catch {
        setPlaying(false);
      }
    },
    [fadeTo],
  );

  const pause = useCallback(() => {
    wantPlayRef.current = false;
    localStorage.setItem(STORAGE_KEY, "0");
    fadeTo(0, 400);
  }, [fadeTo]);

  const toggle = useCallback(() => {
    if (playing) pause();
    else void play(600);
  }, [playing, pause, play]);

  useEffect(() => {
    const onVisibility = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (document.hidden) {
        if (!audio.paused) {
          audio.pause();
          setPlaying(false);
        }
      } else if (wantPlayRef.current && localStorage.getItem(STORAGE_KEY) !== "0") {
        void audio.play().then(() => {
          setPlaying(true);
          fadeTo(0.55, 800);
        });
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [fadeTo]);

  return { playing, ready, play, pause, toggle };
}
