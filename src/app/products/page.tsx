"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Banknote, Box, ChevronDown, ChevronLeft, ChevronRight, Grip, LayoutGrid,
  Laptop, List, Monitor, SlidersHorizontal, Tablet, X, type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { clsx } from "clsx";
import { StorefrontFooter } from "@/components/StorefrontFooter";
import { StorefrontHeader } from "@/components/StorefrontHeader";
import { PriceRangeSlider, type Range } from "@/components/shop/PriceRangeSlider";
import { ProductCard } from "@/components/shop/ProductCard";
import { QuickView } from "@/components/shop/QuickView";
import {
  CATEGORIES, PRODUCTS, formatNaira, getCategory, isCategoryId,
  type CategoryId, type Product,
} from "@/lib/catalog";
import styles from "./products.module.css";

// ─── Config ───────────────────────────────────────────────────
const CATEGORY_ICONS: Record<CategoryId, LucideIcon> = {
  laptops: Laptop,
  tablets: Tablet,
  "mini-pcs": Box,
  "all-in-ones": Monitor,
};

type SortKey = "featured" | "price_asc" | "price_desc" | "name";
const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name", label: "Name: A to Z" },
];
/** Multiples of 6, so pages fill complete rows at 3, 2 or 1 per row. */
const PAGE_SIZES = [6, 12, 18, 24] as const;

/** Price filter: the committed slider range, or null when the whole range is selected. */
type PriceFilter = Range | null;

/**
 * Slider bounds: from ₦0 to at least ₦1,000,000, stretched further if a
 * product ever costs more. Null when no product has a listed price.
 */
const PRICED = PRODUCTS.flatMap((p) => (p.price === null ? [] : [p.price]));
const PRICE_STEP = 10_000;
const PRICE_CEILING_MIN = 1_000_000;
const PRICE_BOUNDS: Range | null =
  PRICED.length > 0
    ? [0, Math.max(PRICE_CEILING_MIN, Math.ceil(Math.max(...PRICED) / PRICE_STEP) * PRICE_STEP)]
    : null;

const CATEGORY_COUNTS = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, PRODUCTS.filter((p) => p.category === c.id).length]),
) as Record<CategoryId, number>;

// ─── Filtering ────────────────────────────────────────────────
function matchesQuery(p: Product, q: string): boolean {
  const haystack = [p.name, p.variant, getCategory(p.category).label, ...p.specs.map((s) => s.value)]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return q.toLowerCase().split(/\s+/).filter(Boolean).every((term) => haystack.includes(term));
}

function applyFilters(
  products: readonly Product[],
  { category, q, price, sort }: { category: CategoryId | null; q: string; price: PriceFilter; sort: SortKey },
): Product[] {
  const list = products.filter((p) => {
    if (category && p.category !== category) return false;
    if (q && !matchesQuery(p, q)) return false;
    if (price) {
      // Products without a listed price can't satisfy a price range.
      if (p.price === null || p.price < price[0] || p.price > price[1]) return false;
    }
    return true;
  });

  // Unpriced items always sort after priced ones.
  const byPrice = (dir: 1 | -1) => (a: Product, b: Product) =>
    a.price === null ? 1 : b.price === null ? -1 : (a.price - b.price) * dir;

  switch (sort) {
    case "price_asc": return [...list].sort(byPrice(1));
    case "price_desc": return [...list].sort(byPrice(-1));
    case "name": return [...list].sort((a, b) => a.name.localeCompare(b.name));
    default: return list; // Featured = catalogue order.
  }
}

// ─── Sidebar ──────────────────────────────────────────────────
function SidebarSection({
  title, icon: Icon, children, defaultOpen = true,
}: {
  title: string; icon: LucideIcon; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className={styles.sideSection}>
      <button aria-expanded={open} className={styles.sideHeading} onClick={() => setOpen(!open)} type="button">
        <Icon aria-hidden size={19} />
        <span>{title}</span>
        <ChevronDown aria-hidden className={clsx(styles.chevron, open && styles.chevronOpen)} size={17} />
      </button>
      {open && <div className={styles.sideBody}>{children}</div>}
    </section>
  );
}

