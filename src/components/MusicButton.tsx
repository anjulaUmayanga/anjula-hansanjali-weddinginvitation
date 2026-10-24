"use client";

import { Music, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

import { t } from "@/i18n";

type MusicButtonProps = {
  playing: boolean;
  onToggle: () => void;
  visible: boolean;
};

function EqualizerBars() {
  return (
    <span className="flex h-4 items-end gap-0.5" aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-0.5 rounded-full bg-gold"
          animate={{ height: ["40%", "100%", "55%"] }}
          transition={{
            duration: 0.55,
            repeat: Infinity,
            delay: i * 0.12,
            ease: "easeInOut",
          }}
        />
      ))}
    </span>
  );
}

export function MusicButton({ playing, onToggle, visible }: MusicButtonProps) {
  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={onToggle}
      className="glass-card gold-border fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-50 flex h-14 w-14 items-center justify-center rounded-full text-ink shadow-glass transition hover:border-gold"
      aria-label={playing ? t("musicOff") : t("musicOn")}
      aria-pressed={playing}
    >
      {playing ? (
        <EqualizerBars />
      ) : (
        <VolumeX className="h-5 w-5 text-gold-dark" aria-hidden />
      )}
      <span className="sr-only">{playing ? t("musicOff") : t("musicOn")}</span>
      <Music className="sr-only" aria-hidden />
    </button>
  );
}
