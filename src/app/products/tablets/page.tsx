"use client";

// ═══════════════════════════════════════════════════════════════
// 📸 IMAGE REPLACEMENT GUIDE
//
// Drop your tablet photo into:
//   /public/devices/rev-tablet.png
//
// That's the only image this page uses — it appears in the hero,
// the spec card, and the carousel slides.
// All sections fall back to a clean SVG placeholder automatically
// if the file hasn't been added yet.
//
// To update pricing or specs, edit the TABLET constant below.
// ═══════════════════════════════════════════════════════════════

import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Battery, Cpu, HardDrive,
  MessageCircle, Monitor, Shield, Wifi, X,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui";
import { StorefrontHeader } from "@/components/StorefrontHeader";
import { StorefrontFooter } from "@/components/StorefrontFooter";

// ─────────────────────────────────────────────────────────────
// UPDATE THIS CONSTANT to change pricing, specs, or the WhatsApp
// ─────────────────────────────────────────────────────────────
const WHATSAPP_NUMBER = "2348012345678"; // update with real number

const TABLET = {
  name:         "Rev Tab",
  tagline:      "The classroom tablet — built tough, priced right.",
  normalPrice:  150000,
  offerPrice:   80000,
  img:          "/devices/rev-tablet.png",  // ← swap this image
  badge:        "Limited Offer — While Stock Lasts",
  specs: [
    { icon: Monitor,    label: "Display",        value: '10.1" IPS LCD, 1280 × 800' },
    { icon: Cpu,        label: "Processor",      value: "Quad-core ARM Cortex-A55 (1.8GHz)" },
    { icon: HardDrive,  label: "RAM / Storage",  value: "3GB RAM · 32GB ROM" },
    { icon: HardDrive,  label: "Expandable",     value: "MicroSD up to 256GB" },
    { icon: Battery,    label: "Battery",        value: "5,000mAh · Up to 10 hours" },
    { icon: Wifi,       label: "Connectivity",   value: "Wi-Fi 802.11 b/g/n · Bluetooth 5.0" },
    { icon: Monitor,    label: "Camera",         value: "5MP rear · 2MP front" },
    { icon: Shield,     label: "OS",             value: "Android 13" },
    { icon: Shield,     label: "Ports",          value: "USB-C · 3.5mm audio · MicroSD" },
    { icon: Shield,     label: "Certifications", value: "RoHS · CE certified" },
  ],
};

// Carousel slides — all about the tablet deal
const SLIDES = [
  {
    id: "deal",
    kicker: "Limited Offer — While Stock Lasts",
    headline: ["The Rev Tab.", "₦80,000. Today only."],
    sub: "Normally ₦150,000. For a limited time, grab the Rev Tab at nearly half price. Perfect for students, teachers, and classrooms.",
    accent: "#FF6B1A",
    bg: "radial-gradient(130% 95% at 65% 15%, #7a1a1e 0%, #4a0e10 55%, #2e0608 100%)",
  },
  {
    id: "specs",
    kicker: "Built for Learning",
    headline: ["3GB RAM. 32GB Storage.", "A full day of battery."],
    sub: "10.1\" IPS display, quad-core processor, and 10 hours of battery — everything a student needs, built to last.",
    accent: "#34d399",
    bg: "radial-gradient(130% 95% at 30% 80%, #0c1f10 0%, #081508 55%, #040a04 100%)",
  },
  {
    id: "school",
    kicker: "For Schools & Institutions",
    headline: ["Order for your whole", "school. Save more."],
    sub: "Bulk orders for schools and institutions get additional discounts. Message us on WhatsApp to discuss a school deal.",
    accent: "#60a5fa",
    bg: "radial-gradient(130% 95% at 70% 20%, #0c1830 0%, #081020 55%, #040810 100%)",
  },
];

function TabletImg({ className }: { className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <svg className={className} fill="none" viewBox="0 0 320 420" xmlns="http://www.w3.org/2000/svg">
        <rect fill="#1e1e22" height="420" rx="24" width="320" />
        <rect fill="#0a0a0c" height="360" rx="12" width="280" x="20" y="30" />
        <rect fill="#8a1a1e" height="200" rx="6" width="240" x="40" y="90" />
        <circle cx="160" cy="400" fill="#3a3a3e" r="8" />
        <text fill="rgba(255,255,255,0.3)" fontFamily="system-ui" fontSize="13" textAnchor="middle" x="160" y="195">Rev Tab</text>
      </svg>
    );
  }
  return (
    <img
      alt="Rev Tab"
      className={className}
      onError={() => setFailed(true)}
      src={TABLET.img}
    />
  );
}

