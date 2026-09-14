"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronDown, ShoppingCart, Zap } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { RevricaLogo } from "@/components/brand";
import { StorefrontHeader } from "@/components/StorefrontHeader";
import { StorefrontFooter } from "@/components/StorefrontFooter";

const SORA    = "'Sora','Archivo Variable',ui-sans-serif,system-ui";
const JAKARTA = "'Plus Jakarta Sans','Inter Variable',ui-sans-serif,system-ui";

function fmt(n: number) { return "₦" + n.toLocaleString("en-NG"); }

// ─── Canonical Rev device catalogue ──────────────────────────
// IDs must match: page.tsx DEALS array + products_page IDs
const PRODUCTS: Record<string, {
  id: string; name: string; tagline: string; price: number; was: number; save: number;
  img: string; accentColor: string; category: string;
  specs: { label: string; value: string }[];
  highlights: string[];
  badge: string;
  monthlyFrom: number | null;
}> = {
  orion: {
    id: "orion",
    name: 'Rev Orion 12"',
    tagline: "The teacher's everyday laptop — lightweight, powerful, classroom-ready.",
    price: 290000, was: 350000, save: 17,
    img: "/devices/rev-laptop.png",
    accentColor: "#581319", category: "Laptop", badge: "Most Popular",
    monthlyFrom: 14858,
    specs: [
      { label: "Processor",    value: "Intel® Celeron N4020 (dual-core, up to 2.8GHz)" },
      { label: "RAM",          value: "4GB LPDDR4" },
      { label: "Storage",      value: "128GB eMMC + MicroSD slot (up to 256GB)" },
      { label: "Display",      value: '12.5" IPS FHD (1920×1080) anti-glare' },
      { label: "Battery",      value: "Up to 8 hours" },
      { label: "OS",           value: "Windows 11 Home + Office 365 + RevLearn" },
      { label: "Camera",       value: "2MP FHD webcam with mic" },
      { label: "Ports",        value: "2× USB-A, 1× USB-C, HDMI, 3.5mm audio, MicroSD" },
      { label: "Connectivity", value: "Wi-Fi 5 (802.11ac) + Bluetooth 5.0" },
      { label: "Weight",       value: "0.98 kg — ultralight" },
      { label: "Keyboard",     value: "Full-size, splash-resistant" },
      { label: "Warranty",     value: "2 years — local Nigeria-based support" },
    ],
    highlights: [
      "0.98 kg — carry anywhere",
      "Splash-resistant keyboard",
      "2MP FHD webcam for video lessons",
      "Office 365 preloaded",
      "RevLearn platform included",
      "2-year local warranty",
    ],
  },
  aelia: {
    id: "aelia",
    name: 'Rev Aelia 14"',
    tagline: "More screen, more power — built for serious teaching and deep work.",
    price: 330000, was: 400000, save: 18,
    img: "/devices/rev-laptop.png",
    accentColor: "#7c3aed", category: "Laptop", badge: "Pre-order",
    monthlyFrom: 17500,
    specs: [
      { label: "Processor",    value: "Intel® Core i3-1215U (6 cores, up to 4.4GHz)" },
      { label: "RAM",          value: "8GB DDR4" },
      { label: "Storage",      value: "256GB NVMe SSD" },
      { label: "Display",      value: '14" IPS FHD (1920×1080) anti-glare' },
      { label: "Battery",      value: "Up to 10 hours" },
      { label: "OS",           value: "Windows 11 Pro + Office 365 + RevLearn" },
      { label: "Camera",       value: "2MP FHD webcam with noise-cancelling mic" },
      { label: "Ports",        value: "2× USB-A, 2× USB-C (1× Thunderbolt 4), HDMI 2.0, SD card, 3.5mm" },
      { label: "Graphics",     value: "Intel® Iris Xe Graphics" },
      { label: "Connectivity", value: "Wi-Fi 6 (802.11ax) + Bluetooth 5.2" },
      { label: "Weight",       value: "1.4 kg" },
      { label: "Keyboard",     value: "Full-size backlit, fingerprint reader" },
      { label: "Warranty",     value: "2 years — local Nigeria-based support" },
    ],
    highlights: [
      "Intel Core i3 — 6-core speed",
      "NVMe SSD — 3× faster than eMMC",
      "14\" FHD IPS display",
      "Backlit keyboard + fingerprint",
      "Thunderbolt 4 port",
      "2-year local warranty",
    ],
  },
  tab: {
    id: "tab",
    name: 'Rev Tab 10"',
    tagline: "Tablets for students — tough, affordable, classroom-ready.",
    price: 80000, was: 150000, save: 47,
    img: "/devices/rev-tablet.png",
    accentColor: "#dc2626", category: "Tablet", badge: "47% off",
    monthlyFrom: null,
    specs: [
      { label: "Display",      value: '10.1" IPS LCD (1280×800)' },
      { label: "Processor",    value: "Quad-core ARM Cortex-A55 (1.8GHz)" },
      { label: "RAM",          value: "3GB RAM" },
      { label: "Storage",      value: "32GB ROM + MicroSD up to 256GB" },
      { label: "Battery",      value: "5,000mAh — up to 10 hours" },
      { label: "OS",           value: "Android 13 + Google Play Store" },
      { label: "Camera",       value: "5MP rear + 2MP front" },
      { label: "Connectivity", value: "Wi-Fi (802.11 b/g/n) + Bluetooth 5.0" },
      { label: "Ports",        value: "USB-C charging, 3.5mm audio, MicroSD" },
      { label: "Weight",       value: "480g" },
      { label: "Warranty",     value: "1 year — local support" },
    ],
    highlights: [
      "5MP rear + 2MP front camera",
      "5,000mAh all-day battery",
      "Android 13 — full app ecosystem",
      "MicroSD expandable storage",
      "Ultra-portable at 480g",
      "Kids-tough casing",
    ],
  },
  "tab-4g": {
    id: "tab-4g",
    name: 'Rev Tab 4G 10"',
    tagline: "All the Rev Tab — plus 4G LTE. Learn anywhere, no Wi-Fi needed.",
    price: 110000, was: 140000, save: 21,
    img: "/devices/rev-tablet.png",
    accentColor: "#0ea5e9", category: "Tablet", badge: "New",
    monthlyFrom: null,
    specs: [
      { label: "Display",      value: '10.1" IPS FHD (1920×1200)' },
      { label: "Processor",    value: "Octa-core ARM Cortex-A55 (2.0GHz)" },
      { label: "RAM",          value: "4GB RAM" },
      { label: "Storage",      value: "64GB ROM + MicroSD up to 256GB" },
      { label: "Battery",      value: "6,000mAh — up to 12 hours" },
      { label: "OS",           value: "Android 13 + Google Play Store" },
      { label: "Camera",       value: "8MP rear (AF) + 5MP front (FHD video)" },
      { label: "Connectivity", value: "4G LTE + Wi-Fi 6 + Bluetooth 5.0 · Dual nano SIM" },
      { label: "Ports",        value: "USB-C, 3.5mm audio, MicroSD, SIM tray" },
      { label: "Weight",       value: "510g" },
      { label: "Warranty",     value: "1 year — local support" },
    ],
    highlights: [
      "4G LTE — learn without Wi-Fi",
      "Dual nano SIM support",
      "8MP autofocus rear camera",
      "FHD 1920×1200 display",
      "6,000mAh battery — 12hrs",
      "Octa-core processor",
    ],
  },
};

