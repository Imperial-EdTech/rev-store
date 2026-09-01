"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  ArrowRight, Bell, Building2, CheckCircle2, Facebook, FlaskConical,
  Instagram, Linkedin, Mail, MapPin, MessageCircle, Phone,
  Search, ShoppingCart, Twitter, Youtube,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BackToSchoolBanner } from "@/components/BackToSchoolBanner";
import { HeroCarousel } from "@/components/HeroCarousel";
import { PreOrderPopup } from "@/components/preorder-popup";
import { RevricaLogo } from "@/components/brand";

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

// ─── Real deal products ───────────────────────────────────────
const DEALS = [
  {
    id: "orion",
    name: 'Rev Orion 12"',
    spec: "Intel Celeron N4020 · 4GB RAM · 128GB eMMC · Win 11",
    price: 290000, was: 350000, save: 17,
    img: "/devices/rev-laptop.png",
    badge: "Most Popular",
  },
  {
    id: "aelia",
    name: 'Rev Aelia 14"',
    spec: "Intel Core i3 · 8GB RAM · 256GB SSD · Win 11 Pro",
    price: 330000, was: 400000, save: 18,
    img: "/devices/rev-laptop.png",
    badge: "Pre-order",
  },
  {
    id: "tab",
    name: 'Rev Tab 10"',
    spec: "Quad-core ARM · 3GB RAM · 32GB ROM · Android 13",
    price: 80000, was: 150000, save: 47,
    img: "/devices/rev-tablet.png",
    badge: "47% off",
  },
  {
    id: "tab-4g",
    name: 'Rev Tab 4G 10"',
    spec: "Octa-core · 4GB RAM · 64GB · 4G LTE · Android 13",
    price: 110000, was: 140000, save: 21,
    img: "/devices/rev-tablet.png",
    badge: "New",
  },
];

