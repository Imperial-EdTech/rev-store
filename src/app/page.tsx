"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  ArrowRight, FlaskConical, MessageCircle, ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type React from "react";
import { BackToSchoolBanner } from "@/components/BackToSchoolBanner";
import { HeroCarousel } from "@/components/HeroCarousel";
import { PreOrderPopup } from "@/components/preorder-popup";
import { StorefrontHeader } from "@/components/StorefrontHeader";
import { StorefrontFooter } from "@/components/StorefrontFooter";
import { getProduct, specSummary } from "@/lib/catalog";
import { WHATSAPP_NUMBER } from "@/lib/contact";
import { FEATURES } from "@/lib/features";

// ─── Helpers ──────────────────────────────────────────────────
function fmt(n: number) { return "₦" + n.toLocaleString("en-NG"); }

function DeviceImg({ src, alt, className, style }: {
  src: string; alt: string; className?: string; style?: React.CSSProperties;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) return (
    <div className={`${className ?? ""} flex items-center justify-center rounded-lg bg-black/5`} style={style}>
      <span className="text-[11px] font-semibold text-black/25">{alt}</span>
    </div>
  );
  return <img alt={alt} className={className} onError={() => setFailed(true)} src={src} style={style} />;
}

// ─── Countdown ────────────────────────────────────────────────
function Countdown() {
  const endRef = useRef<number>(Date.now() + 9 * 3600 * 1000);
  const [time, setTime] = useState({ h: "09", m: "00", s: "00" });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, endRef.current - Date.now());
      setTime({
        h: String(Math.floor(diff / 3600000)).padStart(2, "0"),
        m: String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0"),
        s: String(Math.floor((diff % 60000) / 1000)).padStart(2, "0"),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex items-center gap-1">
      {[{ val: time.h, label: "Hrs" }, { val: time.m, label: "Min" }, { val: time.s, label: "Sec" }].map((u, i) => (
        <span key={u.label} className="flex items-center gap-1">
          <span className="flex min-w-[36px] flex-col items-center justify-center rounded-lg px-2 py-1 tabular-nums"
            style={{ background: "#1a1a1a", color: "#fff", fontSize: 14, fontWeight: 800, lineHeight: 1.15 }}>
            {u.val}
            <span style={{ fontSize: 8, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em" }}>{u.label}</span>
          </span>
          {i < 2 && <span style={{ color: "rgba(255,255,255,0.3)", fontWeight: 700, fontSize: 12 }}>:</span>}
        </span>
      ))}
    </div>
  );
}

// ─── Trust icon ───────────────────────────────────────────────
function TrustIcon({ type }: { type: string }) {
  const s = { fill: "none", stroke: "#f2760f", strokeWidth: "1.6", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      {type === "shield"  && <><path {...s} d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z"/><path {...s} d="M9 12l2 2 4-4"/></>}
      {type === "headset" && <><path {...s} d="M3 11C3 6.03 7.03 2 12 2s9 4.03 9 9"/><path {...s} d="M3 11v3a2 2 0 002 2h1V11H3z"/><path {...s} d="M21 11v3a2 2 0 01-2 2h-1V11h3z"/></>}
      {type === "wallet"  && <><rect {...s} x="2" y="7" width="20" height="14" rx="2"/><path {...s} d="M16 3H5a2 2 0 00-2 2v2"/><path {...s} d="M22 12h-4a2 2 0 000 4h4"/></>}
      {type === "flag"    && <><path {...s} d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line {...s} x1="4" y1="22" x2="4" y2="15"/></>}
    </svg>
  );
}

// ─── Deal products ────────────────────────────────────────────
// Name, specs, price and image come from the catalogue (src/lib/catalog.ts);
// only the marketing badge is set here.
const DEAL_BADGES: [id: string, badge: string][] = [
  ["orion", "Most Popular"],
  ["aelia", "Pre-order"],
  ["tab", "47% off"],
  ["tab-4g", "New"],
];

const DEALS = DEAL_BADGES.flatMap(([id, badge]) => {
  const p = getProduct(id);
  if (!p || p.price === null || !p.image) return [];
  const was = p.compareAtPrice ?? p.price;
  return [{
    id,
    name: p.name,
    spec: specSummary(p),
    price: p.price,
    was,
    save: Math.round(((was - p.price) / was) * 100),
    img: p.image,
    badge,
  }];
});

// ─── Section entrance animation wrapper ───────────────────────
function AnimatedSection({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─── WhatsApp Chat Button ──────────────────────────────────────
const WA_MESSAGE = encodeURIComponent(
  "Hi! I just visited the RevStore website and I'm interested in learning more about your devices and payment options. " +
  "Could you please help me with information on the available laptops/tablets, pricing, and your financing plans? " +
  "I'd love to find the best option for my needs. Thank you!"
);
const WA_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WA_MESSAGE}`;

function WhatsAppButton() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 999, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
      {/* Popup */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 10 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: "#fff",
              borderRadius: 18,
              boxShadow: "0 8px 40px rgba(0,0,0,0.16)",
              padding: "20px 20px 16px",
              width: 270,
              border: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="22" height="22" viewBox="0 0 32 32" fill="#fff">
                  <path d="M16 2C8.268 2 2 8.268 2 16c0 2.47.668 4.783 1.832 6.77L2 30l7.43-1.796A13.94 13.94 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm7.2 19.4c-.3.84-1.76 1.62-2.42 1.68-.62.06-1.2.28-4.04-.84-3.4-1.36-5.58-4.82-5.74-5.04-.16-.22-1.3-1.74-1.3-3.32s.82-2.36 1.12-2.68c.3-.32.66-.4.88-.4l.64.012c.2 0 .48-.076.74.56.3.72 1.02 2.48 1.1 2.66.08.18.14.4.028.64-.11.24-.166.39-.33.6-.16.21-.34.47-.48.63-.16.18-.33.38-.14.74.18.36.82 1.36 1.76 2.2 1.21 1.08 2.23 1.42 2.59 1.58.36.16.57.14.78-.08.22-.22.92-1.08 1.16-1.44.24-.36.48-.3.8-.18.32.12 2.04.96 2.4 1.14.36.18.6.26.68.4.08.22.08 1.06-.22 1.9z"/>
                </svg>
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: 13.5, color: "#111", margin: 0 }}>RevStore Support</p>
                <p style={{ fontSize: 11.5, color: "#25D366", margin: 0, fontWeight: 600 }}>● Online now</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 2, lineHeight: 1 }}
                type="button"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <p style={{ fontSize: 12.5, color: "#374151", lineHeight: 1.6, margin: "0 0 14px" }}>
              Have questions? Chat with us on WhatsApp — we typically reply in minutes.
            </p>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                style={{ width: "100%", height: 44, borderRadius: 12, background: "#25D366", border: "none", color: "#fff", fontSize: 13.5, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                type="button"
              >
                <svg width="18" height="18" viewBox="0 0 32 32" fill="#fff">
                  <path d="M16 2C8.268 2 2 8.268 2 16c0 2.47.668 4.783 1.832 6.77L2 30l7.43-1.796A13.94 13.94 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm7.2 19.4c-.3.84-1.76 1.62-2.42 1.68-.62.06-1.2.28-4.04-.84-3.4-1.36-5.58-4.82-5.74-5.04-.16-.22-1.3-1.74-1.3-3.32s.82-2.36 1.12-2.68c.3-.32.66-.4.88-.4l.64.012c.2 0 .48-.076.74.56.3.72 1.02 2.48 1.1 2.66.08.18.14.4.028.64-.11.24-.166.39-.33.6-.16.21-.34.47-.48.63-.16.18-.33.38-.14.74.18.36.82 1.36 1.76 2.2 1.21 1.08 2.23 1.42 2.59 1.58.36.16.57.14.78-.08.22-.22.92-1.08 1.16-1.44.24-.36.48-.3.8-.18.32.12 2.04.96 2.4 1.14.36.18.6.26.68.4.08.22.08 1.06-.22 1.9z"/>
                </svg>
                Chat on WhatsApp
              </motion.button>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The floating button itself */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        style={{
          width: 58,
          height: 58,
          borderRadius: "50%",
          background: "#25D366",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 20px rgba(37,211,102,0.45)",
          position: "relative",
        }}
        type="button"
        aria-label="Chat with us on WhatsApp"
      >
        {/* Pulse ring */}
        <motion.span
          animate={{ scale: [1, 1.55], opacity: [0.5, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: "#25D366",
            pointerEvents: "none",
          }}
        />
        <svg width="28" height="28" viewBox="0 0 32 32" fill="#fff">
          <path d="M16 2C8.268 2 2 8.268 2 16c0 2.47.668 4.783 1.832 6.77L2 30l7.43-1.796A13.94 13.94 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm7.2 19.4c-.3.84-1.76 1.62-2.42 1.68-.62.06-1.2.28-4.04-.84-3.4-1.36-5.58-4.82-5.74-5.04-.16-.22-1.3-1.74-1.3-3.32s.82-2.36 1.12-2.68c.3-.32.66-.4.88-.4l.64.012c.2 0 .48-.076.74.56.3.72 1.02 2.48 1.1 2.66.08.18.14.4.028.64-.11.24-.166.39-.33.6-.16.21-.34.47-.48.63-.16.18-.33.38-.14.74.18.36.82 1.36 1.76 2.2 1.21 1.08 2.23 1.42 2.59 1.58.36.16.57.14.78-.08.22-.22.92-1.08 1.16-1.44.24-.36.48-.3.8-.18.32.12 2.04.96 2.4 1.14.36.18.6.26.68.4.08.22.08 1.06-.22 1.9z"/>
        </svg>
      </motion.button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════
export default function Home() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <div style={{ background: "#f5f5f5", fontFamily: "'Plus Jakarta Sans','Inter Variable',ui-sans-serif,system-ui" }}>
      <PreOrderPopup />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Sora:wght@700;800&display=swap');
        .serve-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .deals-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
        .shop-cat-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
        .why-grid { display: grid; grid-template-columns: repeat(4,1fr); }
        .programs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .trust-grid { display: grid; grid-template-columns: repeat(4,1fr); }
        .financing-bar { display: flex; align-items: center; }
        .top-info-bar { display: flex; }
        .deals-header { display: flex; align-items: flex-end; justify-content: space-between; }
        .bulk-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 1024px) {
          .deals-grid { grid-template-columns: repeat(2,1fr) !important; }
          .shop-cat-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 768px) {
          .serve-grid { grid-template-columns: 1fr !important; }
          .deals-grid { grid-template-columns: 1fr 1fr !important; }
          .shop-cat-grid { grid-template-columns: 1fr 1fr !important; }
          .why-grid { grid-template-columns: 1fr 1fr !important; }
          .programs-grid { grid-template-columns: 1fr !important; }
          .trust-grid { grid-template-columns: 1fr 1fr !important; }
          .financing-bar { flex-direction: column !important; align-items: flex-start !important; gap: 14px !important; }
          .top-info-bar { display: none !important; }
          .deals-header { flex-direction: column; align-items: flex-start !important; gap: 12px !important; }
          .newsletter-row { flex-direction: column; align-items: flex-start !important; gap: 14px !important; }
          .bulk-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .deals-grid { grid-template-columns: 1fr !important; }
          .why-grid { grid-template-columns: 1fr !important; }
          .trust-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Shared storefront header (info bar, nav, search, cart) */}
      <StorefrontHeader />

      <main>
        {/* 1. HERO CAROUSEL */}
        <div style={{ background: "#0a0a0a" }}>
          <HeroCarousel />
        </div>

        {/* 2. BACK TO SCHOOL BANNER */}
        <BackToSchoolBanner />

        {/* WHO WE SERVE moved to /about page */}

        {/* 3. LIMITED OFFERS (hidden while FEATURES.homepageOffers is off) */}
        {FEATURES.homepageOffers && DEALS.length > 0 && (
        <AnimatedSection>
        <section style={{ background: "#f5f5f5", padding: "56px 20px" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto" }}>
            <div className="deals-header" style={{ marginBottom: 28 }}>
              <div>
                <h2 style={{ fontFamily: "Sora,sans-serif", fontWeight: 800, fontSize: 28, color: "#111", letterSpacing: "-0.02em", margin: "0 0 4px" }}>
                  Limited <span style={{ color: "#f2760f" }}>offers</span>
                </h2>
                <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>Limited-time offers on our most popular devices.</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                <span style={{ fontSize: 12, color: "#6b7280" }}>Offer ends in</span>
                <Countdown />
              </div>
            </div>
            <div className="deals-grid">
              {DEALS.map((p, idx) => (
                <Link key={p.id} href={`/products/${p.id}`} style={{ textDecoration: "none" }}>
                  <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.45, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -5, boxShadow: "0 16px 40px rgba(0,0,0,0.12)" }}
                    style={{ background: "#fff", borderRadius: 16, border: "1px solid #ebebeb", overflow: "hidden", cursor: "pointer", height: "100%", display: "flex", flexDirection: "column" }}
                  >
                    <div style={{ padding: "14px 14px 0", position: "relative" }}>
                      <div style={{ position: "absolute", top: 12, left: 12, background: "#f2760f", color: "#fff", fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 6, letterSpacing: "0.04em" }}>
                        SAVE {p.save}%
                      </div>
                      {p.badge && (
                        <div style={{ position: "absolute", top: 12, right: 12, background: "#111", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6 }}>
                          {p.badge}
                        </div>
                      )}
                      <div style={{ height: 148, display: "flex", alignItems: "center", justifyContent: "center", background: "#f9f9f9", borderRadius: 10, overflow: "hidden" }}>
                        <DeviceImg alt={p.name} src={p.img} className="h-28 w-auto object-contain" />
                      </div>
                    </div>
                    <div style={{ padding: "14px 16px 18px", flex: 1, display: "flex", flexDirection: "column" }}>
                      <h3 style={{ fontFamily: "Sora,sans-serif", fontWeight: 700, fontSize: 13.5, color: "#111", margin: "0 0 3px" }}>{p.name}</h3>
                      <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 10px", lineHeight: 1.5 }}>{p.spec}</p>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 12 }}>
                        <span style={{ fontFamily: "Sora,sans-serif", fontWeight: 800, fontSize: 18, color: "#f2760f" }}>{fmt(p.price)}</span>
                        <span style={{ fontSize: 11.5, color: "#d1d5db", textDecoration: "line-through" }}>{fmt(p.was)}</span>
                      </div>
                      <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>View details →</span>
                        <button style={{ width: 30, height: 30, borderRadius: 7, background: "#f2760f", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} type="button">
                          <ShoppingCart size={13} color="#fff" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        </AnimatedSection>
        )}

        {/* 4b. SHOP BY CATEGORY */}
        <AnimatedSection>
        <section style={{ background: "#fff", padding: "56px 20px", borderTop: "1px solid #ebebeb" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 10 }}>
              <h2 style={{ fontFamily: "Sora,sans-serif", fontWeight: 800, fontSize: 24, color: "#111", letterSpacing: "-0.02em", margin: 0 }}>
                Shop by <span style={{ color: "#f2760f" }}>category</span>
              </h2>
              <Link href="/products" style={{ fontSize: 13, fontWeight: 700, color: "#f2760f", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                View all <ArrowRight size={13} />
              </Link>
            </div>
            <div className="shop-cat-grid">
              {[
                {
                  label: "Laptops",
                  sub: "Work, learn & create",
                  href: "/products?category=laptops",
                  bg: "linear-gradient(135deg,#f0f4ff 0%,#e8eeff 100%)",
                  accent: "#3b5bdb",
                  icon: (
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#3b5bdb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="13" rx="2"/>
                      <path d="M0 21h24"/>
                    </svg>
                  ),
                },
                {
                  label: "Tablets",
                  sub: "Portable & powerful",
                  href: "/products?category=tablets",
                  bg: "linear-gradient(135deg,#fff0f6 0%,#ffe3ec 100%)",
                  accent: "#c2255c",
                  icon: (
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#c2255c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="4" y="2" width="16" height="20" rx="2"/>
                      <circle cx="12" cy="17.5" r="0.8" fill="#c2255c" stroke="none"/>
                    </svg>
                  ),
                },
                {
                  label: "All-in-Ones",
                  sub: "Desktop, reinvented",
                  href: "/products?category=all-in-ones",
                  bg: "linear-gradient(135deg,#f3fff3 0%,#e6ffe6 100%)",
                  accent: "#2f9e44",
                  icon: (
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#2f9e44" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2"/>
                      <path d="M8 21h8M12 17v4"/>
                    </svg>
                  ),
                },
                {
                  label: "Mini PCs",
                  sub: "Big power, tiny form",
                  href: "/products?category=mini-pcs",
                  bg: "linear-gradient(135deg,#fff9f0 0%,#fff3e0 100%)",
                  accent: "#e67700",
                  icon: (
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#e67700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="9" height="14" rx="2"/>
                      <path d="M16 8h3a1 1 0 011 1v6a1 1 0 01-1 1h-3"/>
                      <circle cx="7.5" cy="15" r="1" fill="#e67700" stroke="none"/>
                    </svg>
                  ),
                },
              ].map((cat, idx) => (
                <Link key={cat.label} href={cat.href} style={{ textDecoration: "none" }}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ duration: 0.4, delay: idx * 0.07, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -6, boxShadow: `0 12px 32px ${cat.accent}28` }}
                    style={{
                      background: cat.bg,
                      borderRadius: 20,
                      padding: "32px 24px 28px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: 16,
                      cursor: "pointer",
                      border: "1.5px solid transparent",
                      height: "100%",
                      boxSizing: "border-box",
                    }}
                  >
                    <motion.div
                      whileHover={{ rotate: [0, -8, 8, 0], scale: 1.08 }}
                      transition={{ duration: 0.4 }}
                      style={{ width: 68, height: 68, borderRadius: 16, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}
                    >
                      {cat.icon}
                    </motion.div>
                    <div>
                      <p style={{ fontFamily: "Sora,sans-serif", fontWeight: 800, fontSize: 17, color: "#111", margin: "0 0 4px", letterSpacing: "-0.01em" }}>{cat.label}</p>
                      <p style={{ fontSize: 12.5, color: "#6b7280", margin: 0 }}>{cat.sub}</p>
                    </div>
                    <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 700, color: cat.accent }}>
                      Browse <ArrowRight size={12} />
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        </AnimatedSection>

        {/* 5. WHY REVSTORE */}
        <AnimatedSection>
        <section style={{ background: "#fff", padding: "52px 20px", borderTop: "1px solid #ebebeb" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "Sora,sans-serif", fontWeight: 800, fontSize: 26, color: "#111", textAlign: "center", margin: "0 0 32px", letterSpacing: "-0.02em" }}>
              Why shop with <span style={{ color: "#f2760f" }}>RevStore?</span>
            </h2>
            <div className="why-grid" style={{ borderTop: "1px solid #f0f0f0", borderLeft: "1px solid #f0f0f0" }}>
              {[
                { icon: "shield",  title: "Quality devices",  sub: "Built to last in any environment" },
                { icon: "headset", title: "Local support",     sub: "Real people, always within reach" },
                { icon: "wallet",  title: "Easy payments",     sub: "From ₦15,000/month" },
                { icon: "flag",    title: "Proudly Nigerian",  sub: "Designed and made locally" },
              ].map((item) => (
                <div key={item.title} style={{ padding: "28px 24px", borderRight: "1px solid #f0f0f0", borderBottom: "1px solid #f0f0f0", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, textAlign: "center" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(242,118,15,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <TrustIcon type={item.icon} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 13.5, color: "#111", margin: "0 0 2px" }}>{item.title}</p>
                    <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        </AnimatedSection>

        {/* 6. PROGRAMS MAKING AN IMPACT */}
        <section style={{ background: "#f5f5f5", padding: "52px 20px" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "Sora,sans-serif", fontWeight: 800, fontSize: 26, color: "#111", margin: "0 0 24px", letterSpacing: "-0.02em" }}>
              Programs making an <span style={{ color: "#f2760f" }}>impact</span>
            </h2>
            <div className="programs-grid" style={{ marginBottom: 16 }}>
              <div style={{ borderRadius: 16, background: "linear-gradient(140deg,#1a2a38 0%,#0f1a22 100%)", padding: "32px 28px", position: "relative", overflow: "hidden", minHeight: 210, display: "flex", gap: 20, alignItems: "flex-start" }}>
                <div style={{ flex: 1, zIndex: 2, position: "relative" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 8 }}>In Partnership With</div>
                  <h3 style={{ fontFamily: "Sora,sans-serif", fontWeight: 800, fontSize: 22, color: "#fff", margin: "0 0 10px", lineHeight: 1.2 }}>Let There Be<br />Teachers</h3>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: "0 0 20px", lineHeight: 1.6 }}>Affordable laptops for teachers. Empowering every classroom.</p>
                  <Link href="/apply?pathway=ltbt">
                    <button style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#f2760f", fontWeight: 700, fontSize: 13, cursor: "pointer", padding: 0 }} type="button">
                      Learn more <ArrowRight size={12} />
                    </button>
                  </Link>
                </div>
                <div style={{ flexShrink: 0, width: 120, alignSelf: "flex-end" }}>
                </div>
              </div>
              <div style={{ borderRadius: 16, background: "linear-gradient(140deg,#0f2a1a 0%,#061408 100%)", padding: "32px 28px", position: "relative", overflow: "hidden", minHeight: 210 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 8 }}>Our Initiative</div>
                <h3 style={{ fontFamily: "Sora,sans-serif", fontWeight: 800, fontSize: 22, color: "#fff", margin: "0 0 10px", lineHeight: 1.2 }}>Teacher Digital<br />Empowerment<br />Program</h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: "0 0 20px", lineHeight: 1.6 }}>Equipping teachers with tools to teach, inspire and transform.</p>
                <Link href="/teacher-empowerment">
                  <button style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#f2760f", fontWeight: 700, fontSize: 13, cursor: "pointer", padding: 0 }} type="button">
                    Learn more <ArrowRight size={12} />
                  </button>
                </Link>
              </div>
            </div>
            {/* Financing bar */}
            <div className="financing-bar" style={{ borderRadius: 16, background: "#fff", border: "1px solid #ebebeb", padding: "22px 28px", gap: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, borderRight: "1px solid #f0f0f0", paddingRight: 28 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(242,118,15,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f2760f" strokeWidth="1.7" strokeLinecap="round"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 13.5, color: "#111", margin: 0 }}>Flexible payment plans</p>
                  <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>Spread over up to 36 months.</p>
                </div>
              </div>
              <div style={{ flex: 1, paddingLeft: 28, paddingRight: 28, borderRight: "1px solid #f0f0f0" }}>
                <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 2px" }}>Starting from</p>
                <p style={{ fontFamily: "Sora,sans-serif", fontWeight: 800, fontSize: 20, color: "#111", margin: 0 }}>₦15,000/month</p>
              </div>
              <div style={{ paddingLeft: 28 }}>
                <Link href="/teacher-empowerment">
                  <button style={{ display: "inline-flex", alignItems: "center", gap: 7, height: 42, padding: "0 22px", borderRadius: 100, border: "1.5px solid #f2760f", background: "#fff", fontSize: 13, fontWeight: 700, color: "#f2760f", cursor: "pointer" }} type="button">
                    Explore plans <ArrowRight size={13} />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 7. BULK ORDERS FOR SCHOOLS */}
        <BulkOrderSection />
        

        {/* 8. FREE TECH AUDIT */}
        <TechAuditSection />

        {/* 9. TRUST BAR */}
        <section style={{ background: "#0f0f0f", padding: "16px 20px" }}>
          <div className="trust-grid" style={{ maxWidth: 1240, margin: "0 auto" }}>
            {[
              { icon: "flag",    title: "Built in Nigeria",   sub: "Designed and manufactured locally." },
              { icon: "headset", title: "Local Support",      sub: "Real people. Always within reach." },
              { icon: "shield",  title: "Reliable & Durable", sub: "Tested for African environments." },
              { icon: "wallet",  title: "Trusted by Schools", sub: "Hundreds of schools nationwide." },
            ].map((item, i) => (
              <div key={item.title} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "18px 20px", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(242,118,15,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <TrustIcon type={item.icon} />
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 12.5, color: "#fff", margin: "0 0 2px" }}>{item.title}</p>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", margin: 0, lineHeight: 1.5 }}>{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        
      </main>

      {/* ── FOOTER ── */}
      {/* ═══ FOOTER ═══ */}
      <StorefrontFooter />

      {/* WhatsApp floating chat button */}
      <WhatsAppButton />
    </div>
  );
}

// ─── Bulk Order Section ───────────────────────────────────────
function BulkOrderSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ background: "linear-gradient(155deg, #3a0810 0%, #28060e 50%, #1a0308 100%)", padding: "64px 20px", position: "relative", overflow: "hidden" }}>
      {/* Dot grid */}
      <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px,transparent 1px)", backgroundSize: "22px 22px", pointerEvents: "none" }} />
      {/* Accent glow */}
      <div aria-hidden style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "60%", height: "1px", background: "linear-gradient(90deg,transparent,#f2760f,transparent)", opacity: 0.5 }} />

      <div style={{ maxWidth: 1240, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16,1,0.3,1] }}
        >
          {/* No eyebrow — heading stands alone */}
          <h2 style={{ fontFamily: "Sora,sans-serif", fontWeight: 800, fontSize: "clamp(24px,3.5vw,40px)", color: "#fff", margin: "0 0 14px", lineHeight: 1.1, letterSpacing: "-0.02em", maxWidth: 620 }}>
            Equipping your whole school?<br />
            <span style={{ color: "#f2760f" }}>Let's talk bulk.</span>
          </h2>
        </motion.div>

        <div className="bulk-grid" style={{ gap: 14 }}>
          {[
            { icon: "🖥️", title: "Computer labs", body: "Full lab setups — hardware, networking and installation." },
            { icon: "👩‍🏫", title: "Staff devices", body: "Laptops and accessories for every teacher on your payroll." },
            { icon: "🎒", title: "Student kits", body: "Durable, affordable devices scaled to your enrolment." },
            { icon: "⚙️", title: "Custom configs", body: "Spec what you need — pre-loaded software, branding and more." },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.1 + i * 0.08, ease: [0.16,1,0.3,1] }}
              style={{ background: "rgba(88,19,25,0.25)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "20px 22px", display: "flex", gap: 14, alignItems: "flex-start" }}
            >
              <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>{item.icon}</span>
              <div>
                <p style={{ fontWeight: 700, fontSize: 13.5, color: "#fff", margin: "0 0 4px" }}>{item.title}</p>
                <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: 1.5 }}>{item.body}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.42 }}
          style={{ marginTop: 36, display: "flex", flexWrap: "wrap", gap: 12 }}
        >
          <Link
            href="/apply/school"
            style={{ display: "inline-flex", alignItems: "center", gap: 9, height: 48, padding: "0 26px", borderRadius: 100, background: "#f2760f", color: "#fff", fontSize: 13.5, fontWeight: 700, textDecoration: "none" }}
          >
            Let's Talk<ArrowRight size={15} />
          </Link>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Revrica, I'd like to enquire about a bulk order for my school/institution.")}`}
            target="_blank" rel="noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 9, height: 48, padding: "0 26px", borderRadius: 100, background: "#25D366", border: "none", color: "#fff", fontSize: 13.5, fontWeight: 700, cursor: "pointer", textDecoration: "none" }}
          >
            <MessageCircle size={16} />
            WhatsApp us
          </a>
        </motion.div>

        
      </div>
    </section>
  );
}

// ─── Tech Audit Section ───────────────────────────────────────
function TechAuditSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const steps = [
    { n: "01", title: "Fill the form", body: "Tell us about your school — size, current setup, and what you need." },
    { n: "02", title: "Get your report", body: "A clear, actionable plan — gaps, recommendations and next steps." },
  ];

  return (
    <section ref={ref} style={{ background: "#fff", padding: "64px 20px", borderTop: "1px solid #ebebeb" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 48, alignItems: "center" }}>
          {/* Left: copy */}
          <motion.div
            style={{ flex: "1 1 340px" }}
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16,1,0.3,1] }}
          >
            {/* No eyebrow — heading stands alone */}
            <h2 style={{ fontFamily: "Sora,sans-serif", fontWeight: 800, fontSize: "clamp(22px,3vw,36px)", color: "#111", margin: "0 0 14px", lineHeight: 1.12, letterSpacing: "-0.02em" }}>
              Is your school's tech<br />
              <span style={{ color: "#f2760f" }}>ready for the future?</span>
            </h2>
            <p style={{ fontSize: 14.5, color: "#374151", lineHeight: 1.7, margin: "0 0 28px", maxWidth: 460 }}>
              Get a clear picture of where your school's technology stands — and a practical roadmap to get it where it needs to be.
            </p>
            <Link href="/tech-audit">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{ display: "inline-flex", alignItems: "center", gap: 9, height: 50, padding: "0 28px", borderRadius: 100, background: "#f2760f", border: "none", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
                type="button"
              >
                <FlaskConical size={16} />
                Book your free audit
                <ArrowRight size={14} />
              </motion.button>
            </Link>
            
          </motion.div>

          {/* Right: steps */}
          <motion.div
            style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: 0 }}
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16,1,0.3,1] }}
          >
            {steps.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 14 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.18 + i * 0.1 }}
                style={{ display: "flex", gap: 16, paddingBottom: i < steps.length - 1 ? 28 : 0, position: "relative" }}
              >
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div style={{ position: "absolute", left: 19, top: 40, width: 2, height: "calc(100% - 12px)", background: "#f0f0f0" }} />
                )}
                <div style={{ width: 40, height: 40, borderRadius: 12, background: i === 0 ? "#f2760f" : "rgba(242,118,15,0.08)", border: i === 0 ? "none" : "1.5px solid rgba(242,118,15,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1 }}>
                  <span style={{ fontFamily: "Sora,sans-serif", fontWeight: 800, fontSize: 12, color: i === 0 ? "#fff" : "#f2760f" }}>{step.n}</span>
                </div>
                <div style={{ paddingTop: 9 }}>
                  <p style={{ fontWeight: 700, fontSize: 14, color: "#111", margin: "0 0 4px" }}>{step.title}</p>
                  <p style={{ fontSize: 13, color: "#6b7280", margin: 0, lineHeight: 1.55 }}>{step.body}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}