type Product = typeof PRODUCTS["orion"];

function DeviceImg({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return (
    <div className={`${className ?? ""} flex items-center justify-center`}
      style={{ background: "rgba(88,19,25,0.04)", borderRadius: 12 }}>
      <span style={{ fontSize: 13, color: "rgba(0,0,0,0.2)", fontWeight: 600 }}>{alt}</span>
    </div>
  );
  return <img alt={alt} className={className} onError={() => setFailed(true)} src={src} style={{ objectFit: "contain" }} />;
}

function SpecsTable({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  const half = Math.ceil(product.specs.length / 2);
  const visible = open ? product.specs : product.specs.slice(0, half);

  return (
    <div>
      <div style={{ border: "1px solid #e8e8e8", borderRadius: 14, overflow: "hidden" }}>
        {visible.map((s, i) => (
          <div key={s.label} style={{
            display: "grid", gridTemplateColumns: "140px 1fr",
            borderBottom: i < visible.length - 1 ? "1px solid #f0f0f0" : "none",
            background: i % 2 === 0 ? "#fff" : "#fafafa",
          }}>
            <div style={{ padding: "12px 14px", borderRight: "1px solid #f0f0f0" }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.07em", margin: 0 }}>{s.label}</p>
            </div>
            <div style={{ padding: "12px 14px" }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#111", margin: 0, lineHeight: 1.5 }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => setOpen(!open)} type="button"
        style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", padding: "4px 0", fontSize: 12.5, fontWeight: 700, color: product.accentColor }}>
        <ChevronDown size={13} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.22s" }} />
        {open ? "Show fewer specs" : `Show all ${product.specs.length} specs`}
      </button>
    </div>
  );
}

export default function ProductDetailPage() {
  const params   = useParams();
  const rawId    = params?.id as string;
  const product  = PRODUCTS[rawId];

  const [qty, setQty]             = useState(1);
  const [addedToCart, setAdded]   = useState(false);

  if (!product) {
    return (
      <div style={{ fontFamily: JAKARTA, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: SORA, fontSize: 28, fontWeight: 800, color: "#111", margin: "0 0 12px" }}>Device not found</p>
          <Link href="/products">
            <button style={{ height: 44, padding: "0 24px", borderRadius: 100, background: "#581319", border: "none", color: "#fff", fontSize: 13.5, fontWeight: 700, cursor: "pointer" }} type="button">
              ← Browse all devices
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const saving = product.was - product.price;

  return (
    <>
      <div style={{ fontFamily: JAKARTA, background: "#f5f5f5", minHeight: "100vh" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Sora:wght@700;800;900&display=swap');
          .pd-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 36px; align-items: start; }
          .related-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
          @media (max-width: 800px) {
            .pd-layout { grid-template-columns: 1fr !important; gap: 0 !important; }
            .related-grid { grid-template-columns: 1fr 1fr !important; }
          }
          @media (max-width: 480px) { .related-grid { grid-template-columns: 1fr !important; } }
        `}</style>

        <StorefrontHeader />

        <main style={{ maxWidth: 1240, margin: "0 auto", padding: "28px 20px 60px" }}>

          <div className="pd-layout">
            {/* LEFT — image panel */}
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
              <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e8e8e8", padding: "28px", position: "sticky", top: 76 }}>
                {/* Badges */}
                <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                  <span style={{ background: product.accentColor, color: "#fff", fontSize: 10.5, fontWeight: 800, padding: "4px 10px", borderRadius: 6 }}>
                    {product.badge}
                  </span>
                  <span style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a", fontSize: 10.5, fontWeight: 700, padding: "4px 10px", borderRadius: 6 }}>
                    Save {product.save}% — {fmt(saving)} off
                  </span>
                </div>

                {/* Image */}
                <div style={{ background: "#fafafa", borderRadius: 14, padding: "24px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 240 }}>
                  <DeviceImg alt={product.name} src={product.img}
                    className="w-full max-w-[280px] drop-shadow-xl" />
                </div>

                {/* Trust badges */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 18 }}>
                  {["2-year warranty", "Local support", "Office 365 included"].map(t => (
                    <div key={t} style={{ display: "flex", alignItems: "center", gap: 6, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 100, padding: "5px 12px" }}>
                      <CheckCircle2 size={11} color="#16a34a" />
                      <span style={{ fontSize: 11.5, fontWeight: 600, color: "#15803d" }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* RIGHT — info panel */}
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.08 }}>
              {/* Category tag */}
              <div style={{ display: "inline-block", fontSize: 10.5, fontWeight: 700, color: product.accentColor, textTransform: "uppercase", letterSpacing: "0.14em", background: `${product.accentColor}14`, padding: "4px 12px", borderRadius: 100, marginBottom: 14 }}>
                {product.category}
              </div>

              {/* Name */}
              <h1 style={{ fontFamily: SORA, fontWeight: 900, fontSize: "clamp(24px,3vw,36px)", color: "#111", margin: "0 0 8px", letterSpacing: "-0.025em", lineHeight: 1.08 }}>
                {product.name}
              </h1>
              <p style={{ fontSize: 14.5, color: "#6b7280", margin: "0 0 22px", lineHeight: 1.6 }}>{product.tagline}</p>

              {/* Highlights */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "7px 16px", marginBottom: 22 }}>
                {product.highlights.map(h => (
                  <div key={h} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: product.accentColor, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: "#374151", fontWeight: 600 }}>{h}</span>
                  </div>
                ))}
              </div>

              {/* Pricing card */}
              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e8e8", padding: "20px 22px", marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
                  <span style={{ fontFamily: SORA, fontWeight: 900, fontSize: 32, color: "#111" }}>{fmt(product.price)}</span>
                  <span style={{ fontSize: 15, color: "#d1d5db", textDecoration: "line-through" }}>{fmt(product.was)}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: "#16a34a" }}>You save {fmt(saving)}</span>
                  <span style={{ fontSize: 11.5, color: "#9ca3af" }}>· Limited deal</span>
                </div>
                {product.monthlyFrom && (
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 8 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#581319" strokeWidth="1.8" strokeLinecap="round">
                      <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                    </svg>
                    <span style={{ fontSize: 12.5, color: "#6b7280" }}>
                      Or from <strong style={{ color: "#581319" }}>{fmt(product.monthlyFrom)}/month</strong> — Teacher Empowerment Programme
                    </span>
                  </div>
                )}
              </div>

              {/* Qty + Add to cart */}
              <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", border: "1px solid #e8e8e8", borderRadius: 10, overflow: "hidden", background: "#fff", flexShrink: 0 }}>
                  <button type="button" onClick={() => setQty(q => Math.max(1, q - 1))}
                    style={{ width: 38, height: 48, border: "none", background: "transparent", fontSize: 18, color: "#374151", cursor: "pointer" }}>−</button>
                  <span style={{ width: 32, textAlign: "center", fontSize: 14, fontWeight: 700, color: "#111" }}>{qty}</span>
                  <button type="button" onClick={() => setQty(q => q + 1)}
                    style={{ width: 38, height: 48, border: "none", background: "transparent", fontSize: 18, color: "#374151", cursor: "pointer" }}>+</button>
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} type="button"
                  onClick={() => { setAdded(true); setTimeout(() => setAdded(false), 2200); }}
                  style={{ flex: 1, height: 48, borderRadius: 12, background: addedToCart ? "#16a34a" : "#111", border: "none", color: "#fff", fontSize: 13.5, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "background 0.22s" }}
                >
                  <AnimatePresence mode="wait">
                    {addedToCart
                      ? <motion.span key="added" initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <CheckCircle2 size={15} /> Added!
                        </motion.span>
                      : <motion.span key="add" initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <ShoppingCart size={14} /> Add to cart
                        </motion.span>
                    }
                  </AnimatePresence>
                </motion.button>
              </div>

              {/* Buy now */}
              <Link href={`/pre-order?device=${product.id}`}>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} type="button"
                  style={{ width: "100%", height: 52, borderRadius: 12, background: "#581319", border: "none", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 9, marginBottom: 10 }}>
                  <Zap size={16} /> Buy now at {fmt(product.price)} — deal price
                </motion.button>
              </Link>

              {/* Apply for financing */}
              <Link href={`/apply/devices?preselect=${product.id}`}>
                <button type="button"
                  style={{ width: "100%", height: 46, borderRadius: 12, border: "1.5px solid #581319", background: "#fff", color: "#581319", fontSize: 13.5, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  Apply for monthly financing <ArrowRight size={13} />
                </button>
              </Link>
              <p style={{ marginTop: 8, fontSize: 11.5, color: "#9ca3af", textAlign: "center" }}>
                Financing from {product.monthlyFrom ? fmt(product.monthlyFrom) : "₦14,858"}/month · Teacher Empowerment Programme
              </p>

              {/* Specs */}
              <div style={{ marginTop: 28 }}>
                <h2 style={{ fontFamily: SORA, fontWeight: 800, fontSize: 18, color: "#111", margin: "0 0 14px" }}>Full specifications</h2>
                <SpecsTable product={product} />
              </div>
            </motion.div>
          </div>

          {/* Related products */}
          <div style={{ marginTop: 60 }}>
            <h2 style={{ fontFamily: SORA, fontWeight: 800, fontSize: 20, color: "#111", margin: "0 0 20px", letterSpacing: "-0.02em" }}>You might also like</h2>
            <div className="related-grid">
              {Object.values(PRODUCTS).filter(p => p.id !== rawId).slice(0, 3).map(p => (
                <Link key={p.id} href={`/products/${p.id}`} style={{ textDecoration: "none" }}>
                  <motion.div whileHover={{ y: -3, boxShadow: "0 10px 28px rgba(0,0,0,0.09)" }}
                    style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8e8e8", overflow: "hidden", cursor: "pointer" }}>
                    <div style={{ padding: "14px 14px 0", position: "relative" }}>
                      <div style={{ position: "absolute", top: 10, left: 10, background: p.accentColor, color: "#fff", fontSize: 9.5, fontWeight: 800, padding: "2px 7px", borderRadius: 5 }}>
                        SAVE {p.save}%
                      </div>
                      <div style={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center", background: "#f9f9f9", borderRadius: 8 }}>
                        <DeviceImg alt={p.name} src={p.img} className="h-20 w-auto" />
                      </div>
                    </div>
                    <div style={{ padding: "12px 14px 16px" }}>
                      <p style={{ fontFamily: SORA, fontWeight: 700, fontSize: 13, color: "#111", margin: "0 0 4px" }}>{p.name}</p>
                      <p style={{ fontFamily: SORA, fontWeight: 800, fontSize: 17, color: p.accentColor, margin: 0 }}>{fmt(p.price)}</p>
                      {p.monthlyFrom && <p style={{ fontSize: 11, color: "#6b7280", margin: "3px 0 0" }}>from {fmt(p.monthlyFrom)}/mo</p>}
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
      <StorefrontFooter />
    </>
  );
}