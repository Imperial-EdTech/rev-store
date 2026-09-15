"use client";

// ═══════════════════════════════════════════════════════════════
// /apply/devices  —  Device picker
//
// User lands here from "Apply Now" anywhere on the site.
// They pick a laptop, then proceed to /apply?device=<id>
// where they choose their pathway (Individual / LTBT / Government).
// ═══════════════════════════════════════════════════════════════

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Check, ChevronDown, ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { StorefrontHeader } from "@/components/StorefrontHeader";
import { StorefrontFooter } from "@/components/StorefrontFooter";

const JAKARTA = "'Plus Jakarta Sans', ui-sans-serif, system-ui";
const SORA    = "'Sora', ui-sans-serif, system-ui";

// ─── Device catalogue (laptops only, no discounts) ────────────
const DEVICES = [
  {
    id: "orion",
    name: 'Rev Orion 12"',
    tagline: "The teacher's everyday laptop — lightweight, powerful, ready.",
    category: "Laptop",
    badge: "Most Popular",
    badgeColor: "#4a0e10",
    price: 290000,
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
    accentColor: "#4a0e10",
  },
  {
    id: "aelia",
    name: 'Rev Aelia 14"',
    tagline: "More screen, more power — built for serious teaching.",
    category: "Laptop",
    badge: "Pre-order",
    badgeColor: "#7c3aed",
    price: 330000,
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
  },
];

