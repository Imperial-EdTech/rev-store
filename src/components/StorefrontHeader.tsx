"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { RevricaLogo } from "@/components/brand";

const NAV_CATEGORIES: [string, string][] = [
  ["Laptops", "/products"],
  ["Tablets", "/products/tablets"],
  ["All-in-Ones", "#"],
  ["Mini PCs", "#"],
  ["Interactive Boards", "#"],
  ["Content Servers", "#"],
];

const MOBILE_NAV: [string, string][] = [
  ["Laptops", "/products"],
  ["Tablets", "/products/tablets"],
  ["All-in-Ones", "#"],
  ["Mini PCs", "#"],
  ["Interactive Boards", "#"],
  ["Programs", "/teacher-empowerment"],
];

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
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
              {MOBILE_NAV.map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-xl px-3 py-3.5 text-[14px] font-semibold text-[#1a1a1a] transition hover:bg-orange-50"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f2760f" strokeWidth="2.2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                  {label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-3 px-4 pb-6">
              <Link href="/pre-order" onClick={onClose}>
                <button
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#f2760f] text-[13px] font-bold text-white"
                  style={{ height: 48 }}
                  type="button"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
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

interface StorefrontHeaderProps {
  /** Show the top info bar (phone / email / pre-order status). Defaults to true. */
  showInfoBar?: boolean;
  /** Show the category nav row below the main header bar. Defaults to true. */
  showCategoryNav?: boolean;
}

/**
 * Shared storefront header used across all RevStore pages.
 * Renders the top info bar, the sticky main header (logo + search + CTA),
 * and the desktop category nav. The mobile slide-out menu is self-contained.
 */
export function StorefrontHeader({
  showInfoBar = true,
  showCategoryNav = true,
}: StorefrontHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <style>{`
        .sh-nav-desktop { display: flex; }
        .sh-nav-mobile  { display: none; }
        .sh-search      { display: block; }
        .sh-top-bar     { display: flex; }
        @media (max-width: 768px) {
          .sh-nav-desktop { display: none !important; }
          .sh-nav-mobile  { display: flex !important; }
          .sh-search      { display: none !important; }
          .sh-top-bar     { display: none !important; }
        }
      `}</style>

      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Top info bar */}
      {showInfoBar && (
        <div className="sh-top-bar" style={{ background: "#111", padding: "8px 0" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 11.5, color: "rgba(255,255,255,0.5)" }}>
              <span>About</span><span>Support</span><span>FAQ</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f2760f", display: "inline-block" }} />
              <span style={{ color: "#f2760f", fontWeight: 700 }}>Pre-order open</span>
              <span style={{ color: "rgba(255,255,255,0.45)" }}>— Rev Orion from ₦290,000</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 11.5, color: "rgba(255,255,255,0.5)" }}>
              <span>+234 813 611 7198</span>
              <span style={{ color: "#f2760f" }}>support@revrica.com</span>
            </div>
          </div>
        </div>
      )}

      {/* Main header */}
      <header style={{ background: "#fff", borderBottom: "1px solid #e8e8e8", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, height: 64 }}>
            {/* Hamburger — mobile only */}
            <button
              className="sh-nav-mobile"
              onClick={() => setMobileMenuOpen(true)}
              style={{ height: 36, width: 36, alignItems: "center", justifyContent: "center", borderRadius: 8, border: "1.5px solid #e8e8e8", background: "transparent", cursor: "pointer", flexShrink: 0 }}
              type="button"
              aria-label="Open menu"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.2" strokeLinecap="round">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Logo */}
            <div style={{ flexShrink: 0 }}>
              <RevricaLogo variant="light" />
            </div>

            {/* Search — hidden on mobile */}
            <div className="sh-search" style={{ flex: 1, maxWidth: 500, position: "relative" }}>
              <Search size={14} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#aaa" }} />
              <input
                placeholder="Search laptops, tablets, accessories..."
                style={{ width: "100%", height: 38, borderRadius: 9, border: "1.5px solid #e8e8e8", background: "#fafafa", paddingLeft: 36, paddingRight: 14, fontSize: 12.5, color: "#111", outline: "none", boxSizing: "border-box" }}
              />
            </div>

            {/* Desktop CTA */}
            <div className="sh-nav-desktop" style={{ alignItems: "center", gap: 8, marginLeft: "auto" }}>
              <Link href="/pre-order">
                <button
                  style={{ height: 37, padding: "0 18px", borderRadius: 8, border: "none", background: "#f2760f", fontSize: 12.5, fontWeight: 700, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 7, whiteSpace: "nowrap" }}
                  type="button"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="#fff"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                  Pre-order
                </button>
              </Link>
            </div>

            {/* Mobile: pre-order pill */}
            <div className="sh-nav-mobile" style={{ marginLeft: "auto" }}>
              <Link href="/pre-order">
                <button
                  style={{ height: 36, padding: "0 14px", borderRadius: 8, border: "none", background: "#f2760f", fontSize: 12, fontWeight: 700, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                  type="button"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                  Pre-order
                </button>
              </Link>
            </div>
          </div>

          {/* Category nav — desktop only */}
          {showCategoryNav && (
            <nav
              className="sh-nav-desktop"
              style={{ alignItems: "center", gap: 4, height: 40, borderTop: "1px solid #f0f0f0", overflowX: "auto" }}
            >
              {NAV_CATEGORIES.map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  style={{ padding: "0 12px", height: "100%", display: "flex", alignItems: "center", fontSize: 12.5, fontWeight: 600, color: "#374151", whiteSpace: "nowrap", textDecoration: "none" }}
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