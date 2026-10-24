"use client";

import { Calendar, Download } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import { SectionReveal } from "@/components/ui/SectionReveal";
import { siteConfig } from "@/data/config";
import { t } from "@/i18n";
import { downloadIcs, googleCalendarUrl } from "@/lib/ics";
import type { ClientGuest } from "@/types/guest";

type CountdownProps = {
  guest: ClientGuest;
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeLeft(target: Date): TimeLeft {
  const diff = Math.max(0, target.getTime() - Date.now());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

function FlipDigit({ value, label }: { value: number; label: string }) {
  const padded = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-16 w-[4.25rem] overflow-hidden rounded-sm gold-border bg-white/70 sm:h-[4.5rem] sm:w-[4.75rem]">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={padded}
            className="absolute inset-0 flex items-center justify-center font-serif text-3xl text-ink tabular-nums sm:text-4xl"
            initial={{ rotateX: -90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: 90, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformPerspective: 400 }}
          >
            {padded}
          </motion.span>
        </AnimatePresence>
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-gold/20" aria-hidden />
      </div>
      <span className="label-caps text-[0.6rem] text-ink/55">{label}</span>
    </div>
  );
}

export function Countdown({ guest }: CountdownProps) {
  const reduce = useReducedMotion();
  const target = useMemo(() => new Date(siteConfig.weddingDateISO), []);
  const [left, setLeft] = useState<TimeLeft>(() => getTimeLeft(target));

  useEffect(() => {
    const id = window.setInterval(() => setLeft(getTimeLeft(target)), 1000);
    return () => window.clearInterval(id);
  }, [target]);

  const welcomeLines = useMemo(() => {
    const base = siteConfig.welcomeMessage;
    if (guest.isFallback) return [base];
    return [guest.displayName, base];
  }, [guest.displayName, guest.isFallback]);

  const units: { key: keyof TimeLeft; label: string }[] = [
    { key: "days", label: "Days" },
    { key: "hours", label: "Hours" },
    { key: "minutes", label: "Mins" },
    { key: "seconds", label: "Secs" },
  ];

  return (
    <SectionReveal
      id="welcome"
      className="relative mx-auto w-full max-w-3xl px-6 py-20 sm:py-24"
    >
      <p className="label-caps text-center text-gold">{t("welcome")}</p>

      <div className="mt-8 space-y-3 text-center">
        {welcomeLines.map((line, i) => (
          <motion.p
            key={`${i}-${line.slice(0, 12)}`}
            className={
              i === 0 && !guest.isFallback
                ? "font-script text-4xl text-ink sm:text-5xl"
                : "mx-auto max-w-xl font-serif text-lg leading-relaxed text-ink/80 sm:text-xl"
            }
            initial={reduce ? false : { opacity: 0, y: 20, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: i * 0.12, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            {line}
          </motion.p>
        ))}
      </div>

      <div className="mt-14 flex flex-wrap items-end justify-center gap-3 sm:gap-5">
        {units.map(({ key, label }) => (
          <FlipDigit key={key} value={left[key]} label={label} />
        ))}
      </div>

      <div className="mt-12 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <p className="label-caps w-full text-center text-ink/50 sm:w-auto sm:pr-2">
          {t("addToCalendar")}
        </p>
        <a
          href={googleCalendarUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-card gold-border inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-serif text-ink transition hover:border-gold sm:w-auto"
        >
          <Calendar className="h-4 w-4 text-gold" aria-hidden />
          {t("googleCalendar")}
        </a>
        <button
          type="button"
          onClick={() => downloadIcs()}
          className="glass-card gold-border inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-serif text-ink transition hover:border-gold sm:w-auto"
        >
          <Download className="h-4 w-4 text-gold" aria-hidden />
          {t("downloadIcs")}
        </button>
      </div>
    </SectionReveal>
  );
}
