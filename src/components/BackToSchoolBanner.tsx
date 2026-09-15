"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

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

function AnimatedHeadline({ inView }: { inView: boolean }) {
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setCycle(c => c + 1), 6000);
    return () => clearInterval(id);
  }, [inView]);

  const line1 = ["Welcome", "Back"];
  const line2 = ["To", "School", "DEALS"];

  return (
    <AnimatePresence mode="wait">
      <motion.div key={cycle} className="text-center">
        <div className="flex flex-wrap justify-center gap-x-[0.28em]">
          {line1.map((word, i) => (
            <motion.span key={word + i}
              className="font-display font-black uppercase leading-[1.1] tracking-tight text-white"
              style={{ fontSize: "clamp(20px, 2.8vw, 30px)" }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.38, delay: 0.05 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            >
              {word}
            </motion.span>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-x-[0.28em]">
          {line2.map((word, i) => (
            <motion.span key={word + i}
              className="font-display font-black uppercase leading-[1.1] tracking-tight text-[#FF6B1A]"
              style={{ fontSize: "clamp(20px, 2.8vw, 30px)" }}
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

export function BackToSchoolBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-40px" });

  const devices = [
    { src: "/devices/rev_orion_laptop.png", alt: "Rev Orion laptop", svg: <LaptopSVG className="h-16 w-auto" />, label: "Rev Orion" },
    { src: "/devices/rev_orion_laptop.png", alt: "Rev Aelia laptop", svg: <LaptopSVG className="h-14 w-auto" />, label: "Rev Aelia" },
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
        <div className="flex flex-col items-center py-8 text-center">

          {/* Headline centred */}
          <AnimatedHeadline inView={inView} />

          {/* Divider */}
          <div className="my-5 h-px w-24 bg-white/15" />

          {/* Sub-copy centred */}
          <motion.p className="max-w-md text-[13px] leading-[1.65] text-white/55"
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.45, delay: 0.28 }}>
            Big savings on laptops for students, teachers and schools.
          </motion.p>

          {/* Device images centred */}
          <motion.div className="mt-6 flex items-end justify-center gap-10"
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{ duration: 0.42, delay: 0.38 }}>
            {devices.map((d, i) => (
              <motion.div key={d.label}
                initial={{ opacity: 0, y: 18 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                transition={{ duration: 0.42, delay: 0.4 + i * 0.1 }}
                className="flex flex-col items-center gap-1.5"
              >
                <DeviceThumb alt={d.alt} className="h-20 w-auto object-contain drop-shadow-lg" fallback={d.svg} src={d.src} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/30">{d.label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.a href="/apply/devices"
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.4, delay: 0.55 }}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#FF6B1A] px-6 py-2.5 text-[13px] font-bold text-white shadow-md transition hover:bg-[#e55d10]"
          >
            Apply Now
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </motion.a>
        </div>
      </div>

      {/* ── MOBILE ── */}
      <div className="container-x relative z-10 block py-7 text-center md:hidden">
        <AnimatedHeadline inView={inView} />

        <motion.p className="mx-auto mt-3 max-w-xs text-[12.5px] leading-[1.6] text-white/52"
          initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: 0.3 }}>
          Big savings on laptops for students, teachers and schools.
        </motion.p>

        <motion.div className="mt-4 flex items-end justify-center gap-6"
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.4, delay: 0.4 }}>
          {devices.map(d => (
            <div key={d.label} className="flex flex-col items-center gap-1">
              <DeviceThumb alt={d.alt} className="h-12 w-auto object-contain drop-shadow-md" fallback={d.svg} src={d.src} />
              <span className="text-[9px] font-bold uppercase tracking-wider text-white/30">{d.label}</span>
            </div>
          ))}
        </motion.div>

        <motion.a href="/apply/devices"
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#FF6B1A] px-5 py-2 text-[12.5px] font-bold text-white"
        >
          Apply Now
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </motion.a>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-white/6" />
    </div>
  );
}
