"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarClock, Fingerprint, GraduationCap, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

type CardContent = {
  icon: typeof Fingerprint;
  eyebrow: string;
  title: string;
  position: "top" | "bottom";
};

const cards: CardContent[] = [
  { icon: Fingerprint, eyebrow: "From", title: "₦15,000 / month", position: "top" },
  { icon: CalendarClock, eyebrow: "Term", title: "Up to 24 months", position: "bottom" },
  { icon: GraduationCap, eyebrow: "Program", title: "Teacher Empowerment", position: "top" },
  { icon: ShieldCheck, eyebrow: "Built For", title: "The classroom, daily", position: "bottom" }
];

/**
 * Rotating glass-card carousel that floats beside the hero device.
 * Headline price stays static in the page copy — this carousel only
 * carries secondary, rotating callouts, matching the existing site's
 * floating spec-card pattern (seen in the live revrica.com hero).
 */
export function HeroCardCarousel({ position }: { position: "top" | "bottom" }) {
  const filtered = cards.filter((card) => card.position === position);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((value) => (value + 1) % filtered.length);
    }, 3200);
    return () => clearInterval(id);
  }, [filtered.length]);

  const active = filtered[index];

  return (
    <div className="glass-card relative flex h-[92px] w-[250px] flex-col justify-center overflow-hidden rounded-2xl px-6 py-5 shadow-glass">
      <AnimatePresence mode="wait">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
          exit={{ opacity: 0, y: -10 }}
          initial={{ opacity: 0, y: 10 }}
          key={active.title}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rev-orange/90 text-maroon-deep">
            <active.icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-rev-peach">{active.eyebrow}</p>
            <p className="font-display text-base font-extrabold leading-snug text-white">{active.title}</p>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="mt-3 flex gap-1.5">
        {filtered.map((card, i) => (
          <span
            className={`h-1 rounded-full transition-all ${i === index ? "w-4 bg-rev-orange" : "w-1.5 bg-white/25"}`}
            key={card.title}
          />
        ))}
      </div>
    </div>
  );
}