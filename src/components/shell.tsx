"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui";

// ── Revrica RevStore wordmark ─────────────────────────────────
// Uses your existing logo image with "RevStore" alongside it.
// If the image fails to load, falls back to text wordmark.
function RevricaRevStoreLogo() {
  return (
    <Link aria-label="Revrica RevStore home" className="inline-flex items-center gap-2" href="/">
      {/* Logo image — /public/brand/revrica-logo.png */}
      <img
        alt="Revrica"
        className="h-7 w-auto md:h-8"
        src="/brand/revrica-logo.png"
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />
      {/* RevStore wordmark alongside */}
      <span className="flex items-baseline gap-0.5 select-none">
        <span
          className="font-display text-base font-black tracking-tight text-white md:text-lg"
          style={{ fontStyle: "italic", letterSpacing: "-0.03em" }}
        >
          Rev
        </span>
        <span
          className="font-display text-base font-light tracking-wide text-rev-orange md:text-lg"
          style={{ letterSpacing: "0.12em" }}
        >
          Store
        </span>
      </span>
    </Link>
  );
}

const nav = [
  { href: "/#products",           label: "Devices" },
  { href: "/#empowerment",        label: "Teacher Programme" },
  { href: "/teacher-empowerment", label: "How It Works" },
  { href: "/#benefits",           label: "What's Included" },
];

export function SiteHeader() {
  return (
    <motion.header
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 border-b border-white/10 bg-maroon/90 backdrop-blur-xl"
      initial={{ y: -16, opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container-x flex h-20 items-center justify-between gap-4">
        <RevricaRevStoreLogo />
        <nav className="hidden items-center gap-8 text-xs font-bold uppercase tracking-[0.14em] text-white/70 lg:flex">
          {nav.map((item) => (
            <Link className="transition hover:text-rev-orange" href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/apply">
          <Button className="h-11 px-5 text-xs">Apply Now</Button>
        </Link>
      </div>
    </motion.header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-maroon-deep py-12">
      <div className="container-x flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm space-y-4">
          <RevricaRevStoreLogo />
          <p className="text-sm leading-6 text-white/55">
            Revrica is a Nigerian OEM — we design and manufacture laptops, tablets, smartboards, and servers for African schools and institutions.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm text-white/55 sm:grid-cols-3">
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/35">Products</p>
            <Link className="block hover:text-rev-orange" href="/#products">Laptops</Link>
            <Link className="block hover:text-rev-orange" href="/#products">Tablets</Link>
            <Link className="block hover:text-rev-orange" href="/#products">Smartboards</Link>
            <Link className="block hover:text-rev-orange" href="/#products">Servers</Link>
          </div>
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/35">Teacher Programme</p>
            <Link className="block hover:text-rev-orange" href="/teacher-empowerment">How It Works</Link>
            <Link className="block hover:text-rev-orange" href="/teacher-empowerment#plans">Payment Plans</Link>
            <Link className="block hover:text-rev-orange" href="/teacher-empowerment#specs">Device Specs</Link>
            <Link className="block hover:text-rev-orange" href="/apply">Apply Now</Link>
          </div>
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/35">Company</p>
            <Link className="block hover:text-rev-orange" href="/tech-audit">Free Tech Audit</Link>
            <Link className="block hover:text-rev-orange" href="/partners">Partner Portal</Link>
            <Link className="block hover:text-rev-orange" href="/admin">Admin</Link>
          </div>
        </div>
      </div>
      <div className="container-x mt-10 border-t border-white/10 pt-6 text-xs text-white/30">
        © {new Date().getFullYear()} Revrica. Applying does not guarantee financing approval. Monthly amounts are indicative — final terms confirmed with your financing institution.
      </div>
    </footer>
  );
}
