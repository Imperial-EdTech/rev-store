"use client";

// ═══════════════════════════════════════════════════════════════
// LTBTCarousel.tsx  —  src/components/LTBTCarousel.tsx
//
// Drop this at: src/components/LTBTCarousel.tsx
// Use in let-there-be-teachers/page.tsx:
//   import { LTBTCarousel } from "@/components/LTBTCarousel";
//   ...
//   <LTBTCarousel />
//
// Also replaces Slide02 in HeroCarousel.tsx — see HeroCarousel
// integration note at the bottom of this file.
//
// Teacher photo:  /public/images/ltbt-teacher.png
//   → A photo of a Nigerian teacher holding a Rev laptop
//     Cut out on transparent PNG, min 800px tall
//     If missing: falls back to a styled placeholder
//
// LTBT logo:      /public/logos/let-there-be-teachers.png
// ImperialEdtech: /public/logos/imperial-edtech.png
// ═══════════════════════════════════════════════════════════════

import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Framer typed easing ──────────────────────────────────────
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE, delay: 0.06 } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.25, ease: "easeIn" } },
};

const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: EASE, delay: 0.12 } },
  exit:    { opacity: 0, transition: { duration: 0.25, ease: "easeIn" } },
};

// ─── Slide config ─────────────────────────────────────────────
// Three slides — add more by extending this array and adding a SlideN component
const TOTAL = 3;

// ─── Image with fallback ──────────────────────────────────────
function Img({
  src,
  alt,
  className,
  fallback,
}: {
  src: string;
  alt: string;
  className?: string;
  fallback?: React.ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  if (failed && fallback) return <>{fallback}</>;
  return (
    <img
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      src={src}
    />
  );
}

// ─── Dot-grid overlay (matches the reference dot texture) ─────
function DotGrid() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage:
          "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }}
    />
  );
}

