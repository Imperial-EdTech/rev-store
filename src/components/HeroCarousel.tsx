"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Font stack ───────────────────────────────────────────────
const JAKARTA = "'Plus Jakarta Sans', 'Inter Variable', ui-sans-serif, system-ui";
const SORA    = "'Sora', 'Archivo Variable', ui-sans-serif, system-ui";

// ─── Slide definitions ────────────────────────────────────────
type Slide = {
  id:      string;
  kicker:  string;
  title1:  string;
  title2:  string;
  title2Color: string;
  body:    string;
  pills:   string[];
  pillIcon: string[];
  cta1:    string;
  cta1Href: string;
  cta1Style: "filled" | "outline";
  cta2:    string;
  cta2Href: string;
  bg:      string;
  accentColor: string;
  rightContent: "tdep" | "ltbt" | "nigeria" | "bts";
  /** Real device photo. Place at public/devices/<filename>.png */
  imageSrc: string;
};

const SLIDES: Slide[] = [
  {
    id: "tdep",
    kicker: "Our Initiative",
    title1: "Teacher Digital",
    title2: "Empowerment Scheme",
    title2Color: "#f2760f",
    body: "Equipping teachers with the right tools to teach, inspire and transform every classroom.",
    pills: ["Affordable laptops", "Digital skills training", "Local technical support", "Built for Nigerian schools"],
    pillIcon: ["laptop", "grad", "headset", "school"],
    cta1: "Learn more", cta1Href: "/teacher-empowerment", cta1Style: "filled",
    cta2: "Apply now",  cta2Href: "/apply",
    bg: "linear-gradient(135deg, #0f0a05 0%, #1a0e06 40%, #2a1008 70%, #1a0906 100%)",
    accentColor: "#f2760f",
    rightContent: "tdep",
    imageSrc: "/devices/rev_orion_laptop.png",
  },
  {
    id: "ltbt",
    kicker: "In Partnership With",
    title1: "Let There Be",
    title2: "Teachers",
    title2Color: "#f5a623",
    body: "Making quality teaching possible by putting powerful devices in the hands of teachers.",
    pills: ["For every educator", "Bank-backed financing", "Classroom-ready devices", "Nationwide impact"],
    pillIcon: ["grad", "wallet", "laptop", "flag"],
    cta1: "Learn more", cta1Href: "/apply", cta1Style: "outline",
    cta2: "", cta2Href: "",
    bg: "linear-gradient(135deg, #050e1a 0%, #071628 40%, #0a1e35 70%, #060f1e 100%)",
    accentColor: "#f5a623",
    rightContent: "ltbt",
    imageSrc: "/devices/rev_orion_laptop.png",
  },
  {
    id: "nigeria",
    kicker: "Built in Nigeria",
    title1: "Built in Nigeria.",
    title2: "Built for All.",
    title2Color: "#22c55e",
    body: "Designed, assembled and supported locally for real African realities.",
    pills: ["Nigerian OEM", "Local support", "Built to last", "Affordable"],
    pillIcon: ["flag", "headset", "shield", "wallet"],
    cta1: "Explore devices", cta1Href: "/products", cta1Style: "filled",
    cta2: "Get a quote",    cta2Href: "/apply",
    bg: "linear-gradient(135deg, #030d07 0%, #051408 40%, #071c0c 70%, #040e06 100%)",
    accentColor: "#22c55e",
    rightContent: "nigeria",
    imageSrc: "/devices/rev_orion_laptop.png",
  },
  {
    id: "bts",
    kicker: "WELCOME BACK",
    title1: "BACK TO",
    title2: "SCHOOL DEALS",
    title2Color: "#f2760f",
    body: "Big savings on laptops & devices for students, teachers and schools.",
    pills: ["Up to 15% off", "All devices", "Limited time", "Schools & teachers"],
    pillIcon: ["tag", "laptop", "clock", "school"],
    cta1: "Get notified", cta1Href: "/early-access", cta1Style: "filled",
    cta2: "Browse deals",  cta2Href: "/products",
    bg: "linear-gradient(135deg, #0f0805 0%, #1c0e06 40%, #2a1508 70%, #180b04 100%)",
    accentColor: "#f2760f",
    rightContent: "bts",
    imageSrc: "/devices/rev_orion_laptop.png",
  },
];

// ─── Easing ───────────────────────────────────────────────────
const E: [number,number,number,number] = [0.16, 1, 0.3, 1];

// ─── Copy variants ────────────────────────────────────────────
const copyV: Variants = {
  hidden:  { opacity: 0, x: -28 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: E, delay: 0.05 } },
  exit:    { opacity: 0, x: 20, transition: { duration: 0.28, ease: "easeIn" } },
};

