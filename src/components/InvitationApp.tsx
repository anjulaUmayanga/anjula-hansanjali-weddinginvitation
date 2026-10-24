"use client";

import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";

import { Countdown } from "@/components/Countdown";
import { DotNav } from "@/components/DotNav";
import { clearIntroSeen, hasSeenIntro } from "@/components/EnvelopeIntro";
import { Families } from "@/components/Families";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Hero } from "@/components/Hero";
import { MusicButton } from "@/components/MusicButton";
import { Petals } from "@/components/Petals";
import { Rsvp } from "@/components/Rsvp";
import { Schedule } from "@/components/Schedule";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SparkleCursor } from "@/components/SparkleCursor";
import { Story } from "@/components/Story";
import { Venue } from "@/components/Venue";
import { WeddingDayBanner } from "@/components/WeddingDayBanner";
import { WishesWall } from "@/components/WishesWall";
import { useGuest } from "@/hooks/useGuest";
import { useLenis } from "@/hooks/useLenis";
import { useMusic } from "@/hooks/useMusic";
import { t } from "@/i18n";
import type { ClientGuest } from "@/types/guest";

const EnvelopeIntroLazy = dynamic(
  () => import("@/components/EnvelopeIntro").then((m) => m.EnvelopeIntro),
  { ssr: false },
);

type InvitationAppProps = {
  guest: ClientGuest;
};

export function InvitationApp({ guest: initialGuest }: InvitationAppProps) {
  const { guest, customName, setCustomName, needsName } = useGuest(initialGuest);
  const [introActive, setIntroActive] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const [siteReady, setSiteReady] = useState(false);
  const { playing, play, toggle } = useMusic({ enabled: true });
  const [newWish, setNewWish] = useState<{ name: string; message: string } | null>(null);

  useEffect(() => {
    const seen = hasSeenIntro();
    setIntroActive(!seen);
    setSiteReady(seen);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (introActive) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [introActive]);

  useLenis(siteReady && !introActive);

  const handleIntroComplete = useCallback(() => {
    setIntroActive(false);
    window.scrollTo(0, 0);
    setSiteReady(true);
    void play(2000);
  }, [play]);

  const handleReplay = useCallback(() => {
    clearIntroSeen();
    setSiteReady(false);
    setIntroActive(true);
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <AnimatePresence>
        {hydrated && introActive && (
          <EnvelopeIntroLazy
            key="envelope-intro"
            guest={guest}
            active
            onComplete={handleIntroComplete}
          />
        )}
      </AnimatePresence>

      <div
        className={`relative ${introActive ? "max-h-dvh overflow-hidden pointer-events-none select-none" : ""}`}
        aria-hidden={introActive || undefined}
      >
        <ScrollProgress />
        {!introActive && <DotNav />}
        <SparkleCursor />
        {!introActive && <Petals />}
        {!introActive && <WeddingDayBanner />}

        <MusicButton
          playing={playing}
          onToggle={toggle}
          visible={siteReady && !introActive}
        />

        <main>
          <Hero guest={guest} />

          {needsName && (
            <div className="mx-auto max-w-md px-6 py-4">
              <label className="label-caps text-maroon-muted" htmlFor="guest-name">
                {t("enterName")}
              </label>
              <input
                id="guest-name"
                value={customName}
                onChange={(e) => setCustomName(e.target.value.slice(0, 60))}
                className="gold-border mt-2 w-full rounded-sm bg-white/70 px-4 py-3 font-serif text-lg outline-none focus:ring-2 focus:ring-maroon-soft/50"
                placeholder={t("dearGuest")}
                maxLength={60}
              />
            </div>
          )}

          <Countdown guest={guest} />
          <Story />
          <Families />
          <Schedule />
          <Gallery />
          <Venue />
          <Rsvp guest={guest} onPublicWish={setNewWish} />
          <WishesWall incoming={newWish} />
          <Footer onReplay={handleReplay} />
        </main>
      </div>
    </>
  );
}
