"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// ─── Device image with fallback SVG ───────────────────────────
function DeviceThumb({ src, alt, fallback, className }: {
  src: string; alt: string; fallback: React.ReactNode; className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) return <>{fallback}</>;
  return <img alt={alt} className={className} onError={() => setFailed(true)} src={src} />;
}

function LaptopSVG({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 160 110">
      <path d="M22 12 L138 12 L134 80 L26 80 Z" fill="#3a1015" />
      <path d="M28 18 L132 18 L129 74 L31 74 Z" fill="#1a0608" />
      <rect fill="#581319" opacity="0.8" height="44" rx="3" width="86" x="37" y="24" />
      <path d="M8 82 L152 82 L162 100 L-2 100 Z" fill="#1a0608" />
      <rect fill="#FF6B1A" height="3" rx="1.5" width="22" x="69" y="92" />
    </svg>
  );
}

function TabletSVG({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 80 110">
      <rect fill="#2a0a0e" height="106" rx="10" width="76" x="2" y="2" />
      <rect fill="#150406" height="88" rx="6" width="62" x="9" y="10" />
      <rect fill="#581319" opacity="0.7" height="68" rx="3" width="52" x="14" y="18" />
      <circle cx="40" cy="106" fill="#581319" r="4" />
    </svg>
  );
}

// ─── Word-by-word headline — loops indefinitely ───────────────
function AnimatedHeadline({ inView }: { inView: boolean }) {
  const [cycle, setCycle] = useState(0);

  // Re-trigger animation every 6 seconds
  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setCycle(c => c + 1), 6000);
    return () => clearInterval(id);
  }, [inView]);

  const line1 = ["Back", "to", "School"];
  const line2 = ["Deals", "Are", "Coming!"];

  return (
    <AnimatePresence mode="wait">
      <motion.div key={cycle}>
        <div className="flex flex-wrap gap-x-[0.28em]">
          {line1.map((word, i) => (
            <motion.span key={word + i}
              className="font-display font-black uppercase leading-[1.1] tracking-tight text-white"
              style={{ fontSize: "clamp(17px, 2.4vw, 24px)" }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.38, delay: 0.05 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            >
              {word}
            </motion.span>
          ))}
        </div>
        <div className="flex flex-wrap gap-x-[0.28em]">
          {line2.map((word, i) => (
            <motion.span key={word + i}
              className="font-display font-black uppercase leading-[1.1] tracking-tight text-[#FF6B1A]"
              style={{ fontSize: "clamp(17px, 2.4vw, 24px)" }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.38, delay: 0.2 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              {word}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main ─────────────────────────────────────────────────────
export function BackToSchoolBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-40px" });

  // Only 3 devices: 2 laptops + 1 tablet
  const devices = [
    { src: "/devices/rev-laptop.png",  alt: "Rev Orion laptop",  svg: <LaptopSVG className="h-16 w-auto" />,  label: "Rev Orion" },
    { src: "/devices/rev-laptop.png",  alt: "Rev Aelia laptop",  svg: <LaptopSVG className="h-14 w-auto" />,  label: "Rev Aelia" },
    { src: "/devices/rev-tablet.png",  alt: "Rev Tab tablet",    svg: <TabletSVG className="h-14 w-auto" />,  label: "Rev Tab" },
  ];

  return (
    <div ref={ref} className="relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #3a0810 0%, #280608 50%, #180305 100%)" }}>

      {/* Top accent sweep */}
      <motion.div className="absolute inset-x-0 top-0 h-[2px] origin-left bg-[#FF6B1A]"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: 0.7 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Dot grid texture */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)", backgroundSize: "18px 18px" }} />

      {/* ── DESKTOP ── */}
      <div className="container-x relative z-10 hidden md:block">
        <div className="flex items-center gap-0 py-5">

          {/* Headline */}
          <div className="flex shrink-0 flex-col gap-0.5 pr-7">
            <motion.p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#FF6B1A]"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.35 }}>
              Coming Soon
            </motion.p>
            <AnimatedHeadline inView={inView} />
          </div>

          <div className="mx-6 h-14 w-px shrink-0 bg-white/10" />

          {/* Body copy */}
          <motion.div className="flex shrink-0 items-center gap-3 pr-7"
            initial={{ opacity: 0, x: -10 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
            transition={{ duration: 0.45, delay: 0.28 }}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FF6B1A]/15">
              <svg fill="none" height="20" stroke="#FF6B1A" strokeWidth="1.6" viewBox="0 0 24 24" width="20">
                <rect height="16" rx="2" width="18" x="3" y="4" />
                <path d="M3 9h18" /><path d="M8 2v4M16 2v4" />
                <rect fill="#FF6B1A" height="4" rx="1" stroke="none" width="6" x="9" y="13" />
              </svg>
            </div>
            <p className="max-w-[150px] text-[12.5px] leading-[1.55] text-white/55">
              Big savings on laptops &amp; tablets for students, teachers and schools.
            </p>
          </motion.div>

          <div className="mx-6 h-14 w-px shrink-0 bg-white/10" />

          {/* Device images — staggered rise */}
          <div className="flex flex-1 items-end justify-center gap-6">
            {devices.map((d, i) => (
              <motion.div key={d.label}
                initial={{ opacity: 0, y: 18 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                transition={{ duration: 0.42, delay: 0.32 + i * 0.08 }}
                className="flex flex-col items-center gap-1.5"
                style={{ transition: "transform 0.2s ease" }}
              >
                <DeviceThumb alt={d.alt} className="h-16 w-auto object-contain drop-shadow-lg" fallback={d.svg} src={d.src} />
                <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "0.06em" }}>{d.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MOBILE ── */}
      <div className="container-x relative z-10 block py-6 md:hidden">
        <motion.p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#FF6B1A]"
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.35 }}>
          Coming Soon
        </motion.p>
        <AnimatedHeadline inView={inView} />

        <motion.p className="mt-3 max-w-xs text-[12.5px] leading-[1.6] text-white/52"
          initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: 0.3 }}>
          Big savings on laptops &amp; tablets for students, teachers and schools.
        </motion.p>

        {/* Device row */}
        <motion.div className="mt-4 flex items-end gap-5"
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.4, delay: 0.4 }}>
          {devices.map(d => (
            <div key={d.label} className="flex flex-col items-center gap-1">
              <DeviceThumb alt={d.alt} className="h-12 w-auto object-contain drop-shadow-md" fallback={d.svg} src={d.src} />
              <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.32)" }}>{d.label}</span>
            </div>
          ))}
        </motion.div>
        </div>

      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-white/6" />
    </div>
  );
}