// ─── Mobile menu ──────────────────────────────────────────────
function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navLinks = [
    ["Laptops", "/products"],
    ["Tablets", "/products"],
    ["All-in-Ones", "#"],
    ["Mini PCs", "#"],
    ["Interactive Boards", "#"],
    ["Programs", "/teacher-empowerment"],
  ];
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-y-0 left-0 z-[200] w-[80vw] max-w-xs bg-white shadow-2xl flex flex-col"
            initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-black/8">
              <RevricaLogo variant="light" />
              <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-black/60" type="button">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <nav className="flex flex-col gap-1 px-4 py-5 flex-1">
              {navLinks.map(([label, href]) => (
                <Link key={label} href={href} onClick={onClose}
                  className="flex items-center gap-3 rounded-xl px-3 py-3.5 text-[14px] font-600 text-[#1a1a1a] hover:bg-orange-50 transition">
                  <ArrowRight size={14} className="text-[#f2760f]" />
                  {label}
                </Link>
              ))}
            </nav>
            <div className="px-4 pb-6 flex flex-col gap-3">
              <Link href="/pre-order" onClick={onClose}>
                <button className="w-full h-12 rounded-xl bg-[#f2760f] text-white text-[13px] font-700 flex items-center justify-center gap-2" type="button">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                  Pre-order Now
                </button>
              </Link>
              <Link href="/early-access" onClick={onClose}>
                <button className="w-full h-12 rounded-xl border border-black/12 text-[#374151] text-[13px] font-600 flex items-center justify-center gap-2" type="button">
                  Join Waitlist
                </button>
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════
export default function Home() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div style={{ background: "#f5f5f5", fontFamily: "'Plus Jakarta Sans','Inter Variable',ui-sans-serif,system-ui" }}>
      <PreOrderPopup />
      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Sora:wght@700;800&display=swap');
        .serve-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .deals-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
        .why-grid { display: grid; grid-template-columns: repeat(4,1fr); }
        .programs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .trust-grid { display: grid; grid-template-columns: repeat(4,1fr); }
        .footer-grid { display: grid; grid-template-columns: 1.6fr 1fr 1fr 1fr; gap: 32px; }
        .financing-bar { display: flex; align-items: center; }
        .top-info-bar { display: flex; }
        .deals-header { display: flex; align-items: flex-end; justify-content: space-between; }
        .newsletter-row { display: flex; align-items: center; gap: 20px; }
        .bulk-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .nav-desktop { display: flex; }
        .nav-mobile-btn { display: none; }
        .search-bar { display: block; }
        @media (max-width: 1024px) {
          .deals-grid { grid-template-columns: repeat(2,1fr) !important; }
          .footer-grid { grid-template-columns: 1fr 1fr 1fr !important; }
        }
        @media (max-width: 768px) {
          .serve-grid { grid-template-columns: 1fr !important; }
          .deals-grid { grid-template-columns: 1fr 1fr !important; }
          .why-grid { grid-template-columns: 1fr 1fr !important; }
          .programs-grid { grid-template-columns: 1fr !important; }
          .trust-grid { grid-template-columns: 1fr 1fr !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .financing-bar { flex-direction: column !important; align-items: flex-start !important; gap: 14px !important; }
          .top-info-bar { display: none !important; }
          .deals-header { flex-direction: column; align-items: flex-start !important; gap: 12px !important; }
          .newsletter-row { flex-direction: column; align-items: flex-start !important; gap: 14px !important; }
          .bulk-grid { grid-template-columns: 1fr !important; }
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
          .search-bar { display: none !important; }
        }
        @media (max-width: 480px) {
          .deals-grid { grid-template-columns: 1fr !important; }
          .why-grid { grid-template-columns: 1fr !important; }
          .trust-grid { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── TOP INFO BAR ── */}
      <div className="top-info-bar" style={{ background: "#111", padding: "8px 0" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 11.5, color: "rgba(255,255,255,0.5)" }}>
            <span>About</span><span>Support</span><span>FAQ</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f2760f", display: "inline-block" }} />
            <span style={{ color: "#f2760f", fontWeight: 700 }}>Pre-order open</span>
            <span style={{ color: "rgba(255,255,255,0.45)" }}>— Rev Orion from ₦290,000</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 11.5, color: "rgba(255,255,255,0.5)" }}>
            <span>+234 813 611 7198</span>
            <span style={{ color: "#f2760f" }}>support@revrica.com</span>
          </div>
        </div>
      </div>

      {/* ── HEADER ── */}
      <header style={{ background: "#fff", borderBottom: "1px solid #e8e8e8", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, height: 64 }}>
            {/* Hamburger — mobile only */}
            <button
              className="nav-mobile-btn"
              onClick={() => setMobileMenuOpen(true)}
              style={{ height: 36, width: 36, alignItems: "center", justifyContent: "center", borderRadius: 8, border: "1.5px solid #e8e8e8", background: "transparent", cursor: "pointer", flexShrink: 0 }}
              type="button" aria-label="Open menu"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>

            {/* Logo — light variant for white header */}
            <div style={{ flexShrink: 0 }}>
              <RevricaLogo variant="light" />
            </div>

            {/* Search — hidden on mobile */}
            <div className="search-bar" style={{ flex: 1, maxWidth: 500, position: "relative" }}>
              <Search size={14} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#aaa" }} />
              <input
                placeholder="Search laptops, tablets, accessories..."
                style={{ width: "100%", height: 38, borderRadius: 9, border: "1.5px solid #e8e8e8", background: "#fafafa", paddingLeft: 36, paddingRight: 14, fontSize: 12.5, color: "#111", outline: "none", boxSizing: "border-box" }}
              />
            </div>

            {/* Desktop actions */}
            <div className="nav-desktop" style={{ alignItems: "center", gap: 8, marginLeft: "auto" }}>
              <Link href="/pre-order">
                <button style={{ height: 37, padding: "0 18px", borderRadius: 8, border: "none", background: "#f2760f", fontSize: 12.5, fontWeight: 700, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 7, whiteSpace: "nowrap" }} type="button">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="#fff"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                  Pre-order
                </button>
              </Link>
            </div>

            {/* Mobile: pre-order pill only */}
            <div className="nav-mobile-btn" style={{ marginLeft: "auto" }}>
              <Link href="/pre-order">
                <button style={{ height: 36, padding: "0 14px", borderRadius: 8, border: "none", background: "#f2760f", fontSize: 12, fontWeight: 700, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }} type="button">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                  Pre-order
                </button>
              </Link>
            </div>
          </div>

          {/* Category nav — desktop */}
          <nav className="nav-desktop" style={{ alignItems: "center", gap: 4, height: 40, borderTop: "1px solid #f0f0f0", overflowX: "auto" }}>
            {[["Laptops", "/products"], ["Tablets", "/products"], ["All-in-Ones", "#"], ["Mini PCs", "#"], ["Interactive Boards", "#"], ["Content Servers", "#"]].map(([label, href]) => (
              <Link key={label} href={href}
                style={{ padding: "0 12px", height: "100%", display: "flex", alignItems: "center", fontSize: 12.5, fontWeight: 600, color: "#374151", whiteSpace: "nowrap", textDecoration: "none" }}>
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main>
        {/* 1. HERO CAROUSEL */}
        <div style={{ background: "#0a0a0a" }}>
          <HeroCarousel />
        </div>

        {/* 2. BACK TO SCHOOL BANNER */}
        <BackToSchoolBanner />

        {/* 3. WHO WE SERVE */}
        <section style={{ background: "#fff", padding: "52px 20px" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <h2 style={{ fontFamily: "Sora,sans-serif", fontWeight: 800, fontSize: 28, color: "#111", letterSpacing: "-0.02em", margin: "0 0 8px" }}>
                Who <span style={{ color: "#f2760f" }}>we serve</span>
              </h2>
              <div style={{ width: 36, height: 3, background: "#f2760f", margin: "0 auto", borderRadius: 2 }} />
            </div>
            <div className="serve-grid">
              {/* Students */}
              <div style={{ borderRadius: 18, background: "linear-gradient(135deg,#e8f5ee 0%,#d4eddc 100%)", padding: "36px 32px", position: "relative", overflow: "hidden", display: "flex", gap: 20, alignItems: "flex-end", minHeight: 240 }}>
                <div style={{ flex: 1, zIndex: 2, position: "relative" }}>
                  <div style={{ display: "inline-block", fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", color: "#0a6b35", textTransform: "uppercase", marginBottom: 12, background: "rgba(10,107,53,0.1)", padding: "4px 10px", borderRadius: 4 }}>For Students</div>
                  <h3 style={{ fontFamily: "Sora,sans-serif", fontWeight: 800, fontSize: 26, color: "#111", margin: "0 0 10px", lineHeight: 1.15 }}>Learn better.<br />Do more.</h3>
                  <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, margin: "0 0 22px", maxWidth: 240 }}>Reliable devices for studying, assignments and research.</p>
                  <Link href="/products">
                    <button style={{ display: "inline-flex", alignItems: "center", gap: 7, height: 42, padding: "0 22px", borderRadius: 100, background: "#0a6b35", border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }} type="button">
                      Shop student deals <ArrowRight size={13} />
                    </button>
                  </Link>
                </div>
                <div style={{ width: 140, flexShrink: 0, alignSelf: "flex-end" }}>
                  <DeviceImg alt="Student with Rev device" src="/images/student.png" className="w-full object-contain" />
                </div>
                <div style={{ position: "absolute", right: -20, bottom: -20, width: 160, height: 160, borderRadius: "50%", background: "rgba(10,107,53,0.06)", pointerEvents: "none" }} />
              </div>
              {/* Teachers */}
              <div style={{ borderRadius: 18, background: "linear-gradient(135deg,#fff3ec 0%,#fde8d4 100%)", padding: "36px 32px", position: "relative", overflow: "hidden", display: "flex", gap: 20, alignItems: "flex-end", minHeight: 240 }}>
                <div style={{ flex: 1, zIndex: 2, position: "relative" }}>
                  <div style={{ display: "inline-block", fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", color: "#b45309", textTransform: "uppercase", marginBottom: 12, background: "rgba(180,83,9,0.1)", padding: "4px 10px", borderRadius: 4 }}>For Teachers</div>
                  <h3 style={{ fontFamily: "Sora,sans-serif", fontWeight: 800, fontSize: 26, color: "#111", margin: "0 0 10px", lineHeight: 1.15 }}>Teach better.<br />Inspire more.</h3>
                  <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, margin: "0 0 22px", maxWidth: 240 }}>Built for planning, lessons and every part of your school day.</p>
                  <Link href="/apply/devices">
                    <button style={{ display: "inline-flex", alignItems: "center", gap: 7, height: 42, padding: "0 22px", borderRadius: 100, background: "#f2760f", border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }} type="button">
                      Shop teacher deals <ArrowRight size={13} />
                    </button>
                  </Link>
                </div>
                <div style={{ width: 140, flexShrink: 0, alignSelf: "flex-end" }}>
                  <DeviceImg alt="Teacher with Rev laptop" src="/images/teacher.png" className="w-full object-contain" />
                </div>
                <div style={{ position: "absolute", right: -20, bottom: -20, width: 160, height: 160, borderRadius: "50%", background: "rgba(242,118,15,0.06)", pointerEvents: "none" }} />
              </div>
            </div>
          </div>
        </section>

        {/* 4. TODAY'S DEALS */}
        <section style={{ background: "#f5f5f5", padding: "52px 20px" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto" }}>
            <div className="deals-header" style={{ marginBottom: 24 }}>
              <div>
                <h2 style={{ fontFamily: "Sora,sans-serif", fontWeight: 800, fontSize: 28, color: "#111", letterSpacing: "-0.02em", margin: "0 0 4px" }}>
                  Today's <span style={{ color: "#f2760f" }}>deals</span>
                </h2>
                <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>Limited-time offers on our most popular devices.</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                <span style={{ fontSize: 12, color: "#6b7280" }}>Offer ends in</span>
                <Countdown />
              </div>
            </div>
            <div className="deals-grid">
              {DEALS.map((p) => (
                <Link key={p.id} href={`/products/${p.id}`} style={{ textDecoration: "none" }}>
                  <motion.div
                    whileHover={{ y: -3, boxShadow: "0 12px 32px rgba(0,0,0,0.10)" }}
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
            <div style={{ textAlign: "center", marginTop: 28 }}>
              <Link href="/products">
                <button style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 46, padding: "0 32px", borderRadius: 100, border: "1.5px solid #e0e0e0", background: "#fff", fontSize: 13, fontWeight: 700, color: "#374151", cursor: "pointer" }} type="button">
                  View all offers <ArrowRight size={13} />
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* 5. WHY REVSTORE */}
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
                  <Link href="/apply/devices?pathway=ltbt">
                    <button style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#f2760f", fontWeight: 700, fontSize: 13, cursor: "pointer", padding: 0 }} type="button">
                      Learn more <ArrowRight size={12} />
                    </button>
                  </Link>
                </div>
                <div style={{ flexShrink: 0, width: 120, alignSelf: "flex-end" }}>
                  <DeviceImg alt="Teacher with laptop" src="/images/ltbt-teacher.png" className="w-full object-contain" />
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
      <footer style={{ background: "#0a0a0a", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        {/* Newsletter */}
        <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "28px 20px" }}>
          <div className="newsletter-row" style={{ maxWidth: 1240, margin: "0 auto" }}>
            <div style={{ flex: "0 0 auto" }}>
              <p style={{ fontWeight: 700, fontSize: 14, color: "#fff", margin: "0 0 3px" }}>Stay in the loop</p>
              <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.35)", margin: 0 }}>Deals, programs and product updates — no spam.</p>
            </div>
            <div style={{ display: "flex", gap: 8, width: "100%", maxWidth: 460, marginLeft: "auto" }}>
              <input
                type="email" placeholder="Enter your email"
                value={email} onChange={e => setEmail(e.target.value)}
                style={{ flex: 1, height: 42, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", padding: "0 14px", fontSize: 13, color: "#fff", outline: "none", boxSizing: "border-box" }}
              />
              <button
                onClick={() => { if (email) setSubscribed(true); }}
                style={{ height: 42, padding: "0 18px", borderRadius: 8, border: "none", background: "#f2760f", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}
                type="button"
              >
                {subscribed ? "Subscribed ✓" : "Subscribe"}
              </button>
            </div>
          </div>
        </div>

        {/* Footer links */}
        <div className="footer-grid" style={{ maxWidth: 1240, margin: "0 auto", padding: "36px 20px" }}>
          <div>
            <div style={{ marginBottom: 14 }}>
              <RevricaLogo />
            </div>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", lineHeight: 1.65, margin: "0 0 16px", maxWidth: 210 }}>African hardware, built for impact. Proudly designed and assembled in Nigeria.</p>
            <div style={{ display: "flex", gap: 8 }}>
              {[Facebook, Twitter, Instagram, Linkedin, Youtube].map((Icon, i) => (
                <div key={i} style={{ width: 30, height: 30, borderRadius: 7, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={13} color="rgba(255,255,255,0.4)" />
                </div>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "0.14em", color: "rgba(255,255,255,0.28)", textTransform: "uppercase", margin: "0 0 14px" }}>Shop</p>
            {["Laptops","Tablets","All-in-Ones","Mini PCs","Interactive Boards"].map(l => (
              <Link key={l} href="/products" style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.45)", textDecoration: "none", marginBottom: 9 }}>{l}</Link>
            ))}
          </div>
          <div>
            <p style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "0.14em", color: "rgba(255,255,255,0.28)", textTransform: "uppercase", margin: "0 0 14px" }}>Company</p>
            {["About Us","Careers","Newsroom","Contact Us"].map(l => (
              <Link key={l} href="#" style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.45)", textDecoration: "none", marginBottom: 9 }}>{l}</Link>
            ))}
          </div>
          <div>
            <p style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "0.14em", color: "rgba(255,255,255,0.28)", textTransform: "uppercase", margin: "0 0 14px" }}>Support</p>
            {["Support Center","Warranty","Shipping & Delivery","Returns"].map(l => (
              <Link key={l} href="#" style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.45)", textDecoration: "none", marginBottom: 9 }}>{l}</Link>
            ))}
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "14px 20px" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.22)", margin: 0 }}>© {new Date().getFullYear()} RevStore by Revrica. All rights reserved.</p>
            <div style={{ display: "flex", gap: 20 }}>
              {["Terms & Conditions","Privacy Policy"].map(l => (
                <Link key={l} href="#" style={{ fontSize: 11, color: "rgba(255,255,255,0.22)", textDecoration: "none" }}>{l}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
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
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, maxWidth: 540, margin: "0 0 36px" }}>
            Whether you're setting up a computer lab, rolling out devices for your teachers, or building a custom solution for your students — we work with you to get it right. Volume pricing, flexible delivery, and on-site support included.
          </p>
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
          <a
            href={`https://wa.me/2348136117198?text=${encodeURIComponent("Hi Revrica, I'd like to enquire about a bulk order for my school/institution.")}`}
            target="_blank" rel="noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 9, height: 48, padding: "0 26px", borderRadius: 100, background: "#25D366", border: "none", color: "#fff", fontSize: 13.5, fontWeight: 700, cursor: "pointer", textDecoration: "none" }}
          >
            <MessageCircle size={16} />
            WhatsApp us
          </a>
          <a
            href="mailto:schools@revrica.com?subject=Bulk Order Enquiry"
            style={{ display: "inline-flex", alignItems: "center", gap: 9, height: 48, padding: "0 26px", borderRadius: 100, border: "1.5px solid rgba(255,255,255,0.18)", background: "transparent", color: "#fff", fontSize: 13.5, fontWeight: 700, cursor: "pointer", textDecoration: "none" }}
          >
            <Mail size={15} />
            Email us
          </a>
        </motion.div>

        <p style={{ marginTop: 16, fontSize: 11.5, color: "rgba(255,255,255,0.28)" }}>
          We typically respond within one business day. You can also call us on <span style={{ color: "#f2760f" }}>+234 813 611 7198</span>.
        </p>
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
    { n: "02", title: "We visit or call", body: "Our team will contact you to arrange a walkthrough, in person or online." },
    { n: "03", title: "Get your report", body: "A clear, actionable plan — gaps, recommendations and next steps." },
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
              Our free Tech Audit gives you a clear picture of where your school's technology stands — and a practical roadmap to get it where it needs to be. No sales pitch. No obligation.
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
            <p style={{ marginTop: 12, fontSize: 12, color: "#9ca3af" }}>Free · No commitment · Takes 5 minutes to book</p>
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