function PriceFilterControl({ bounds, applied, onApply }: {
  bounds: Range; applied: PriceFilter; onApply: (next: PriceFilter) => void;
}) {
  // Live position while dragging; resyncs when the filter changes elsewhere (chip, "Clear all").
  const [draft, setDraft] = useState<Range>(applied ?? bounds);
  useEffect(() => setDraft(applied ?? bounds), [applied, bounds]);

  const commit = ([lo, hi]: Range) =>
    onApply(lo <= bounds[0] && hi >= bounds[1] ? null : [lo, hi]);

  return <PriceRangeSlider bounds={bounds} onChange={setDraft} onCommit={commit} step={PRICE_STEP} value={draft} />;
}

function Sidebar({
  category, onCategory, price, onPrice,
}: {
  category: CategoryId | null;
  onCategory: (c: CategoryId | null) => void;
  price: PriceFilter;
  onPrice: (r: PriceFilter) => void;
}) {
  const rows: { id: CategoryId | null; label: string; count: number; Icon: LucideIcon }[] = [
    { id: null, label: "All Categories", count: PRODUCTS.length, Icon: Grip },
    ...CATEGORIES.map((c) => ({ id: c.id, label: c.label, count: CATEGORY_COUNTS[c.id], Icon: CATEGORY_ICONS[c.id] })),
  ];

  return (
    <div className={styles.sidebar}>
      <SidebarSection icon={LayoutGrid} title="Categories">
        <ul className={styles.catList}>
          {rows.map(({ id, label, count, Icon }) => {
            const active = category === id;
            return (
              <li key={label}>
                <button
                  aria-current={active ? "true" : undefined}
                  className={clsx(styles.catRow, active && styles.catRowActive)}
                  onClick={() => onCategory(id)}
                  type="button"
                >
                  <Icon aria-hidden size={18} strokeWidth={1.8} />
                  <span className={styles.catLabel}>{label}</span>
                  <span className={styles.catCount}>{count}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </SidebarSection>

      {PRICE_BOUNDS && (
        <SidebarSection icon={Banknote} title="Filter by Price">
          <PriceFilterControl applied={price} bounds={PRICE_BOUNDS} onApply={onPrice} />
        </SidebarSection>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────
function ShopPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Category and search live in the URL, so they're shareable and the header search works.
  const rawCategory = searchParams.get("category");
  const category = isCategoryId(rawCategory) ? rawCategory : null;
  const q = (searchParams.get("q") ?? "").trim();

  const [sort, setSort] = useState<SortKey>("featured");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [pageSize, setPageSize] = useState<number>(12);
  const [page, setPage] = useState(1);
  const [price, setPrice] = useState<PriceFilter>(null);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Any change to what's being filtered sends you back to page 1.
  useEffect(() => setPage(1), [category, q, price, sort, pageSize]);

  // Close the mobile drawer with Escape.
  useEffect(() => {
    if (!filtersOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFiltersOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [filtersOpen]);

  function updateUrl(next: { category?: CategoryId | null; q?: string | null }) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const filtered = useMemo(
    () => applyFilters(PRODUCTS, { category, q, price, sort }),
    [category, q, price, sort],
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const priceActive = price !== null;
  const hasFilters = Boolean(category || q || priceActive);
  const clearAll = () => {
    setPrice(null);
    updateUrl({ category: null, q: null });
  };

  const sidebar = (
    <Sidebar
      category={category}
      onCategory={(c) => { updateUrl({ category: c }); setFiltersOpen(false); }}
      onPrice={setPrice}
      price={price}
    />
  );

  const priceChipLabel = price ? `${formatNaira(price[0])} – ${formatNaira(price[1])}` : "";

  return (
    <div className={styles.page}>
      <StorefrontHeader showInfoBar={false} />

      <div className={styles.container}>
        <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <ChevronRight aria-hidden size={14} />
          {category ? (
            <>
              <button onClick={() => updateUrl({ category: null })} type="button">Shop</button>
              <ChevronRight aria-hidden size={14} />
              <span aria-current="page">{getCategory(category).label}</span>
            </>
          ) : (
            <span aria-current="page">Shop</span>
          )}
        </nav>

        <div className={styles.layout}>
          <aside aria-label="Filters" className={styles.sidebarDesktop}>{sidebar}</aside>

          <main className={styles.main}>
            {/* Toolbar */}
            <div className={styles.toolbar}>
              <button className={styles.filtersButton} onClick={() => setFiltersOpen(true)} type="button">
                <SlidersHorizontal aria-hidden size={16} /> Filters
              </button>

              <div aria-label="Layout" className={styles.viewToggle} role="group">
                {([["grid", LayoutGrid, "Grid view"], ["list", List, "List view"]] as const).map(([v, Icon, label]) => (
                  <button
                    aria-label={label}
                    aria-pressed={view === v}
                    className={clsx(view === v && styles.viewActive)}
                    key={v}
                    onClick={() => setView(v)}
                    type="button"
                  >
                    <Icon aria-hidden size={18} />
                  </button>
                ))}
              </div>

              <p aria-live="polite" className={styles.resultCount}>
                {filtered.length} product{filtered.length === 1 ? "" : "s"}
              </p>

              <div className={styles.toolbarRight}>
                <label className={styles.selectWrap}>
                  <span className={styles.srOnly}>Sort by</span>
                  <select onChange={(e) => setSort(e.target.value as SortKey)} value={sort}>
                    {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <ChevronDown aria-hidden size={16} />
                </label>

                <label className={styles.selectWrap}>
                  <span className={styles.srOnly}>Products per page</span>
                  <select onChange={(e) => setPageSize(Number(e.target.value))} value={pageSize}>
                    {PAGE_SIZES.map((n) => <option key={n} value={n}>Show {n}</option>)}
                  </select>
                  <ChevronDown aria-hidden size={16} />
                </label>

                <div className={styles.pager}>
                  <span className={styles.pagerText}>
                    Page <span className={styles.pagerBox}>{currentPage}</span> of {totalPages}
                  </span>
                  <button
                    aria-label="Previous page"
                    disabled={currentPage <= 1}
                    onClick={() => setPage(currentPage - 1)}
                    type="button"
                  >
                    <ChevronLeft aria-hidden size={18} />
                  </button>
                  <button
                    aria-label="Next page"
                    disabled={currentPage >= totalPages}
                    onClick={() => setPage(currentPage + 1)}
                    type="button"
                  >
                    <ChevronRight aria-hidden size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Active filters */}
            {hasFilters && (
              <div className={styles.chips}>
                {category && (
                  <button className={styles.chip} onClick={() => updateUrl({ category: null })} type="button">
                    {getCategory(category).label} <X aria-hidden size={13} />
                    <span className={styles.srOnly}>Remove category filter</span>
                  </button>
                )}
                {q && (
                  <button className={styles.chip} onClick={() => updateUrl({ q: null })} type="button">
                    Search: “{q}” <X aria-hidden size={13} />
                    <span className={styles.srOnly}>Clear search</span>
                  </button>
                )}
                {priceActive && (
                  <button className={styles.chip} onClick={() => setPrice(null)} type="button">
                    {priceChipLabel} <X aria-hidden size={13} />
                    <span className={styles.srOnly}>Remove price filter</span>
                  </button>
                )}
                <button className={styles.clearAll} onClick={clearAll} type="button">Clear all</button>
              </div>
            )}

            {/* Results */}
            {visible.length === 0 ? (
              <div className={styles.empty}>
                <h2>No products match these filters</h2>
                <p>
                  {priceActive
                    ? "Bulk-order (MOQ) products have no listed price, so they're hidden while a price range is set. Widen the range or clear it."
                    : "Try a different search term or category."}
                </p>
                <button className={styles.emptyButton} onClick={clearAll} type="button">Clear filters</button>
              </div>
            ) : (
              <div className={view === "grid" ? styles.grid : styles.list}>
                {visible.map((p) => <ProductCard key={p.id} onQuickView={setQuickView} product={p} view={view} />)}
              </div>
            )}
          </main>
        </div>
      </div>

      <StorefrontFooter />

      <QuickView onClose={() => setQuickView(null)} product={quickView} />

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {filtersOpen && (
          <>
            <motion.div
              animate={{ opacity: 1 }}
              className={styles.drawerBackdrop}
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              onClick={() => setFiltersOpen(false)}
            />
            <motion.div
              animate={{ x: 0 }}
              aria-label="Filters"
              aria-modal="true"
              className={styles.drawer}
              exit={{ x: "-100%" }}
              initial={{ x: "-100%" }}
              role="dialog"
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
            >
              <div className={styles.drawerHead}>
                <h2>Filters</h2>
                <button aria-label="Close filters" onClick={() => setFiltersOpen(false)} type="button">
                  <X aria-hidden size={18} />
                </button>
              </div>
              {sidebar}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// useSearchParams needs a Suspense boundary so the route can still be prerendered.
export default function ProductsPage() {
  return (
    <Suspense fallback={<div className={styles.page} />}>
      <ShopPage />
    </Suspense>
  );
}
