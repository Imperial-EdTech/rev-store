"use client";

import { motion } from "framer-motion";
import {
  ArrowRight, BookOpen, CheckCircle2, ChevronDown,
  Cpu, GraduationCap, Layers, Shield, Wifi, Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SiteFooter, SiteHeader } from "@/components/shell";
import { Button } from "@/components/ui";
import { Reveal } from "@/components/reveal";

// ─────────────────────────────────────────────────────────────
// Both laptop models use /public/devices/rev-laptop.png until
// individual product shots are available.
// ─────────────────────────────────────────────────────────────

function DeviceImg({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <svg className={className} fill="none" viewBox="0 0 560 380" xmlns="http://www.w3.org/2000/svg">
        <path d="M80 40 L480 40 L472 280 L88 280 Z" fill="#2a2a2e" />
        <path d="M96 56 L464 56 L458 264 L102 264 Z" fill="#0a0a0c" />
        <rect fill="#8a1a1e" height="160" rx="6" width="300" x="130" y="80" />
        <path d="M40 296 L520 296 L560 348 L0 348 Z" fill="#1e1e22" />
        <rect fill="#FF6B1A" height="4" rx="2" width="40" x="260" y="330" />
        <text fill="rgba(255,255,255,0.3)" fontFamily="system-ui" fontSize="14" textAnchor="middle" x="280" y="175">{alt}</text>
      </svg>
    );
  }
  return (
    <img
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      src={src}
    />
  );
}

// ── Financing data ────────────────────────────────────────────
// Profit rates from Revrica financing document (same rates applied to both models):
//   12 months → 16.98%
//   24 months → 34.19%
//   36 months → 52.83%
//
// Rev Orion 12"  — ₦350,000 — exact figures from document
// Rev Aelia 14"  — ₦400,000 — same rates applied

const DEVICES = [
  {
    id: "orion",
    name: "Rev Orion",
    size: '12"',
    price: 350000,
    img: "/devices/rev-laptop.png",
    desc: "Compact and lightweight — ideal for individual teachers who commute between classrooms or schools.",
    plans: [
      { months: 12, monthly: 34120.49, profitRate: "16.98%" },
      { months: 24, monthly: 19569.49, profitRate: "34.19%" },
      { months: 36, monthly: 14858.05, profitRate: "52.83%" },
    ],
    // Specs — Rev Orion (from product PDF)
    specs: [
      { label: "Display",        value: '11.6" HD LCD (1366 × 768)' },
      { label: "Processor",      value: "Intel® Celeron N4020 (up to 2.8GHz)" },
      { label: "RAM",            value: "4GB LPDDR4, On-board" },
      { label: "Storage",        value: "128GB eMMC + 1× M.2 2280 SATA SSD slot" },
      { label: "Webcam",         value: "2MPix FHD" },
      { label: "Battery",        value: "29.6Wh · Up to 8 hours" },
      { label: "OS",             value: "Windows 11 Home 64-bit" },
      { label: "Wi-Fi",          value: "Intel® Dual Band 802.11ac" },
      { label: "Bluetooth",      value: "4.2" },
      { label: "Ports",          value: "2× USB 3.2 Gen 1 · 1× USB-C · mini HDMI · Combo Audio · MicroSD" },
      { label: "Keyboard",       value: "Splash-resistant (ML-810 certified) · Choice of language" },
      { label: "Weight",         value: "0.98 kg" },
      { label: "Certifications", value: "ML-810 · RoHS · Energy Star · Win 11 Compatible" },
    ],
  },
  {
    id: "aelia",
    name: "Rev Aelia",
    size: '14"',
    price: 400000,
    img: "/devices/rev-laptop.png",
    desc: "Larger screen and more room to work — suited for administrators, content creators, and senior staff.",
    plans: [
      { months: 12, monthly: 38993.33, profitRate: "16.98%" },
      { months: 24, monthly: 22365.00, profitRate: "34.19%" },
      { months: 36, monthly: 16981.11, profitRate: "52.83%" },
    ],
    // Same internals as Orion, larger chassis
    specs: [
      { label: "Display",        value: '14.0" HD LCD (1366 × 768)' },
      { label: "Processor",      value: "Intel® Celeron N4020 (up to 2.8GHz)" },
      { label: "RAM",            value: "4GB LPDDR4, On-board" },
      { label: "Storage",        value: "128GB eMMC + 1× M.2 2280 SATA SSD slot" },
      { label: "Webcam",         value: "2MPix FHD" },
      { label: "Battery",        value: "29.6Wh · Up to 8 hours" },
      { label: "OS",             value: "Windows 11 Home 64-bit" },
      { label: "Wi-Fi",          value: "Intel® Dual Band 802.11ac" },
      { label: "Bluetooth",      value: "4.2" },
      { label: "Ports",          value: "2× USB 3.2 Gen 1 · 1× USB-C · mini HDMI · Combo Audio · MicroSD" },
      { label: "Keyboard",       value: "Splash-resistant (ML-810 certified) · Choice of language" },
      { label: "Weight",         value: "1.3 kg" },
      { label: "Certifications", value: "ML-810 · RoHS · Energy Star · Win 11 Compatible" },
    ],
  },
];

