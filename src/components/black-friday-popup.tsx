"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Gift, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FEATURES } from "@/lib/features";

const STORAGE_KEY   = "revstore_black_friday_popup_v1";
const DISMISS_HOURS = 24;

/** Headline "from" price for the campaign, in naira. */
const FROM_PRICE = 295_000;

/**
 * Pre-Black Friday laptop promo modal.
 * Controlled by FEATURES.blackFridayPopup (src/lib/features.ts); set it to false when the campaign ends.
 */
export function BlackFridayPopup() {
  if (!FEATURES.blackFridayPopup) return null;
  return <BlackFridayPopupModal />;
}

function BlackFridayPopupModal() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show after 2.5s; suppress for DISMISS_HOURS after dismissal
    const t = setTimeout(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const { at } = JSON.parse(raw);
          if ((Date.now() - at) / 36e5 < DISMISS_HOURS) return;
        }
      } catch { /* ignore */ }
      setVisible(true);
    }, 2500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") dismiss(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible]);

  function dismiss() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ at: Date.now() })); } catch { /**/ }
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[190] bg-black/75 backdrop-blur-sm"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={dismiss}
            transition={{ duration: 0.3 }}
          />

          <div className="pointer-events-none fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              animate={{ opacity: 1, scale: 1, y: 0 }}
              aria-labelledby="bf-popup-title"
              aria-modal="true"
              className="pointer-events-auto relative w-full max-w-[560px]"
              exit={{ opacity: 0, scale: 0.95, y: 24 }}
              initial={{ opacity: 0, scale: 0.93, y: 32 }}
              role="dialog"
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="relative overflow-hidden rounded-3xl bg-[#0d0d0f] shadow-[0_40px_100px_rgba(0,0,0,0.7)]">
                {/* Glows */}
                <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-rev-orange opacity-20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-maroon-bright opacity-40 blur-3xl" />

                <button
                  aria-label="Close"
                  className="absolute right-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/60 transition hover:bg-white/20 hover:text-white"
                  onClick={dismiss}
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="relative z-10 p-7 text-center sm:p-9">
                  <span className="inline-flex items-center gap-2 rounded-full border border-rev-orange/40 bg-rev-orange/10 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-rev-orange">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rev-orange opacity-60" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-rev-orange" />
                    </span>
                    Pre-Black Friday Deal
                  </span>

                  <h2
                    className="text-balance mx-auto mt-5 max-w-md font-display text-3xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-4xl"
                    id="bf-popup-title"
                  >
                    Buy a brand-new laptop <span className="text-rev-peach">for your loved ones</span>
                  </h2>

                  <img
                    alt="Rev laptop"
                    className="mx-auto mt-6 h-40 w-auto object-contain drop-shadow-2xl sm:h-48"
                    src="/devices/rev_orion_laptop.png"
                  />

                  <p className="mt-5 text-sm font-semibold uppercase tracking-[0.14em] text-white/50">For as low as</p>
                  <p className="font-display text-5xl font-extrabold tracking-tight text-rev-orange sm:text-6xl">
                    ₦{FROM_PRICE.toLocaleString("en-NG")}
                  </p>

                  <div className="mx-auto mt-5 flex max-w-sm items-center justify-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3">
                    <Gift className="h-5 w-5 shrink-0 text-rev-peach" />
                    <p className="text-sm text-white/80">
                      We also do <strong className="text-white">Buy Now, Pay Later</strong>
                    </p>
                  </div>

                  <div className="mt-7 grid gap-3 sm:grid-cols-2">
                    <Link
                      className="focus-ring flex h-12 items-center justify-center gap-2 rounded-full bg-rev-orange text-sm font-bold text-white shadow-glow transition hover:bg-rev-orangeDeep"
                      href="/products?category=laptops"
                      onClick={dismiss}
                    >
                      Shop laptops <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      className="focus-ring flex h-12 items-center justify-center rounded-full border border-white/20 text-sm font-bold text-white transition hover:border-white/45 hover:bg-white/5"
                      href="/apply"
                      onClick={dismiss}
                    >
                      Buy Now, Pay Later
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
