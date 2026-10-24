"use client";

import { ExternalLink, MapPin, MessageCircle } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

import { SectionReveal } from "@/components/ui/SectionReveal";
import { siteConfig } from "@/data/config";
import { t } from "@/i18n";


export function Venue() {
  const reduce = useReducedMotion();
  const [mapLoaded, setMapLoaded] = useState(false);
  const { venue } = siteConfig;
  const embedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(venue.mapQuery)}&output=embed`;

  return (
    <SectionReveal id="venue" className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-24">
      <p className="label-caps text-center text-gold">{t("venue")}</p>
      <h2 className="mt-3 text-center font-script text-4xl text-ink sm:text-5xl">{venue.name}</h2>
      <p className="mx-auto mt-3 max-w-md text-center font-serif text-base text-ink/70">
        {venue.address}
      </p>

      <motion.div
        className="relative mt-10 aspect-[16/10] w-full overflow-hidden rounded-sm gold-border bg-champagne/40"
        initial={reduce ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
      >
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center font-serif text-ink/50">
            <MapPin className="mr-2 h-5 w-5 text-gold" aria-hidden />
            Loading map…
          </div>
        )}
        <iframe
          title={`Map — ${venue.name}`}
          src={embedSrc}
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => setMapLoaded(true)}
          allowFullScreen
        />
      </motion.div>

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <a
          href={venue.mapsShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-card gold-border inline-flex w-full max-w-sm items-center justify-center gap-2 rounded-full px-5 py-3 font-serif text-ink transition hover:border-gold sm:w-auto"
        >
          <ExternalLink className="h-4 w-4 text-gold" aria-hidden />
          {t("getDirections")}
        </a>
        
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <article className="glass-card gold-border rounded-sm p-5">
          <h3 className="label-caps text-gold-dark">{t("parking")}</h3>
          <p className="mt-2 font-serif text-sm leading-relaxed text-ink/75 sm:text-base">
            {venue.parkingNote}
          </p>
        </article>
        <article className="glass-card gold-border rounded-sm p-5">
          <h3 className="label-caps text-gold-dark">{t("hotels")}</h3>
          <p className="mt-2 font-serif text-sm leading-relaxed text-ink/75 sm:text-base">
            {venue.hotelNote}
          </p>
        </article>
      </div>
    </SectionReveal>
  );
}
