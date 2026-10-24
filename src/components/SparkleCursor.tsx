"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export function SparkleCursor() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const touch = "ontouchstart" in window && navigator.maxTouchPoints > 0;
    setEnabled(!coarse && !touch);
  }, []);

  useEffect(() => {
    if (!enabled || reduce) return;
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [enabled, reduce]);

  if (!enabled || reduce) return null;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[70] h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/70 bg-gold-light/10 mix-blend-multiply"
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 400, damping: 28, mass: 0.4 }}
      aria-hidden
    />
  );
}
