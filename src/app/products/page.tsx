"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight, Battery, CheckCircle2, ChevronDown, ChevronRight,
  Cpu, Filter, HardDrive, Monitor, Search, Shield, SlidersHorizontal,
  Star, Wifi, X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { RevricaLogo } from "@/components/brand";

const SORA    = "'Sora','Archivo Variable',ui-sans-serif,system-ui";
const JAKARTA = "'Plus Jakarta Sans','Inter Variable',ui-sans-serif,system-ui";

function fmt(n: number) { return "₦" + n.toLocaleString("en-NG"); }

// ─── Canonical product catalogue ─────────────────────────────
const PRODUCTS = [
  {
    id: "orion",
    name: "Rev Orion",
    size: '12"',
    tagline: "The teacher's everyday laptop — lightweight, powerful, classroom-ready.",
    category: "Laptops",
    badge: "Most Popular",
    badgeColor: "#581319",
    price: 290000,
    was: 350000,
    monthlyFrom: 14858,
    save: 17,
    img: "/devices/rev-laptop.png",
    accentColor: "#581319",
    rating: 4.8,
    reviews: 124,
    inStock: true,
    isNew: false,
    specs: [
      { icon: "cpu",     label: "Processor",  value: "Intel® Celeron N4020", sub: "Up to 2.8GHz dual-core" },
      { icon: "ram",     label: "RAM",         value: "4GB LPDDR4",           sub: "Smooth multitasking" },
      { icon: "storage", label: "Storage",     value: "128GB eMMC",           sub: "+ MicroSD expandable" },
      { icon: "display", label: "Display",     value: '12.5" IPS FHD',        sub: "1920×1080 · anti-glare" },
      { icon: "battery", label: "Battery",     value: "Up to 8 hrs",          sub: "Full classroom day" },
      { icon: "weight",  label: "Weight",      value: "0.98 kg",              sub: "Ultralight" },
      { icon: "os",      label: "OS",          value: "Windows 11 Home",      sub: "+ Office 365 + RevLearn" },
      { icon: "shield",  label: "Warranty",    value: "2 Years",              sub: "Local Nigeria support" },
    ],
    highlights: ["Splash-resistant keyboard","2MP FHD webcam","2× USB-A + USB-C + HDMI","Wi-Fi 5 + Bluetooth 5.0","Preloaded Office 365","RevLearn platform included"],
  },
  {
    id: "aelia",
    name: "Rev Aelia",
    size: '14"',
    tagline: "More screen, more power — built for serious teaching and productivity.",
    category: "Laptops",
    badge: "Pre-order",
    badgeColor: "#7c3aed",
    price: 330000,
    was: 400000,
    monthlyFrom: 17500,
    save: 18,
    img: "/devices/rev-laptop.png",
    accentColor: "#7c3aed",
    rating: 4.9,
    reviews: 47,
    inStock: true,
    isNew: true,
    specs: [
      { icon: "cpu",     label: "Processor",  value: "Intel® Core i3-1215U", sub: "Up to 4.4GHz, 6 cores" },
      { icon: "ram",     label: "RAM",         value: "8GB DDR4",             sub: "Heavy multitasking" },
      { icon: "storage", label: "Storage",     value: "256GB NVMe SSD",       sub: "3× faster than HDD" },
      { icon: "display", label: "Display",     value: '14" IPS FHD',          sub: "1920×1080 · anti-glare" },
      { icon: "battery", label: "Battery",     value: "Up to 10 hrs",         sub: "School day + evening" },
      { icon: "weight",  label: "Weight",      value: "1.4 kg",               sub: "Slim & portable" },
      { icon: "os",      label: "OS",          value: "Windows 11 Pro",       sub: "+ Office 365 + RevLearn" },
      { icon: "shield",  label: "Warranty",    value: "2 Years",              sub: "Local Nigeria support" },
    ],
    highlights: ["Backlit full-size keyboard","Fingerprint reader","Thunderbolt 4 + HDMI 2.0","Wi-Fi 6 + Bluetooth 5.2","Preloaded Office 365","Intel Iris Xe Graphics"],
  },
  {
    id: "tab",
    name: "Rev Tab",
    size: '10"',
    tagline: "Tablets for students — tough, light, affordable, classroom-ready.",
    category: "Tablets",
    badge: "47% off",
    badgeColor: "#dc2626",
    price: 80000,
    was: 150000,
    monthlyFrom: null,
    save: 47,
    img: "/devices/rev-tablet.png",
    accentColor: "#dc2626",
    rating: 4.6,
    reviews: 89,
    inStock: true,
    isNew: false,
    specs: [
      { icon: "display", label: "Display",      value: '10.1" IPS LCD',       sub: "1280×800 · vivid colour" },
      { icon: "cpu",     label: "Processor",    value: "Quad-core ARM A55",   sub: "1.8GHz" },
      { icon: "ram",     label: "RAM",          value: "3GB RAM · 32GB ROM",  sub: "+ MicroSD up to 256GB" },
      { icon: "battery", label: "Battery",      value: "5,000mAh",            sub: "Up to 10 hours" },
      { icon: "wifi",    label: "Connectivity", value: "Wi-Fi + BT 5.0",      sub: "802.11 b/g/n" },
      { icon: "os",      label: "OS",           value: "Android 13",          sub: "Latest Android" },
      { icon: "cam",     label: "Camera",       value: "5MP rear + 2MP front",sub: "For video calls" },
      { icon: "shield",  label: "Warranty",     value: "1 Year",              sub: "Local support" },
    ],
    highlights: ["5MP rear camera","2MP front camera for video calls","Wi-Fi + Bluetooth 5.0","USB-C charging","Kids-tough casing","Google Play Store"],
  },
  {
    id: "tab-4g",
    name: "Rev Tab 4G",
    size: '10"',
    tagline: "All the Rev Tab — plus 4G LTE. Learn anywhere, no Wi-Fi needed.",
    category: "Tablets",
    badge: "New",
    badgeColor: "#0ea5e9",
    price: 110000,
    was: 140000,
    monthlyFrom: null,
    save: 21,
    img: "/devices/rev-tablet.png",
    accentColor: "#0ea5e9",
    rating: 4.7,
    reviews: 31,
    inStock: true,
    isNew: true,
    specs: [
      { icon: "display", label: "Display",      value: '10.1" IPS FHD',       sub: "1920×1200 · vivid colour" },
      { icon: "cpu",     label: "Processor",    value: "Octa-core ARM A55",   sub: "2.0GHz" },
      { icon: "ram",     label: "RAM",          value: "4GB RAM · 64GB ROM",  sub: "+ MicroSD up to 256GB" },
      { icon: "battery", label: "Battery",      value: "6,000mAh",            sub: "Up to 12 hours" },
      { icon: "wifi",    label: "Connectivity", value: "4G LTE + Wi-Fi 6",    sub: "Dual SIM · nano SIM" },
      { icon: "os",      label: "OS",           value: "Android 13",          sub: "Latest Android" },
      { icon: "cam",     label: "Camera",       value: "8MP rear + 5MP front",sub: "FHD video" },
      { icon: "shield",  label: "Warranty",     value: "1 Year",              sub: "Local support" },
    ],
    highlights: ["4G LTE — learn without Wi-Fi","Dual nano SIM","FHD display","8MP rear camera","6,000mAh all-day battery","Google Play Store"],
  },
];

