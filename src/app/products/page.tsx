"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown, ChevronRight, Grid2x2, Heart, LayoutList,
  Search, ShoppingCart, SlidersHorizontal, X,
} from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import { StorefrontHeader } from "@/components/StorefrontHeader";
import { StorefrontFooter } from "@/components/StorefrontFooter";

const SORA    = "'Sora','Archivo Variable',ui-sans-serif,system-ui";
const JAKARTA = "'Plus Jakarta Sans','Inter Variable',ui-sans-serif,system-ui";
const MAROON  = "#4a0e10";

function fmt(n: number) { return "₦" + n.toLocaleString("en-NG"); }

// ─── Product data ─────────────────────────────────────────────
const PRODUCTS = [
  {
    id: "orion",
    name: "Rev Orion 12\"",
    category: "Laptops",
    brand: "Rev",
    price: 290000,
    was: 350000,
    img: "/devices/rev-laptop.png",
    inStock: true,
    badge: "Most Popular",
    badgeColor: "#16a34a",
    specs: { ram: "4GB", storage: "128GB", display: "12.5\" FHD", cpu: "Intel Celeron N4020" },
  },
  {
    id: "aelia",
    name: "Rev Aelia 14\"",
    category: "Laptops",
    brand: "Rev",
    price: 330000,
    was: 400000,
    img: "/devices/rev-laptop.png",
    inStock: true,
    badge: "New Arrival",
    badgeColor: "#16a34a",
    specs: { ram: "8GB", storage: "256GB SSD", display: "14\" FHD", cpu: "Intel Core i3" },
  },
  {
    id: "tab",
    name: "Rev Tab 10\"",
    category: "Tablets",
    brand: "Rev",
    price: 80000,
    was: 150000,
    img: "/devices/rev-tablet.png",
    inStock: true,
    badge: "In stock",
    badgeColor: "#16a34a",
    specs: { ram: "3GB", storage: "32GB", display: "10.1\" IPS", cpu: "Quad-core" },
  },
  {
    id: "tab-4g",
    name: "Rev Tab 4G",
    category: "Tablets",
    brand: "Rev",
    price: 110000,
    was: 140000,
    img: "/devices/rev-tablet.png",
    inStock: true,
    badge: "In stock",
    badgeColor: "#16a34a",
    specs: { ram: "4GB", storage: "64GB", display: "10.1\" FHD", cpu: "Octa-core" },
  },
  {
    id: "orion-pro",
    name: "Rev Orion Pro",
    category: "Laptops",
    brand: "Rev",
    price: 420000,
    was: 500000,
    img: "/devices/rev-laptop.png",
    inStock: false,
    badge: "Coming Soon",
    badgeColor: "#6b7280",
    specs: { ram: "16GB", storage: "512GB SSD", display: "14\" 2K", cpu: "Intel Core i5" },
  },
  {
    id: "smartboard-65",
    name: "Rev SmartBoard 65\"",
    category: "Interactive Boards",
    brand: "Rev",
    price: 980000,
    was: 1200000,
    img: "/devices/rev-laptop.png",
    inStock: true,
    badge: "In stock",
    badgeColor: "#16a34a",
    specs: { ram: "4GB", storage: "32GB", display: "65\" 4K Touch", cpu: "Octa-core" },
  },
  {
    id: "mini-pc-1",
    name: "Rev Mini PC M1",
    category: "Mini PCs",
    brand: "Rev",
    price: 185000,
    was: 220000,
    img: "/devices/rev-laptop.png",
    inStock: true,
    badge: "In stock",
    badgeColor: "#16a34a",
    specs: { ram: "8GB", storage: "256GB SSD", display: "—", cpu: "Intel N100" },
  },
  {
    id: "aio-21",
    name: "Rev All-in-One 21\"",
    category: "All-in-Ones",
    brand: "Rev",
    price: 520000,
    was: 640000,
    img: "/devices/rev-laptop.png",
    inStock: true,
    badge: "In stock",
    badgeColor: "#16a34a",
    specs: { ram: "8GB", storage: "256GB SSD", display: "21.5\" FHD", cpu: "Intel Core i3" },
  },
];

type Product = typeof PRODUCTS[0];

