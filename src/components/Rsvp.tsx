"use client";

import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { SectionReveal } from "@/components/ui/SectionReveal";
import { t } from "@/i18n";
import { rsvpSchema } from "@/lib/rsvp-schema";
import type { ClientGuest } from "@/types/guest";

type RsvpProps = {
  guest: ClientGuest;
  onPublicWish?: (wish: { name: string; message: string }) => void;
};

export function Rsvp({ guest, onPublicWish }: RsvpProps) {
  const [name, setName] = useState(guest.displayName === "Dear Guest" ? "" : guest.displayName);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [attending, setAttending] = useState<"yes" | "no">("yes");
  const [guestCount, setGuestCount] = useState(1);
  const [message, setMessage] = useState("");
  const [publicWish, setPublicWish] = useState(false);
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setName(guest.displayName === "Dear Guest" ? "" : guest.displayName);
  }, [guest.displayName]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;
    setError("");
    setFieldErrors({});

    const payload = {
      name,
      email,
      phone,
      attending,
      guestCount: attending === "no" ? 1 : guestCount,
      message,
      publicWish,
      slug: guest.slug,
      website,
    };

    const parsed = rsvpSchema.safeParse(payload);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        errs[key] = issue.message;
      }
      setFieldErrors(errs);
      setStatus("error");
      setError("Please check the form and try again.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      setStatus("success");
      const wishText = parsed.data.message?.trim() ?? "";
      if (parsed.data.publicWish && wishText) {
        onPublicWish?.({ name: parsed.data.name, message: wishText });
      }
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: ["#E6C987", "#B8923F", "#C9D3C0", "#F3DCD8"],
      });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <SectionReveal id="rsvp" className="mx-auto max-w-xl px-6 py-20">
      <p className="label-caps text-center text-gold-dark">{t("rsvp")}</p>
      <h2 className="font-script mt-2 text-center text-4xl text-ink sm:text-5xl">
        {t("attending")}
      </h2>

      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="ok"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card gold-border mt-10 rounded-sm px-6 py-10 text-center"
            role="status"
            aria-live="polite"
          >
            <p className="font-script text-3xl text-wax">{t("thankYou")}</p>
            <p className="mt-3 font-serif text-lg text-ink/80">{t("success")}</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            className="glass-card gold-border mt-10 space-y-5 rounded-sm p-6 sm:p-8"
            noValidate
          >
            <div>
              <label className="label-caps text-gold-dark" htmlFor="rsvp-name">
                Name
              </label>
              <input
                id="rsvp-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-sm border border-champagne bg-white/70 px-3 py-2.5 font-serif"
                required
                maxLength={60}
              />
              {fieldErrors.name && <p className="mt-1 text-sm text-wax">{fieldErrors.name}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label-caps text-gold-dark" htmlFor="rsvp-email">
                  Email
                </label>
                <input
                  id="rsvp-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-sm border border-champagne bg-white/70 px-3 py-2.5 font-serif"
                />
              </div>
              <div>
                <label className="label-caps text-gold-dark" htmlFor="rsvp-phone">
                  Phone
                </label>
                <input
                  id="rsvp-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-2 w-full rounded-sm border border-champagne bg-white/70 px-3 py-2.5 font-serif"
                />
              </div>
            </div>

            <div>
              <p className="label-caps text-gold-dark">{t("attending")}</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {(["yes", "no"] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setAttending(value)}
                    className={`rounded-sm px-3 py-3 font-serif text-sm transition ${
                      attending === value
                        ? "bg-gold text-ivory"
                        : "border border-champagne bg-white/50 text-ink"
                    }`}
                  >
                    {value === "yes" ? t("yes") : t("no")}
                  </button>
                ))}
              </div>
            </div>

            {attending === "yes" && (
              <div>
                <label className="label-caps text-gold-dark" htmlFor="rsvp-count">
                  {t("guests")}
                </label>
                <input
                  id="rsvp-count"
                  type="number"
                  min={1}
                  max={10}
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="mt-2 w-full rounded-sm border border-champagne bg-white/70 px-3 py-2.5 font-serif"
                />
              </div>
            )}

            <div>
              <label className="label-caps text-gold-dark" htmlFor="rsvp-msg">
                {t("message")}
              </label>
              <textarea
                id="rsvp-msg"
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 500))}
                rows={3}
                className="mt-2 w-full rounded-sm border border-champagne bg-white/70 px-3 py-2.5 font-serif"
              />
            </div>

            <label className="flex items-start gap-3 font-serif text-sm text-ink/80">
              <input
                type="checkbox"
                checked={publicWish}
                onChange={(e) => setPublicWish(e.target.checked)}
                className="mt-1"
              />
              {t("publicWish")}
            </label>

            {/* honeypot */}
            <input
              type="text"
              name="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="absolute left-[-9999px] h-0 w-0 opacity-0"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
            />

            {error && (
              <p className="text-sm text-wax" role="alert" aria-live="assertive">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-sm bg-gradient-to-r from-gold-light via-gold to-gold-dark px-4 py-3 font-serif text-ivory transition hover:opacity-95 disabled:opacity-60"
            >
              {status === "loading" ? t("submitting") : t("submit")}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </SectionReveal>
  );
}
