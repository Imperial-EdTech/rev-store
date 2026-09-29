"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Menu, Search, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { RevricaLogo } from "@/components/brand";
import { CONTACT } from "@/lib/contact";

// Contact details come from lib/contact.ts (single source).
const PHONE   = CONTACT.phone;
const EMAIL   = CONTACT.supportEmail;
const ADDRESS = CONTACT.address;

// ── Category nav ───────────────────────────────────────────────
const CATEGORIES = [
  { label: "Laptops",           href: "/teacher-empowerment" },
  { label: "Tablets",           href: "/products/tablets" },
  { label: "All-in-Ones",       href: "/products/all-in-one" },
  { label: "Mini PCs",          href: "/products/mini-pcs" },
  { label: "Interactive Boards",href: "/products/smartboards" },
  { label: "Content Servers",   href: "/products/content-cloud" },
  { label: "Maker Spaces",      href: "/products/maker-spaces" },
];

const FOOTER_DEVICES = [
  { label: "Laptops",           href: "/teacher-empowerment" },
  { label: "Tablets",           href: "/products/tablets" },
  { label: "All-in-Ones",       href: "/products/all-in-one" },
  { label: "Mini PCs",          href: "/products/mini-pcs" },
  { label: "Interactive Boards",href: "/products/smartboards" },
  { label: "Content Servers",   href: "/products/content-cloud" },
  { label: "Maker Spaces",      href: "/products/maker-spaces" },
];

const FOOTER_PROGRAMME = [
  { label: "Teacher Empowerment",    href: "/teacher-empowerment" },
  { label: "Let There Be Teachers",  href: "/teacher-empowerment#ltbt" },
  { label: "Apply now",              href: "/apply" },
  { label: "Payment plans",          href: "/teacher-empowerment#plans" },
  { label: "FAQ",                    href: "/#faq" },
];

const FOOTER_COMPANY = [
  { label: "About Revrica",         href: "https://revrica.com" },
  { label: "OEM Manufacturing",     href: "https://revrica.com" },
  { label: "ImperialEdtech",        href: "https://imperialedtech.com" },
  { label: "Terms and Conditions",  href: "/terms" },
  { label: "Privacy Policy",        href: "/privacy" },
  { label: "Support",               href: "/support" },
];