// ─── NavDots ──────────────────────────────────────────────────
function NavDots({
  total,
  current,
  onDot,
}: {
  total: number;
  current: number;
  onDot: (i: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          aria-label={`Go to slide ${i + 1}`}
          className="group p-1"
          onClick={() => onDot(i)}
          type="button"
        >
          <div
            className={`rounded-full transition-all duration-400 ${
              i === current
                ? "h-2.5 w-7 bg-amber-400"
                : "h-2.5 w-2.5 bg-white/30 group-hover:bg-white/55"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

// ─── Arrow button ─────────────────────────────────────────────
function Arrow({
  dir,
  onClick,
}: {
  dir: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      aria-label={dir === "left" ? "Previous" : "Next"}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition hover:border-white/40 hover:bg-white/18"
      onClick={onClick}
      type="button"
    >
      <svg
        fill="none"
        height="14"
        stroke="currentColor"
        strokeWidth="2.2"
        viewBox="0 0 14 14"
        width="14"
      >
        {dir === "left" ? (
          <path d="M9 2L4 7l5 5" />
        ) : (
          <path d="M5 2l5 5-5 5" />
        )}
      </svg>
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 1 — main LTBT hero (matches reference image exactly)
// ═══════════════════════════════════════════════════════════════
function Slide1({ active }: { active: boolean }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background: "#050d1a" }}
    >
      <DotGrid />

      {/* Full-width layout: left copy | center photo | right panel */}
      <div className="relative z-10 flex h-full">

        {/* ── LEFT: Copy ── */}
        <div className="flex w-[38%] shrink-0 flex-col justify-center px-10 py-10 md:px-14">
          <AnimatePresence mode="wait">
            {active && (
              <motion.div
                key="s1-copy"
                animate="visible"
                exit="exit"
                initial="hidden"
                variants={fadeUp}
              >
                {/* Partnership badge */}
                <div className="mb-4 inline-flex items-center rounded bg-amber-400 px-3 py-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#050d1a]">
                    In Partnership With
                  </span>
                </div>

                {/* LTBT logo-style text */}
                <div className="mb-5 flex items-start gap-3">
                  {/* Globe icon fallback */}
                  <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-400/15">
                    <svg
                      fill="none"
                      height="28"
                      viewBox="0 0 28 28"
                      width="28"
                    >
                      <circle
                        cx="14"
                        cy="14"
                        r="11"
                        stroke="#FBBF24"
                        strokeWidth="1.5"
                      />
                      <ellipse
                        cx="14"
                        cy="14"
                        rx="5"
                        ry="11"
                        stroke="#FBBF24"
                        strokeWidth="1.2"
                      />
                      <line
                        stroke="#FBBF24"
                        strokeWidth="1.2"
                        x1="3"
                        x2="25"
                        y1="14"
                        y2="14"
                      />
                      <line
                        stroke="#FBBF24"
                        strokeWidth="1"
                        x1="5"
                        x2="23"
                        y1="9"
                        y2="9"
                      />
                      <line
                        stroke="#FBBF24"
                        strokeWidth="1"
                        x1="5"
                        x2="23"
                        y1="19"
                        y2="19"
                      />
                    </svg>
                  </div>
                  <div>
                    <p
                      className="font-display text-[1.45rem] font-black italic leading-none tracking-tight text-amber-400"
                      style={{ fontStyle: "italic" }}
                    >
                      LET THERE BE
                    </p>
                    <p className="font-display text-[2.15rem] font-black leading-none tracking-tight text-white">
                      TEACHERS
                    </p>
                  </div>
                </div>

                {/* Main headline */}
                <h1 className="font-display text-[2.85rem] font-black leading-[1.04] tracking-[-0.02em] text-white md:text-[3.2rem]">
                  Together,
                  <br />
                  empowering
                  <br />
                  <span className="text-amber-400">every teacher.</span>
                </h1>

                {/* Gold underline accent */}
                <div className="mt-3 h-[3px] w-24 rounded-full bg-amber-400" />

                <p className="mt-5 text-[13.5px] leading-[1.65] text-white/55">
                  Affordable laptops. Flexible payments.
                  <br />
                  Stronger classrooms.
                </p>

                <Link href="/let-there-be-teachers" className="mt-7 inline-block">
                  <button className="inline-flex items-center gap-2.5 rounded-full bg-amber-400 px-7 py-3 text-[13px] font-bold text-[#050d1a] transition hover:bg-amber-300 active:scale-95">
                    Learn More <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── CENTER: Teacher photo (bleeds full height) ── */}
        <div className="relative flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {active && (
              <motion.div
                key="s1-photo"
                animate="visible"
                className="absolute inset-0"
                exit="exit"
                initial="hidden"
                variants={fadeIn}
              >
                {/* Gradient vignettes: left edge fades into navy */}
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32"
                  style={{
                    background:
                      "linear-gradient(to right, #050d1a 0%, transparent 100%)",
                  }}
                />
                {/* Right edge fades into the right panel */}
                <div
                  className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32"
                  style={{
                    background:
                      "linear-gradient(to left, #0a1628 0%, transparent 100%)",
                  }}
                />

                <Img
                  alt="Teacher holding a Rev laptop"
                  className="h-full w-full object-cover object-top"
                  src="/images/ltbt-teacher.png"
                  fallback={
                    /* SVG placeholder teacher silhouette */
                    <div
                      className="flex h-full w-full items-end justify-center"
                      style={{
                        background:
                          "linear-gradient(180deg, #0a1628 0%, #071020 100%)",
                      }}
                    >
                      <svg
                        fill="none"
                        viewBox="0 0 320 480"
                        style={{ width: 260, height: "85%", opacity: 0.35 }}
                      >
                        {/* Head */}
                        <circle cx="160" cy="90" fill="#6b7280" r="52" />
                        {/* Shoulders / body */}
                        <path
                          d="M60 220 C60 180 100 160 160 160 C220 160 260 180 260 220 L270 480 L50 480 Z"
                          fill="#4b5563"
                        />
                        {/* Laptop rectangle */}
                        <rect
                          fill="#374151"
                          height="80"
                          rx="6"
                          width="130"
                          x="95"
                          y="280"
                        />
                        <rect
                          fill="#1f2937"
                          height="68"
                          rx="4"
                          width="116"
                          x="102"
                          y="286"
                        />
                        {/* rev text on laptop */}
                        <text
                          fill="rgba(255,255,255,0.4)"
                          fontFamily="system-ui"
                          fontSize="16"
                          textAnchor="middle"
                          x="160"
                          y="326"
                        >
                          rev
                        </text>
                      </svg>
                    </div>
                  }
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── RIGHT: Info panel ── */}
        <div
          className="flex w-[24%] shrink-0 flex-col justify-center border-l border-white/10 px-8 py-10"
          style={{ background: "rgba(10,22,46,0.85)" }}
        >
          <AnimatePresence mode="wait">
            {active && (
              <motion.div
                key="s1-panel"
                animate="visible"
                exit="exit"
                initial="hidden"
                variants={fadeUp}
              >
                <p className="font-display text-[1.55rem] font-bold leading-tight text-white">
                  Let There Be
                  <br />
                  Teachers
                </p>
                <p className="mt-1.5 font-display text-[1.1rem] font-bold text-amber-400">
                  Laptop Scheme
                </p>

                <div className="my-5 h-px w-full bg-white/10" />

                {/* IN PARTNERSHIP WITH badge */}
                <div className="mb-4 inline-flex items-center rounded bg-amber-400 px-3 py-1">
                  <span className="text-[9px] font-black uppercase tracking-[0.16em] text-[#050d1a]">
                    In Partnership With
                  </span>
                </div>

                {/* ImperialEdtech logo placeholder */}
                <div className="flex items-center gap-2.5">
                  {/* ImperialEdtech logo mark */}
                  <Img
                    alt="ImperialEdtech"
                    className="h-8 w-auto"
                    src="/logos/imperial-edtech.png"
                    fallback={
                      <svg
                        fill="none"
                        height="32"
                        viewBox="0 0 32 32"
                        width="32"
                      >
                        <circle
                          cx="16"
                          cy="12"
                          r="6"
                          stroke="#fff"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M10 28 C10 22 22 22 22 28"
                          stroke="#fff"
                          strokeWidth="1.5"
                        />
                        <circle
                          cx="16"
                          cy="12"
                          r="2"
                          fill="#fff"
                        />
                      </svg>
                    }
                  />
                  <div>
                    <p className="text-[13px] font-bold text-white">
                      ImperialEdtech
                    </p>
                    <p className="text-[10px] text-white/40">
                      Building for impact
                    </p>
                  </div>
                </div>

                <div className="mt-7">
                  <Link href="/apply">
                    <button className="w-full rounded-full bg-amber-400 py-3 text-[12px] font-bold text-[#050d1a] transition hover:bg-amber-300">
                      Apply Today
                    </button>
                  </Link>
                  <Link href="/let-there-be-teachers">
                    <button className="mt-2 w-full rounded-full border border-white/18 py-3 text-[12px] font-semibold text-white/60 transition hover:border-white/35 hover:text-white">
                      Learn More
                    </button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2">
        {/* Dots rendered by parent */}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 2 — Pricing / How to apply
// ═══════════════════════════════════════════════════════════════
function Slide2({ active }: { active: boolean }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background: "#050d1a" }}
    >
      <DotGrid />

      <div className="container-x relative z-10 flex h-full items-center gap-14">
        <AnimatePresence mode="wait">
          {active && (
            <>
              {/* Left copy */}
              <motion.div
                key="s2-copy"
                animate="visible"
                className="max-w-sm"
                exit="exit"
                initial="hidden"
                variants={fadeUp}
              >
                <div className="mb-4 inline-flex items-center rounded bg-amber-400 px-3 py-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#050d1a]">
                    Let There Be Teachers
                  </span>
                </div>
                <h2 className="font-display text-[2.8rem] font-black leading-[1.03] tracking-[-0.025em] text-white">
                  Own your laptop.
                  <br />
                  <span className="text-amber-400">Pay monthly.</span>
                </h2>
                <p className="mt-4 text-[14px] leading-[1.7] text-white/52">
                  From ₦14,858/month over 36 months. Zero upfront cost. Bank-backed and fully regulated.
                </p>
                <Link href="/apply" className="mt-7 inline-block">
                  <button className="inline-flex items-center gap-2.5 rounded-full bg-amber-400 px-7 py-3 text-[13px] font-bold text-[#050d1a] transition hover:bg-amber-300 active:scale-95">
                    Apply Now <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </motion.div>

              {/* Right: pricing grid */}
              <motion.div
                key="s2-plans"
                animate="visible"
                className="flex-1"
                exit="exit"
                initial="hidden"
                variants={fadeUp}
              >
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { months: 12, monthly: "₦34,120", rate: "16.98%" },
                    { months: 24, monthly: "₦19,569", rate: "34.19%", featured: true },
                    { months: 36, monthly: "₦14,858", rate: "52.83%" },
                  ].map((plan) => (
                    <div
                      key={plan.months}
                      className={`rounded-2xl border p-6 text-center ${
                        plan.featured
                          ? "border-amber-400/50 bg-amber-400/10"
                          : "border-white/10 bg-white/[0.04]"
                      }`}
                    >
                      {plan.featured && (
                        <div className="mb-3 inline-flex rounded-full bg-amber-400 px-3 py-0.5 text-[9px] font-black uppercase tracking-widest text-[#050d1a]">
                          Most Popular
                        </div>
                      )}
                      <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">
                        {plan.months} months
                      </p>
                      <p className="mt-2 font-display text-[2.2rem] font-black text-white">
                        {plan.monthly}
                      </p>
                      <p className="text-[10px] text-white/35">per month</p>
                      <p className="mt-2 text-[10px] text-white/30">
                        {plan.rate} profit rate
                      </p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-center text-[11px] text-white/28">
                  All plans include RevLearn + Microsoft Office 365. Zero upfront. 2-year warranty.
                </p>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 3 — How it works
// ═══════════════════════════════════════════════════════════════
function Slide3({ active }: { active: boolean }) {
  const steps = [
    { n: "01", title: "Apply online",    body: "Fill in the short application. Select the Let There Be Teachers scheme when asked." },
    { n: "02", title: "Verification",    body: "Our team reviews your employment details. Quick and paperwork-light." },
    { n: "03", title: "Choose your plan",body: "Pick your repayment term — 12, 24, or 36 months. Get your exact monthly figure." },
    { n: "04", title: "Laptop delivered",body: "Your Rev laptop ships. Monthly payments begin the following month." },
  ];

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background: "#050d1a" }}
    >
      <DotGrid />

      <div className="container-x relative z-10 flex h-full flex-col justify-center py-12">
        <AnimatePresence mode="wait">
          {active && (
            <motion.div
              key="s3-content"
              animate="visible"
              exit="exit"
              initial="hidden"
              variants={fadeUp}
            >
              <div className="mb-2 inline-flex items-center rounded bg-amber-400 px-3 py-1">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#050d1a]">
                  How It Works
                </span>
              </div>
              <h2 className="mb-10 font-display text-[2.5rem] font-black leading-[1.05] tracking-[-0.02em] text-white">
                Four steps to{" "}
                <span className="text-amber-400">your laptop.</span>
              </h2>

              <div className="grid grid-cols-4 gap-6">
                {steps.map((step, i) => (
                  <div key={step.n}>
                    <p className="select-none font-display text-[3rem] font-black text-amber-400/18 leading-none">
                      {step.n}
                    </p>
                    <div className="mb-4 mt-2 h-[3px] w-10 rounded-full bg-amber-400" />
                    <p className="font-display text-[15px] font-bold text-white">
                      {step.title}
                    </p>
                    <p className="mt-2 text-[13px] leading-[1.6] text-white/48">
                      {step.body}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex items-center gap-4">
                <Link href="/apply">
                  <button className="inline-flex items-center gap-2.5 rounded-full bg-amber-400 px-7 py-3 text-[13px] font-bold text-[#050d1a] transition hover:bg-amber-300 active:scale-95">
                    Apply Today <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
                <Link href="/let-there-be-teachers">
                  <button className="inline-flex items-center gap-2.5 rounded-full border border-white/18 px-7 py-3 text-[13px] font-semibold text-white/60 transition hover:border-white/35 hover:text-white">
                    Learn More
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ROOT — LTBTCarousel
// ═══════════════════════════════════════════════════════════════
export function LTBTCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused]   = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback(
    (n: number) => setCurrent((n + TOTAL) % TOTAL),
    [],
  );
  const next = useCallback(() => go(current + 1), [current, go]);
  const prev = useCallback(() => go(current - 1), [current, go]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!paused) setCurrent((c) => (c + 1) % TOTAL);
    }, 8000);
  }, [paused]);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused, resetTimer]);

  const nav = (fn: () => void) => { fn(); resetTimer(); };

  return (
    <section
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{ height: "clamp(420px, 52vw, 560px)" }}
    >
      <Slide1 active={current === 0} />
      <Slide2 active={current === 1} />
      <Slide3 active={current === 2} />

      {/* Left arrow */}
      <div className="absolute left-4 top-1/2 z-30 -translate-y-1/2">
        <Arrow dir="left" onClick={() => nav(prev)} />
      </div>

      {/* Right arrow */}
      <div className="absolute right-4 top-1/2 z-30 -translate-y-1/2">
        <Arrow dir="right" onClick={() => nav(next)} />
      </div>

      {/* Bottom dot navigation */}
      <div className="absolute bottom-5 left-1/2 z-30 -translate-x-1/2">
        <NavDots
          current={current}
          onDot={(i) => { go(i); resetTimer(); }}
          total={TOTAL}
        />
      </div>
    </section>
  );
}

/*
 * ─── Integration into HeroCarousel.tsx ─────────────────────────
 *
 * To use the LTBT design as Slide02 of the main homepage carousel,
 * replace the existing <Slide02 active={current === 1} /> in
 * HeroCarousel.tsx with a self-contained version of Slide1 from
 * this file. The LTBTCarousel component is its own full-page
 * carousel used on /let-there-be-teachers.
 *
 * For the homepage hero (HeroCarousel), slide 02 should remain the
 * TDEP slide with the teacher photo and price badge, as shown in
 * the previous design reference. The LTBT slide is now an additional
 * slide — add it as slide 04 (id: "ltbt") in HeroCarousel.tsx if
 * desired.
 */