// ─── Spec icon SVG helper ──────────────────────────────────────
function SpecIcon({ type, color }: { type: string; color: string }) {
  const p = { fill: "none", stroke: color, strokeWidth: "1.7", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" {...p}>
      {type === "cpu"      && <><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6v6H9zM9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3"/></>}
      {type === "ram"      && <><rect x="2" y="8" width="20" height="8" rx="2"/><path d="M6 8V6M10 8V6M14 8V6M18 8V6M6 16v2M10 16v2M14 16v2M18 16v2"/></>}
      {type === "storage"  && <><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></>}
      {type === "display"  && <><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></>}
      {type === "battery"  && <><rect x="1" y="6" width="18" height="12" rx="2"/><path d="M23 13v-2"/><path d="M5 9v6M9 9v6"/></>}
      {type === "weight"   && <><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></>}
      {type === "os"       && <><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M7 8h2l2 5 2-5h2"/></>}
      {type === "warranty" && <><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z"/><path d="M9 12l2 2 4-4"/></>}
    </svg>
  );
}

// ─── Device image with SVG fallback ───────────────────────────
function DeviceImg({ src, alt, style }: { src: string; alt: string; style?: React.CSSProperties }) {
  const [failed, setFailed] = useState(false);
  if (failed) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.04)", borderRadius: 12, ...style }}>
      <svg viewBox="0 0 280 190" fill="none" style={{ width: "80%", opacity: 0.35 }}>
        <rect x="20" y="8" width="240" height="152" rx="10" fill="#2a2b2e" stroke="#333" strokeWidth="1"/>
        <rect x="30" y="16" width="220" height="136" rx="6" fill="#0d0e10"/>
        <text x="140" y="92" fontFamily={SORA} fontSize="18" fill="rgba(255,255,255,0.3)" textAnchor="middle">{alt}</text>
        <path d="M4 162L276 162L290 178L-10 178Z" fill="#1e1f21"/>
      </svg>
    </div>
  );
  return <img alt={alt} onError={() => setFailed(true)} src={src} style={style} />;
}

const E: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ═══════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════
export default function DevicePickerPage() {
  const router = useRouter();

  const [selected, setSelected] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const selectedDevice = DEVICES.find(d => d.id === selected);

  function handleApply() {
    if (!selected) return;
    router.push(`/apply?device=${selected}`);
  }

  return (
    <>
      <StorefrontHeader />
      <main style={{ background: "#f5f5f5", minHeight: "100vh", fontFamily: JAKARTA }}>

        {/* ── Page header band ── */}
        <div style={{ background: "linear-gradient(135deg, #4a0e10 0%, #2e0608 100%)", padding: "36px 20px 32px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>

            <Link
              href="/"
              style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.5)", textDecoration: "none", marginBottom: 24 }}
            >
              <ArrowLeft size={14} /> Back to store
            </Link>

            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", color: "#f2760f", textTransform: "uppercase", margin: "0 0 8px" }}>
                  Teacher Digital Empowerment Programme
                </p>
                <h1 style={{ fontFamily: SORA, fontWeight: 900, fontSize: "clamp(24px,3vw,36px)", color: "#fff", margin: 0, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                  Choose your device
                </h1>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.52)", margin: "8px 0 0", maxWidth: 480 }}>
                  Pick the laptop that fits your needs — then select your pathway and apply in minutes.
                </p>
              </div>

              {/* Step indicator */}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {["Choose device", "Your pathway", "Your details", "Employment", "Financial", "Verify"].map((s, i) => (
                  <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: "50%",
                        background: i === 0 ? "#f2760f" : "rgba(255,255,255,0.15)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <span style={{ fontSize: 10, fontWeight: 800, color: "#fff" }}>{i + 1}</span>
                      </div>
                      <span style={{
                        fontSize: 11,
                        fontWeight: i === 0 ? 700 : 500,
                        color: i === 0 ? "#fff" : "rgba(255,255,255,0.3)",
                        display: "none",
                      }} className="sm:inline">{s}</span>
                    </div>
                    {i < 5 && <div style={{ width: 16, height: 1, background: "rgba(255,255,255,0.15)" }} />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Device cards ── */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "36px 20px" }}>
          {/* Two-column on desktop, single column on mobile */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
            {DEVICES.map((device, idx) => {
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
                    boxShadow: isSelected
                      ? `0 8px 32px ${device.accentColor}28`
                      : "0 2px 8px rgba(0,0,0,0.04)",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                    position: "relative",
                  }}
                >
                  {/* Selected tick */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        style={{
                          position: "absolute", top: 16, right: 16, zIndex: 10,
                          width: 28, height: 28, borderRadius: "50%",
                          background: device.accentColor,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                      >
                        <Check size={14} color="#fff" strokeWidth={3} />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Badge */}
                  <div style={{
                    position: "absolute", top: 16, left: 16, zIndex: 10,
                    background: device.badgeColor, color: "#fff",
                    fontSize: 10, fontWeight: 800,
                    padding: "4px 10px", borderRadius: 6, letterSpacing: "0.04em",
                  }}>
                    {device.badge}
                  </div>

                  {/* Device image area */}
                  <div style={{
                    background: `${device.accentColor}08`,
                    padding: "40px 24px 20px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    minHeight: 200,
                  }}>
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 4.5, ease: "easeInOut", repeat: Infinity, delay: idx * 0.9 }}
                      style={{ width: "65%", maxWidth: 220 }}
                    >
                      <DeviceImg
                        alt={device.name}
                        src={device.img}
                        style={{ width: "100%", height: 160, objectFit: "contain" }}
                      />
                    </motion.div>
                  </div>

                  {/* Card body */}
                  <div style={{ padding: "20px 24px 24px" }}>
                    <p style={{ fontSize: 11, fontWeight: 800, color: device.accentColor, textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 4px" }}>
                      {device.category}
                    </p>
                    <h2 style={{ fontFamily: SORA, fontWeight: 800, fontSize: 22, color: "#111", margin: "0 0 6px" }}>
                      {device.name}
                    </h2>
                    <p style={{ fontSize: 13.5, color: "#6b7280", margin: "0 0 18px", lineHeight: 1.55 }}>
                      {device.tagline}
                    </p>

                    {/* Price — clean, no strikethrough */}
                    <div style={{ marginBottom: 20 }}>
                      <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 2px", fontWeight: 600 }}>Price</p>
                      <span style={{ fontFamily: SORA, fontWeight: 800, fontSize: 26, color: device.accentColor }}>
                        ₦{device.price.toLocaleString()}
                      </span>
                    </div>

                    {/* Highlights */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "7px 14px", marginBottom: 18 }}>
                      {device.highlights.slice(0, isExpanded ? undefined : 4).map(h => (
                        <div key={h} style={{ display: "flex", alignItems: "flex-start", gap: 7, fontSize: 12, color: "#374151", lineHeight: 1.45 }}>
                          <Check size={12} color={device.accentColor} strokeWidth={3} style={{ flexShrink: 0, marginTop: 2 }} />
                          {h}
                        </div>
                      ))}
                    </div>

                    {/* Expand / collapse specs */}
                    <button
                      onClick={e => { e.stopPropagation(); setExpanded(isExpanded ? null : device.id); }}
                      style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, color: device.accentColor, background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 18 }}
                    >
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      {isExpanded ? "Hide full specs" : "View full specs"}
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: E }}
                          style={{ overflow: "hidden", marginBottom: 18 }}
                        >
                          <div style={{ borderRadius: 12, border: "1px solid #f0f0f0", overflow: "hidden" }}>
                            {device.specs.map((spec, i) => (
                              <div
                                key={spec.label}
                                style={{
                                  display: "flex", alignItems: "center", gap: 14,
                                  padding: "12px 16px",
                                  borderBottom: i < device.specs.length - 1 ? "1px solid #f5f5f5" : "none",
                                  background: i % 2 === 0 ? "#fafafa" : "#fff",
                                }}
                              >
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

                    {/* Select button */}
                    <button
                      onClick={e => { e.stopPropagation(); setSelected(isSelected ? null : device.id); }}
                      style={{
                        width: "100%", height: 46, borderRadius: 100,
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

          {/* Spacer so sticky bar doesn't cover last card */}
          {selected && <div style={{ height: 110 }} />}
        </div>

        {/* ── Sticky apply bar ── */}
        <AnimatePresence>
          {selected && selectedDevice && (
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              style={{
                position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
                background: "#fff",
                borderTop: "1px solid #e8e8e8",
                boxShadow: "0 -8px 32px rgba(0,0,0,0.08)",
                padding: "16px 24px",
              }}
            >
              <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>

                {/* Selected device summary */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: `${selectedDevice.accentColor}10`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <DeviceImg alt={selectedDevice.name} src={selectedDevice.img} style={{ width: 36, height: 36, objectFit: "contain" }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      {selectedDevice.category} · Selected
                    </p>
                    <p style={{ fontSize: 15, fontWeight: 800, color: "#111", margin: 0, fontFamily: SORA }}>
                      {selectedDevice.name}
                    </p>
                  </div>
                  <div style={{ height: 40, width: 1, background: "#f0f0f0" }} />
                  <div>
                    <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>Price</p>
                    <p style={{ fontSize: 17, fontWeight: 800, color: selectedDevice.accentColor, margin: 0, fontFamily: SORA }}>
                      ₦{selectedDevice.price.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={handleApply}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    height: 50, padding: "0 32px", borderRadius: 100,
                    background: selectedDevice.accentColor,
                    border: "none", color: "#fff",
                    fontSize: 14, fontWeight: 800, cursor: "pointer",
                    fontFamily: JAKARTA, whiteSpace: "nowrap",
                  }}
                >
                  Apply for the {selectedDevice.name} <ArrowRight size={16} />
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