// ── Logo placeholder for partners (uses img with text fallback) ─
function PartnerLogo({ name, file, isLTBT }: { name: string; file: string; isLTBT?: boolean }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold ${
          isLTBT
            ? "border-yellow-400/30 bg-yellow-400/10 text-yellow-300"
            : "border-white/10 bg-white/5 text-white/50"
        }`}
      >
        {name}
      </div>
    );
  }
  return (
    <img
      alt={name}
      className="h-8 w-auto max-w-[130px] object-contain opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
      onError={() => setFailed(true)}
      src={`/logos/${file}`}
    />
  );
}

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ── Utility bar ── */}
      <div className="hidden border-b border-white/5 bg-[#110103] py-2 md:block">
        <div className="container-x flex items-center justify-between">
          <div className="flex gap-5 text-[11px] text-white/35">
            {["About", "Support", "FAQ"].map((l) => (
              <Link className="transition hover:text-white/70" href={`/${l.toLowerCase()}`} key={l}>{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-rev-orange" />
            </span>
            <span className="text-[11px] font-bold tracking-wide text-rev-orange">
              Teacher Empowerment Programme: applications open
            </span>
          </div>
          <div className="flex gap-5 text-[11px] text-white/35">
            <span>{PHONE}</span>
            <span>{EMAIL}</span>
          </div>
        </div>
      </div>

      {/* ── Main header ── */}
      <motion.header
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 border-b border-white/8 bg-[#2e0608]/95 backdrop-blur-xl"
        initial={{ y: -16, opacity: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className="container-x flex h-16 items-center gap-4">
          <RevricaLogo />

          {/* Search */}
          <div className="mx-4 hidden flex-1 items-center gap-3 rounded-full border border-white/10 bg-white/6 px-4 py-2.5 md:flex">
            <Search className="h-4 w-4 shrink-0 text-white/30" />
            <span className="text-sm text-white/25">Search laptops, tablets, accessories…</span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <Link
              className="hidden items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-xs font-bold text-white/70 transition hover:border-white/30 hover:text-white md:inline-flex"
              href="/early-access"
            >
              Join Waitlist
            </Link>
            <Link
              className="inline-flex items-center gap-1.5 rounded-full bg-rev-orange px-5 py-2.5 text-xs font-bold text-white shadow-lg transition hover:bg-rev-orange/90"
              href="/apply"
            >
              Apply Now
            </Link>
            <button
              aria-label="Menu"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-white/30 md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              type="button"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* ── Category nav strip ── */}
        <div className="hidden border-t border-white/6 md:block" style={{ background: "#3a0a0e" }}>
          <div className="container-x flex overflow-x-auto">
            {CATEGORIES.map((cat) => (
              <Link
                className="flex items-center gap-1.5 whitespace-nowrap border-b-2 border-transparent px-4 py-2.5 text-[11px] font-semibold text-white/45 transition hover:border-rev-orange hover:text-rev-orange"
                href={cat.href}
                key={cat.label}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>

        {/* ── Mobile menu ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              animate={{ height: "auto", opacity: 1 }}
              className="overflow-hidden border-t border-white/8 bg-[#1e0406]"
              exit={{ height: 0, opacity: 0 }}
              initial={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="space-y-1 p-4">
                {CATEGORIES.map((cat) => (
                  <Link
                    className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-white/60 transition hover:bg-white/5 hover:text-white"
                    href={cat.href}
                    key={cat.label}
                    onClick={() => setMobileOpen(false)}
                  >
                    {cat.label}
                    <ChevronDown className="h-4 w-4 -rotate-90" />
                  </Link>
                ))}
                <div className="pt-3">
                  <Link
                    className="block rounded-full bg-rev-orange py-3 text-center text-sm font-bold text-white"
                    href="/apply"
                    onClick={() => setMobileOpen(false)}
                  >
                    Apply Now
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer>
      {/* ── Partners strip ── */}
      <div className="border-t border-white/6 bg-[#f8f5f2] py-10">
        <div className="container-x">
          <p className="mb-6 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-black/30">
            Partners and financing institutions
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
            {[
              { name: "Let There Be Teachers", file: "let-there-be-teachers.png", ltbt: true },
              { name: "Lotus Bank",            file: "lotus-bank.png" },
              { name: "Sterling Bank",         file: "sterling-bank.png" },
              { name: "FCMB",                  file: "fcmb.png" },
              { name: "ImperialEdtech",        file: "imperial-edtech.png" },
              { name: "T2 Mobile",             file: "t2-mobile.png" },
            ].map((p) => (
              <PartnerLogo file={p.file} isLTBT={p.ltbt} key={p.name} name={p.name} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Main footer ── */}
      <div className="bg-[#0d0202] pt-14 pb-0">
        <div className="container-x grid gap-10 pb-12 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div>
            <RevricaLogo className="h-9 w-auto" />
            <p className="mt-4 text-sm leading-7 text-white/35">
              Revrica equips African teachers, schools, and businesses with quality hardware — flexible financing, local support, built for real conditions.
            </p>
            <div className="mt-5 space-y-2.5 text-xs text-white/30">
              <p className="flex items-start gap-2"><span className="mt-0.5 text-rev-orange/60">📍</span>{ADDRESS}</p>
              <p className="flex items-center gap-2"><span className="text-rev-orange/60">📞</span>{PHONE}</p>
              <p className="flex items-center gap-2"><span className="text-rev-orange/60">✉️</span>{EMAIL}</p>
            </div>
            {/* Social */}
            <div className="mt-5 flex gap-3">
              {[
                { label: "LinkedIn",  href: "https://linkedin.com" },
                { label: "Twitter",   href: "https://twitter.com" },
                { label: "Instagram", href: "https://instagram.com" },
                { label: "Facebook",  href: "https://facebook.com" },
              ].map((s) => (
                <a
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-[10px] font-bold text-white/30 transition hover:border-white/25 hover:text-white/60"
                  href={s.href}
                  key={s.label}
                  rel="noreferrer"
                  target="_blank"
                >
                  {s.label[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Devices */}
          <div>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.14em] text-white/25">Devices</p>
            <ul className="space-y-3">
              {FOOTER_DEVICES.map((l) => (
                <li key={l.label}>
                  <Link className="text-sm text-white/40 transition hover:text-white/80" href={l.href}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programme */}
          <div>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.14em] text-white/25">Programme</p>
            <ul className="space-y-3">
              {FOOTER_PROGRAMME.map((l) => (
                <li key={l.label}>
                  <Link className="text-sm text-white/40 transition hover:text-white/80" href={l.href}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.14em] text-white/25">Company</p>
            <ul className="space-y-3">
              {FOOTER_COMPANY.map((l) => (
                <li key={l.label}>
                  <Link className="text-sm text-white/40 transition hover:text-white/80" href={l.href}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.14em] text-white/20">
              Payment methods
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Bank Transfer", "WhatsApp", "Email"].map((m) => (
                <span
                  className="rounded-md border border-white/8 bg-white/5 px-2.5 py-1 text-[10px] text-white/30"
                  key={m}
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/6 py-5">
          <div className="container-x flex flex-col items-center justify-between gap-3 text-[10px] text-white/20 md:flex-row">
            <span>© 2026 Revrica Technology Ltd. All rights reserved. Powered by ImperialEdtech.</span>
            <div className="flex gap-5">
              <Link className="hover:text-white/50" href="/terms">Terms and Conditions</Link>
              <Link className="hover:text-white/50" href="/privacy">Privacy Policy</Link>
            </div>
            <span>Registering interest does not create a loan agreement.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}