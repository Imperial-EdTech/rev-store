"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const messages: [string, string][] = [
  ["A lot of quality devices,", "from ₦15,000/month"],
  ["Affordable laptops", "for every classroom"],
  ["Spread the cost", "over up to 24 months"],
  ["Built to last,", "classroom-ready every day"],
  ["Financing backed", "by licensed banks"],
  ["Warranty included", "on every device"]
];

/**
 * Slow, intermittent rotating announcement strip just under the header.
 * Uses the same dark band treatment as the "What We Do" section — same
 * background, white text, orange accent on the key phrase — so it reads
 * as part of one designed system rather than a separate utility bar.
 */
export function AnnouncementTicker() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((value) => (value + 1) % messages.length);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  const [lead, accent] = messages[index];

  return (
    <div className="ink-band relative overflow-hidden border-b border-white/5 py-2.5 text-center">
      <div className="noise-overlay-dark" />
      <AnimatePresence mode="wait">
        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-xs font-bold uppercase tracking-[0.12em] text-white/85"
          exit={{ opacity: 0, y: -6 }}
          initial={{ opacity: 0, y: 6 }}
          key={index}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {lead} <span className="text-rev-orange">{accent}</span>
        </motion.p>
      </AnimatePresence>
    </div>
  );
}