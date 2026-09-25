"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { RevricaLogo } from "@/components/brand";
import { CartButton } from "@/components/cart/CartButton";
import { useCart } from "@/lib/cart/cart-context";
import { CATEGORIES } from "@/lib/catalog";

const PRIMARY_NAV: { label: string; href: string; match: (path: string) => boolean }[] = [
  { label: "Home", href: "/", match: (p) => p === "/" },
  { label: "About", href: "/about", match: (p) => p.startsWith("/about") },
  { label: "Shop Now", href: "/products", match: (p) => p.startsWith("/products") },
];

/** Category links derive from the catalogue. */
const CATEGORY_NAV: [string, string][] = CATEGORIES.map((c) => [c.label, `/products?category=${c.id}`]);

// ─── Mobile slide-out menu ────────────────────────────────────
function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { count, hydrated } = useCart();
  const navLinks: [string, string][] = [
    ...PRIMARY_NAV.map((n): [string, string] => [n.label, n.href]),
    ...CATEGORY_NAV,
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-y-0 left-0 z-[200] flex w-[80vw] max-w-xs flex-col bg-white shadow-2xl"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
          >
            <div className="flex items-center justify-between border-b border-black/8 px-5 py-4">
              <RevricaLogo variant="light" />
              <button
                aria-label="Close menu"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-black/60"
                type="button"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-5">
              {navLinks.map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-xl px-3 py-3.5 text-[14px] font-semibold text-[#1a1a1a] transition hover:bg-orange-50"
                >
                  <ArrowRight size={14} className="text-[#f2760f]" />
                  {label}
                </Link>
              ))}
            </nav>

            <div className="flex flex-col gap-3 px-4 pb-6">
              <Link
                href="/cart"
                onClick={onClose}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#5a1016] text-[13px] font-bold text-white"
              >
                <ShoppingCart size={15} />
                {hydrated && count > 0 ? `View cart (${count})` : "View cart"}
              </Link>
              <Link
                href="/early-access"
                onClick={onClose}
                className="flex h-12 w-full items-center justify-center rounded-xl border border-black/12 text-[13px] font-semibold text-[#374151]"
              >
                Join Waitlist
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Props ────────────────────────────────────────────────────
interface StorefrontHeaderProps {
  /** Show the maroon "Welcome to RevStore" strip. Defaults to true. */
  showInfoBar?: boolean;
  /** Show the desktop category sub-nav below the main bar. Defaults to false. */
  showCategoryNav?: boolean;
}

/**
 * Shared storefront header, used by every storefront page including the homepage.
 *
 * Layout:
 *   1. Maroon top strip  "Welcome to RevStore by Revrica" (optional)
 *   2. Sticky white bar  logo · centred nav · search · cart
 */
export function StorefrontHeader({
  showInfoBar = true,
  showCategoryNav = false,
}: StorefrontHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname() ?? "/";
  const router = useRouter();

  function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const q = String(new FormData(event.currentTarget).get("q") ?? "").trim();
    router.push(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
  }

  return (
    <>
      <style>{`
        .sh2-desktop { display: flex; }
        .sh2-mobile  { display: none; }
        .sh2-search  { display: block; }
        .sh2-topbar  { display: block; }
        .sh2-link { padding: 10px 22px; display: flex; align-items: center; font-size: 14.5px; font-weight: 700;
          color: #1a1a1a; white-space: nowrap; border-radius: 10px; transition: background .15s, color .15s; }
        .sh2-link:hover, .sh2-link[aria-current="page"] { background: rgba(90,16,22,0.06); color: #5a1016; }
        .sh2-input { width: 100%; height: 44px; border-radius: 11px; border: 1.5px solid #e8e8e8; background: #fafafa;
          padding: 0 16px 0 40px; font-size: 13px; color: #111; outline: none; transition: border-color .15s; }
        .sh2-input:focus { border-color: #5a1016; background: #fff; }
        @media (max-width: 768px) {
          .sh2-desktop { display: none !important; }
          .sh2-mobile  { display: flex !important; }
          .sh2-search  { display: none !important; }
          .sh2-topbar  { display: none !important; }
        }
      `}</style>

      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* ── Top info bar ── */}
      {showInfoBar && (
        <div
          className="sh2-topbar"
          style={{ background: "#4a0e10", padding: "9px 20px", textAlign: "center" }}
        >
          <span style={{ fontSize: 12.5, fontWeight: 600, color: "rgba(255,255,255,0.92)", letterSpacing: "0.01em" }}>
            Welcome to{" "}
            <span style={{ fontWeight: 800, color: "#fff" }}>RevStore</span>
            <span style={{ color: "rgba(255,255,255,0.55)", fontWeight: 400 }}> by Revrica</span>
          </span>
        </div>
      )}

      {/* ── Sticky main header ── */}
      <header
        style={{
          background: "#fff",
          borderBottom: "1px solid #e8e8e8",
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxShadow: "0 1px 12px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, height: 82 }}>

            {/* Hamburger — mobile only */}
            <button
              className="sh2-mobile"
              onClick={() => setMobileMenuOpen(true)}
              style={{
                height: 40, width: 40,
                alignItems: "center", justifyContent: "center",
                borderRadius: 10, border: "1.5px solid #e8e8e8",
                background: "transparent", cursor: "pointer", flexShrink: 0,
              }}
              type="button"
              aria-label="Open menu"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.2" strokeLinecap="round">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Logo */}
            <div style={{ flexShrink: 0 }}>
              <RevricaLogo variant="light" />
            </div>

            {/* Primary nav — desktop, centred */}
            <nav
              className="sh2-desktop"
              style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 4 }}
            >
              {PRIMARY_NAV.map(({ label, href, match }) => (
                <Link
                  key={label}
                  aria-current={match(pathname) ? "page" : undefined}
                  className="sh2-link"
                  href={href}
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Search — desktop only; submits to /products?q= */}
            <form
              className="sh2-search"
              onSubmit={onSearch}
              role="search"
              style={{ flex: 1, maxWidth: 420, position: "relative" }}
            >
              <Search
                aria-hidden
                size={15}
                style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#bbb" }}
              />
              <input
                aria-label="Search products"
                className="sh2-input"
                name="q"
                placeholder="Search laptops, tablets, accessories..."
                type="search"
              />
            </form>

            {/* Cart — always visible; pushed right on mobile */}
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
              <CartButton />
            </div>
          </div>

          {/* Optional category sub-nav */}
          {showCategoryNav && (
            <nav
              className="sh2-desktop"
              style={{
                alignItems: "center", gap: 4, height: 40,
                borderTop: "1px solid #f0f0f0", overflowX: "auto",
              }}
            >
              {CATEGORY_NAV.map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  style={{
                    padding: "0 12px", height: "100%",
                    display: "flex", alignItems: "center",
                    fontSize: 12.5, fontWeight: 600,
                    color: "#374151", whiteSpace: "nowrap", textDecoration: "none",
                  }}
                >
                  {label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>
    </>
  );
}
