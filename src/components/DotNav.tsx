"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "hero", label: "Hero" },
  { id: "welcome", label: "Welcome" },
  { id: "story", label: "Story" },
  { id: "families", label: "Families" },
  { id: "schedule", label: "Schedule" },
  { id: "gallery", label: "Gallery" },
  { id: "venue", label: "Venue" },
  { id: "rsvp", label: "RSVP" },
  { id: "footer", label: "Footer" },
] as const;

export function DotNav() {
  const [active, setActive] = useState<string>("hero");

  useEffect(() => {
    const elements = SECTIONS.map(({ id }) => document.getElementById(id)).filter(Boolean);
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const top = visible[0]?.target.id;
        if (top) setActive(top);
      },
      { rootMargin: "-40% 0px -45% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    elements.forEach((el) => observer.observe(el!));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className="fixed right-[max(0.5rem,env(safe-area-inset-right))] top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-2 md:flex"
      aria-label="Section navigation"
    >
      {SECTIONS.map(({ id, label }) => {
        const isActive = active === id;
        return (
          <a
            key={id}
            href={`#${id}`}
            className="group flex items-center justify-end gap-2"
            aria-label={label}
            aria-current={isActive ? "true" : undefined}
          >
            <span className="pointer-events-none max-w-0 overflow-hidden whitespace-nowrap rounded bg-ink/80 px-2 py-0.5 text-[0.65rem] text-ivory opacity-0 transition-all group-hover:max-w-[8rem] group-hover:opacity-100 group-focus-visible:max-w-[8rem] group-focus-visible:opacity-100">
              {label}
            </span>
            <span
              className={`block rounded-full border transition ${
                isActive
                  ? "h-2.5 w-2.5 border-maroon-muted bg-maroon-soft"
                  : "h-2 w-2 border-maroon-soft/50 bg-ivory/80 group-hover:border-maroon-muted group-hover:bg-blush"
              }`}
            />
          </a>
        );
      })}
    </nav>
  );
}
