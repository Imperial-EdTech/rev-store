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
    cta1: "Learn more", cta1Href: "/partners", cta1Style: "outline",
    cta2: "", cta2Href: "",
    bg: "linear-gradient(135deg, #050e1a 0%, #071628 40%, #0a1e35 70%, #060f1e 100%)",
    accentColor: "#f5a623",
    rightContent: "ltbt",
  },
  {
    id: "nigeria",
    kicker: "Built in Nigeria",
    title1: "For Nigerian schools.",
    title2: "By Nigerians.",
    title2Color: "#22c55e",
    body: "Designed, assembled and supported locally for real African realities.",
    pills: ["Nigerian OEM", "Local support", "Built to last", "Affordable"],
    pillIcon: ["flag", "headset", "shield", "wallet"],
    cta1: "Explore devices", cta1Href: "/products", cta1Style: "filled",
    cta2: "Get a quote",    cta2Href: "/apply",
    bg: "linear-gradient(135deg, #030d07 0%, #051408 40%, #071c0c 70%, #040e06 100%)",
    accentColor: "#22c55e",
    rightContent: "nigeria",
  },
  {
    id: "bts",
    kicker: "Coming Soon",
    title1: "Back to School",
    title2: "Deals",
    title2Color: "#f2760f",
    body: "Big savings on laptops & devices for students, teachers and schools.",
    pills: ["Up to 15% off", "All devices", "Limited time", "Schools & teachers"],
    pillIcon: ["tag", "laptop", "clock", "school"],
    cta1: "Get notified", cta1Href: "/early-access", cta1Style: "filled",
    cta2: "Browse deals",  cta2Href: "/products",
    bg: "linear-gradient(135deg, #0f0805 0%, #1c0e06 40%, #2a1508 70%, #180b04 100%)",
    accentColor: "#f2760f",
    rightContent: "bts",
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
// RIGHT PANEL SCENES
// ═══════════════════════════════════════════════════════════════

// Dot-grid Nigeria map silhouette
function NigeriaMap({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 320 280" fill="none" style={{ position:"absolute", right:0, top:0, width:"65%", height:"100%", opacity:0.15 }}>
      <defs>
        <radialGradient id="ngmap" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="1"/>
          <stop offset="100%" stopColor={accent} stopOpacity="0"/>
        </radialGradient>
      </defs>
      {Array.from({length:340}).map((_,i)=>{
        const row=Math.floor(i/20), col=i%20;
        const x=col*14+20, y=row*14+10;
        const inShape = x>40&&x<280&&y>30&&y<260 &&
          !(x<80&&y<80) && !(x>240&&y<60) && !(x<60&&y>200) && !(x>260&&y>180);
        return inShape ? <circle key={i} cx={x} cy={y} r="2.5" fill={accent}/> : null;
      })}
    </svg>
  );
}

// ── Scene: TDEP ── Laptop illustration + floating icons
function SceneTDEP({ accent }: { accent: string }) {
  const icons = [
    { icon: "laptop", pos: { top:"12%", right:"38%" }, delay: 0 },
    { icon: "grad",   pos: { top:"8%",  right:"22%" }, delay: 0.15 },
    { icon: "school", pos: { top:"28%", right:"12%" }, delay: 0.3 },
    { icon: "headset",pos: { top:"48%", right:"8%"  }, delay: 0.45 },
    { icon: "flag",   pos: { top:"66%", right:"18%" }, delay: 0.6 },
  ];
  return (
    <div style={{ position:"relative", width:"100%", height:"100%", overflow:"hidden" }}>
      <NigeriaMap accent={accent} />
      {/* Laptop — bigger, more centered */}
      <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", padding:"10% 8% 8% 4%" }}>
        <motion.div
          animate={{ y:[0,-14,0], rotateY:[0,6,0,-4,0] }}
          transition={{ duration:6, ease:"easeInOut", repeat:Infinity }}
          style={{ width:"88%", maxWidth:420 }}
        >
          <LaptopSVG accent={accent} />
        </motion.div>
      </div>
      {/* Glow halo behind laptop */}
      <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse 55% 50% at 55% 55%, ${accent}18 0%, transparent 70%)`, pointerEvents:"none" }} />
      {/* Floating icon circles */}
      {icons.map((item,i)=>(
        <motion.div
          key={i}
          animate={{ y:[0,-8,0], opacity:[0.7,1,0.7] }}
          initial={{ opacity:0, scale:0.5 }}
          transition={{ duration:3+i*0.4, ease:"easeInOut", repeat:Infinity, delay:item.delay, opacity:{ duration:0.5, delay:item.delay } }}
          whileInView={{ opacity:1, scale:1, transition:{ duration:0.4, delay:item.delay } }}
          style={{ position:"absolute", ...item.pos as React.CSSProperties }}
        >
          <div style={{ width:44, height:44, borderRadius:"50%", border:`1.5px solid ${accent}55`, background:`${accent}14`, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <PillIcon type={item.icon} color={accent} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ── Scene: LTBT ── Teacher + laptop, clean layout, no text list
function SceneLTBT({ accent }: { accent: string }) {
  return (
    <div style={{ position:"relative", width:"100%", height:"100%", overflow:"hidden", display:"flex", alignItems:"stretch" }}>
      {/* Dot-grid texture */}
      <div style={{ position:"absolute", inset:0, backgroundImage:`radial-gradient(${accent}22 1px, transparent 1px)`, backgroundSize:"22px 22px", pointerEvents:"none" }} />
      {/* Accent glow */}
      <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse 60% 55% at 60% 60%, ${accent}15 0%, transparent 70%)`, pointerEvents:"none" }} />
      {/* Logo badge — bottom left */}
      <div style={{ position:"absolute", left:"8%", bottom:"18%", zIndex:10 }}>
        <div style={{ background:"#fff", borderRadius:12, padding:"12px 20px", display:"flex", alignItems:"center", gap:12, boxShadow:"0 8px 32px rgba(0,0,0,0.35)" }}>
          <div style={{ width:32, height:32, background:"#f5a623", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </div>
          <div>
            <p style={{ fontSize:10, fontWeight:800, color:"#111", margin:0, letterSpacing:"0.06em" }}>LET THERE BE</p>
            <p style={{ fontSize:10, fontWeight:800, color:"#111", margin:0, letterSpacing:"0.06em" }}>TEACHERS</p>
          </div>
          <div style={{ width:1, height:32, background:"#e0e0e0" }}/>
          <span style={{ fontFamily:SORA, fontWeight:800, fontSize:20, color:"#111" }}>rev</span>
        </div>
      </div>
      {/* Laptop — large, centered, blended */}
      <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", padding:"8% 6% 20% 10%" }}>
        <motion.div
          animate={{ y:[0,-10,0] }}
          transition={{ duration:5, ease:"easeInOut", repeat:Infinity }}
          style={{ width:"90%", maxWidth:440 }}
        >
          <LaptopSVG accent={accent} />
        </motion.div>
      </div>
    </div>
  );
}

