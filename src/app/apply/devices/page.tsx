"use client";

// ═══════════════════════════════════════════════════════════════
// /apply/devices  —  Pathway selector + device picker
//
// Step 0: Choose "Apply as an Individual" (pre-selected) or
//         "Apply as a School" (routes to /apply/school)
// Step 1: Pick a device → /apply?device=<id>
// ═══════════════════════════════════════════════════════════════

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Battery, Check, ChevronDown, ChevronUp,
  Cpu, GraduationCap, HardDrive, Monitor, School, Shield, Wifi, X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { StorefrontHeader } from "@/components/StorefrontHeader";
import { StorefrontFooter } from "@/components/StorefrontFooter";

const JAKARTA = "'Plus Jakarta Sans', ui-sans-serif, system-ui";
const SORA    = "'Sora', ui-sans-serif, system-ui";

// ─── Device catalogue ─────────────────────────────────────────
const DEVICES = [
  {
    id: "orion",
    name: 'Rev Orion 12"',
    tagline: "The teacher's everyday laptop — lightweight, powerful, ready.",
    category: "Laptop",
    badge: "Most Popular",
    badgeColor: "#581319",
    price: 290000,
    was: 350000,
    monthlyFrom: 14858,
    img: "/devices/rev-laptop.png",
    highlights: [
      "Intel® Celeron N4020 — up to 2.8GHz",
      "4GB RAM · 128GB eMMC Storage",
      "Splash-resistant keyboard",
      "2MP FHD webcam built-in",
      "Up to 8-hour battery",
      "0.98 kg — carry anywhere",
      "Microsoft Office 365 preloaded",
      "RevLearn platform preloaded",
      "2-year local warranty",
    ],
    specs: [
      { icon: "cpu",      label: "Processor", value: "Intel® Celeron N4020", sub: "Up to 2.8GHz dual-core" },
      { icon: "ram",      label: "RAM",        value: "4GB LPDDR4",           sub: "Responsive multitasking" },
      { icon: "storage",  label: "Storage",    value: "128GB eMMC",           sub: "Fast + expandable via MicroSD" },
      { icon: "display",  label: "Display",    value: '12.5" IPS FHD',        sub: "1920×1080 · anti-glare" },
      { icon: "battery",  label: "Battery",    value: "Up to 8 hours",        sub: "All-day classroom use" },
      { icon: "weight",   label: "Weight",     value: "0.98 kg",              sub: "Ultralight & portable" },
      { icon: "os",       label: "OS",         value: "Windows 11",           sub: "+ Office 365 + RevLearn" },
      { icon: "warranty", label: "Warranty",   value: "2 Years",              sub: "Local Nigeria-based support" },
    ],
    accentColor: "#581319",
    bg: "linear-gradient(135deg, #1a0608 0%, #2a0c10 100%)",
  },
  {
    id: "aelia",
    name: 'Rev Aelia 14"',
    tagline: "More screen, more power — built for serious teaching.",
    category: "Laptop",
    badge: "Pre-order",
    badgeColor: "#7c3aed",
    price: 330000,
    was: 400000,
    monthlyFrom: 17500,
    img: "/devices/rev-laptop.png",
    highlights: [
      "Intel® Core i3 — up to 4.4GHz",
      "8GB RAM · 256GB SSD Storage",
      '14" FHD IPS display',
      "Full-size backlit keyboard",
      "Up to 10-hour battery",
      "1.4 kg",
      "Microsoft Office 365 preloaded",
      "RevLearn platform preloaded",
      "2-year local warranty",
    ],
    specs: [
      { icon: "cpu",      label: "Processor", value: "Intel® Core i3-1215U", sub: "Up to 4.4GHz, 6 cores" },
      { icon: "ram",      label: "RAM",        value: "8GB DDR4",             sub: "Heavy multitasking" },
      { icon: "storage",  label: "Storage",    value: "256GB NVMe SSD",       sub: "3× faster than eMMC" },
      { icon: "display",  label: "Display",    value: '14" IPS FHD',          sub: "1920×1080 · anti-glare" },
      { icon: "battery",  label: "Battery",    value: "Up to 10 hours",       sub: "School day + evening" },
      { icon: "weight",   label: "Weight",     value: "1.4 kg",               sub: "Slim & portable" },
      { icon: "os",       label: "OS",         value: "Windows 11 Pro",       sub: "+ Office 365 + RevLearn" },
      { icon: "warranty", label: "Warranty",   value: "2 Years",              sub: "Local Nigeria-based support" },
    ],
    accentColor: "#7c3aed",
    bg: "linear-gradient(135deg, #0e0a1a 0%, #160e2a 100%)",
  },
  {
    id: "tab",
    name: 'Rev Tab 10"',
    tagline: "Tablets for students — tough, affordable, classroom-ready.",
    category: "Tablet",
    badge: "47% off",
    badgeColor: "#dc2626",
    price: 80000,
    was: 150000,
    monthlyFrom: null,
    img: "/devices/rev-tablet.png",
    highlights: [
      '10.1" IPS LCD 1280×800 display',
      "Quad-core ARM Cortex-A55",
      "3GB RAM · 32GB ROM",
      "MicroSD up to 256GB",
      "5,000mAh battery (up to 10hrs)",
      "5MP rear + 2MP front cameras",
      "Android 13",
      "Wi-Fi + Bluetooth 5.0",
    ],
    specs: [
      { icon: "display",  label: "Display",      value: '10.1" IPS',           sub: "1280×800" },
      { icon: "cpu",      label: "Processor",    value: "Quad-core ARM",       sub: "1.8GHz Cortex-A55" },
      { icon: "ram",      label: "RAM",          value: "3GB RAM",             sub: "32GB ROM + MicroSD" },
      { icon: "battery",  label: "Battery",      value: "5,000mAh",            sub: "Up to 10 hours" },
      { icon: "wifi",     label: "Connectivity", value: "Wi-Fi + BT 5.0",      sub: "802.11 b/g/n" },
      { icon: "os",       label: "OS",           value: "Android 13",          sub: "Latest Android" },
      { icon: "warranty", label: "Warranty",     value: "1 Year",              sub: "Local support" },
    ],
    accentColor: "#dc2626",
    bg: "linear-gradient(135deg, #1a0505 0%, #250808 100%)",
  },
];

