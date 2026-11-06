"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, X, Zap } from "lucide-react";
import { Manrope } from "next/font/google";
import Link from "next/link";
import { useEffect, useState } from "react";
import { discountPercent, getProduct } from "@/lib/catalog";
import { FEATURES } from "@/lib/features";

// Bumped with each new creative so visitors who closed the old one see it once.
const STORAGE_KEY   = "revstore_black_friday_popup_v2";
const DISMISS_HOURS = 24;

const manrope = Manrope({ subsets: ["latin"], weight: ["500", "600", "700", "800"] });

/** Headline "from" price: the Rev Orion's catalogue price, so the popup and shop always agree. */
const ORION      = getProduct("orion");
const FROM_PRICE = ORION?.price ?? 290_000;
const WAS_PRICE  = ORION?.compareAtPrice;
const PERCENT    = ORION ? discountPercent(ORION) : 0;

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
              className="pointer-events-auto relative max-h-[calc(100dvh-2rem)] w-full max-w-[880px] overflow-y-auto rounded-3xl"
              exit={{ opacity: 0, scale: 0.95, y: 24 }}
              initial={{ opacity: 0, scale: 0.93, y: 32 }}
              role="dialog"
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className={`${manrope.className} relative overflow-hidden rounded-3xl border-[1.5px] border-white bg-[#0a0a0b] shadow-[0_40px_100px_rgba(0,0,0,0.7)]`}
              >
                {/* Spotlight and glows */}
                <div className="pointer-events-none absolute left-1/4 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-[0.06] blur-3xl" />
                <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-rev-orange opacity-25 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-maroon-bright opacity-40 blur-3xl" />

                <button
                  aria-label="Close"
                  className="absolute right-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/60 transition hover:bg-white/20 hover:text-white"
                  onClick={dismiss}
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="relative z-10 grid items-center gap-6 p-7 text-center sm:p-10 md:grid-cols-[1fr_1.1fr] md:gap-10 md:text-left">
                  {/* Laptop: beside the offer on md+, below the headline on phones */}
                  <div className="order-2 md:order-1">
                    <img
                      alt="Rev laptop"
                      className="mx-auto h-40 w-auto object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.8)] sm:h-48 md:h-auto md:w-full"
                      src="/devices/rev_orion_laptop.png"
                    />
                  </div>

                  <div className="contents md:order-2 md:block">
                    <div className="order-1">
                      <span className="inline-flex items-center gap-2 rounded-full bg-rev-orange px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-white">
                        <Zap className="h-3.5 w-3.5 fill-current" />
                        Limited-time offer
                      </span>

                      <h2
                        className="text-balance mx-auto mt-4 max-w-md text-[28px] font-extrabold uppercase leading-[1.05] tracking-tight text-white sm:text-[34px] md:mx-0"
                        id="bf-popup-title"
                      >
                        Brand New Laptops <span className="block">Pre-Black Friday deals are <span className="text-rev-orange">here!</span></span>
                      </h2>

                      <p className="mt-3 text-lg font-bold text-rev-peach">Your next laptop. Your best deal.</p>
                    </div>

                    <div className="order-3 md:mt-4">
                      <p className="mx-auto max-w-sm text-[15px] leading-relaxed text-white/65 md:mx-0">
                        Upgrade now with exclusive deals on <strong className="text-white">REV Aelia</strong> and{" "}
                        <strong className="text-white">REV Orion</strong>. Why wait for Black Friday?
                      </p>

                      {WAS_PRICE && PERCENT > 0 && (
                        <div className="mt-5 flex items-center justify-center gap-3 md:justify-start">
                          <s className="text-base font-semibold text-white/40">
                            <span className="sr-only">Regular price </span>₦{WAS_PRICE.toLocaleString("en-NG")}
                          </s>
                          <span className="rounded-full bg-red-600 px-2.5 py-0.5 text-sm font-extrabold text-white">
                            {PERCENT}% OFF
                          </span>
                        </div>
                      )}
                      <div className={`${WAS_PRICE && PERCENT > 0 ? "mt-1" : "mt-5"} flex flex-wrap items-center justify-center gap-x-3 gap-y-1 md:justify-start`}>
                        <span className="text-sm font-semibold text-white/50">From</span>
                        <span className="text-4xl font-extrabold tracking-tight text-white sm:text-[42px]">
                          ₦{FROM_PRICE.toLocaleString("en-NG")}
                        </span>
                      </div>

                      <Link
                        className="focus-ring mt-6 flex items-center justify-center gap-2 rounded-full bg-rev-orange py-3.5 text-[15px] font-extrabold uppercase tracking-wide text-white shadow-glow transition hover:bg-rev-orangeDeep"
                        href="/products?category=laptops"
                        onClick={dismiss}
                      >
                        Shop the deals <ArrowRight className="h-4 w-4" />
                      </Link>

                      <p className="mt-3 text-sm text-white/60">
                        Prefer to spread the cost?{" "}
                        <Link className="font-bold text-white underline underline-offset-4 hover:text-rev-peach" href="/apply" onClick={dismiss}>
                          Buy Now, Pay Later
                        </Link>
                      </p>

                      <p className="mt-4 text-[11px] text-white/35">Limited-time offer. Terms and conditions apply.</p>
                    </div>
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
