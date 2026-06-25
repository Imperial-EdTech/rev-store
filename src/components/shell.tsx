"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { RevricaLogo } from "@/components/brand";
import { Button } from "@/components/ui";

const nav = [
  { href: "/#program", label: "Teacher Program" },
  { href: "/#financing", label: "Financing" },
  { href: "/#tech-audit", label: "Free Tech Audit" },
  { href: "/#devices", label: "Devices" },
  { href: "/#faq", label: "FAQ" }
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
        <RevricaLogo />
        <nav className="hidden items-center gap-8 text-xs font-bold uppercase tracking-[0.14em] text-white/70 lg:flex">
          {nav.map((item) => (
            <Link className="transition hover:text-rev-orange" href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/early-access">
          <Button className="h-11 px-5 text-xs">Join Waitlist</Button>
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
          <RevricaLogo />
          <p className="text-sm leading-6 text-white/55">
            Revrica equips African teachers and schools with laptops on flexible, affordable terms.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm text-white/55 sm:grid-cols-3">
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/35">Program</p>
            <Link className="block hover:text-rev-orange" href="/#program">Teacher Empowerment</Link>
            <Link className="block hover:text-rev-orange" href="/#financing">Pay Monthly</Link>
            <Link className="block hover:text-rev-orange" href="/tech-audit">Free Tech Audit</Link>
            <Link className="block hover:text-rev-orange" href="/#faq">FAQ</Link>
          </div>
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/35">Get Started</p>
            <Link className="block hover:text-rev-orange" href="/early-access">Join Waitlist</Link>
            <Link className="block hover:text-rev-orange" href="/tech-audit">Request Tech Audit</Link>
          </div>
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/35">Team</p>
            <Link className="block hover:text-rev-orange" href="/admin">Admin</Link>
          </div>
        </div>
      </div>
      <div className="container-x mt-10 border-t border-white/10 pt-6 text-xs text-white/35">
        © {new Date().getFullYear()} Revrica. Registering interest does not create a loan agreement.
      </div>
    </footer>
  );
}
