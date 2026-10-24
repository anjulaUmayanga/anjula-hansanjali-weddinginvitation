"use client";

import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";

export type Wish = {
  name: string;
  message: string;
};

const PAGE_SIZE = 4;

function mergeWish(list: Wish[], incoming: Wish | null): Wish[] {
  if (!incoming?.message.trim()) return list;
  const rest = list.filter(
    (wish) => !(wish.name === incoming.name && wish.message === incoming.message),
  );
  return [incoming, ...rest];
}

function FloralCorner({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 180 180" className={className} aria-hidden>
      <g fill="none" stroke="#C4A882" strokeWidth="1.1" strokeLinecap="round">
        <path d="M20 150c30-10 48-38 42-78 18 8 34 6 52-8-8 28-6 52 10 74" />
        <path d="M36 128c18-22 22-48 12-72" />
        <path d="M58 118c14-16 16-36 8-54" />
      </g>
      <g fill="#E7D3B0" stroke="#C4A882" strokeWidth="0.6">
        <ellipse cx="48" cy="62" rx="7" ry="14" transform="rotate(-30 48 62)" />
        <ellipse cx="70" cy="48" rx="6" ry="12" transform="rotate(20 70 48)" />
        <ellipse cx="34" cy="84" rx="6" ry="11" transform="rotate(-70 34 84)" />
        <circle cx="52" cy="70" r="4" fill="#F4E7D4" />
      </g>
      <g fill="#D7C4A4">
        <circle cx="92" cy="36" r="2.2" />
        <circle cx="28" cy="108" r="1.8" />
        <circle cx="78" cy="96" r="1.6" />
      </g>
    </svg>
  );
}

function CardSprig() {
  return (
    <svg viewBox="0 0 48 56" className="h-10 w-9 text-[#C4A882]" aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
        <path d="M24 50c0-16 2-28 8-40" />
        <path d="M24 50c2-14-4-24-12-32" />
      </g>
      <ellipse cx="30" cy="16" rx="5" ry="9" fill="#E8D7BE" stroke="#C4A882" strokeWidth="0.6" transform="rotate(25 30 16)" />
      <ellipse cx="16" cy="26" rx="4.5" ry="8" fill="#EFE2CF" stroke="#C4A882" strokeWidth="0.6" transform="rotate(-35 16 26)" />
      <ellipse cx="28" cy="32" rx="4" ry="7" fill="#F3E8D8" stroke="#C4A882" strokeWidth="0.6" transform="rotate(15 28 32)" />
    </svg>
  );
}

function WishCard({ wish }: { wish: Wish }) {
  return (
    <article className="relative flex min-h-[210px] flex-col rounded-[18px] border border-[#D7C4A2] bg-[#FFFcf7] px-6 py-6 text-left shadow-[0_8px_24px_rgba(139,106,62,0.06)] sm:min-h-[230px] sm:px-7 sm:py-7">
      <span className="font-serif text-4xl leading-none text-[#C4A36A]" aria-hidden>
        “
      </span>
      <span className="absolute right-4 top-4 opacity-80">
        <CardSprig />
      </span>
      <p className="mt-2 max-w-[92%] font-serif text-[0.98rem] leading-relaxed text-[#5C4A3A] sm:text-[1.05rem]">
        {wish.message}
      </p>
      <div className="mt-auto pt-6">
        <p className="font-serif text-[1.02rem] font-semibold text-[#3F3228]">{wish.name}</p>
        <div className="mt-2 flex items-center gap-2 text-[#C4A36A]" aria-hidden>
          <span className="h-px w-10 bg-[#C4A36A]/80" />
          <svg viewBox="0 0 16 10" className="h-2.5 w-4">
            <path d="M1 7c3-4 5-4 7 0 2-4 4-4 7 0" fill="none" stroke="currentColor" strokeWidth="0.8" />
          </svg>
        </div>
      </div>
      <Heart className="absolute bottom-4 right-4 h-3.5 w-3.5 text-[#C4A36A]" strokeWidth={1.5} aria-hidden />
    </article>
  );
}

export function WishesWall({ incoming = null }: { incoming?: Wish | null }) {
  const reduce = useReducedMotion();
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  const load = useCallback(async (prefer?: Wish | null) => {
    try {
      const res = await fetch("/api/wishes", { cache: "no-store" });
      if (!res.ok) throw new Error("fetch failed");
      const data = (await res.json()) as { wishes?: Wish[] };
      setWishes(mergeWish(data.wishes ?? [], prefer ?? null));
    } catch {
      if (prefer?.message.trim()) {
        setWishes((current) => mergeWish(current, prefer));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(null);
  }, [load]);

  useEffect(() => {
    if (!incoming?.message.trim()) return;
    setWishes((current) => mergeWish(current, incoming));
    setLoading(false);
    setPage(0);
    void load(incoming);
  }, [incoming, load]);

  const pages = Math.max(1, Math.ceil(wishes.length / PAGE_SIZE));
  const safePage = Math.min(page, pages - 1);
  const visible = useMemo(
    () => wishes.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE),
    [wishes, safePage],
  );

  if (loading || wishes.length === 0) return null;

  return (
    <section className="relative overflow-hidden px-5 py-16 sm:px-8 sm:py-24">
      <FloralCorner className="pointer-events-none absolute -left-6 -top-2 h-40 w-40 opacity-80 sm:h-52 sm:w-52" />
      <FloralCorner className="pointer-events-none absolute -right-6 -top-2 h-40 w-40 -scale-x-100 opacity-80 sm:h-52 sm:w-52" />

      <div className="relative mx-auto max-w-4xl text-center">
        <div className="flex items-center justify-center gap-3 text-[#C4A36A]">
          <span className="h-px w-10 bg-[#C4A36A]/70 sm:w-16" />
          <p className="label-caps text-[0.68rem] tracking-[0.42em] text-[#B8923F]">Wishes</p>
          <span className="h-px w-10 bg-[#C4A36A]/70 sm:w-16" />
        </div>
        <Heart className="mx-auto mt-2 h-3.5 w-3.5 text-[#C4A36A]" strokeWidth={1.4} aria-hidden />

        <h2 className="mt-2 font-script text-[clamp(2.4rem,6vw,3.6rem)] leading-none text-[#3C2A22]">
          Words from our loved ones
        </h2>
        <p className="mx-auto mt-4 max-w-xl font-serif text-base leading-relaxed text-[#6B5848] sm:text-lg">
          Your kind words, wishes and blessings mean the world to us.
          <br />
          Thank you for being part of our special journey.
        </p>

        <AnimatePresence mode="wait">
          <motion.ul
            key={safePage}
            className="mt-10 grid gap-4 text-left sm:grid-cols-2 sm:gap-5"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          >
            {visible.map((wish, index) => (
              <li key={`${wish.name}-${wish.message}-${index}`}>
                <WishCard wish={wish} />
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>

        {pages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setPage((current) => (current - 1 + pages) % pages)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D7C4A2] bg-[#FFFCF7] text-[#8C6A25] transition hover:bg-[#F8F1E6]"
              aria-label="Previous wishes"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2" role="tablist" aria-label="Wish pages">
              {Array.from({ length: pages }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  role="tab"
                  aria-selected={index === safePage}
                  aria-label={`Wish page ${index + 1}`}
                  onClick={() => setPage(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === safePage ? "w-2 bg-[#8C6A25]" : "w-2 bg-[#E4D3B8]"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setPage((current) => (current + 1) % pages)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D7C4A2] bg-[#FFFCF7] text-[#8C6A25] transition hover:bg-[#F8F1E6]"
              aria-label="Next wishes"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