type Product = typeof PRODUCTS[0];

// ─── Spec icon helper ─────────────────────────────────────────
function SpecIcon({ type, color }: { type: string; color: string }) {
  const p = { fill: "none", stroke: color, strokeWidth: "1.7", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" {...p}>
      {type === "cpu"     && <><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 9h6v6H9zM9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" /></>}
      {type === "ram"     && <><rect x="2" y="8" width="20" height="8" rx="2" /><path d="M6 8V6M10 8V6M14 8V6M18 8V6M6 16v2M10 16v2M14 16v2M18 16v2" /></>}
      {type === "storage" && <><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></>}
      {type === "display" && <><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></>}
      {type === "battery" && <><rect x="1" y="6" width="18" height="12" rx="2" /><path d="M23 13v-2" /><path d="M5 9v6M9 9v6" /></>}
      {type === "weight"  && <><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></>}
      {type === "os"      && <><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /><path d="M7 8h2l2 5 2-5h2" /></>}
      {type === "shield"  && <><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" /><path d="M9 12l2 2 4-4" /></>}
      {type === "wifi"    && <><path d="M5 12.55a11 11 0 0114.08 0" /><path d="M1.42 9a16 16 0 0121.16 0" /><path d="M8.53 16.11a6 6 0 016.95 0" /><circle cx="12" cy="20" r="1" /></>}
      {type === "cam"     && <><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" /></>}
    </svg>
  );
}

function DeviceImg({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return (
    <div className={`${className ?? ""} flex items-center justify-center`} style={{ background: "rgba(88,19,25,0.04)", borderRadius: 12 }}>
      <span style={{ fontSize: 12, color: "rgba(0,0,0,0.2)", fontWeight: 600 }}>{alt}</span>
    </div>
  );
  return <img alt={alt} className={className} onError={() => setFailed(true)} src={src} style={{ objectFit: "contain" }} />;
}

// ─── Star rating ──────────────────────────────────────────────
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={11}
          fill={i <= Math.floor(rating) ? "#f2760f" : "transparent"}
          color={i <= Math.floor(rating) ? "#f2760f" : "#d1d5db"}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

// ─── Quick spec pills ─────────────────────────────────────────
function QuickSpecs({ product }: { product: Product }) {
  const quick = product.specs.slice(0, 4);
  return (
    <div className="flex flex-col gap-1.5">
      {quick.map(s => (
        <div key={s.label} className="flex items-center gap-2">
          <SpecIcon type={s.icon} color={product.accentColor} />
          <span style={{ fontSize: 11.5, color: "#374151" }}>
            <span style={{ fontWeight: 700 }}>{s.value}</span>
            {s.sub && <span style={{ color: "#9ca3af" }}> — {s.sub}</span>}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Expanded spec grid ───────────────────────────────────────
function SpecGrid({ product }: { product: Product }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "#f0f0f0", border: "1px solid #f0f0f0", borderRadius: 12, overflow: "hidden" }}>
      {product.specs.map((s, i) => (
        <div key={s.label} style={{ background: "#fff", padding: "12px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
            <SpecIcon type={s.icon} color={product.accentColor} />
            <span style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</span>
          </div>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#111", margin: "0 0 1px" }}>{s.value}</p>
          <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>{s.sub}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Product card ─────────────────────────────────────────────
function ProductCard({ product }: { product: Product }) {
  const [expanded, setExpanded] = useState(false);
  const saving = product.was - product.price;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.35 }}
      style={{ background: "#fff", borderRadius: 18, border: "1px solid #ebebeb", overflow: "hidden", display: "flex", flexDirection: "column" }}
    >
      {/* Image area */}
      <div style={{ position: "relative", padding: "16px 16px 0", background: "#fafafa", borderBottom: "1px solid #f5f5f5" }}>
        {/* Badges */}
        <div style={{ position: "absolute", top: 12, left: 12, display: "flex", flexDirection: "column", gap: 5 }}>
          <span style={{ background: product.badgeColor, color: "#fff", fontSize: 9.5, fontWeight: 800, padding: "3px 8px", borderRadius: 5, letterSpacing: "0.04em", display: "block" }}>
            {product.badge}
          </span>
          {product.isNew && (
            <span style={{ background: "#111", color: "#fff", fontSize: 9.5, fontWeight: 700, padding: "3px 8px", borderRadius: 5, display: "block" }}>NEW</span>
          )}
        </div>
        <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <DeviceImg alt={product.name} src={product.img} className="h-36 w-auto" />
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "18px 18px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <Stars rating={product.rating} />
          <span style={{ fontSize: 11, color: "#9ca3af" }}>({product.reviews})</span>
          {product.inStock && (
            <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 700, color: "#16a34a", background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "2px 7px", borderRadius: 100 }}>In stock</span>
          )}
        </div>

        <h3 style={{ fontFamily: SORA, fontWeight: 800, fontSize: 16, color: "#111", margin: "0 0 3px", letterSpacing: "-0.01em" }}>
          {product.name} <span style={{ color: "#9ca3af", fontWeight: 600, fontSize: 13 }}>{product.size}</span>
        </h3>
        <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 14px", lineHeight: 1.5 }}>{product.tagline}</p>

        {/* Quick specs */}
        <QuickSpecs product={product} />

        {/* Expanded specs */}
        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ overflow: "hidden" }}>
              <div style={{ marginTop: 14 }}>
                <SpecGrid product={product} />
                <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {product.highlights.map(h => (
                    <div key={h} style={{ display: "flex", alignItems: "center", gap: 5, background: `${product.accentColor}08`, border: `1px solid ${product.accentColor}20`, borderRadius: 100, padding: "4px 10px" }}>
                      <CheckCircle2 size={11} color={product.accentColor} />
                      <span style={{ fontSize: 11, fontWeight: 600, color: "#374151" }}>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle specs */}
        <button type="button" onClick={() => setExpanded(!expanded)}
          style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: "10px 0 6px", fontSize: 12, fontWeight: 700, color: product.accentColor }}>
          {expanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
          {expanded ? "Hide specs" : "View all specs"}
        </button>

        {/* Pricing */}
        <div style={{ marginTop: 8, paddingTop: 14, borderTop: "1px solid #f5f5f5" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 3 }}>
            <span style={{ fontFamily: SORA, fontWeight: 900, fontSize: 22, color: "#111" }}>{fmt(product.price)}</span>
            <span style={{ fontSize: 13, color: "#d1d5db", textDecoration: "line-through" }}>{fmt(product.was)}</span>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: "#16a34a" }}>Save {product.save}%</span>
          </div>
          {product.monthlyFrom && (
            <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 12px" }}>
              or from <strong style={{ color: product.accentColor }}>{fmt(product.monthlyFrom)}/month</strong>
            </p>
          )}
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Link href={`/apply/devices?preselect=${product.id}`}>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} type="button"
              style={{ width: "100%", height: 46, borderRadius: 100, background: "#581319", border: "none", color: "#fff", fontSize: 13.5, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              Apply for financing <ArrowRight size={14} />
            </motion.button>
          </Link>
          <Link href={`/pre-order?device=${product.id}`}>
            <button type="button"
              style={{ width: "100%", height: 42, borderRadius: 100, border: "1.5px solid #581319", background: "transparent", color: "#581319", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
              Buy outright
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Filter sidebar / bar ─────────────────────────────────────
const CATEGORIES = ["All", "Laptops", "Tablets"];
const SORT_OPTIONS = ["Featured", "Price: Low to High", "Price: High to Low", "Highest Rated"];

// ═══════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════
export default function ProductsPage() {
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Featured");
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  let filtered = PRODUCTS.filter(p => {
    const matchCat = category === "All" || p.category === category;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.tagline.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  if (sort === "Price: Low to High") filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sort === "Price: High to Low") filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sort === "Highest Rated") filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  return (
    <div style={{ fontFamily: JAKARTA, background: "#f5f5f5", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Sora:wght@700;800;900&display=swap');
        .products-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
        @media (max-width: 1200px) { .products-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 900px)  { .products-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 520px)  { .products-grid { grid-template-columns: 1fr !important; } }
        .filter-bar { display: flex; }
        @media (max-width: 640px) { .filter-bar { flex-direction: column; gap: 10px !important; } }
      `}</style>

      {/* ── Header ── */}
      <header style={{ background: "#fff", borderBottom: "1px solid #e8e8e8", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", height: 60, gap: 16 }}>
          <RevricaLogo variant="light" />
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 16, fontSize: 13 }}>
            <Link href="/" style={{ color: "#9ca3af", textDecoration: "none" }}>Home</Link>
            <ChevronRight size={12} color="#d1d5db" />
            <span style={{ color: "#581319", fontWeight: 700 }}>All Products</span>
          </div>
          <Link href="/" style={{ marginLeft: "auto", fontSize: 13, fontWeight: 600, color: "#581319", textDecoration: "none" }}>← Back to store</Link>
        </div>
      </header>

      {/* ── Hero band ── */}
      <div style={{ background: "linear-gradient(135deg, #581319 0%, #3a0810 100%)", padding: "40px 20px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", margin: "0 0 10px" }}>
            Nigerian-made hardware
          </p>
          <h1 style={{ fontFamily: SORA, fontWeight: 900, fontSize: "clamp(26px,4vw,44px)", color: "#fff", margin: "0 0 10px", letterSpacing: "-0.025em", lineHeight: 1.08 }}>
            Devices built for<br /><span style={{ color: "#FF6B1A" }}>African classrooms.</span>
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", margin: "0 0 28px", maxWidth: 500, lineHeight: 1.65 }}>
            Every Rev device is designed, assembled and warranted locally. Financing from ₦14,858/month through our Teacher Empowerment Programme.
          </p>
          {/* Stats strip */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
            {[
              { val: "₦14,858", label: "Monthly from" },
              { val: "2 Years", label: "Local warranty" },
              { val: "48h", label: "Support response" },
              { val: "500+", label: "Schools served" },
            ].map(s => (
              <div key={s.label}>
                <p style={{ fontFamily: SORA, fontWeight: 800, fontSize: 20, color: "#FF6B1A", margin: "0 0 2px" }}>{s.val}</p>
                <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.45)", margin: 0 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "28px 20px 60px" }}>

        {/* ── Filter bar ── */}
        <div className="filter-bar" style={{ gap: 12, marginBottom: 24, alignItems: "center", flexWrap: "wrap" }}>
          {/* Search */}
          <div style={{ position: "relative", flex: "1 1 220px" }}>
            <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search devices…"
              style={{ width: "100%", height: 42, borderRadius: 10, border: "1.5px solid #e8e8e8", background: "#fff", paddingLeft: 36, paddingRight: 14, fontSize: 13, color: "#111", outline: "none", boxSizing: "border-box" }} />
          </div>

          {/* Category tabs */}
          <div style={{ display: "flex", gap: 6, background: "#fff", borderRadius: 10, border: "1px solid #e8e8e8", padding: 4 }}>
            {CATEGORIES.map(cat => (
              <button key={cat} type="button" onClick={() => setCategory(cat)}
                style={{ height: 34, padding: "0 14px", borderRadius: 7, border: "none", background: category === cat ? "#581319" : "transparent", color: category === cat ? "#fff" : "#6b7280", fontSize: 12.5, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}>
                {cat}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div style={{ position: "relative" }}>
            <select value={sort} onChange={e => setSort(e.target.value)}
              style={{ height: 42, padding: "0 36px 0 14px", borderRadius: 10, border: "1.5px solid #e8e8e8", background: "#fff", fontSize: 12.5, fontWeight: 600, color: "#374151", outline: "none", cursor: "pointer", appearance: "none" }}>
              {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
            <ChevronDown size={13} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", pointerEvents: "none" }} />
          </div>

          <span style={{ fontSize: 12.5, color: "#9ca3af", flexShrink: 0 }}>{filtered.length} device{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        {/* ── Grid ── */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <p style={{ fontFamily: SORA, fontSize: 20, fontWeight: 800, color: "#111", margin: "0 0 8px" }}>No devices found</p>
            <p style={{ fontSize: 13.5, color: "#9ca3af" }}>Try adjusting your search or filter.</p>
            <button type="button" onClick={() => { setSearch(""); setCategory("All"); }}
              style={{ marginTop: 16, height: 42, padding: "0 24px", borderRadius: 100, background: "#581319", border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              Clear filters
            </button>
          </div>
        ) : (
          <div className="products-grid">
            <AnimatePresence mode="popLayout">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </AnimatePresence>
          </div>
        )}

        {/* ── Financing CTA ── */}
        <div style={{ marginTop: 52, borderRadius: 20, background: "linear-gradient(135deg, #581319 0%, #3a0810 100%)", padding: "36px 32px", display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center", justifyContent: "space-between", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: -40, top: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,107,26,0.08)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.45)", letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 8px" }}>Teacher Empowerment Programme</p>
            <h2 style={{ fontFamily: SORA, fontWeight: 800, fontSize: "clamp(20px,2.5vw,28px)", color: "#fff", margin: "0 0 8px", letterSpacing: "-0.02em" }}>
              Own your Rev device from ₦14,858/month.
            </h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", margin: 0 }}>
              No upfront payment. Spread over 12–36 months. Backed by licensed banks.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", position: "relative", zIndex: 1 }}>
            <Link href="/apply/devices">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="button"
                style={{ height: 48, padding: "0 26px", borderRadius: 100, background: "#FF6B1A", border: "none", color: "#fff", fontSize: 13.5, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                Apply now <ArrowRight size={14} />
              </motion.button>
            </Link>
            <Link href="/teacher-empowerment">
              <button type="button"
                style={{ height: 48, padding: "0 22px", borderRadius: 100, border: "1.5px solid rgba(255,255,255,0.25)", background: "transparent", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Learn more
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}