// ─── Category tree for sidebar ────────────────────────────────
const CATEGORIES = [
  { label: "All Categories", value: "All" },
  { label: "Laptops",           value: "Laptops",           count: 3 },
  { label: "Tablets",           value: "Tablets",           count: 2 },
  { label: "All-in-Ones",       value: "All-in-Ones",       count: 1 },
  { label: "Mini PCs",          value: "Mini PCs",          count: 1 },
  { label: "Interactive Boards",value: "Interactive Boards", count: 1 },
];

const BRANDS = ["Rev", "All brands"];
const SORT_OPTIONS = [
  { label: "Featured",           value: "featured" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Newest First",       value: "newest" },
];
const SHOW_OPTIONS = [8, 16, 24, 48];

// ─── Device image with fallback ───────────────────────────────
function DeviceImg({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#f9fafb" }}>
      <span style={{ fontSize: 11, color: "#d1d5db", fontWeight: 600 }}>{alt}</span>
    </div>
  );
  return (
    <img
      src={src} alt={alt}
      onError={() => setFailed(true)}
      style={{ width: "100%", height: "100%", objectFit: "contain" }}
    />
  );
}

// ─── Product card — matches Slot style exactly ─────────────────
function ProductCard({ product, view }: { product: Product; view: "grid" | "list" }) {
  const [hovered, setHovered] = useState(false);
  if (view === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        style={{ background: "#fff", border: "1px solid #ebebeb", borderRadius: 12, display: "flex", gap: 0, overflow: "hidden" }}
      >
        {/* Image */}
        <div style={{ width: 200, flexShrink: 0, background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, position: "relative" }}>
          <div style={{ position: "absolute", top: 10, left: 10 }}>
            <span style={{ background: product.inStock ? "#16a34a" : "#6b7280", color: "#fff", fontSize: 10.5, fontWeight: 700, padding: "3px 9px", borderRadius: 5 }}>
              {product.inStock ? "In stock" : "Coming soon"}
            </span>
          </div>
          <div style={{ height: 120, width: "100%" }}>
            <DeviceImg src={product.img} alt={product.name} />
          </div>
        </div>
        {/* Info */}
        <div style={{ flex: 1, padding: "20px 24px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.08em" }}>{product.category}</p>
            <h3 style={{ fontFamily: SORA, fontWeight: 800, fontSize: 17, color: "#111", margin: "0 0 8px" }}>{product.name}</h3>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
              {Object.entries(product.specs).filter(([, v]) => v !== "—").map(([k, v]) => (
                <span key={k} style={{ fontSize: 11.5, background: "#f5f5f5", color: "#374151", padding: "3px 9px", borderRadius: 100, fontWeight: 600 }}>{v}</span>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <span style={{ fontFamily: SORA, fontSize: 22, fontWeight: 800, color: MAROON }}>{fmt(product.price)}</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ height: 38, padding: "0 20px", borderRadius: 100, border: `1.5px solid ${MAROON}`, background: "transparent", color: MAROON, fontSize: 13, fontWeight: 700, cursor: "pointer" }} type="button">
                Quick View
              </button>
              <Link href={`/pre-order?device=${product.id}`}>
                <button style={{ height: 38, padding: "0 20px", borderRadius: 100, border: "none", background: MAROON, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }} type="button">
                  Buy Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        border: "1px solid #ebebeb",
        borderRadius: 10,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        boxShadow: hovered ? "0 4px 20px rgba(0,0,0,0.09)" : "none",
        transition: "box-shadow 0.2s",
        position: "relative",
      }}
    >
      {/* Image area */}
      <div style={{ position: "relative", background: "#f9fafb", height: 200, overflow: "hidden" }}>
        {/* Stock badge — top right, green, matches Slot */}
        <div style={{ position: "absolute", top: 10, right: 10, zIndex: 2 }}>
          <span style={{
            background: product.inStock ? "#16a34a" : "#6b7280",
            color: "#fff",
            fontSize: 11,
            fontWeight: 700,
            padding: "4px 10px",
            borderRadius: 6,
          }}>
            {product.inStock ? "In stock" : "Coming soon"}
          </span>
        </div>
        <div style={{ padding: "20px", height: "100%" }}>
          <DeviceImg src={product.img} alt={product.name} />
        </div>
        {/* Hover overlay — Quick View + Wishlist */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{ position: "absolute", bottom: 10, left: 10, right: 10, display: "flex", gap: 8, zIndex: 3 }}
            >
              <button style={{ flex: 1, height: 34, borderRadius: 7, border: "1px solid #e0e0e0", background: "#fff", fontSize: 12, fontWeight: 700, color: "#374151", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }} type="button">
                <Search size={12} /> Quick View
              </button>
              <button style={{ width: 34, height: 34, borderRadius: 7, border: "1px solid #e0e0e0", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }} type="button">
                <Heart size={14} color="#374151" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info */}
      <div style={{ padding: "14px 16px 18px", flex: 1, display: "flex", flexDirection: "column" }}>
        <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.07em" }}>{product.category}</p>
        <h3 style={{ fontFamily: SORA, fontWeight: 800, fontSize: 14.5, color: "#111", margin: "0 0 12px", lineHeight: 1.3 }}>
          {product.name}
        </h3>

        {/* Price row — matches Slot exactly: price in maroon, crossed-out original, cart button */}
        <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontFamily: SORA, fontWeight: 800, fontSize: 17, color: MAROON, margin: "0 0 1px" }}>{fmt(product.price)}</p>
          </div>
          {/* Circular cart button — maroon, exact Slot style */}
          <Link href={`/pre-order?device=${product.id}`}>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              style={{ width: 38, height: 38, borderRadius: "50%", border: "none", background: MAROON, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
              type="button"
            >
              <ShoppingCart size={16} color="#fff" />
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Sidebar category item ────────────────────────────────────
function SidebarCategory({
  label, value, count, active, onClick,
}: {
  label: string; value: string; count?: number; active: boolean; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "9px 0",
        textAlign: "left",
        borderBottom: "1px solid #f5f5f5",
      }}
    >
      <span style={{ fontSize: 14, color: active ? MAROON : "#374151", fontWeight: active ? 700 : 500, transition: "color 0.15s" }}>
        {label}
      </span>
      {count !== undefined && (
        <span style={{ fontSize: 12, color: "#9ca3af" }}>({count})</span>
      )}
    </button>
  );
}

