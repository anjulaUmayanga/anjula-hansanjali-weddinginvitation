"use client";

import confetti from "canvas-confetti";
import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

import { OrnateName } from "@/components/ui/OrnateName";
import { ScriptName } from "@/components/ui/ScriptName";
import { siteConfig } from "@/data/config";
import { t } from "@/i18n";
import type { ClientGuest } from "@/types/guest";

const INTRO_KEY = "wedding-intro-seen";

type EnvelopeIntroProps = {
  guest: ClientGuest;
  active: boolean;
  onComplete: () => void;
};

type Phase = "idle" | "opening" | "done";

export function hasSeenIntro(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(INTRO_KEY) === "1";
  } catch {
    return false;
  }
}

export function markIntroSeen() {
  try {
    sessionStorage.setItem(INTRO_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function clearIntroSeen() {
  try {
    sessionStorage.removeItem(INTRO_KEY);
  } catch {
    /* ignore */
  }
}

function GoldDust({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = true;
    const particles = Array.from({ length: 28 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.5 + Math.random() * 1.2,
      vx: (Math.random() - 0.5) * 0.0003,
      vy: -0.00012 - Math.random() * 0.00028,
      a: 0.2 + Math.random() * 0.4,
    }));

    const resize = () => {
      canvas.width = window.innerWidth * devicePixelRatio;
      canvas.height = window.innerHeight * devicePixelRatio;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const onVis = () => {
      running = !document.hidden;
      if (running) loop();
    };
    document.addEventListener("visibilitychange", onVis);

    const loop = () => {
      if (!running) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -0.02) p.y = 1.02;
        if (p.x < 0) p.x = 1;
        if (p.x > 1) p.x = 0;
        ctx.beginPath();
        ctx.fillStyle = `rgba(168, 122, 122, ${p.a})`;
        ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [active]);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 opacity-60" aria-hidden />;
}

function playCrackSound() {
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.18);
    gain.gain.setValueAtTime(0.07, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.22);
    void ctx.resume();
  } catch {
    /* ignore */
  }
}

export function EnvelopeIntro({ guest, active, onComplete }: EnvelopeIntroProps) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const finishing = useRef(false);

  const finish = useCallback(() => {
    if (finishing.current) return;
    finishing.current = true;
    markIntroSeen();
    setPhase("done");
    onComplete();
  }, [onComplete]);

  const startOpen = useCallback(() => {
    if (phase !== "idle") return;
    setPhase("opening");
    playCrackSound();

    if (reduce) {
      window.setTimeout(finish, 200);
      return;
    }

    window.setTimeout(() => {
      confetti({
        particleCount: 42,
        spread: 68,
        origin: { y: 0.48 },
        colors: ["#E6C987", "#C4A0A0", "#F0E0DC", "#B8923F", "#A87A7A"],
        disableForReducedMotion: true,
      });
    }, 2600);

    window.setTimeout(finish, 4200);
  }, [phase, reduce, finish]);

  useEffect(() => {
    if (!active || reduce) return;
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 6;
      const y = (e.clientY / window.innerHeight - 0.5) * -4;
      setTilt({ x: y, y: x });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [active, reduce]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        startOpen();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, startOpen]);

  const opening = phase === "opening";

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden px-5"
      style={{
        background:
          "radial-gradient(ellipse 75% 55% at 50% 35%, rgba(196,160,160,0.28), transparent 58%), radial-gradient(ellipse 50% 40% at 80% 90%, rgba(232,208,204,0.35), transparent 50%), #FBF6F2",
      }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.65 }}
      aria-modal
      role="dialog"
      aria-label={t("youAreInvited")}
    >
      <GoldDust active={!reduce && phase === "idle"} />

      <button
        type="button"
        onClick={finish}
        className="label-caps absolute top-[max(1rem,env(safe-area-inset-top))] right-4 z-20 rounded-full px-3 py-1.5 text-ink/45 transition hover:bg-white/50 hover:text-ink"
      >
        {t("skip")}
      </button>

      <motion.div
        className="relative flex w-full max-w-[340px] flex-col items-center"
        style={{
          perspective: 1200,
          transform: reduce ? undefined : `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        }}
        animate={
          opening && !reduce
            ? { y: 70, opacity: 0, transition: { delay: 1.7, duration: 1.1 } }
            : { y: 0, opacity: 1 }
        }
      >
        {/* Guest greeting first — clearer hierarchy */}
        <motion.div
          className="mb-5 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: opening ? 0 : 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="label-caps text-maroon-muted">{t("youAreInvited")}</p>
          {!guest.isFallback && (
            <div className="mt-3">
              <OrnateName as="p" size="md">
                {guest.displayName}
              </OrnateName>
            </div>
          )}
        </motion.div>

        {/* Envelope card */}
        <div
          className="relative h-[260px] w-full"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Body — soft maroon / blush paper */}
          <div
            className="absolute inset-0 overflow-hidden rounded-md shadow-[0_22px_48px_rgba(61,46,46,0.18)]"
            style={{
              background: "linear-gradient(165deg, #F0E0DC 0%, #E8D0CC 42%, #C4A0A0 100%)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -10px 20px rgba(139,85,88,0.12)",
            }}
          >
            <svg className="absolute inset-0 h-full w-full opacity-30" aria-hidden>
              <defs>
                <pattern id="env-floral" width="36" height="36" patternUnits="userSpaceOnUse">
                  <path
                    d="M18 6c2 4 5 5 5 11s-3 7-5 11c-2-4-5-5-5-11s3-7 5-11z"
                    fill="none"
                    stroke="#8B5558"
                    strokeWidth="0.55"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#env-floral)" />
            </svg>
          </div>

          {/* Letter */}
          <motion.div
            className="absolute inset-x-[9%] top-[16%] z-[2] flex h-[62%] flex-col items-center justify-center rounded-sm border border-gold-light/60 bg-ivory px-4 text-center shadow-lg"
            initial={{ y: 36, opacity: 0, scale: 0.92 }}
            animate={
              opening
                ? reduce
                  ? { y: 0, opacity: 1, scale: 1.35 }
                  : {
                      y: [36, -18, -36],
                      opacity: [0, 1, 1],
                      scale: [0.92, 1, 1.75],
                      transition: { delay: 0.95, duration: 2.1, times: [0, 0.35, 1] },
                    }
                : { y: 36, opacity: 0 }
            }
          >
            <p className="label-caps text-maroon-muted">With love</p>
            <ScriptName className="mt-2 text-3xl text-ink sm:text-4xl">
              {siteConfig.couple.displayNames}
            </ScriptName>
            <p className="mt-2 font-serif text-xs text-ink/65 sm:text-sm">
              {siteConfig.weddingDateLabel}
            </p>
          </motion.div>

          <motion.div
            className="pointer-events-none absolute inset-[-18%] z-[5] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(196,160,160,0.75) 0%, rgba(251,246,242,0.35) 45%, transparent 70%)",
            }}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={
              opening
                ? {
                    opacity: [0, 0, 1, 0],
                    scale: [0.4, 0.4, 1.55, 2.1],
                    transition: { delay: 2.5, duration: 1.3 },
                  }
                : { opacity: 0 }
            }
          />

          {/* Flap */}
          <motion.div
            className="absolute inset-x-0 top-0 z-[3] h-[46%] origin-top"
            style={{
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              background: "linear-gradient(180deg, #F3E6E2 0%, #E0C8C4 100%)",
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
              boxShadow: "0 1px 0 rgba(230,201,135,0.55)",
            }}
            animate={
              opening && !reduce
                ? { rotateX: 180, transition: { delay: 0.35, duration: 1.05, ease: [0.4, 0, 0.2, 1] } }
                : { rotateX: 0 }
            }
          >
            <motion.div
              className="absolute inset-0"
              animate={
                opening
                  ? { backgroundColor: "rgba(61,46,46,0.22)" }
                  : { backgroundColor: "rgba(0,0,0,0)" }
              }
              transition={{ delay: 0.35, duration: 1.05 }}
            />
          </motion.div>

          {/* Large tap target — wax seal */}
          <div className="absolute left-1/2 top-[44%] z-[6] -translate-x-1/2 -translate-y-1/2">
            <motion.button
              type="button"
              aria-label={t("tapSeal")}
              disabled={phase !== "idle"}
              onClick={startOpen}
              className="relative flex h-[88px] w-[88px] items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-maroon-muted disabled:cursor-default"
              initial={{ scale: 1 }}
              animate={
                opening
                  ? { scale: 0.85, opacity: 0, y: 40, transition: { duration: 0.55 } }
                  : reduce
                    ? { scale: 1 }
                    : { scale: [1, 1.06, 1], transition: { duration: 2.2, repeat: Infinity } }
              }
              whileTap={phase === "idle" ? { scale: 0.92 } : undefined}
            >
              {!opening && !reduce && (
                <motion.span
                  className="pointer-events-none absolute inset-[-10px] rounded-full border border-maroon-soft/50"
                  animate={{ scale: [1, 1.35], opacity: [0.55, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  aria-hidden
                />
              )}
              <svg width="80" height="80" viewBox="0 0 72 72" className="drop-shadow-lg">
                <defs>
                  <radialGradient id="wax-main" cx="35%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#D98A8A" />
                    <stop offset="55%" stopColor="#C45C5C" />
                    <stop offset="100%" stopColor="#8B3A3A" />
                  </radialGradient>
                </defs>
                <path
                  d="M36 6c8 0 12 3 16 5 5 3 10 4 12 10 2 6 1 11-1 16 2 5 3 10 0 15-3 6-8 8-13 11-4 2-8 5-14 5s-10-3-14-5c-5-3-10-5-13-11-3-5-2-10 0-15-2-5-3-10-1-16 2-6 7-7 12-10 4-2 8-5 16-5z"
                  fill="url(#wax-main)"
                />
                <circle cx="36" cy="36" r="22" fill="none" stroke="#E6C987" strokeWidth="1.3" opacity="0.9" />
                <text
                  x="36"
                  y="42"
                  textAnchor="middle"
                  fill="#FBF6F2"
                  fontSize="15"
                  style={{ fontFamily: "var(--font-allura), cursive" }}
                >
                  {siteConfig.couple.initials}
                </text>
                <ellipse cx="26" cy="22" rx="8" ry="4" fill="white" opacity="0.28" />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Primary CTA */}
        <motion.div
          className="mt-8 flex flex-col items-center gap-3 text-center"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: opening ? 0 : 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
        >
          <button
            type="button"
            onClick={startOpen}
            disabled={phase !== "idle"}
            className="rounded-full bg-gradient-to-r from-maroon-soft via-maroon-muted to-maroon-deep px-7 py-3 font-serif text-sm tracking-wide text-ivory shadow-soft transition hover:opacity-95 disabled:opacity-60"
          >
            Open invitation
          </button>
          <p className="label-caps text-[0.65rem] text-ink/40">{t("tapSeal")}</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
