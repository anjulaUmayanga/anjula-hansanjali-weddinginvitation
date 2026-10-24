"use client";

import { QrCode, RotateCcw, Share2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { useCallback, useState } from "react";

import { OrnateName } from "@/components/ui/OrnateName";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { siteConfig } from "@/data/config";
import { t } from "@/i18n";
import { titleCaseName } from "@/lib/text";

type FooterProps = {
  onReplay: () => void;
};

export function Footer({ onReplay }: FooterProps) {
  const [qrOpen, setQrOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pageUrl, setPageUrl] = useState("");

  const ensureUrl = useCallback(() => {
    if (typeof window !== "undefined" && !pageUrl) {
      setPageUrl(window.location.href);
    }
    return pageUrl || (typeof window !== "undefined" ? window.location.href : "");
  }, [pageUrl]);

  const handleShare = async () => {
    const url = ensureUrl();
    const title = `${siteConfig.couple.displayNames} Wedding`;
    const text = siteConfig.thankYouMessage;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        /* user cancelled or unsupported */
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const openQr = () => {
    ensureUrl();
    setQrOpen(true);
  };

  return (
    <SectionReveal
      id="footer"
      as="section"
      className="mx-auto w-full max-w-3xl px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-16 text-center"
    >
      <div className="flex justify-center [&_.font-script]:gold-text">
        <OrnateName as="h2" size="lg">
          {titleCaseName(siteConfig.couple.displayNames)}
        </OrnateName>
      </div>
      <p className="label-caps mt-4 text-gold-dark">{t("thankYou")}</p>
      <p className="mx-auto mt-4 max-w-md font-serif text-lg leading-relaxed text-ink/75">
        {siteConfig.thankYouMessage}
      </p>

      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
        <button
          type="button"
          onClick={handleShare}
          className="glass-card gold-border inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-full px-5 py-3 font-serif text-ink transition hover:border-gold sm:w-auto"
        >
          <Share2 className="h-4 w-4 text-gold" aria-hidden />
          {copied ? "Link copied" : t("share")}
        </button>
        <button
          type="button"
          onClick={openQr}
          className="glass-card gold-border inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-full px-5 py-3 font-serif text-ink transition hover:border-gold sm:w-auto"
        >
          <QrCode className="h-4 w-4 text-gold" aria-hidden />
          QR
        </button>
       
      </div>

      <p className="label-caps mt-14 text-ink/40">{siteConfig.weddingDateLabel}</p>

      <AnimatePresence>
        {qrOpen && (
          <motion.div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-ink/60 p-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setQrOpen(false)}
            role="dialog"
            aria-modal
            aria-label="QR code"
          >
            <motion.div
              className="glass-card gold-border relative max-w-sm rounded-sm p-8"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="absolute right-3 top-3 rounded-full p-1 text-ink/50 hover:text-ink"
                onClick={() => setQrOpen(false)}
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              <p className="font-serif text-lg text-ink">Scan to open invitation</p>
              <div className="mt-6 flex justify-center rounded-sm bg-white p-4">
                <QRCodeSVG value={ensureUrl()} size={200} level="M" includeMargin />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionReveal>
  );
}
