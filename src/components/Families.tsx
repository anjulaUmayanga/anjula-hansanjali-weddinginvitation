"use client";

import { motion, useReducedMotion } from "framer-motion";

import { SectionReveal } from "@/components/ui/SectionReveal";
import { siteConfig } from "@/data/config";
import { t } from "@/i18n";


function FamilyCard({
  side,
  names,
  delay,
}: {
  side: string;
  names: readonly string[];
  delay: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      className="glass-card gold-border flex flex-1 flex-col items-center rounded-sm px-6 py-10 text-center"
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="label-caps text-gold">{side}</p>
      <ul className="mt-6 space-y-2">
        {names.map((name) => (
          <li key={name} className="font-serif text-xl text-ink sm:text-2xl">
            {name}
          </li>
        ))}
      </ul>
    </motion.article>
  );
}

export function Families() {
  return (
    <SectionReveal id="families" className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-24">
      <p className="label-caps text-center text-gold">{t("families")}</p>
      <h2 className="mt-3 text-center font-script text-4xl text-ink sm:text-5xl">
        With love &amp; gratitude
      </h2>
      <p className="mx-auto mt-4 max-w-md text-center font-serif text-base text-ink/70">
        We are honoured to celebrate surrounded by the families who shaped us.
      </p>

      <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:gap-8">
        <FamilyCard
          side={siteConfig.parents.groom.side}
          names={siteConfig.parents.groom.names}
          delay={0}
        />
        <FamilyCard
          side={siteConfig.parents.bride.side}
          names={siteConfig.parents.bride.names}
          delay={0.12}
        />
      </div>
    </SectionReveal>
  );
}