export default function TabletsPage() {
  const [slide, setSlide]   = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setSlide((s) => (s + 1) % SLIDES.length), []);
  const prev = useCallback(() => setSlide((s) => (s - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 11000);
    return () => clearInterval(id);
  }, [paused, next]);

  const saving  = TABLET.normalPrice - TABLET.offerPrice;
  const pctOff  = Math.round((saving / TABLET.normalPrice) * 100);

  const whatsappMsg = encodeURIComponent(
    `Hi Revrica! I'd like to order the Rev Tab at the offer price of ₦${TABLET.offerPrice.toLocaleString()}. Please let me know the next steps. Thank you!`
  );
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`;

  return (
    <>
      <StorefrontHeader />
      <main className="overflow-hidden bg-white">

        {/* ── HERO CAROUSEL ── */}
        <section
          className="relative overflow-hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <AnimatePresence mode="wait">
            {SLIDES.map((s, i) =>
              slide !== i ? null : (
                <motion.div
                  animate={{ opacity: 1 }}
                  className="relative min-h-[86vh]"
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                  key={s.id}
                  style={{ background: s.bg }}
                  transition={{ duration: 0.7 }}
                >
                  <div className="noise-overlay" />
                  <div className="container-x relative z-10 grid min-h-[86vh] items-center gap-12 py-24 lg:grid-cols-[1.1fr_1fr]">
                    <motion.div animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 18 }} transition={{ duration: 0.55, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}>
                      <span
                        className="inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
                        style={{ background: `${s.accent}22`, color: s.accent, border: `1px solid ${s.accent}44` }}
                      >
                        {s.kicker}
                      </span>
                      <h1 className="text-balance mt-4 font-display text-4xl font-extrabold leading-[1.06] tracking-tight text-white md:text-[3.2rem] lg:text-[3.6rem]">
                        <span className="block">{s.headline[0]}</span>
                        <span className="block" style={{ color: s.accent }}>{s.headline[1]}</span>
                      </h1>
                      <p className="mt-5 max-w-lg text-lg leading-8 text-white/60">{s.sub}</p>
                      <div className="mt-8 flex flex-wrap gap-4">
                        <a href="#buy">
                          <Button>Order on WhatsApp <ArrowRight className="h-4 w-4" /></Button>
                        </a>
                        <a href="#specs">
                          <Button variant="ghost">See specifications</Button>
                        </a>
                      </div>
                    </motion.div>
                    <motion.div animate={{ opacity: 1, scale: 1 }} className="flex items-center justify-center" initial={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.6, delay: 0.1 }}>
                      <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
                        <TabletImg className="mx-auto w-full max-w-[260px] drop-shadow-2xl sm:max-w-xs" />
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              )
            )}
          </AnimatePresence>

          {/* Controls */}
          <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-4">
            <button className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition hover:bg-white/20" onClick={prev} type="button">
              <svg fill="none" height="16" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="16"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <div className="flex gap-2">
              {SLIDES.map((_, i) => (
                <button className={`h-1.5 rounded-full transition-all ${i === slide ? "w-6 bg-rev-orange" : "w-1.5 bg-white/30"}`} key={i} onClick={() => setSlide(i)} type="button" />
              ))}
            </div>
            <button className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition hover:bg-white/20" onClick={next} type="button">
              <svg fill="none" height="16" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="16"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </div>
        </section>

        {/* ── PRICE + BUY CTA ── */}
        <section className="bg-[#f5f5f7] py-16" id="buy">
          <div className="container-x">
            <Reveal>
              <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl bg-white shadow-lg">
                <div className="grid items-center gap-0 md:grid-cols-[1fr_auto]">
                  <div className="p-8 md:p-10">
                    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-emerald-700">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                      </span>
                      Limited Offer — While Stock Lasts
                    </span>
                    <h2 className="mt-4 font-display text-3xl font-extrabold text-[#1d1d1f] md:text-4xl">
                      {TABLET.name}
                    </h2>
                    <p className="mt-1 text-[#6e6e73]">{TABLET.tagline}</p>
                    <div className="mt-5 flex items-end gap-4">
                      <span className="font-display text-5xl font-extrabold text-rev-orange">
                        ₦{TABLET.offerPrice.toLocaleString()}
                      </span>
                      <div className="mb-1.5">
                        <p className="text-sm text-[#6e6e73] line-through">₦{TABLET.normalPrice.toLocaleString()}</p>
                        <p className="text-sm font-bold text-emerald-600">You save ₦{saving.toLocaleString()} ({pctOff}% off)</p>
                      </div>
                    </div>
                    <a
                      className="mt-6 inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-8 py-4 text-sm font-bold text-white shadow-md transition hover:brightness-110 active:scale-95"
                      href={whatsappUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <MessageCircle className="h-5 w-5" />
                      Order on WhatsApp
                    </a>
                    <p className="mt-3 text-xs text-[#6e6e73]">
                      Tap to open WhatsApp with a pre-filled order message. Our team responds within hours.
                    </p>
                  </div>
                  <div className="flex items-center justify-center border-t border-black/6 bg-[#f8f7f5] px-10 py-10 md:border-l md:border-t-0">
                    <TabletImg className="w-32 drop-shadow-lg md:w-44" />
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── SPECIFICATIONS ── */}
        <section className="bg-white py-24" id="specs">
          <div className="container-x">
            <Reveal>
              <p className="text-center text-xs font-bold uppercase tracking-[0.22em] text-rev-orange">Technical Specifications</p>
              <h2 className="text-balance mx-auto mt-3 max-w-xl text-center font-display text-4xl font-extrabold tracking-tight text-[#1d1d1f] md:text-5xl">
                Everything you need to know.
              </h2>
            </Reveal>

            <Reveal className="mx-auto mt-12 max-w-2xl overflow-hidden rounded-3xl border border-black/8 bg-white shadow-sm" delay={0.08}>
              <div className="flex items-center justify-center border-b border-black/6 bg-gradient-to-br from-[#f5f5f7] to-[#e8e5e2] px-12 py-10">
                <TabletImg className="w-full max-w-[200px] drop-shadow-xl" />
              </div>
              <div className="p-8">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-2xl font-extrabold text-[#1d1d1f]">{TABLET.name}</h3>
                    <p className="mt-1 text-sm text-[#6e6e73]">{TABLET.tagline}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-2xl font-extrabold text-rev-orange">₦{TABLET.offerPrice.toLocaleString()}</p>
                    <p className="text-xs text-[#6e6e73] line-through">₦{TABLET.normalPrice.toLocaleString()}</p>
                  </div>
                </div>
                <div className="divide-y divide-black/6">
                  {TABLET.specs.map((spec) => (
                    <div className="flex items-center justify-between gap-4 py-3.5" key={spec.label}>
                      <div className="flex items-center gap-3">
                        <spec.icon className="h-4 w-4 shrink-0 text-rev-orange" />
                        <span className="text-sm font-semibold text-[#6e6e73]">{spec.label}</span>
                      </div>
                      <span className="text-right text-sm font-bold text-[#1d1d1f]">{spec.value}</span>
                    </div>
                  ))}
                </div>
                <a
                  className="mt-8 flex w-full items-center justify-center gap-2.5 rounded-full bg-[#25D366] py-4 text-sm font-bold text-white shadow-md transition hover:brightness-110"
                  href={whatsappUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  <MessageCircle className="h-5 w-5" />
                  Order now on WhatsApp
                </a>
              </div>
            </Reveal>

            <Reveal className="mt-5 rounded-2xl border border-black/6 bg-[#f5f5f7] p-5 text-center" delay={0.15}>
              <p className="text-sm text-[#6e6e73]">
                Offer valid while stock lasts. Specs are indicative and may vary. Bulk orders welcome — message us for school pricing.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── SCHOOL BULK CTA ── */}
        <section
          className="py-20"
          style={{ background: "radial-gradient(120% 90% at 65% 20%, #7a1a1e 0%, #4a0e10 55%, #2e0608 100%)" }}
        >
          <div className="noise-overlay" />
          <div className="container-x relative z-10 text-center">
            <Reveal>
              <h2 className="text-balance mx-auto max-w-xl font-display text-3xl font-extrabold text-white md:text-4xl">
                Ordering for a school or organisation?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-white/60">
                We offer special pricing for schools ordering 10 or more tablets. Message us and we'll sort out a deal that works for your budget.
              </p>
              <a
                className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-8 py-4 text-sm font-bold text-white shadow-lg transition hover:brightness-110"
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Revrica! I'm interested in ordering Rev Tab tablets in bulk for our school/organisation. Can you share the bulk pricing?")}`}
                rel="noreferrer"
                target="_blank"
              >
                <MessageCircle className="h-5 w-5" />
                Get bulk pricing on WhatsApp
              </a>
              <div className="mt-6">
                <Link href="/products/tablets">
                  <span className="text-sm font-bold text-white/50 underline underline-offset-4 transition hover:text-white">
                    Back to top
                  </span>
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

      </main>
      <StorefrontFooter />
    </>
  );
}