// ─── Pill row variants (stagger) ─────────────────────────────
const pillContV: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.35 } },
  exit:    {},
};
const pillV: Variants = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: E } },
  exit:    { opacity: 0, transition: { duration: 0.15 } },
};

// ─── Right panel entry ────────────────────────────────────────
const rightV: Variants = {
  hidden:  { opacity: 0, x: 40, scale: 0.96 },
  visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.65, ease: E, delay: 0.1 } },
  exit:    { opacity: 0, x: -20, scale: 0.97, transition: { duration: 0.28, ease: "easeIn" } },
};

// ─── Pill icon SVGs ───────────────────────────────────────────
function PillIcon({ type, color }: { type: string; color: string }) {
  const s = { fill:"none", stroke: color, strokeWidth:"1.6", strokeLinecap:"round" as const };
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" {...s}>
      {type==="laptop"   && <><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M2 20h20"/></>}
      {type==="grad"     && <><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></>}
      {type==="headset"  && <><path d="M3 11C3 6.03 7.03 2 12 2s9 4.03 9 9"/><path d="M3 11v3a2 2 0 002 2h1V11H3z"/><path d="M21 11v3a2 2 0 01-2 2h-1V11h3z"/></>}
      {type==="school"   && <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></>}
      {type==="handshake"&& <><path d="M20.42 4.58a5.4 5.4 0 00-7.65 0l-.77.78-.77-.78a5.4 5.4 0 00-7.65 7.65l.77.77L12 21l7.65-7.65.77-.77a5.4 5.4 0 000-8.0z"/></>}
      {type==="flag"     && <><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></>}
      {type==="shield"   && <><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z"/></>}
      {type==="wallet"   && <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3H5a2 2 0 00-2 2v2"/><path d="M22 12h-4a2 2 0 000 4h4"/></>}
      {type==="tag"      && <><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></>}
      {type==="clock"    && <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></>}
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════
// DEVICE IMAGE — real photo with animated float + SVG fallback
// ═══════════════════════════════════════════════════════════════


function DeviceImage({
  src,
  alt,
  accent,
  floatAnimation = { y: [0, -14, 0] },
  floatDuration = 5.5,
}: {
  src: string;
  alt: string;
  accent: string;
  floatAnimation?: { y: number[] };
  floatDuration?: number;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "6% 4%" }}>
      {/* Accent glow behind image */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(ellipse 65% 55% at 55% 55%, ${accent}28 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* Dot-grid texture */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `radial-gradient(${accent}18 1px, transparent 1px)`,
        backgroundSize: "24px 24px",
        pointerEvents: "none",
      }} />

      {failed ? (
        /* ── SVG fallback — shown until real image is added ── */
        <motion.div
          animate={floatAnimation}
          transition={{ duration: floatDuration, ease: "easeInOut", repeat: Infinity }}
          style={{ width: "88%", maxWidth: 420, position: "relative", zIndex: 1 }}
        >
          <LaptopSVG accent={accent} />
          {/* "Add image" hint — only visible in dev */}
          <div style={{
            position: "absolute",
            bottom: -32,
            left: "50%",
            transform: "translateX(-50%)",
            whiteSpace: "nowrap",
            fontSize: 11,
            fontWeight: 600,
            color: `${accent}80`,
            letterSpacing: "0.04em",
            fontFamily: JAKARTA,
          }}>
            📁 Add image → {src}
          </div>
        </motion.div>
      ) : (
        /* ── Real device photo ── */
        <motion.div
          animate={floatAnimation}
          transition={{ duration: floatDuration, ease: "easeInOut", repeat: Infinity }}
          style={{
            position: "relative",
            zIndex: 1,
            width: "92%",
            maxWidth: 520,
            filter: `drop-shadow(0 32px 64px ${accent}50)`,
          }}
        >
          <img
            src={src}
            alt={alt}
            onError={() => setFailed(true)}
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
              display: "block",
            }}
          />
        </motion.div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DEVICE SVGs
// ═══════════════════════════════════════════════════════════════

function LaptopSVG({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 280 190" fill="none" style={{ width:"100%", filter:`drop-shadow(0 24px 48px ${accent}40)` }}>
      <defs>
        <linearGradient id="lid" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2a2b2e"/>
          <stop offset="100%" stopColor="#0e0f10"/>
        </linearGradient>
        <linearGradient id={`scr-${accent.replace("#","")}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.45"/>
          <stop offset="100%" stopColor="#060809" stopOpacity="0.95"/>
        </linearGradient>
      </defs>
      {/* Lid */}
      <rect x="20" y="8" width="240" height="152" rx="10" fill="url(#lid)" stroke="#333" strokeWidth="1"/>
      {/* Screen */}
      <rect x="30" y="16" width="220" height="136" rx="6" fill={`url(#scr-${accent.replace("#","")})`}/>
      {/* UI hint */}
      <rect x="44" y="30" width="80" height="6" rx="3" fill={accent} opacity="0.85"/>
      <rect x="44" y="44" width="56" height="5" rx="2.5" fill="rgba(255,255,255,0.15)"/>
      <rect x="44" y="58" width="100" height="5" rx="2.5" fill="rgba(255,255,255,0.08)"/>
      {/* Rev logo on screen */}
      <text x="160" y="100" fontFamily={SORA} fontWeight="800" fontSize="22" fill={accent} opacity="0.55" textAnchor="middle">rev</text>
      {/* Camera */}
      <circle cx="140" cy="12" r="3" fill="#1a1a1d"/>
      <circle cx="140" cy="12" r="1.4" fill="#2e2e32"/>
      {/* Base */}
      <path d="M4 162 L276 162 L290 178 L-10 178 Z" fill="#1e1f21"/>
      <rect x="120" y="162" width="40" height="5" rx="2" fill="#0c0c0d"/>
      {/* Rev brand strip */}
      <rect x="130" y="174" width="20" height="2" rx="1" fill={accent} opacity="0.7"/>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════
// ROOT CAROUSEL
// ═══════════════════════════════════════════════════════════════
export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused,  setPaused]  = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const go   = useCallback((n: number) => setCurrent((n + SLIDES.length) % SLIDES.length), []);
  const next = useCallback(() => go(current + 1), [current, go]);
  const prev = useCallback(() => go(current - 1), [current, go]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!paused) setCurrent(c => (c + 1) % SLIDES.length);
    }, 7000);
  }, [paused]);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused, resetTimer]);

  const s = SLIDES[current];

  const floatConfigs: Record<string, { y: number[]; duration: number }> = {
    tdep:    { y: [0, -14, 0], duration: 5.5 },
    ltbt:    { y: [0, -10, 0], duration: 5.0 },
    nigeria: { y: [0, -12, 0], duration: 6.0 },
    bts:     { y: [0, -10, 0], duration: 4.8 },
  };

  return (
    <div
      style={{ fontFamily: JAKARTA, width:"100%", position:"relative", overflow:"hidden" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Animated BG ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${s.id}`}
          animate={{ opacity:1 }}
          exit={{ opacity:0 }}
          initial={{ opacity:0 }}
          transition={{ duration:0.55 }}
          style={{ position:"absolute", inset:0, background:s.bg, zIndex:0 }}
        />
      </AnimatePresence>

      {/* Dot-grid overlay */}
      <div aria-hidden style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(rgba(255,255,255,0.045) 1px, transparent 1px)", backgroundSize:"26px 26px", pointerEvents:"none", zIndex:1 }} />

      {/* ── Page-aligned inner wrapper ── */}
      <div style={{ position:"relative", zIndex:2 }}>
        <div className="carousel-inner">
          {/* LEFT — copy */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`copy-${s.id}`}
              animate="visible" exit="exit" initial="hidden"
              variants={copyV}
              className="hero-copy"
            >
              {/* Kicker */}
              <div style={{ fontSize:11, fontWeight:800, letterSpacing:"0.18em", color:s.accentColor, textTransform:"uppercase", marginBottom:18, fontFamily:JAKARTA }}>
                {s.kicker}
              </div>

              {/* Headline */}
              <h1 style={{ margin:"0 0 6px", fontFamily:SORA, fontWeight:800, fontSize:"clamp(26px, 3.6vw, 50px)", lineHeight:1.08, letterSpacing:"-0.022em", color:"#f5f6f7" }}>
                {s.title1}
              </h1>
              <h1 style={{ margin:"0 0 20px", fontFamily:SORA, fontWeight:800, fontSize:"clamp(26px, 3.6vw, 50px)", lineHeight:1.08, letterSpacing:"-0.022em", color:s.title2Color }}>
                {s.title2}
              </h1>

              {/* Body */}
              <p style={{ fontSize:"clamp(13px, 1.4vw, 15.5px)", lineHeight:1.68, color:"rgba(255,255,255,0.58)", marginBottom:28, maxWidth:440 }}>
                {s.body}
              </p>

              {/* Pills */}
              <motion.div
                key={`pills-${s.id}`}
                animate="visible" exit="exit" initial="hidden"
                variants={pillContV}
                style={{ display:"flex", flexWrap:"wrap", gap:10, marginBottom:30 }}
              >
                {s.pills.map((pill, i) => (
                  <motion.div
                    key={pill}
                    variants={pillV}
                    style={{ display:"flex", alignItems:"center", gap:8, background:"rgba(255,255,255,0.06)", border:`1px solid ${s.accentColor}30`, borderRadius:10, padding:"7px 12px", fontSize:12, fontWeight:600, color:"rgba(255,255,255,0.72)", whiteSpace:"nowrap" }}
                  >
                    <PillIcon type={s.pillIcon[i]} color={s.accentColor} />
                    {pill}
                  </motion.div>
                ))}
              </motion.div>

              {/* CTAs */}
              <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
                <Link href={s.cta1Href}>
                  <button style={{
                    display:"inline-flex", alignItems:"center", gap:8,
                    height:44, padding:"0 24px", borderRadius:100,
                    background: s.cta1Style==="filled" ? s.accentColor : "transparent",
                    border: s.cta1Style==="filled" ? "none" : "1.5px solid rgba(255,255,255,0.3)",
                    color: s.cta1Style==="filled" ? (s.accentColor==="#f2760f" ? "#0d0500" : "#060605") : "#fff",
                    fontSize:13.5, fontWeight:700, cursor:"pointer", fontFamily:JAKARTA,
                  }}>
                    {s.cta1} <ArrowRight size={14}/>
                  </button>
                </Link>
                {s.cta2 && (
                  <Link href={s.cta2Href}>
                    <button style={{ display:"inline-flex", alignItems:"center", gap:8, height:44, padding:"0 22px", borderRadius:100, border:"1.5px solid rgba(255,255,255,0.2)", background:"rgba(255,255,255,0.04)", color:"rgba(255,255,255,0.75)", fontSize:13.5, fontWeight:600, cursor:"pointer", fontFamily:JAKARTA }}>
                      {s.cta2}
                    </button>
                  </Link>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* RIGHT — real device image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`scene-${s.id}`}
              animate="visible" exit="exit" initial="hidden"
              variants={rightV}
              className="hero-scene"
            >
              <DeviceImage
                src={s.imageSrc}
                alt={`${s.title1} ${s.title2}`}
                accent={s.accentColor}
                floatAnimation={{ y: floatConfigs[s.rightContent].y }}
                floatDuration={floatConfigs[s.rightContent].duration}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Footer: progress bar + arrows ── */}
        <div className="carousel-footer">
          {/* Progress bar only — no numbering */}
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            {SLIDES.map((sl, i) => (
              <button
                key={sl.id}
                onClick={() => { go(i); resetTimer(); }}
                aria-label={`Go to slide ${i + 1}`}
                style={{
                  width: i === current ? 32 : 8,
                  height: 4,
                  borderRadius: 4,
                  background: i === current ? s.accentColor : "rgba(255,255,255,0.2)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.35s ease",
                  padding: 0,
                }}
              />
            ))}
            {/* Auto-progress fill */}
            <div style={{ width:56, height:3, background:"rgba(255,255,255,0.1)", borderRadius:2, overflow:"hidden", marginLeft:4 }}>
              <motion.div
                key={`prog-${s.id}`}
                initial={{ width:"0%" }}
                animate={{ width:"100%" }}
                transition={{ duration:7, ease:"linear" }}
                style={{ height:"100%", background:s.accentColor, borderRadius:2 }}
              />
            </div>
          </div>

          {/* Arrows */}
          <div style={{ display:"flex", gap:8 }}>
            <button
              onClick={() => { prev(); resetTimer(); }}
              aria-label="Previous"
              style={{ width:40, height:40, borderRadius:"50%", border:"1px solid rgba(255,255,255,0.18)", background:"rgba(255,255,255,0.04)", color:"#f5f6f7", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}
            >
              <ChevronLeft size={16}/>
            </button>
            <button
              onClick={() => { next(); resetTimer(); }}
              aria-label="Next"
              style={{ width:40, height:40, borderRadius:"50%", border:`1px solid ${s.accentColor}`, background:"rgba(255,255,255,0.04)", color:s.accentColor, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}
            >
              <ChevronRight size={16}/>
            </button>
          </div>
        </div>
      </div>

      {/* ── Responsive CSS ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Sora:wght@700;800&display=swap');

        .carousel-inner {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 20px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 560px;
        }

        .hero-copy {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 52px 40px 52px 0;
        }

        .hero-scene {
          position: relative;
          overflow: hidden;
          min-height: 440px;
        }

        .carousel-footer {
          max-width: 1240px;
          margin: 0 auto;
          padding: 14px 20px 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid rgba(255,255,255,0.07);
        }

        @media (max-width: 768px) {
          .carousel-inner {
            grid-template-columns: 1fr;
            min-height: auto;
            padding: 0 16px;
          }
          .hero-copy {
            padding: 36px 0 24px;
            order: 1;
          }
          .hero-scene {
            min-height: 280px;
            order: 2;
          }
          .carousel-footer {
            padding: 12px 16px 18px;
          }
        }

        @media (max-width: 480px) {
          .hero-copy {
            padding: 28px 0 20px;
          }
          .hero-scene {
            min-height: 240px;
          }
        }
      `}</style>
    </div>
  );
}