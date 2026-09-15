"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { RevricaLogo } from "@/components/brand";

// ─── Mobile slide-out menu ────────────────────────────────────
function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navLinks: [string, string][] = [
    ["Home",               "/"],
    ["About",              "/about"],
    ["Shop Now",           "/products"],
    ["Laptops",            "/products"],
    ["Tablets",            "/products/tablets"],
    ["All-in-Ones",        "#"],
    ["Mini PCs",           "#"],
    ["Interactive Boards", "#"],
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
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-black/60"
                type="button"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex flex-1 flex-col gap-1 px-4 py-5">
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
              <Link href="/pre-order" onClick={onClose}>
                <button
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4a0e10] text-[13px] font-bold text-white"
                  style={{ height: 48 }}
                  type="button"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Pre-order Now
                </button>
              </Link>
              <Link href="/early-access" onClick={onClose}>
                <button
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-black/12 text-[13px] font-semibold text-[#374151]"
                  style={{ height: 48 }}
                  type="button"
                >
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

// ─── Props ────────────────────────────────────────────────────
interface StorefrontHeaderProps {
  /** Hide the maroon top info bar. Defaults to true (shown). */
  showInfoBar?: boolean;
  /**
   * Show the desktop category sub-nav below the main bar.
   * Defaults to false — matches the homepage which uses the
   * centred primary nav instead.
   */
  showCategoryNav?: boolean;
}

/**
 * Shared storefront header — matches the homepage design exactly.
 *
 * Layout:
 *   1. Maroon top strip  "Welcome to RevStore by Revrica"
 *   2. Sticky white bar  logo · centred nav · search · Pre-order CTA
 */
export function StorefrontHeader({
  showInfoBar = true,
  showCategoryNav = false,
}: StorefrontHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <style>{`
        .sh2-desktop { display: flex; }
        .sh2-mobile  { display: none; }
        .sh2-search  { display: block; }
        .sh2-topbar  { display: block; }
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
              {([
                ["Home",     "/"],
                ["About",    "/about"],
                ["Shop Now", "/products"],
              ] as [string, string][]).map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  style={{
                    padding: "10px 22px",
                    display: "flex",
                    alignItems: "center",
                    fontSize: 14.5,
                    fontWeight: 700,
                    color: "#1a1a1a",
                    whiteSpace: "nowrap",
                    textDecoration: "none",
                    borderRadius: 10,
                    transition: "background 0.15s, color 0.15s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "rgba(74,14,16,0.06)";
                    e.currentTarget.style.color = "#4a0e10";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#1a1a1a";
                  }}
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Search — desktop only */}
            <div className="sh2-search" style={{ flex: 1, maxWidth: 420, position: "relative" }}>
              <Search
                size={15}
                style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#bbb" }}
              />
              <input
                placeholder="Search laptops, tablets, accessories..."
                style={{
                  width: "100%", height: 44, borderRadius: 11,
                  border: "1.5px solid #e8e8e8", background: "#fafafa",
                  paddingLeft: 40, paddingRight: 16,
                  fontSize: 13, color: "#111", outline: "none",
                  boxSizing: "border-box", transition: "border-color 0.15s",
                }}
                onFocus={e => (e.target.style.borderColor = "#4a0e10")}
                onBlur={e => (e.target.style.borderColor = "#e8e8e8")}
              />
            </div>

            {/* Pre-order CTA — desktop */}
            <div className="sh2-desktop" style={{ alignItems: "center", gap: 10, flexShrink: 0 }}>
              <Link href="/pre-order">
                <button
                  style={{
                    height: 44, padding: "0 22px", borderRadius: 11,
                    border: "none", background: "#4a0e10",
                    fontSize: 13.5, fontWeight: 700, color: "#fff",
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                    whiteSpace: "nowrap",
                    boxShadow: "0 2px 10px rgba(74,14,16,0.25)",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = "#3a0a0d")}
                  onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = "#4a0e10")}
                  type="button"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Pre-order
                </button>
              </Link>
            </div>

            {/* Pre-order — mobile */}
            <div className="sh2-mobile" style={{ marginLeft: "auto" }}>
              <Link href="/pre-order">
                <button
                  style={{
                    height: 40, padding: "0 16px", borderRadius: 10,
                    border: "none", background: "#4a0e10",
                    fontSize: 12.5, fontWeight: 700, color: "#fff",
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                  }}
                  type="button"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Pre-order
                </button>
              </Link>
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
              {([
                ["Laptops",           "/products"],
                ["Tablets",           "/products/tablets"],
                ["All-in-Ones",       "#"],
                ["Mini PCs",          "#"],
                ["Interactive Boards","#"],
                ["Content Servers",   "#"],
              ] as [string, string][]).map(([label, href]) => (
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