const INCLUDED = [
  { icon: BookOpen,      title: "RevLearn platform",       body: "Free access to courses, tools, and resources built for Nigerian teachers — preloaded on every device." },
  { icon: Layers,        title: "Microsoft Office 365",    body: "Word, Excel, PowerPoint, Teams, and OneDrive — fully licensed and ready from day one." },
  { icon: Shield,        title: "2-year warranty",         body: "Full hardware warranty backed by our local support team in Nigeria." },
  { icon: GraduationCap, title: "Teacher training",        body: "Free onboarding sessions so you get full value from your device from day one." },
  { icon: Cpu,           title: "Local technical support", body: "Our support team is based in Nigeria — they understand your power situation, your connectivity, your classroom." },
  { icon: Wifi,          title: "Offline-capable",         body: "RevLearn and Office work without internet — great for schools with unreliable connectivity." },
];

const HOW = [
  { n: "01", title: "Join the waitlist",  body: "Fill in your details. No commitment, no payment at this stage." },
  { n: "02", title: "Verification",       body: "Our team verifies your role as a teacher, school owner, or administrator. Quick and paperwork-light." },
  { n: "03", title: "Choose your plan",   body: "Pick your device and repayment term. Your exact monthly amount is confirmed with our financing partner." },
  { n: "04", title: "Device delivered",   body: "Your Rev laptop arrives. Monthly payments begin the following month." },
];

