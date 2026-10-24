"use client";

import { Clock3, Heart, Sparkles, UtensilsCrossed } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

import { OrnateName } from "@/components/ui/OrnateName";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { siteConfig, type ScheduleItem } from "@/data/config";
import { t } from "@/i18n";

function parseTimeOnDate(isoDate: string, time: string): Date {
  const [h, m] = time.split(":").map(Number);
  const d = new Date(isoDate);
  d.setHours(h ?? 0, m ?? 0, 0, 0);
  return d;
}

function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getNextEventId(now: Date): string | null {
  const weddingDay = new Date(siteConfig.weddingDateISO);
  if (!isSameCalendarDay(now, weddingDay)) return null;

  for (const item of siteConfig.schedule) {
    const start = parseTimeOnDate(siteConfig.weddingDateISO, item.time);
    const next = siteConfig.schedule[siteConfig.schedule.indexOf(item) + 1];
    const end = next
      ? parseTimeOnDate(siteConfig.weddingDateISO, next.time)
      : new Date(start.getTime() + 60 * 60 * 1000);
    if (now < end) return item.id;
  }
  return null;
}

function ScheduleIcon({ item }: { item: ScheduleItem }) {
  const className = "h-5 w-5 text-maroon-muted";
  if (item.icon === "dining") return <UtensilsCrossed className={className} aria-hidden />;
  if (item.icon === "heart") return <Heart className={className} aria-hidden />;
  return <Sparkles className={className} aria-hidden />;
}

export function Schedule() {
  const reduce = useReducedMotion();
  const nextId = useMemo(() => getNextEventId(new Date()), []);

  return (
    <SectionReveal id="schedule" className="relative mx-auto w-full max-w-2xl px-6 py-20 sm:py-24">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(196,160,160,0.18), transparent 65%)",
        }}
        aria-hidden
      />

      <p className="label-caps text-center text-maroon-muted">{t("weddingDay")}</p>
      <div className="mt-3 flex justify-center">
        <OrnateName as="h2" size="lg">
          {siteConfig.couple.displayNames}
        </OrnateName>
      </div>
      <p className="mt-4 text-center font-serif text-lg text-ink/80 sm:text-xl">
        {siteConfig.weddingDateLabel}
      </p>
      <p className="mt-1 text-center font-serif text-sm italic text-ink/55">
        {siteConfig.venue.name}
      </p>

      {/* Day summary strip */}
      <div className="gold-border glass-card mx-auto mt-10 flex max-w-md items-center justify-center gap-3 rounded-sm px-4 py-3">
        <Clock3 className="h-4 w-4 shrink-0 text-maroon-muted" aria-hidden />
        <p className="font-serif text-sm text-ink/75 sm:text-base">
          <span className="font-medium text-ink">11:00 AM</span>
          <span className="mx-2 text-maroon-soft">→</span>
          <span className="font-medium text-ink">4:00 PM</span>
        </p>
      </div>

      {/* Vertical timeline */}
      <ol className="relative mt-14 space-y-0">
        <div
          className="absolute bottom-4 left-[1.15rem] top-4 w-px bg-gradient-to-b from-maroon-soft via-rose-mist to-maroon-soft/40 sm:left-1/2 sm:-translate-x-1/2"
          aria-hidden
        />

        {siteConfig.schedule.map((item, index) => {
          const isNext = item.id === nextId;
          const isPrimary = item.emphasis === "primary";

          return (
            <motion.li
              key={item.id}
              className="relative grid grid-cols-[2.3rem_1fr] gap-4 py-5 sm:grid-cols-[1fr_2.3rem_1fr] sm:gap-6 sm:py-7"
              initial={reduce ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ delay: index * 0.08, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Desktop left column — time */}
              <div className="hidden text-right sm:block">
                <p
                  className={`font-serif tabular-nums tracking-wide ${
                    isPrimary
                      ? "text-3xl text-maroon-deep"
                      : "text-2xl text-ink/80"
                  }`}
                >
                  {item.timeLabel}
                </p>
              </div>

              {/* Node */}
              <div className="relative z-10 flex justify-center pt-1">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full border bg-ivory shadow-sm ${
                    isNext
                      ? "border-maroon-muted ring-4 ring-maroon-soft/30"
                      : "border-maroon-soft/60"
                  }`}
                >
                  <ScheduleIcon item={item} />
                </span>
              </div>

              {/* Content */}
              <div
                className={`gold-border rounded-sm bg-white/55 px-5 py-5 backdrop-blur-sm sm:px-6 ${
                  isPrimary ? "shadow-soft" : ""
                } ${isNext ? "ring-1 ring-maroon-soft/50" : ""}`}
              >
                {isNext && (
                  <span className="label-caps mb-2 inline-block rounded-full bg-maroon-muted px-2.5 py-0.5 text-[0.55rem] text-ivory">
                    {t("nextUp")}
                  </span>
                )}
                <p className="font-serif text-xl tabular-nums text-maroon-deep sm:hidden">
                  {item.timeLabel}
                </p>
                <h3
                  className={`font-serif text-ink ${
                    isPrimary ? "mt-1 text-2xl sm:text-3xl" : "mt-1 text-xl sm:text-2xl"
                  }`}
                >
                  {item.title}
                </h3>
                <p className="mt-2 font-serif text-base leading-relaxed text-ink/70">
                  {item.description}
                </p>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </SectionReveal>
  );
}
