"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FEATURES } from "@/lib/features";

const JAKARTA = "'Plus Jakarta Sans', ui-sans-serif, system-ui";
const SORA    = "'Sora', ui-sans-serif, system-ui";

const STORAGE_KEY   = "revstore_popup_v2";
const DISMISS_HOURS = 24;

const DEVICES = [
  {
    id:    "orion",
    name:  'Rev Orion 12"',
    cat:   "Laptop",
    price: 290000,
    was:   350000,
    mo:    14858,
    badge: "Most Popular",
    color: "#FF6B1A",
    perks: ["Intel Celeron · 4GB RAM · 128GB", "Up to 8hr battery · 0.98 kg", "Office 365 + RevLearn included"],
  },
  {
    id:    "aelia",
    name:  'Rev Aelia 14"',
    cat:   "Laptop",
    price: 330000,
    was:   400000,
    mo:    17500,
    badge: "Pre-order",
    color: "#7c3aed",
    perks: ["Intel Core i3 · 8GB · 256GB SSD", "Up to 10hr battery · 1.4 kg", "Office 365 + RevLearn included"],
  },
];

function fmt(n: number) { return "₦" + n.toLocaleString("en-NG"); }

/**
 * Teacher Empowerment pre-order modal.
 * Controlled by FEATURES.preorderPopup (src/lib/features.ts); set it to true to re-enable.
 * The check happens here, so pages can keep rendering <PreOrderPopup /> unchanged.
 */
export function PreOrderPopup() {
  if (!FEATURES.preorderPopup) return null;
  return <PreOrderPopupModal />;
}

function PreOrderPopupModal() {
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

  function dismiss() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ at: Date.now() })); } catch { /**/ }
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop — clicking it dismisses */}
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[190] bg-black/75 backdrop-blur-sm"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={dismiss}
            transition={{ duration: 0.3 }}
          />

          {/* Modal — z-index above backdrop */}
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="relative w-full pointer-events-auto"
              exit={{ opacity: 0, scale: 0.95, y: 24 }}
              initial={{ opacity: 0, scale: 0.93, y: 32 }}
              style={{ maxWidth: 680 }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
            >
              <div
                className="relative overflow-hidden rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,0.7)]"
                style={{ background: "linear-gradient(150deg, #1e0608 0%, #2e0a0e 40%, #150304 100%)" }}
              >
                {/* Grain */}
                <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
                  style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 0.5px,transparent 0.5px)", backgroundSize: "3px 3px" }} />

                {/* Glows */}
                <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#FF6B1A] opacity-[0.08] blur-3xl" />
                <div className="pointer-events-none absolute -bottom-14 -left-14 h-52 w-52 rounded-full bg-[#581319] opacity-[0.12] blur-3xl" />

                {/* Close button — fully clickable */}
                <button
                  aria-label="Close"
                  className="absolute right-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/60 transition hover:bg-white/22 hover:text-white cursor-pointer"
                  onClick={dismiss}
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="relative z-10 p-7 sm:p-9" style={{ fontFamily: JAKARTA }}>
                  {/* Pulse badge */}
                  <div className="mb-5 flex items-center gap-2.5">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF6B1A] opacity-60" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#FF6B1A]" />
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", color: "#FF6B1A", textTransform: "uppercase" }}>
                      Teacher Empowerment Programme — Open Now
                    </span>
                  </div>

                  {/* Headline */}
                  <h2 style={{ fontFamily: SORA, fontWeight: 800, fontSize: "clamp(22px,4vw,32px)", color: "#f5f6f7", lineHeight: 1.08, margin: "0 0 8px", letterSpacing: "-0.02em" }}>
                    A laptop for every teacher.
                  </h2>
                  <p style={{ fontSize: 14.5, color: "rgba(255,255,255,0.5)", lineHeight: 1.65, margin: "0 0 24px", maxWidth: 480 }}>
                    Own a Rev laptop from <strong style={{ color: "#FF6B1A" }}>{fmt(14858)}/month</strong>. Zero upfront cost. Choose your device, apply in minutes.
                  </p>

                  {/* Device cards */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12, marginBottom: 22 }}>
                    {DEVICES.map(d => (
                      <div key={d.id} style={{ position: "relative", borderRadius: 14, border: `1.5px solid ${d.color}28`, background: "rgba(255,255,255,0.04)", padding: "16px 16px 14px", overflow: "hidden" }}>
                        <span style={{ position: "absolute", top: 9, right: 9, background: d.color, color: "#fff", fontSize: 9.5, fontWeight: 800, padding: "3px 8px", borderRadius: 5, letterSpacing: "0.04em" }}>
                          {d.badge}
                        </span>
                        <p style={{ fontSize: 10.5, fontWeight: 700, color: d.color, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 4px" }}>{d.cat}</p>
                        <p style={{ fontFamily: SORA, fontWeight: 800, fontSize: 15, color: "#fff", margin: "0 0 10px" }}>{d.name}</p>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 7, marginBottom: 3 }}>
                          <span style={{ fontFamily: SORA, fontWeight: 800, fontSize: 19, color: d.color }}>{fmt(d.price)}</span>
                          <span style={{ fontSize: 11.5, color: "rgba(255,255,255,0.22)", textDecoration: "line-through" }}>{fmt(d.was)}</span>
                        </div>
                        <p style={{ fontSize: 11.5, fontWeight: 700, color: "#22c55e", margin: "0 0 12px" }}>or {fmt(d.mo)}/month</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                          {d.perks.map(p => (
                            <div key={p} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "rgba(255,255,255,0.55)" }}>
                              <Check size={11} color={d.color} strokeWidth={3} style={{ flexShrink: 0 }} />
                              {p}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CTAs — both fully clickable Links */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <Link
                      href="/apply/devices"
                      onClick={dismiss}
                      style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, height: 52, borderRadius: 100, background: "#581319", color: "#fff", fontWeight: 800, fontSize: 14.5, textDecoration: "none", fontFamily: JAKARTA, cursor: "pointer", border: "none" }}
                    >
                      See devices &amp; apply <ArrowRight size={16} />
                    </Link>
                    <button
                      onClick={dismiss}
                      type="button"
                      style={{ height: 44, borderRadius: 100, border: "1px solid rgba(255,255,255,0.14)", background: "transparent", color: "rgba(255,255,255,0.48)", fontWeight: 700, fontSize: 13.5, cursor: "pointer", fontFamily: JAKARTA }}
                    >
                      I&apos;ll browse first
                    </button>
                  </div>

                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.18)", textAlign: "center", marginTop: 14 }}>
                    No commitment required. Submitting an application does not guarantee financing approval.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}