// ── Scene: Nigeria ── Device cluster + glow
function SceneNigeria({ accent }: { accent: string }) {
  return (
    <div style={{ position:"relative", width:"100%", height:"100%", overflow:"hidden" }}>
      <NigeriaMap accent={accent} />
      {/* Glow */}
      <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse 55% 50% at 60% 50%, ${accent}18 0%, transparent 70%)`, pointerEvents:"none" }} />
      {/* Device cluster — bigger, centered */}
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16, padding:"8%" }}>
        {/* Laptop */}
        <motion.div
          animate={{ y:[0,-8,0], rotateZ:[0,1,0,-1,0] }}
          transition={{ duration:4.5, ease:"easeInOut", repeat:Infinity }}
          style={{ width:"80%", maxWidth:320 }}
        >
          <LaptopSVG accent={accent} />
        </motion.div>
        {/* Tablet + Mini PC side by side */}
        <div style={{ display:"flex", gap:16, justifyContent:"center", width:"70%" }}>
          <motion.div
            animate={{ y:[0,-6,0] }}
            transition={{ duration:3.8, ease:"easeInOut", repeat:Infinity, delay:0.7 }}
            style={{ width:"38%" }}
          >
            <TabletSVG accent={accent} />
          </motion.div>
          <motion.div
            animate={{ y:[0,-5,0] }}
            transition={{ duration:4.2, ease:"easeInOut", repeat:Infinity, delay:1.3 }}
            style={{ width:"52%" }}
          >
            <MiniPCSVG accent={accent} />
          </motion.div>
        </div>
      </div>
      {/* rev label */}
      <div style={{ position:"absolute", right:"6%", bottom:"8%", fontSize:11, fontWeight:700, color:accent, letterSpacing:"0.08em", fontFamily:SORA }}>rev</div>
    </div>
  );
}

// ── Scene: Back to School ── Devices + discount badge
function SceneBTS({ accent }: { accent: string }) {
  return (
    <div style={{ position:"relative", width:"100%", height:"100%", overflow:"hidden" }}>
      {/* Glow */}
      <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse 60% 55% at 58% 48%, ${accent}18 0%, transparent 70%)`, pointerEvents:"none" }} />
      <motion.div
        animate={{ rotate:[0,2,0,-1,0], y:[0,-8,0] }}
        transition={{ duration:5, ease:"easeInOut", repeat:Infinity }}
        style={{ position:"absolute", right:"36%", top:"8%", width:110, height:110 }}
      >
        <BackpackSVG accent={accent} />
      </motion.div>
      <motion.div
        animate={{ y:[0,-10,0], rotateY:[0,8,0] }}
        transition={{ duration:4.5, ease:"easeInOut", repeat:Infinity, delay:0.5 }}
        style={{ position:"absolute", right:"4%", top:"14%", width:"55%" }}
      >
        <LaptopSVG accent={accent} />
      </motion.div>
      <motion.div
        animate={{ y:[0,-6,0] }}
        transition={{ duration:3.8, ease:"easeInOut", repeat:Infinity, delay:1.1 }}
        style={{ position:"absolute", right:"10%", bottom:"12%", width:"28%" }}
      >
        <TabletSVG accent={accent} />
      </motion.div>
      {/* Discount badge */}
      <motion.div
        animate={{ scale:[1,1.04,1], rotate:[0,2,0,-1,0] }}
        transition={{ duration:3, ease:"easeInOut", repeat:Infinity }}
        style={{ position:"absolute", right:"6%", bottom:"22%", width:72, height:72, borderRadius:"50%", background:accent, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", boxShadow:`0 8px 28px ${accent}55` }}
      >
        <span style={{ fontSize:11, fontWeight:800, color:"#fff", lineHeight:1.1 }}>UP TO</span>
        <span style={{ fontSize:20, fontWeight:900, color:"#fff", lineHeight:1.1, fontFamily:SORA }}>15%</span>
        <span style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.85)" }}>OFF</span>
      </motion.div>
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

function TabletSVG({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 120 170" fill="none" style={{ width:"100%", filter:`drop-shadow(0 10px 24px ${accent}30)` }}>
      <rect x="4" y="4" width="112" height="162" rx="14" fill="#1a1b1e" stroke="#2e2f33" strokeWidth="1"/>
      <rect x="10" y="10" width="100" height="150" rx="10" fill="#0d0e10"/>
      <rect x="14" y="18" width="92" height="134" rx="7" fill={`${accent}25`}/>
      <text x="60" y="88" fontFamily={SORA} fontWeight="800" fontSize="16" fill={accent} opacity="0.55" textAnchor="middle">rev</text>
      <circle cx="60" cy="6" r="3" fill="#0d0e10"/>
    </svg>
  );
}

function MiniPCSVG({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 140 90" fill="none" style={{ width:"100%", filter:`drop-shadow(0 8px 20px ${accent}25)` }}>
      <rect x="4" y="4" width="132" height="82" rx="10" fill="#1a1b1e" stroke="#2e2f33" strokeWidth="1"/>
      <rect x="12" y="12" width="116" height="66" rx="6" fill="#0d0e10"/>
      <rect x="18" y="18" width="104" height="54" rx="4" fill={`${accent}22`}/>
      <circle cx="20" cy="78" r="3" fill={accent} opacity="0.6"/>
      <text x="70" y="50" fontFamily={SORA} fontWeight="800" fontSize="14" fill={accent} opacity="0.45" textAnchor="middle">rev</text>
    </svg>
  );
}

function BackpackSVG({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 120 140" fill="none" style={{ width:"100%", filter:`drop-shadow(0 10px 24px ${accent}35)` }}>
      <rect x="18" y="24" width="84" height="104" rx="16" fill={accent}/>
      <rect x="26" y="32" width="68" height="50" rx="10" fill={`${accent}bb`}/>
      <rect x="34" y="48" width="52" height="20" rx="6" fill={`${accent}88`}/>
      <path d="M44 24 Q60 10 76 24" stroke="rgba(0,0,0,0.2)" strokeWidth="6" strokeLinecap="round" fill="none"/>
      <rect x="48" y="86" width="24" height="30" rx="8" fill="rgba(0,0,0,0.15)"/>
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

  const rightScene = {
    tdep:    <SceneTDEP    accent={s.accentColor} />,
    ltbt:    <SceneLTBT    accent={s.accentColor} />,
    nigeria: <SceneNigeria accent={s.accentColor} />,
    bts:     <SceneBTS     accent={s.accentColor} />,
  }[s.rightContent];

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

          {/* RIGHT — scene */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`scene-${s.id}`}
              animate="visible" exit="exit" initial="hidden"
              variants={rightV}
              className="hero-scene"
            >
              {rightScene}
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