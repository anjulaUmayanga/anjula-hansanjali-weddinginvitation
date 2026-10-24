"use client";

import { Radio } from "lucide-react";
import { useEffect, useState } from "react";

import { siteConfig } from "@/data/config";
import { t } from "@/i18n";


function isWeddingDay(now: Date): boolean {
  const wedding = new Date(siteConfig.weddingDateISO);
  return (
    now.getFullYear() === wedding.getFullYear() &&
    now.getMonth() === wedding.getMonth() &&
    now.getDate() === wedding.getDate()
  );
}

export function WeddingDayBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(isWeddingDay(new Date()));
  }, []);

  if (!show) return null;

  return (
    <div className="safe-pt fixed inset-x-0 top-0 z-[55] px-4 pt-2">
      <a
        href={siteConfig.livestreamUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mx-auto flex max-w-lg items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light px-4 py-2.5 text-center font-serif text-sm text-ivory shadow-soft transition hover:opacity-95 sm:text-base"
      >
        <Radio className="h-4 w-4 shrink-0 animate-pulse motion-reduce:animate-none" aria-hidden />
        {t("weddingDayBanner")}
      </a>
    </div>
  );
}
