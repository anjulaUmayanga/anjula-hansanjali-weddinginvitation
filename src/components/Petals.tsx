"use client";

import { useMemo, type CSSProperties } from "react";

const PETAL_COUNT = 14;

type PetalSpec = {
  id: number;
  left: string;
  delay: string;
  duration: string;
  drift: string;
  size: string;
  opacity: number;
};

function buildPetals(): PetalSpec[] {
  return Array.from({ length: PETAL_COUNT }, (_, id) => ({
    id,
    left: `${4 + (id * 7) % 92}%`,
    delay: `${(id * 0.7) % 10}s`,
    duration: `${14 + (id % 5) * 2}s`,
    drift: `${-30 + (id * 17) % 60}px`,
    size: `${10 + (id % 4) * 3}px`,
    opacity: 0.35 + (id % 3) * 0.15,
  }));
}

export function Petals() {
  const petals = useMemo(() => buildPetals(), []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[5] overflow-hidden motion-reduce:hidden"
      aria-hidden
    >
      {petals.map((p) => (
        <span
          key={p.id}
          className="animate-petal-fall absolute top-0 rounded-full bg-blush"
          style={
            {
              left: p.left,
              width: p.size,
              height: p.size,
              animationDelay: p.delay,
              animationDuration: p.duration,
              opacity: p.opacity,
              "--petal-drift": p.drift,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
