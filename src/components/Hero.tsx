"use client";

import { ChevronDown } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { OrnateName } from "@/components/ui/OrnateName";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { siteConfig } from "@/data/config";
import { t } from "@/i18n";
import { titleCaseName } from "@/lib/text";
import type { ClientGuest } from "@/types/guest";

type HeroProps = {
  guest: ClientGuest;
};

export function Hero({ guest }: HeroProps) {
  const reduce = useReducedMotion();

  return (
    <SectionReveal
      id="hero"
      as="section"
      className="relative flex min-h-dvh w-full flex-col overflow-hidden"
    >
      <div className="absolute inset-0">
        <div className="relative h-full w-full overflow-hidden">
          <div className={`absolute inset-0 ${reduce ? "" : "animate-ken-burns"}`}>
            <PhotoFrame
              src={siteConfig.photos.couple}
              alt={`${siteConfig.couple.displayNames} — wedding cover`}
              className="object-cover"
              priority
              sizes="100vw"
              index={0}
            />
          </div>
          <div
            className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-maroon-soft/20"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-ink/25 via-transparent to-transparent"
            aria-hidden
          />
        </div>
      </div>

      <div className="relative z-10 flex flex-1 flex-col px-6 pb-10 pt-[max(1.5rem,env(safe-area-inset-top))]">
        <div className="mx-auto w-full max-w-lg text-center">
          <p className="label-caps text-champagne/95">{t("youAreInvited")}</p>
          {!guest.isFallback && (
            <motion.div
              className="mt-4"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7 }}
            >
              <OrnateName
                as="p"
                size="md"
                className="[&_.ornate-script]:text-ivory [&_.ornate-flourish]:text-champagne/80"
              >
                {guest.displayName}
              </OrnateName>
            </motion.div>
          )}
        </div>

        <div className="mt-auto w-full pb-4 text-center">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <OrnateName
              as="h1"
              size="xl"
              className="[&_.font-script]:gold-text [&_.ornate-flourish]:text-gold-light/80"
            >
              {titleCaseName(siteConfig.couple.displayNames)}
            </OrnateName>
          </motion.div>
          <motion.p
            className="mx-auto mt-6 max-w-4xl text-balance font-serif text-[clamp(1.85rem,6.2vw,3.4rem)] font-medium leading-tight tracking-wide text-ivory drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]"
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
          >
            {siteConfig.weddingDateLabel}
          </motion.p>
          <motion.p
            className="mt-2 font-serif text-base text-ivory/85 sm:text-lg"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.6 }}
          >
            {siteConfig.venue.name}
          </motion.p>
        </div>
      </div>

      <a
        href="#welcome"
        className="relative z-10 mx-auto mb-[max(1.25rem,env(safe-area-inset-bottom))] flex flex-col items-center gap-1 text-ivory/70 transition-colors hover:text-champagne"
        aria-label={t("scroll")}
      >
        <span className="label-caps text-[0.65rem] tracking-[0.35em]">{t("scroll")}</span>
        <ChevronDown className="h-5 w-5 animate-bounce motion-reduce:animate-none" aria-hidden />
      </a>
    </SectionReveal>
  );
}
