"use client";

import { useEffect, useRef } from "react";

export function useLenis(active: boolean) {
  const lenisRef = useRef<{ destroy: () => void; raf: (time: number) => void } | null>(null);

  useEffect(() => {
    if (!active) {
      lenisRef.current?.destroy();
      lenisRef.current = null;
      return;
    }

    let cancelled = false;
    let rafId = 0;

    void import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      const lenis = new Lenis({
        duration: 1.1,
        smoothWheel: true,
        touchMultiplier: 1.2,
      });
      lenisRef.current = lenis;

      const raf = (time: number) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, [active]);
}