const FAQS = [
  { q: "Do I pay anything upfront?",             a: "No. The programme requires zero upfront payment. You receive the device first; payments begin the following month." },
  { q: "Who qualifies?",                         a: "Any Nigerian teacher, school owner, school administrator, or education professional. No credit history required — just proof of your role." },
  { q: "Can a school enrol multiple teachers?",  a: "Yes. School owners can register interest for their entire staff in a single submission. Our team will arrange the group plan." },
  { q: "Which institution handles my payments?", a: "Monthly payments are processed through a regulated Nigerian financial institution. You'll be notified of your specific partner at the time of approval." },
  { q: "What if I miss a payment?",              a: "Contact us before you miss a payment. This programme is designed for teachers — we work with you, not against you." },
  { q: "Do I own the laptop after repayment?",   a: "Yes. Once your final payment is made, the device is 100% yours." },
  { q: "What KYC documents will I need?",        a: "Typically a valid ID, proof of employment (school letter or staff ID), and a recent payslip. Requirements may vary by financing partner." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10">
      <button
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        <span className="font-display text-base font-bold text-white md:text-lg">{q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/60"
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </button>
      {open && (
        <motion.p animate={{ opacity: 1 }} className="pb-5 text-sm leading-7 text-white/60" initial={{ opacity: 0 }}>
          {a}
        </motion.p>
      )}
    </div>
  );
}

function fmt(n: number) {
  return "₦" + n.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function TeacherEmpowermentPage() {
  const [selectedDeviceId, setSelectedDeviceId] = useState("orion");
  const [selectedMonths, setSelectedMonths]     = useState(24);

  const device = DEVICES.find((d) => d.id === selectedDeviceId) ?? DEVICES[0];
  const plan   = device.plans.find((p) => p.months === selectedMonths) ?? device.plans[1];

  return (
    <>
      <SiteHeader />
      <main className="overflow-hidden bg-white">

        {/* ── HERO ── */}
        <section
          className="relative overflow-hidden pb-24 pt-20"
          style={{ background: "radial-gradient(130% 95% at 65% 20%, #7a1a1e 0%, #4a0e10 55%, #2e0608 100%)" }}
        >
          <div className="noise-overlay" />
          <div className="container-x relative z-10 max-w-3xl text-center">
            <motion.p
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-bold uppercase tracking-[0.22em] text-rev-orange"
              initial={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.5 }}
            >
              Teacher Digital Empowerment Programme
            </motion.p>
            <motion.h1
              animate={{ opacity: 1, y: 0 }}
              className="text-balance mx-auto mt-4 font-display text-4xl font-extrabold leading-[1.06] tracking-tight text-white md:text-6xl"
              initial={{ opacity: 0, y: 18 }}
              transition={{ duration: 0.6, delay: 0.08 }}
            >
              Put a laptop in the hands<br />
              <span className="text-rev-peach">of every teacher.</span>
            </motion.h1>
            <motion.p
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/62"
              initial={{ opacity: 0, y: 14 }}
              transition={{ duration: 0.55, delay: 0.14 }}
            >
              Affordable monthly payments. A brand-new Rev laptop. Zero upfront. No Nigerian teacher left without the tools they need.
            </motion.p>
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="mt-9 flex flex-wrap items-center justify-center gap-4"
              initial={{ opacity: 0, y: 14 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link href="/apply"><Button>Apply now <ArrowRight className="h-4 w-4" /></Button></Link>
              <a href="#specs"><Button variant="ghost">See specifications</Button></a>
            </motion.div>
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto mt-14 grid max-w-lg grid-cols-3 divide-x divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06]"
              initial={{ opacity: 0, y: 14 }}
              transition={{ duration: 0.5, delay: 0.26 }}
            >
              {[
                { val: "₦14,858", lbl: "From / month" },
                { val: "36mo",    lbl: "Up to" },
                { val: "2yr",     lbl: "Warranty" },
              ].map((s) => (
                <div className="flex flex-col items-center gap-1 py-6" key={s.lbl}>
                  <span className="font-display text-2xl font-extrabold text-white md:text-3xl">{s.val}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40">{s.lbl}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── SPECIFICATIONS — shown first, before financing ── */}
        <section className="bg-white py-24" id="specs">
          <div className="container-x">
            <Reveal>
              <p className="text-center text-xs font-bold uppercase tracking-[0.22em] text-rev-orange">
                Technical Specifications
              </p>
              <h2 className="text-balance mx-auto mt-3 max-w-xl text-center font-display text-4xl font-extrabold tracking-tight text-[#1d1d1f] md:text-5xl">
                Built to last.
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-center text-base leading-7 text-[#6e6e73]">
                Every Rev laptop is reinforced for classroom conditions — splash-resistant keyboard, all-day battery, and local support when you need it.
              </p>
            </Reveal>

            <div className="mt-14 grid gap-8 lg:grid-cols-2">
              {DEVICES.map((d, di) => (
                <Reveal delay={di * 0.1} key={d.id}>
                  <div className="overflow-hidden rounded-3xl border border-black/8 bg-white shadow-sm">
                    {/* Product image */}
                    <div className="flex items-center justify-center bg-gradient-to-br from-[#f5f5f7] to-[#e8e5e2] px-12 py-10">
                      <DeviceImg
                        alt={`${d.name} ${d.size}`}
                        className="w-full max-w-xs drop-shadow-xl"
                        src={d.img}
                      />
                    </div>

                    <div className="p-8">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-display text-2xl font-extrabold text-[#1d1d1f]">
                            {d.name} <span className="text-[#6e6e73]">{d.size}</span>
                          </h3>
                          <p className="mt-1 text-sm text-[#6e6e73]">{d.desc}</p>
                        </div>
                        <span className="shrink-0 font-display text-2xl font-extrabold text-rev-orange">
                          ₦{d.price.toLocaleString()}
                        </span>
                      </div>

                      <div className="mt-6 divide-y divide-black/6">
                        {d.specs.map((spec) => (
                          <div className="flex justify-between gap-4 py-3" key={spec.label}>
                            <span className="text-sm font-semibold text-[#6e6e73]">{spec.label}</span>
                            <span className="text-right text-sm font-bold text-[#1d1d1f]">{spec.value}</span>
                          </div>
                        ))}
                      </div>

                      {/* CTA — scroll to plans */}
                      <a className="mt-7 block" href="#plans">
                        <Button className="w-full">
                          See payment plans for {d.name} {d.size} <ArrowRight className="h-4 w-4" />
                        </Button>
                      </a>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-5 rounded-2xl border border-black/6 bg-[#f5f5f7] p-5 text-center" delay={0.2}>
              <p className="text-sm text-[#6e6e73]">
                Specifications are indicative and may vary. Custom configurations available for institutional orders of 10+ units.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── PAYMENT PLANS — device → term → monthly ── */}
        <section className="bg-[#f5f5f7] py-24" id="plans">
          <div className="container-x">
            <Reveal>
              <p className="text-center text-xs font-bold uppercase tracking-[0.22em] text-rev-orange">Payment Plans</p>
              <h2 className="text-balance mx-auto mt-3 max-w-xl text-center font-display text-4xl font-extrabold tracking-tight text-[#1d1d1f] md:text-5xl">
                Choose your plan.
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-center text-base leading-7 text-[#6e6e73]">
                Select your laptop, then pick your repayment term. Rates are final figures set by our licensed financing partner — not estimates.
              </p>
            </Reveal>

            <Reveal className="mx-auto mt-10 max-w-3xl" delay={0.08}>
              <div className="overflow-hidden rounded-3xl border border-black/8 bg-white shadow-lg">

                {/* Step 1 — Device */}
                <div className="border-b border-black/6 p-6">
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-[#6e6e73]">
                    Step 1 — Select your laptop
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {DEVICES.map((d) => (
                      <button
                        className={`flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition ${
                          selectedDeviceId === d.id
                            ? "border-rev-orange bg-rev-orange/5"
                            : "border-black/8 bg-[#fafafa] hover:border-black/20"
                        }`}
                        key={d.id}
                        onClick={() => setSelectedDeviceId(d.id)}
                        type="button"
                      >
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#f5f5f7] to-[#e8e5e2]">
                          <DeviceImg alt={d.name} className="h-14 w-14 object-contain" src={d.img} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-display text-base font-extrabold text-[#1d1d1f]">
                            {d.name} <span className="font-semibold text-[#6e6e73]">{d.size}</span>
                          </p>
                          <p className="mt-0.5 text-xs leading-5 text-[#6e6e73]">{d.desc}</p>
                          <p className="mt-1.5 font-display text-sm font-bold text-rev-orange">
                            ₦{d.price.toLocaleString()}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2 — Term */}
                <div className="border-b border-black/6 p-6">
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-[#6e6e73]">
                    Step 2 — Choose repayment term
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {device.plans.map((p) => (
                      <button
                        className={`rounded-2xl border-2 py-4 text-center transition ${
                          selectedMonths === p.months
                            ? "border-rev-orange bg-rev-orange/5"
                            : "border-black/8 bg-[#fafafa] hover:border-black/20"
                        }`}
                        key={p.months}
                        onClick={() => setSelectedMonths(p.months)}
                        type="button"
                      >
                        <span className="block font-display text-xl font-extrabold text-[#1d1d1f]">{p.months}</span>
                        <span className="text-xs text-[#6e6e73]">months</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Result — monthly payment only */}
                <div
                  className="p-8 text-center"
                  style={{ background: "radial-gradient(120% 90% at 50% 0%, #7a1a1e 0%, #4a0e10 60%, #2e0608 100%)" }}
                >
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/50">
                    {device.name} {device.size} · {plan.months}-month plan
                  </p>
                  <motion.p
                    animate={{ scale: 1 }}
                    className="mt-3 font-display text-6xl font-extrabold text-white"
                    initial={{ scale: 0.88 }}
                    key={`${device.id}-${plan.months}`}
                    transition={{ duration: 0.25, ease: "backOut" }}
                  >
                    {fmt(plan.monthly)}
                  </motion.p>
                  <p className="mt-2 text-base font-semibold text-white/55">per month</p>
   
                  <Link className="mt-7 inline-block" href="/apply">
                    <Button>Apply for this plan <ArrowRight className="h-4 w-4" /></Button>
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* Outright option */}
            <Reveal className="mx-auto mt-5 max-w-3xl" delay={0.15}>
              <div className="flex items-center gap-4 rounded-2xl border border-black/8 bg-white p-6">
                <Zap className="h-8 w-8 shrink-0 text-rev-orange" />
                <div className="flex-1">
                  <p className="font-display text-base font-bold text-[#1d1d1f]">Prefer to buy outright?</p>
                  <p className="mt-0.5 text-sm text-[#6e6e73]">
                    Pay the full device price in one go and receive a discount. Select "Buy Outright" when applying.
                  </p>
                </div>
                <Link className="shrink-0" href="/apply">
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-rev-orange">
                    Apply <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── WHAT'S INCLUDED ── */}
        <section className="bg-[#0e0e0e] py-24">
          <div className="noise-overlay-dark" />
          <div className="container-x relative z-10">
            <Reveal>
              <p className="text-center text-xs font-bold uppercase tracking-[0.22em] text-rev-orange">What's included</p>
              <h2 className="text-balance mx-auto mt-3 max-w-xl text-center font-display text-4xl font-extrabold tracking-tight text-white md:text-5xl">
                More than just a laptop.
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {INCLUDED.map((item, i) => (
                <Reveal delay={i * 0.07} key={item.title}>
                  <div className="flex gap-4 rounded-2xl border border-white/8 bg-white/[0.04] p-6 transition hover:border-white/15">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rev-orange/12 text-rev-orange">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-display text-sm font-bold text-white">{item.title}</p>
                      <p className="mt-1.5 text-sm leading-6 text-white/50">{item.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="bg-[#f5f5f7] py-24">
          <div className="container-x">
            <Reveal>
              <p className="text-center text-xs font-bold uppercase tracking-[0.22em] text-rev-orange">How it works</p>
              <h2 className="text-balance mx-auto mt-3 max-w-xl text-center font-display text-4xl font-extrabold tracking-tight text-[#1d1d1f] md:text-5xl">
                Four steps to your laptop.
              </h2>
            </Reveal>
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {HOW.map((step, i) => (
                <Reveal delay={i * 0.08} key={step.n}>
                  <div className="relative">
                    <span className="select-none font-display text-5xl font-extrabold text-black/6">{step.n}</span>
                    <div className="mt-2 border-t-4 border-rev-orange pt-5">
                      <p className="font-display text-lg font-bold text-[#1d1d1f]">{step.title}</p>
                      <p className="mt-2 text-sm leading-6 text-[#6e6e73]">{step.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-24" style={{ background: "radial-gradient(120% 90% at 65% 20%, #7a1a1e 0%, #4a0e10 55%, #2e0608 100%)" }}>
          <div className="noise-overlay" />
          <div className="container-x relative z-10 max-w-2xl">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-rev-orange">Questions</p>
              <h2 className="mt-3 font-display text-3xl font-extrabold text-white md:text-4xl">Everything you need to know.</h2>
            </Reveal>
            <Reveal className="mt-10 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.04] px-6" delay={0.08}>
              {FAQS.map((item) => <FAQItem key={item.q} {...item} />)}
            </Reveal>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="bg-[#1d1d1f] py-28">
          <div className="container-x text-center">
            <Reveal>
              <CheckCircle2 className="mx-auto h-12 w-12 text-rev-orange" />
              <h2 className="text-balance mx-auto mt-6 max-w-xl font-display text-4xl font-extrabold text-white md:text-5xl">
                Ready to get your laptop?
              </h2>
              <p className="mx-auto mt-5 max-w-md text-lg leading-7 text-white/55">
                Join the waitlist — no payment required. Our team will follow up with your exact plan and next steps.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                <Link href="/apply"><Button>Apply now <ArrowRight className="h-4 w-4" /></Button></Link>
                <Link href="/"><Button variant="ghost">Back to RevStore</Button></Link>
              </div>
              <p className="mt-5 text-xs text-white/25">
                Applying does not commit you to any payment or financing agreement.
              </p>
            </Reveal>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  );
}