// ─── Icon helper ──────────────────────────────────────────────
function SpecIcon({ type, color }: { type: string; color: string }) {
  const p = { fill:"none", stroke: color, strokeWidth:"1.7", strokeLinecap:"round" as const, strokeLinejoin:"round" as const };
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" {...p}>
      {type==="cpu"      && <><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6v6H9zM9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3"/></>}
      {type==="ram"      && <><rect x="2" y="8" width="20" height="8" rx="2"/><path d="M6 8V6M10 8V6M14 8V6M18 8V6M6 16v2M10 16v2M14 16v2M18 16v2"/></>}
      {type==="storage"  && <><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></>}
      {type==="display"  && <><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></>}
      {type==="battery"  && <><rect x="1" y="6" width="18" height="12" rx="2"/><path d="M23 13v-2"/><path d="M5 9v6M9 9v6"/></>}
      {type==="weight"   && <><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></>}
      {type==="os"       && <><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M7 8h2l2 5 2-5h2"/></>}
      {type==="warranty" && <><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z"/><path d="M9 12l2 2 4-4"/></>}
      {type==="wifi"     && <><path d="M5 12.55a11 11 0 0114.08 0"/><path d="M1.42 9a16 16 0 0121.16 0"/><path d="M8.53 16.11a6 6 0 016.95 0"/><circle cx="12" cy="20" r="1"/></>}
    </svg>
  );
}

function DeviceImg({ src, alt, style, className }: { src: string; alt: string; style?: React.CSSProperties; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return (
    <div className={className} style={{ display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.04)", borderRadius:12, ...style }}>
      <svg viewBox="0 0 280 190" fill="none" style={{ width:"80%", opacity:0.35 }}>
        <rect x="20" y="8" width="240" height="152" rx="10" fill="#2a2b2e" stroke="#333" strokeWidth="1"/>
        <rect x="30" y="16" width="220" height="136" rx="6" fill="#0d0e10"/>
        <text x="140" y="92" fontFamily={SORA} fontSize="18" fill="rgba(255,255,255,0.3)" textAnchor="middle">{alt}</text>
        <path d="M4 162L276 162L290 178L-10 178Z" fill="#1e1f21"/>
      </svg>
    </div>
  );
  return <img alt={alt} className={className} onError={() => setFailed(true)} src={src} style={style}/>;
}

const E: [number,number,number,number] = [0.16, 1, 0.3, 1];

// ═══════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════
export default function DevicePickerPage() {
  const router = useRouter();

  // Pathway: null = choosing, "individual" = device picker, "school" = redirect
  const [pathway, setPathway]   = useState<"individual" | "school" | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const selectedDevice = DEVICES.find(d => d.id === selected);

  function handleApply() {
    if (!selected) return;
    router.push(`/apply?device=${selected}`);
  }

  // ── Pathway selection screen ───────────────────────────────
  if (pathway === null) {
    return (
      <>
        <StorefrontHeader />
        <main className="maroon-glow relative min-h-screen" style={{ fontFamily: JAKARTA }}>
          <div className="noise-overlay" />
          <div style={{ maxWidth: 680, margin: "0 auto", padding: "64px 20px 80px", position: "relative", zIndex: 10 }}>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.5)", textDecoration: "none", marginBottom: 40 }}>
              <ArrowLeft size={14} /> Back to store
            </Link>

            <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", color: "#FF6B1A", textTransform: "uppercase", margin: "0 0 12px" }}>
              Teacher Digital Empowerment Programme
            </p>
            <h1 style={{ fontFamily: SORA, fontWeight: 900, fontSize: "clamp(28px,4vw,42px)", color: "#fff", margin: "0 0 10px", letterSpacing: "-0.025em", lineHeight: 1.08 }}>
              How would you like<br />to apply?
            </h1>
            <p style={{ fontSize: 14.5, color: "rgba(255,255,255,0.52)", lineHeight: 1.65, margin: "0 0 40px", maxWidth: 480 }}>
              Whether you&apos;re an individual teacher or a school looking to equip staff and students — we&apos;ve got you covered.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Individual — pre-selected feel */}
              <motion.button
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                type="button"
                onClick={() => setPathway("individual")}
                style={{
                  width: "100%", textAlign: "left", borderRadius: 20,
                  border: "2px solid rgba(255,107,26,0.6)",
                  background: "rgba(255,107,26,0.08)",
                  padding: "26px 28px", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 20,
                  position: "relative",
                }}
              >
                <div style={{ width: 52, height: 52, borderRadius: 14, background: "#FF6B1A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <GraduationCap size={24} color="#fff" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <p style={{ fontFamily: SORA, fontWeight: 800, fontSize: 18, color: "#fff", margin: 0 }}>Apply as an Individual</p>
                    <span style={{ fontSize: 10, fontWeight: 800, background: "#FF6B1A", color: "#fff", padding: "3px 9px", borderRadius: 5, letterSpacing: "0.06em" }}>MOST COMMON</span>
                  </div>
                  <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.5 }}>
                    A teacher, educator or individual applying for a device through the programme.
                  </p>
                </div>
                <ArrowRight size={20} color="rgba(255,107,26,0.7)" style={{ flexShrink: 0 }} />
              </motion.button>

              {/* School */}
              <motion.button
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                type="button"
                onClick={() => router.push("/apply/school")}
                style={{
                  width: "100%", textAlign: "left", borderRadius: 20,
                  border: "2px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.04)",
                  padding: "26px 28px", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 20,
                }}
              >
                <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <School size={24} color="rgba(255,255,255,0.7)" />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: SORA, fontWeight: 800, fontSize: 18, color: "#fff", margin: "0 0 4px" }}>Apply as a School</p>
                  <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: 1.5 }}>
                    A school owner or administrator looking to equip teachers, students or a computer lab with multiple devices.
                  </p>
                </div>
                <ArrowRight size={20} color="rgba(255,255,255,0.3)" style={{ flexShrink: 0 }} />
              </motion.button>
            </div>

            <p style={{ marginTop: 28, fontSize: 12, color: "rgba(255,255,255,0.28)", textAlign: "center" }}>
              Not sure? Start as an individual — you can always reach us for school enquiries at <span style={{ color: "#FF6B1A" }}>schools@revrica.com</span>
            </p>
          </div>
        </main>
      </>
    );
  }

  // ── Device picker (individual pathway) ────────────────────
  return (
    <>
      <StorefrontHeader />
      <main style={{ background: "#f5f5f5", minHeight: "100vh", fontFamily: JAKARTA }}>

        {/* Header band */}
        <div style={{ background: "linear-gradient(135deg, #581319 0%, #3a0810 100%)", padding: "32px 20px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <button
              type="button"
              onClick={() => setPathway(null)}
              style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.55)", background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 20 }}
            >
              <ArrowLeft size={14} /> Change pathway
            </button>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", color: "#FF6B1A", textTransform: "uppercase", margin: "0 0 8px" }}>
                  Individual Application — Step 1
                </p>
                <h1 style={{ fontFamily: SORA, fontWeight: 900, fontSize: "clamp(22px,3vw,34px)", color: "#fff", margin: 0, letterSpacing: "-0.02em" }}>
                  Choose your device
                </h1>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.52)", margin: "6px 0 0" }}>
                  Pick the one that fits your needs — then apply in minutes.
                </p>
              </div>
              {/* Step indicator */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {["Choose device", "Your details", "Employment", "Financial", "Verify"].map((s, i) => (
                  <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: i === 0 ? "#FF6B1A" : "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 10, fontWeight: 800, color: "#fff" }}>{i + 1}</span>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: i === 0 ? 700 : 500, color: i === 0 ? "#fff" : "rgba(255,255,255,0.35)", display: "none" }} className="sm:inline">{s}</span>
                    </div>
                    {i < 4 && <div style={{ width: 20, height: 1, background: "rgba(255,255,255,0.15)" }} />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Device cards */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "36px 20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            {DEVICES.map(device => {
              const isSelected = selected === device.id;
              const isExpanded = expanded === device.id;
              return (
                <motion.div
                  key={device.id}
                  layout
                  onClick={() => setSelected(device.id)}
                  style={{
                    borderRadius: 20,
                    border: isSelected ? `2px solid ${device.accentColor}` : "2px solid #e8e8e8",
                    background: "#fff",
                    cursor: "pointer",
                    overflow: "hidden",
                    boxShadow: isSelected ? `0 8px 32px ${device.accentColor}22` : "0 2px 8px rgba(0,0,0,0.04)",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                    position: "relative",
                  }}
                >
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        style={{ position: "absolute", top: 16, right: 16, zIndex: 10, width: 28, height: 28, borderRadius: "50%", background: device.accentColor, display: "flex", alignItems: "center", justifyContent: "center" }}
                      >
                        <Check size={14} color="#fff" strokeWidth={3} />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div style={{ position: "absolute", top: 16, left: 16, zIndex: 10, background: device.badgeColor, color: "#fff", fontSize: 10, fontWeight: 800, padding: "4px 10px", borderRadius: 6, letterSpacing: "0.04em" }}>
                    {device.badge}
                  </div>

                  <div style={{ background: `${device.accentColor}0a`, padding: "32px 24px 16px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 190 }}>
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 4.5, ease: "easeInOut", repeat: Infinity, delay: DEVICES.indexOf(device) * 0.8 }}
                      style={{ width: "65%", maxWidth: 200 }}
                    >
                      <DeviceImg alt={device.name} src={device.img} style={{ width: "100%", height: 150, objectFit: "contain" }} />
                    </motion.div>
                  </div>

                  <div style={{ padding: "18px 22px 22px" }}>
                    <p style={{ fontSize: 11, fontWeight: 800, color: device.accentColor, textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 4px" }}>{device.category}</p>
                    <h2 style={{ fontFamily: SORA, fontWeight: 800, fontSize: 20, color: "#111", margin: "0 0 6px" }}>{device.name}</h2>
                    <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 16px", lineHeight: 1.5 }}>{device.tagline}</p>

                    <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
                      <span style={{ fontFamily: SORA, fontWeight: 800, fontSize: 24, color: device.accentColor }}>₦{device.price.toLocaleString()}</span>
                      <span style={{ fontSize: 13, color: "#d1d5db", textDecoration: "line-through" }}>₦{device.was.toLocaleString()}</span>
                      {device.monthlyFrom && (
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#16a34a" }}>or ₦{device.monthlyFrom.toLocaleString()}/mo</span>
                      )}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 12px", marginBottom: 16 }}>
                      {device.highlights.slice(0, isExpanded ? undefined : 4).map(h => (
                        <div key={h} style={{ display: "flex", alignItems: "flex-start", gap: 7, fontSize: 12, color: "#374151" }}>
                          <Check size={12} color={device.accentColor} strokeWidth={3} style={{ flexShrink: 0, marginTop: 2 }} />
                          {h}
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={e => { e.stopPropagation(); setExpanded(isExpanded ? null : device.id); }}
                      style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, color: device.accentColor, background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 16 }}
                    >
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      {isExpanded ? "Hide full specs" : "View full specs"}
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: E }}
                          style={{ overflow: "hidden", marginBottom: 16 }}
                        >
                          <div style={{ borderRadius: 12, border: "1px solid #f0f0f0", overflow: "hidden" }}>
                            {device.specs.map((spec, i) => (
                              <div key={spec.label} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderBottom: i < device.specs.length - 1 ? "1px solid #f5f5f5" : "none", background: i % 2 === 0 ? "#fafafa" : "#fff" }}>
                                <div style={{ width: 34, height: 34, borderRadius: 9, background: `${device.accentColor}10`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                  <SpecIcon type={spec.icon} color={device.accentColor} />
                                </div>
                                <div>
                                  <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>{spec.label}</p>
                                  <p style={{ fontSize: 13.5, fontWeight: 700, color: "#111", margin: 0 }}>{spec.value}</p>
                                  {spec.sub && <p style={{ fontSize: 11.5, color: "#6b7280", margin: 0 }}>{spec.sub}</p>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button
                      onClick={e => { e.stopPropagation(); setSelected(isSelected ? null : device.id); }}
                      style={{
                        width: "100%", height: 44, borderRadius: 100,
                        background: isSelected ? device.accentColor : "transparent",
                        border: isSelected ? "none" : `2px solid ${device.accentColor}`,
                        color: isSelected ? "#fff" : device.accentColor,
                        fontSize: 13.5, fontWeight: 700, cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        fontFamily: JAKARTA, transition: "all 0.2s",
                      }}
                    >
                      {isSelected ? <><Check size={15} strokeWidth={3} /> Selected</> : "Select this device"}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
          {selected && <div style={{ height: 100 }} />}
        </div>

        {/* Sticky apply footer */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50, background: "#fff", borderTop: "1px solid #e8e8e8", boxShadow: "0 -8px 32px rgba(0,0,0,0.08)", padding: "16px 24px" }}
            >
              <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: `${selectedDevice!.accentColor}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <DeviceImg alt={selectedDevice!.name} src={selectedDevice!.img} style={{ width: 36, height: 36, objectFit: "contain" }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>{selectedDevice!.category} · Selected</p>
                    <p style={{ fontSize: 15, fontWeight: 800, color: "#111", margin: 0, fontFamily: SORA }}>{selectedDevice!.name}</p>
                  </div>
                  <div style={{ height: 40, width: 1, background: "#f0f0f0" }} />
                  <div>
                    <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>Pre-order price</p>
                    <p style={{ fontSize: 17, fontWeight: 800, color: selectedDevice!.accentColor, margin: 0, fontFamily: SORA }}>₦{selectedDevice!.price.toLocaleString()}</p>
                  </div>
                  {selectedDevice!.monthlyFrom && (
                    <>
                      <div style={{ height: 40, width: 1, background: "#f0f0f0" }} />
                      <div>
                        <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>Monthly from</p>
                        <p style={{ fontSize: 17, fontWeight: 800, color: "#16a34a", margin: 0, fontFamily: SORA }}>₦{selectedDevice!.monthlyFrom.toLocaleString()}/mo</p>
                      </div>
                    </>
                  )}
                </div>
                <button
                  onClick={handleApply}
                  style={{ display: "flex", alignItems: "center", gap: 10, height: 50, padding: "0 32px", borderRadius: 100, background: selectedDevice!.accentColor, border: "none", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: JAKARTA, whiteSpace: "nowrap" }}
                >
                  Apply for the {selectedDevice!.name} <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <StorefrontFooter />
    </>
  );
}