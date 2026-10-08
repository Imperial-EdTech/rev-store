"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { Award } from "lucide-react";
import Link from "next/link";
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

function AnimatedHeadline({ inView, align = "center" }: { inView: boolean; align?: "center" | "left" }) {
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setCycle(c => c + 1), 6000);
    return () => clearInterval(id);
  }, [inView]);

  const line1 = ["Welcome", "Back"];
  const line2 = ["To", "School", "DEALS"];
  const justify = align === "left" ? "justify-start" : "justify-center";

  return (
    <AnimatePresence mode="wait">
      <motion.div key={cycle} className={align === "left" ? "text-left" : "text-center"}>
        <div className={`flex flex-wrap ${justify} gap-x-[0.28em]`}>
          {line1.map((word, i) => (
            <motion.span key={word + i}
              className="font-display font-black uppercase leading-[1.1] tracking-tight text-white"
              style={{ fontSize: "clamp(20px, 2.6vw, 32px)" }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.38, delay: 0.05 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            >
              {word}
            </motion.span>
          ))}
        </div>
        <div className={`flex flex-wrap ${justify} gap-x-[0.28em]`}>
          {line2.map((word, i) => (
            <motion.span key={word + i}
              className="font-display font-black uppercase leading-[1.1] tracking-tight text-[#FF6B1A]"
              style={{ fontSize: "clamp(20px, 2.6vw, 32px)" }}
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

/** Promotes the "My Teacher, My Hero" nominations page (/nominate-a-teacher). */
function NominateTeacherPill() {
  return (
    <Link
      className="group inline-flex max-w-full items-center gap-2.5 rounded-2xl border border-[#FF6B1A]/40 bg-[#FF6B1A]/10 py-2 pl-2 pr-4 text-left transition hover:border-[#FF6B1A]/70 hover:bg-[#FF6B1A]/20"
      href="/nominate-a-teacher"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#FF6B1A] text-white">
        <Award className="h-4 w-4" />
      </span>
      <span className="text-[12px] leading-snug text-white/80">
        <strong className="block text-[13px] font-bold text-white">My Teacher, My Hero</strong>
        Nominate a teacher to win a Rev laptop
        <span className="ml-1 inline-block font-bold text-[#FF6B1A] transition-transform group-hover:translate-x-0.5">&rarr;</span>
      </span>
    </Link>
  );
}

const DEVICES = [
  { src: "/devices/rev_orion_laptop.png", alt: "Rev Orion laptop", label: "Rev Orion", href: "/products/orion" },
  { src: "/devices/rev_orion_laptop.png", alt: "Rev Aelia laptop", label: "Rev Aelia", href: "/products/aelia" },
];

export function BackToSchoolBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-40px" });
  const reveal = (delay: number) => ({
    initial: { opacity: 0, y: 10 },
    animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 },
    transition: { duration: 0.42, delay },
  });

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

      {/* ── DESKTOP: one horizontal row ── */}
      <div className="container-x relative z-10 hidden items-center justify-between gap-8 py-7 md:flex">
        <div className="min-w-0 shrink">
          <AnimatedHeadline align="left" inView={inView} />
          <motion.p className="mt-2 max-w-xs text-[13px] leading-[1.6] text-white/55" {...reveal(0.28)}>
            Big savings on laptops for students, teachers and schools.
          </motion.p>
        </div>

        <motion.div className="flex shrink-0 items-end gap-8 border-white/10 lg:border-x lg:px-10" {...reveal(0.38)}>
          {DEVICES.map((d) => (
            <Link className="group flex flex-col items-center gap-1.5" href={d.href} key={d.label}>
              <DeviceThumb alt={d.alt} className="h-20 w-auto object-contain drop-shadow-lg transition-transform group-hover:-translate-y-1" fallback={<LaptopSVG className="h-16 w-auto" />} src={d.src} />
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 transition-colors group-hover:text-white/70">{d.label}</span>
            </Link>
          ))}
        </motion.div>

        <motion.div className="hidden shrink-0 lg:block" {...reveal(0.5)}>
          <NominateTeacherPill />
        </motion.div>
      </div>
      {/* Between md and lg the row has no room for the pill, so it sits underneath. */}
      <div className="container-x relative z-10 hidden pb-6 md:block lg:hidden">
        <NominateTeacherPill />
      </div>

      {/* ── MOBILE: headline beside the laptop, pill underneath ── */}
      <div className="container-x relative z-10 py-6 md:hidden">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <AnimatedHeadline align="left" inView={inView} />
            <motion.p className="mt-2 text-[12.5px] leading-[1.55] text-white/55" {...reveal(0.3)}>
              Big savings on laptops for students, teachers and schools.
            </motion.p>
          </div>
          <motion.div {...reveal(0.4)}>
            <Link className="flex shrink-0 flex-col items-center gap-1" href={DEVICES[0].href}>
              <DeviceThumb alt={DEVICES[0].alt} className="h-16 w-auto object-contain drop-shadow-md" fallback={<LaptopSVG className="h-14 w-auto" />} src={DEVICES[0].src} />
              <span className="text-[9px] font-bold uppercase tracking-wider text-white/35">{DEVICES[0].label}</span>
            </Link>
          </motion.div>
        </div>
        <motion.div className="mt-5" {...reveal(0.5)}>
          <NominateTeacherPill />
        </motion.div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-white/6" />
    </div>
  );
}
