"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import { OrnateName } from "@/components/ui/OrnateName";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { siteConfig } from "@/data/config";
import { t } from "@/i18n";

export function Story() {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.15"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <SectionReveal
      id="story"
      className="relative mx-auto w-full max-w-4xl overflow-hidden px-5 py-24 sm:px-8 sm:py-28"
    >
      {/* Soft maroon atmosphere */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(196,160,160,0.2), transparent 60%), radial-gradient(ellipse 50% 40% at 80% 80%, rgba(232,208,204,0.35), transparent 55%)",
        }}
        aria-hidden
      />

      <p className="label-caps text-center text-maroon-muted">{t("ourStory")}</p>
      <div className="mt-4 flex justify-center">
        <OrnateName as="h2" size="lg" className="text-center">
          Chapters of Us
        </OrnateName>
      </div>
      <p className="mx-auto mt-5 max-w-md text-center font-serif text-base italic leading-relaxed text-ink/65 sm:text-lg">
        A love written slowly — in glances, journeys, and promises kept.
      </p>

      <div ref={containerRef} className="relative mt-16 sm:mt-20">
        {/* Vertical vine spine */}
        <div
          className="absolute bottom-8 left-6 top-8 w-px bg-rose-mist sm:left-1/2 sm:-translate-x-1/2"
          aria-hidden
        />
        {!reduce && (
          <motion.div
            className="absolute bottom-8 left-6 top-8 origin-top w-px bg-gradient-to-b from-maroon-soft via-maroon-muted to-gold sm:left-1/2 sm:-translate-x-1/2"
            style={{ scaleY: lineScale }}
            aria-hidden
          />
        )}

        <ul className="relative space-y-20 sm:space-y-28">
          {siteConfig.story.map((milestone, index) => {
            const isLeft = index % 2 === 0;
            const tilt = isLeft ? -2.5 : 2.5;

            return (
              <motion.li
                key={milestone.id}
                className="relative"
                initial={reduce ? false : { opacity: 0, y: 48 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Year watermark */}
                <span
                  className="pointer-events-none absolute -top-8 right-0 font-script text-7xl text-maroon-soft/25 sm:-top-10 sm:text-8xl"
                  aria-hidden
                >
                  {milestone.date}
                </span>

                <div
                  className={`relative flex flex-col gap-8 sm:items-center sm:gap-10 ${
                    isLeft ? "sm:flex-row" : "sm:flex-row-reverse"
                  }`}
                >
                  {/* Node on vine */}
                  <div
                    className="absolute left-6 top-10 z-10 flex h-4 w-4 -translate-x-1/2 items-center justify-center sm:left-1/2"
                    aria-hidden
                  >
                    <span className="absolute h-8 w-8 rounded-full bg-maroon-soft/20" />
                    <span className="relative h-3 w-3 rounded-full border border-maroon-muted bg-ivory shadow-sm" />
                  </div>

                  {/* Photo — editorial frame */}
                  <motion.div
                    className="relative ml-10 w-[calc(100%-2.5rem)] sm:ml-0 sm:w-[46%]"
                    style={reduce ? undefined : { rotate: tilt }}
                    whileHover={reduce ? undefined : { rotate: 0, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  >
                    <div className="story-frame relative overflow-hidden rounded-[2px] border border-maroon-soft/40 bg-ivory p-2.5 sm:p-3">
                      <div className="relative aspect-[4/5] overflow-hidden">
                        <PhotoFrame
                          src={milestone.photo}
                          alt={milestone.title}
                          index={index}
                          sizes="(max-width: 640px) 90vw, 40vw"
                        />
                        <div
                          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-ivory/10"
                          aria-hidden
                        />
                      </div>
                      {/* Corner flourishes */}
                      <svg
                        className="absolute left-1 top-1 h-8 w-8 text-maroon-soft/70"
                        viewBox="0 0 32 32"
                        fill="none"
                        aria-hidden
                      >
                        <path d="M4 28V8c0-2 2-4 4-4h20" stroke="currentColor" strokeWidth="1" />
                        <path d="M8 12c4-2 8-2 10 2" stroke="currentColor" strokeWidth="0.8" />
                      </svg>
                      <svg
                        className="absolute bottom-1 right-1 h-8 w-8 rotate-180 text-maroon-soft/70"
                        viewBox="0 0 32 32"
                        fill="none"
                        aria-hidden
                      >
                        <path d="M4 28V8c0-2 2-4 4-4h20" stroke="currentColor" strokeWidth="1" />
                      </svg>
                    </div>
                  </motion.div>

                  {/* Copy */}
                  <div
                    className={`ml-10 flex-1 sm:ml-0 ${
                      isLeft ? "sm:pl-4 sm:text-left" : "sm:pr-4 sm:text-right"
                    }`}
                  >
                    <p className="label-caps text-maroon-muted">{milestone.date}</p>
                    <h3 className="mt-2 font-script text-3xl italic text-ink sm:text-4xl">
                      {milestone.title}
                    </h3>
                    <div
                      className={`mx-auto mt-3 h-px w-16 bg-gradient-to-r from-transparent via-maroon-soft to-transparent sm:mx-0 ${
                        isLeft ? "" : "sm:ml-auto"
                      }`}
                      aria-hidden
                    />
                    <p className="mt-4 max-w-sm font-serif text-base leading-relaxed text-ink/70 sm:text-lg sm:leading-8">
                      {milestone.body}
                    </p>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ul>
      </div>

      <p className="mt-20 text-center font-script text-2xl italic text-maroon-muted sm:text-3xl">
        And so our forever begins…
      </p>
    </SectionReveal>
  );
}
