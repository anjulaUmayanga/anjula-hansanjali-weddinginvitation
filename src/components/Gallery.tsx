"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";

import { OrnateName } from "@/components/ui/OrnateName";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { siteConfig } from "@/data/config";
import { t } from "@/i18n";

export function Gallery() {
  const reduce = useReducedMotion();
  const photos = siteConfig.photos.gallery;
  const [selected, setSelected] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const autoplay = useMemo(
    () =>
      Autoplay({
        delay: 4200,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    [],
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center", skipSnaps: false },
    reduce ? [] : [autoplay],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowLeft") setLightbox((i) => (i === null ? null : (i + photos.length - 1) % photos.length));
      if (e.key === "ArrowRight") setLightbox((i) => (i === null ? null : (i + 1) % photos.length));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, photos.length]);

  return (
    <SectionReveal id="gallery" className="relative w-full overflow-hidden py-20 sm:py-24">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 50% 100%, rgba(196,160,160,0.16), transparent 60%)",
        }}
        aria-hidden
      />

      <div className="mx-auto max-w-4xl px-6 text-center">
        <p className="label-caps text-maroon-muted">{t("gallery")}</p>
        <div className="mt-3 flex justify-center">
          <OrnateName as="h2" size="lg">
            Moments we cherish
          </OrnateName>
        </div>
        <p className="mx-auto mt-4 max-w-md font-serif text-base italic text-ink/60">
          A few frames from our journey — swipe or tap to explore.
        </p>
      </div>

      <div className="relative mx-auto mt-12 w-full max-w-5xl">
        <div className="overflow-hidden px-2 sm:px-6 lg:px-10" ref={emblaRef}>
          <div className="flex touch-pan-y">
            {photos.map((src, index) => {
              const active = index === selected;
              return (
                <div
                  key={src}
                  className="min-w-0 shrink-0 grow-0 basis-[78%] px-2 sm:basis-[42%] md:basis-[32%] lg:basis-[28%] xl:basis-[26%]"
                >
                  <motion.button
                    type="button"
                    onClick={() => setLightbox(index)}
                    className={`group relative mx-auto aspect-[3/4] w-full max-w-[260px] overflow-hidden rounded-sm border transition duration-500 sm:max-w-[250px] lg:max-w-[280px] xl:max-w-[300px] ${
                      active
                        ? "border-maroon-soft/70 shadow-soft scale-100"
                        : "border-transparent scale-[0.92] opacity-55"
                    }`}
                    aria-label={`View photo ${index + 1}`}
                  >
                    <PhotoFrame
                      src={src}
                      alt={`Gallery photo ${index + 1}`}
                      index={index}
                      sizes="(max-width: 640px) 78vw, (max-width: 1024px) 30vw, 22vw"
                      className="transition duration-700 group-hover:scale-105"
                    />
                    <div
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent opacity-80"
                      aria-hidden
                    />
                    <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-ivory/85 text-ink opacity-0 transition group-hover:opacity-100">
                      <Maximize2 className="h-4 w-4" aria-hidden />
                    </span>
                    <span className="absolute bottom-3 left-3 label-caps text-[0.6rem] text-ivory/90">
                      {String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
                    </span>
                  </motion.button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Controls */}
        <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-4 px-6">
          <button
            type="button"
            onClick={scrollPrev}
            className="gold-border flex h-11 w-11 items-center justify-center rounded-full bg-white/70 text-ink transition hover:bg-blush"
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2" role="tablist" aria-label="Gallery slides">
            {photos.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === selected}
                onClick={() => scrollTo(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === selected
                    ? "w-7 bg-maroon-muted"
                    : "w-1.5 bg-maroon-soft/45 hover:bg-maroon-soft"
                }`}
                aria-label={`Go to photo ${i + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={scrollNext}
            className="gold-border flex h-11 w-11 items-center justify-center rounded-full bg-white/70 text-ink transition hover:bg-blush"
            aria-label="Next photo"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/85 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            role="dialog"
            aria-modal
            aria-label={t("gallery")}
          >
            <button
              type="button"
              className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))] rounded-full bg-ivory/10 p-2 text-ivory hover:bg-ivory/20"
              onClick={() => setLightbox(null)}
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
            <button
              type="button"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-ivory/10 p-2 text-ivory hover:bg-ivory/20 sm:left-6"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((i) => (i === null ? null : (i + photos.length - 1) % photos.length));
              }}
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-7 w-7" />
            </button>
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-ivory/10 p-2 text-ivory hover:bg-ivory/20 sm:right-6"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((i) => (i === null ? null : (i + 1) % photos.length));
              }}
              aria-label="Next photo"
            >
              <ChevronRight className="h-7 w-7" />
            </button>
            <motion.div
              className="relative aspect-[3/4] max-h-[85dvh] w-full max-w-lg overflow-hidden rounded-sm border border-maroon-soft/40"
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <PhotoFrame
                src={photos[lightbox]}
                alt={`Gallery photo ${lightbox + 1}`}
                index={lightbox}
                sizes="90vw"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionReveal>
  );
}