// ─── Price range filter ───────────────────────────────────────
function PriceFilter({ min, max, onChange }: { min: number; max: number; onChange: (min: number, max: number) => void }) {
  const [localMin, setLocalMin] = useState(min);
  const [localMax, setLocalMax] = useState(max);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <input
          type="number"
          value={localMin}
          onChange={e => setLocalMin(Number(e.target.value))}
          placeholder="Min"
          style={{ flex: 1, height: 36, borderRadius: 7, border: "1.5px solid #e0e0e0", padding: "0 10px", fontSize: 12.5, color: "#111", outline: "none", boxSizing: "border-box" }}
        />
        <input
          type="number"
          value={localMax}
          onChange={e => setLocalMax(Number(e.target.value))}
          placeholder="Max"
          style={{ flex: 1, height: 36, borderRadius: 7, border: "1.5px solid #e0e0e0", padding: "0 10px", fontSize: 12.5, color: "#111", outline: "none", boxSizing: "border-box" }}
        />
      </div>
      <button
        type="button"
        onClick={() => onChange(localMin, localMax)}
        style={{ width: "100%", height: 36, borderRadius: 7, border: "none", background: MAROON, color: "#fff", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
      >
        Apply
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════
export default function ProductsPage() {
  const [category,  setCategory]  = useState("All");
  const [brand,     setBrand]     = useState("All brands");
  const [sort,      setSort]      = useState("featured");
  const [search,    setSearch]    = useState("");
  const [view,      setView]      = useState<"grid" | "list">("grid");
  const [showCount, setShowCount] = useState(16);
  const [page,      setPage]      = useState(1);
  const [priceMin,  setPriceMin]  = useState(0);
  const [priceMax,  setPriceMax]  = useState(9999999);
  const [expandedFilters, setExpandedFilters] = useState<Record<string, boolean>>({
    categories: true,
    price: true,
    brand: true,
  });
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter(p => {
      const matchCat    = category === "All" || p.category === category;
      const matchBrand  = brand === "All brands" || p.brand === brand;
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
      const matchPrice  = p.price >= priceMin && (priceMax === 0 || p.price <= priceMax);
      return matchCat && matchBrand && matchSearch && matchPrice;
    });
    if (sort === "price_asc")  list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price_desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [category, brand, sort, search, priceMin, priceMax]);

  const totalPages   = Math.ceil(filtered.length / showCount);
  const pageProducts = filtered.slice((page - 1) * showCount, page * showCount);

  function toggleSection(key: string) {
    setExpandedFilters(prev => ({ ...prev, [key]: !prev[key] }));
  }

  const SidebarContent = () => (
    <div style={{ fontFamily: JAKARTA }}>
      {/* Categories */}
      <div style={{ marginBottom: 24 }}>
        <button
          type="button"
          onClick={() => toggleSection("categories")}
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", background: "none", border: "none", cursor: "pointer", padding: "0 0 10px", borderBottom: "2px solid #111" }}
        >
          <span style={{ fontFamily: SORA, fontSize: 15, fontWeight: 800, color: "#111" }}>Categories</span>
          <ChevronDown size={16} color="#374151" style={{ transform: expandedFilters.categories ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
        </button>
        {expandedFilters.categories && (
          <div style={{ paddingTop: 6 }}>
            {CATEGORIES.map(cat => (
              <SidebarCategory
                key={cat.value}
                label={cat.label}
                value={cat.value}
                count={(cat as any).count}
                active={category === cat.value}
                onClick={() => { setCategory(cat.value); setPage(1); }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Price range */}
      <div style={{ marginBottom: 24 }}>
        <button
          type="button"
          onClick={() => toggleSection("price")}
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", background: "none", border: "none", cursor: "pointer", padding: "0 0 10px", borderBottom: "2px solid #111" }}
        >
          <span style={{ fontFamily: SORA, fontSize: 15, fontWeight: 800, color: "#111" }}>Filter by Price</span>
          <ChevronDown size={16} color="#374151" style={{ transform: expandedFilters.price ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
        </button>
        {expandedFilters.price && (
          <div style={{ paddingTop: 14 }}>
            <PriceFilter
              min={priceMin}
              max={priceMax}
              onChange={(mn, mx) => { setPriceMin(mn); setPriceMax(mx); setPage(1); }}
            />
            <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
              {[
                ["Under ₦100k", 0, 100000],
                ["₦100k–₦300k", 100000, 300000],
                ["₦300k–₦600k", 300000, 600000],
                ["₦600k+", 600000, 9999999],
              ].map(([label, mn, mx]) => (
                <button
                  key={String(label)}
                  type="button"
                  onClick={() => { setPriceMin(Number(mn)); setPriceMax(Number(mx)); setPage(1); }}
                  style={{ fontSize: 11.5, padding: "4px 10px", borderRadius: 100, border: `1.5px solid ${priceMin === mn && priceMax === mx ? MAROON : "#e0e0e0"}`, background: priceMin === mn && priceMax === mx ? `${MAROON}10` : "#fff", color: priceMin === mn && priceMax === mx ? MAROON : "#6b7280", fontWeight: 600, cursor: "pointer" }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Brand */}
      <div style={{ marginBottom: 24 }}>
        <button
          type="button"
          onClick={() => toggleSection("brand")}
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", background: "none", border: "none", cursor: "pointer", padding: "0 0 10px", borderBottom: "2px solid #111" }}
        >
          <span style={{ fontFamily: SORA, fontSize: 15, fontWeight: 800, color: "#111" }}>Filter by Brand</span>
          <ChevronDown size={16} color="#374151" style={{ transform: expandedFilters.brand ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
        </button>
        {expandedFilters.brand && (
          <div style={{ paddingTop: 10 }}>
            {BRANDS.map(b => (
              <label key={b} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", cursor: "pointer", borderBottom: "1px solid #f5f5f5" }}>
                <div style={{ width: 17, height: 17, borderRadius: 4, border: `2px solid ${brand === b ? MAROON : "#d1d5db"}`, background: brand === b ? MAROON : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
                  {brand === b && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round"><path d="M5 12l5 5L20 7"/></svg>}
                </div>
                <input type="radio" checked={brand === b} onChange={() => setBrand(b)} style={{ display: "none" }} />
                <span style={{ fontSize: 13.5, color: "#374151" }}>{b}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: JAKARTA, background: "#f5f5f5", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Sora:wght@700;800;900&display=swap');
        .shop-layout { display: grid; grid-template-columns: 276px 1fr; gap: 24px; max-width: 1280px; margin: 0 auto; padding: 0 20px 60px; }
        .products-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .products-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        .toolbar-row { display: flex; align-items: center; gap: 12px; margin-bottom: 18px; flex-wrap: wrap; }
        .sidebar-desktop { display: block; }
        .mobile-filter-btn { display: none; }
        @media (max-width: 1100px) { .products-grid-4 { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 900px)  {
          .shop-layout { grid-template-columns: 1fr !important; padding-top: 0 !important; }
          .sidebar-desktop { display: none !important; }
          .mobile-filter-btn { display: flex !important; }
          .products-grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 520px)  { .products-grid-4 { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* Shared header */}
      <StorefrontHeader showInfoBar={false} />

      {/* Breadcrumb */}
      <div style={{ background: "#fff", borderBottom: "1px solid #ebebeb", padding: "12px 20px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", gap: 6, fontSize: 13.5, color: "#9ca3af" }}>
          <Link href="/" style={{ color: "#9ca3af", textDecoration: "none" }}>Home</Link>
          <ChevronRight size={13} color="#d1d5db" />
          <span style={{ color: "#111", fontWeight: 600 }}>Shop</span>
          {category !== "All" && (
            <>
              <ChevronRight size={13} color="#d1d5db" />
              <span style={{ color: "#111", fontWeight: 600 }}>{category}</span>
            </>
          )}
        </div>
      </div>

      {/* Main layout */}
      <div style={{ paddingTop: 28 }}>
        <div className="shop-layout">

          {/* ── LEFT SIDEBAR ── */}
          <aside className="sidebar-desktop">
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #ebebeb", padding: "24px 20px", position: "sticky", top: 90 }}>
              <SidebarContent />
            </div>
          </aside>

          {/* ── RIGHT CONTENT ── */}
          <div>
            {/* Toolbar row — matches Slot exactly */}
            <div className="toolbar-row">
              {/* Mobile filter button */}
              <button
                className="mobile-filter-btn"
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                style={{ height: 40, padding: "0 16px", borderRadius: 8, border: "1.5px solid #e0e0e0", background: "#fff", fontSize: 13, fontWeight: 700, color: "#374151", cursor: "pointer", alignItems: "center", gap: 7 }}
              >
                <SlidersHorizontal size={14} /> Filters
              </button>

              {/* View toggles — grid/list/2-col exactly like Slot */}
              <div style={{ display: "flex", gap: 0, border: "1.5px solid #e0e0e0", borderRadius: 8, overflow: "hidden" }}>
                {([
                  { v: "grid" as const, Icon: Grid2x2,    label: "Grid view"  },
                  { v: "list" as const, Icon: LayoutList,  label: "List view"  },
                ] as const).map(({ v, Icon, label }) => (
                  <button
                    key={v} type="button" onClick={() => setView(v)} aria-label={label}
                    style={{ width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", border: "none", background: view === v ? MAROON : "#fff", cursor: "pointer", transition: "background 0.15s" }}
                  >
                    <Icon size={15} color={view === v ? "#fff" : "#9ca3af"} />
                  </button>
                ))}
              </div>

              <span style={{ fontSize: 13, color: "#9ca3af", flexShrink: 0 }}>
                {filtered.length} product{filtered.length !== 1 ? "s" : ""}
              </span>

              {/* Spacer */}
              <div style={{ flex: 1 }} />

              {/* Sort — matches Slot's "Price: High to Low" dropdown */}
              <div style={{ position: "relative" }}>
                <select
                  value={sort}
                  onChange={e => { setSort(e.target.value); setPage(1); }}
                  style={{ height: 40, padding: "0 36px 0 14px", borderRadius: 8, border: "1.5px solid #e0e0e0", background: "#fff", fontSize: 13, fontWeight: 600, color: "#374151", outline: "none", cursor: "pointer", appearance: "none" }}
                >
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDown size={13} style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", pointerEvents: "none" }} />
              </div>

              {/* Show count */}
              <div style={{ position: "relative" }}>
                <select
                  value={showCount}
                  onChange={e => { setShowCount(Number(e.target.value)); setPage(1); }}
                  style={{ height: 40, padding: "0 36px 0 14px", borderRadius: 8, border: "1.5px solid #e0e0e0", background: "#fff", fontSize: 13, fontWeight: 600, color: "#374151", outline: "none", cursor: "pointer", appearance: "none" }}
                >
                  {SHOW_OPTIONS.map(n => <option key={n} value={n}>Show {n}</option>)}
                </select>
                <ChevronDown size={13} style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", pointerEvents: "none" }} />
              </div>

              {/* Page indicator */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#374151" }}>
                Page
                <input
                  type="number" min={1} max={totalPages} value={page}
                  onChange={e => setPage(Math.min(Math.max(1, Number(e.target.value)), totalPages))}
                  style={{ width: 44, height: 40, textAlign: "center", borderRadius: 7, border: "1.5px solid #e0e0e0", fontSize: 13, color: "#111", outline: "none" }}
                />
                <span style={{ color: "#9ca3af" }}>of {totalPages}</span>
              </div>
            </div>

            {/* Search bar */}
            <div style={{ position: "relative", marginBottom: 20 }}>
              <Search size={14} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#bbb" }} />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search products..."
                style={{ width: "100%", height: 42, borderRadius: 9, border: "1.5px solid #e0e0e0", background: "#fff", paddingLeft: 38, paddingRight: search ? 38 : 14, fontSize: 13, color: "#111", outline: "none", boxSizing: "border-box" }}
              />
              {search && (
                <button type="button" onClick={() => setSearch("")} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
                  <X size={14} color="#9ca3af" />
                </button>
              )}
            </div>

            {/* Product grid / list */}
            {pageProducts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "72px 20px", background: "#fff", borderRadius: 12 }}>
                <p style={{ fontFamily: SORA, fontSize: 20, fontWeight: 800, color: "#111", margin: "0 0 8px" }}>No products found</p>
                <p style={{ fontSize: 14, color: "#9ca3af", marginBottom: 20 }}>Try adjusting your search or filters.</p>
                <button type="button" onClick={() => { setSearch(""); setCategory("All"); setBrand("All brands"); setPriceMin(0); setPriceMax(9999999); setPage(1); }}
                  style={{ height: 44, padding: "0 28px", borderRadius: 100, border: "none", background: MAROON, color: "#fff", fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}>
                  Clear all filters
                </button>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                <div className={view === "grid" ? "products-grid-4" : ""} style={view === "list" ? { display: "flex", flexDirection: "column", gap: 14 } : {}}>
                  {pageProducts.map(p => <ProductCard key={p.id} product={p} view={view} />)}
                </div>
              </AnimatePresence>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 36 }}>
                <button type="button" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  style={{ height: 38, padding: "0 16px", borderRadius: 8, border: "1.5px solid #e0e0e0", background: "#fff", fontSize: 13, fontWeight: 600, color: "#374151", cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.4 : 1 }}>
                  ← Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button key={n} type="button" onClick={() => setPage(n)}
                    style={{ width: 38, height: 38, borderRadius: 8, border: `1.5px solid ${page === n ? MAROON : "#e0e0e0"}`, background: page === n ? MAROON : "#fff", fontSize: 13, fontWeight: 700, color: page === n ? "#fff" : "#374151", cursor: "pointer" }}>
                    {n}
                  </button>
                ))}
                <button type="button" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  style={{ height: 38, padding: "0 16px", borderRadius: 8, border: "1.5px solid #e0e0e0", background: "#fff", fontSize: 13, fontWeight: 600, color: "#374151", cursor: page === totalPages ? "not-allowed" : "pointer", opacity: page === totalPages ? 0.4 : 1 }}>
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200 }}
              onClick={() => setMobileFilterOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{ position: "fixed", inset: "0 auto 0 0", width: "85vw", maxWidth: 320, background: "#fff", zIndex: 201, padding: 20, overflowY: "auto" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <span style={{ fontFamily: SORA, fontWeight: 800, fontSize: 17 }}>Filters</span>
                <button type="button" onClick={() => setMobileFilterOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                  <X size={20} color="#374151" />
                </button>
              </div>
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <StorefrontFooter />
    </div>
  );
}