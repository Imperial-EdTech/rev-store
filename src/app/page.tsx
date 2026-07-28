"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, BookOpen, Cpu, GraduationCap, Layers,
  Shield, Wifi,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Accordion } from "@/components/accordion";
import { Reveal } from "@/components/reveal";
import { SiteFooter, SiteHeader } from "@/components/shell";
import { Button } from "@/components/ui";

// ─────────────────────────────────────────────────────────────
// Device photos → /public/devices/
//   rev-laptop.png | rev-tablet.png | rev-allInOne.png
//   rev-minipc.png | rev-server.png | rev-smartboard.png | rev-makerspace.png
// Partner logos → /public/logos/
//   lotus-bank.png | sterling-bank.png | fcmb.png
//   imperial-edtech.png | t2-mobile.png | let-there-be-teachers.png
// ─────────────────────────────────────────────────────────────

function LaptopSVG({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 560 380" xmlns="http://www.w3.org/2000/svg">
      <path d="M80 40 L480 40 L472 280 L88 280 Z" fill="#2a2a2e" />
      <path d="M96 56 L464 56 L458 264 L102 264 Z" fill="#0a0a0c" />
      <rect fill="#8a1a1e" height="160" rx="6" width="300" x="130" y="80" />
      <rect fill="rgba(255,107,26,.18)" height="160" rx="6" width="300" x="130" y="80" />
      <path d="M40 296 L520 296 L560 348 L0 348 Z" fill="#1e1e22" />
      <rect fill="#FF6B1A" height="4" rx="2" width="40" x="260" y="330" />
    </svg>
  );
}

function DeviceImg({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <LaptopSVG className={className} />;
  return <img alt={alt} className={className} onError={() => setFailed(true)} src={src} />;
}

function PartnerLogo({ name, file }: { name: string; file: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <span className="font-display text-base font-bold text-[#1d1d1f] opacity-60">{name}</span>;
  return (
    <img
      alt={name}
      className="h-8 w-auto max-w-[140px] object-contain opacity-60 grayscale transition hover:opacity-90 hover:grayscale-0"
      onError={() => setFailed(true)}
      src={`/logos/${file}`}
    />
  );
}

// ── Orbital ring — NO circle track line ──────────────────────
const ORBIT_ITEMS = [
  { label: "Laptops",         img: "/devices/rev-laptop.png",    fallback: "💻" },
  { label: "Tablets",         img: "/devices/rev-tablet.png",    fallback: "📱" },
  { label: "All-in-One PCs",  img: "/devices/rev-allInOne.png",  fallback: "🖥️" },
  { label: "Mini PCs",        img: "/devices/rev-minipc.png",    fallback: "📦" },
  { label: "Content Servers", img: "/devices/rev-server.png",    fallback: "🗄️" },
];

function OrbitNode({ item, active, onClick }: {
  item: typeof ORBIT_ITEMS[0];
  active: boolean;
  onClick: () => void;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  return (
    <motion.button
      animate={{ scale: active ? 1.22 : 1, opacity: active ? 1 : 0.55 }}
      className="absolute flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 shadow-lg"
      onClick={onClick}
      style={{
        borderColor: active ? "#FF6B1A" : "rgba(255,255,255,0.15)",
        background: active ? "rgba(255,107,26,0.18)" : "rgba(255,255,255,0.07)",
      }}
      title={item.label}
      transition={{ duration: 0.35, ease: "easeOut" }}
      type="button"
    >
      {imgFailed ? (
        <span className="text-xl">{item.fallback}</span>
      ) : (
        <img alt={item.label} className="h-10 w-10 object-contain" onError={() => setImgFailed(true)} src={item.img} />
      )}
    </motion.button>
  );
}

function OrbitRing() {
  const [active, setActive] = useState(0);
  const total = ORBIT_ITEMS.length;
  const R = 148;
  const S = 340;

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % total), 2400);
    return () => clearInterval(id);
  }, [total]);

  return (
    <div className="relative mx-auto" style={{ width: S, height: S }}>
      {/* NO orbit track — nodes float on the circular path invisibly */}

      {/* Globe centre */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="flex h-28 w-28 flex-col items-center justify-center rounded-full shadow-2xl"
          style={{
            background: "radial-gradient(circle at 38% 36%, #7a1a1e, #2e0608)",
            border: "2px solid rgba(255,107,26,0.45)",
          }}
        >
          <span className="text-4xl">🌍</span>
          <span className="mt-1 text-center text-[9px] font-bold uppercase tracking-widest text-white/55 leading-tight">
            Built in<br />Nigeria
          </span>
        </div>
      </div>

      {/* Orbiting nodes — arranged on circular path, no visible track */}
      {ORBIT_ITEMS.map((item, i) => {
        const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
        const cx = S / 2 + R * Math.cos(angle);
        const cy = S / 2 + R * Math.sin(angle);
        return (
          <div key={item.label} style={{ position: "absolute", left: cx, top: cy }}>
            <OrbitNode active={i === active} item={item} onClick={() => setActive(i)} />
          </div>
        );
      })}

      {/* Active label */}
      <AnimatePresence mode="wait">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-10 left-0 right-0 text-center"
          exit={{ opacity: 0, y: -4 }}
          initial={{ opacity: 0, y: 5 }}
          key={active}
          transition={{ duration: 0.3 }}
        >
          <span className="inline-block rounded-full border border-rev-orange/40 bg-rev-orange/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-rev-orange">
            {ORBIT_ITEMS[active].label}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ── 2-slide carousel ──────────────────────────────────────────
const SLIDES = [{ id: "tdep" }, { id: "oem" }] as const;

// ── Device catalogue ──────────────────────────────────────────
const DEVICES = [
  { category: "Laptops",           name: "Rev Laptop",               tagline: "The classroom-ready workhorse.",       desc: "Reinforced chassis, splash-resistant keyboard, preloaded with Microsoft Office and RevLearn. Rev Orion 12″ and Rev Aelia 14″ available.", href: "/teacher-empowerment", img: "/devices/rev-laptop.png",    color: "#FF6B1A" },
  { category: "Tablets",           name: "Rev Tablet",               tagline: "Light. Fast. Ready to learn.",         desc: "10.1″ Android tablet with stylus support, rugged build, and a full day of battery — ideal for student and teacher use.",                   href: "/products/tablets",          img: "/devices/rev-tablet.png",    color: "#1d6fce" },
  { category: "All-in-One PCs",    name: "Rev All-in-One",           tagline: "Full power. Zero desk clutter.",       desc: "Integrated display and PC in one unit — ideal for school labs, reception desks, and administrative offices.",                             href: "/products/all-in-one",       img: "/devices/rev-allInOne.png",  color: "#6236cc" },
  { category: "Interactive Board", name: "Rev Interactive Board",    tagline: "Turn any wall into a classroom.",      desc: "65″ and 75″ 4K interactive displays with built-in Android and multi-touch — compatible with all major teaching platforms.",              href: "/products/smartboards",      img: "/devices/rev-smartboard.png",color: "#0d7b6b" },
  { category: "Content Server",    name: "Rev Content Cloud Server", tagline: "Your school. Your data. Always on.",   desc: "On-premise and cloud-managed servers that cache curriculum, e-books, and media for offline delivery across your entire network.",          href: "/products/content-cloud",    img: "/devices/rev-server.png",    color: "#c2410c" },
  { category: "Maker Spaces",      name: "Maker Space Kit",          tagline: "Build the next generation of makers.", desc: "Complete STEM lab setups — 3D printers, robotics kits, electronics workbenches, and curriculum — all in one package.",                      href: "/products/maker-spaces",     img: "/devices/rev-makerspace.png",color: "#92400e" },
  { category: "Mini PCs",          name: "Rev Mini PC",              tagline: "Big performance. Tiny footprint.",     desc: "Compact desktop powerhouses for school computer labs, digital signage, and teacher workstations — low power, high output.",              href: "/products/mini-pcs",         img: "/devices/rev-minipc.png",    color: "#0f766e" },
];

const PARTNERS = [
  { name: "Lotus Bank",            file: "lotus-bank.png" },
  { name: "Sterling Bank",         file: "sterling-bank.png" },
  { name: "FCMB",                  file: "fcmb.png" },
  { name: "ImperialEdtech",        file: "imperial-edtech.png" },
  { name: "T2 Mobile",             file: "t2-mobile.png" },
  { name: "Let There Be Teachers", file: "let-there-be-teachers.png" },
];

const BENEFITS = [
  { icon: BookOpen,      title: "RevLearn included",       body: "Free access to courses, tools, and resources built for Nigerian teachers — preloaded on every device." },
  { icon: Layers,        title: "Microsoft Office 365",    body: "Word, Excel, PowerPoint, Teams, and OneDrive — fully licensed and ready from day one. No extra cost." },
  { icon: Shield,        title: "2-year warranty",         body: "Full hardware warranty backed by our local support team in Nigeria." },
  { icon: GraduationCap, title: "Teacher training",        body: "Free onboarding sessions so you get full value from your device from day one." },
  { icon: Cpu,           title: "Local technical support", body: "Our support team is based in Nigeria — they understand your power situation, your connectivity, your classroom." },
  { icon: Wifi,          title: "Offline-capable",         body: "RevLearn and Office work without internet — you don't need fast connectivity to get full value from your device." },
];

const FAQS: [string, string][] = [
  ["What is Revrica?", "Revrica is a Nigerian OEM (original equipment manufacturer) that designs and produces hardware — laptops, tablets, all-in-ones, mini PCs, and servers — for African schools and institutions."],
  ["Can I buy a device directly from RevStore?", "Yes. All products on RevStore are available for direct purchase. Contact us or apply through the Teacher Digital Empowerment Programme for a financed option."],
  ["What is the Teacher Digital Empowerment Programme?", "A Buy Now, Pay Later scheme that lets Nigerian teachers own a Rev laptop through affordable monthly payments — zero upfront, over 12, 24, or 36 months, backed by a licensed financial institution."],
  ["Do devices come with a warranty?", "Yes. Every Revrica device carries a 2-year hardware warranty, serviced by our local support team in Nigeria."],
  ["Can a school order devices in bulk?", "Yes. Schools and institutions ordering 10 or more devices qualify for institutional pricing. Register your interest and our team will reach out."],
  ["What software comes preloaded?", "Rev laptops ship with Microsoft Office 365 and RevLearn preinstalled."],
];

export default function Home() {
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const next = useCallback(() => setSlide((s) => (s + 1) % SLIDES.length), []);
  const prev = useCallback(() => setSlide((s) => (s - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 7000);
    return () => clearInterval(id);
  }, [paused, next]);

  return (
    <>
      <SiteHeader />
      <main className="overflow-hidden bg-white">

        {/* ── HERO CAROUSEL ── */}
        <section
          className="relative overflow-hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <AnimatePresence mode="wait">

            {/* Slide 1 — TDEP */}
            {slide === 0 && (
              <motion.div
                animate={{ opacity: 1 }}
                className="relative min-h-[88vh]"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                key="tdep"
                style={{ background: "radial-gradient(130% 95% at 65% 15%, #7a1a1e 0%, #4a0e10 55%, #2e0608 100%)" }}
                transition={{ duration: 0.7 }}
              >
                <div className="noise-overlay" />
                <div className="container-x relative z-10 grid min-h-[88vh] items-center gap-12 py-24 lg:grid-cols-[1.1fr_1fr]">
                  <motion.div animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 18 }} transition={{ duration: 0.55, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}>
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-rev-orange">Teacher Digital Empowerment Programme</p>
                    <h1 className="text-balance mt-4 font-display text-4xl font-extrabold leading-[1.06] tracking-tight text-white md:text-[3.2rem] lg:text-[3.75rem]">
                      <span className="block">Put a laptop in the</span>
                      <span className="block text-rev-peach">hands of every teacher.</span>
                    </h1>
                    <p className="mt-5 max-w-lg text-lg leading-8 text-white/60">
                      Affordable monthly payments. A brand-new Rev laptop. A programme designed to make sure no Nigerian teacher is left behind.
                    </p>
                    <div className="mt-9 flex flex-wrap gap-4">
                      <Link href="/teacher-empowerment"><Button>Learn more <ArrowRight className="h-4 w-4" /></Button></Link>
                      <Link href="/apply"><Button variant="ghost">Apply now</Button></Link>
                    </div>
                  </motion.div>
                  <motion.div animate={{ opacity: 1, scale: 1 }} className="flex items-center justify-center" initial={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.6, delay: 0.1 }}>
                    <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
                      <DeviceImg alt="Rev Laptop" className="w-full max-w-lg drop-shadow-2xl" src="/devices/rev-laptop.png" />
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Slide 2 — Built in Nigeria, Built for Africa */}
            {slide === 1 && (
              <motion.div
                animate={{ opacity: 1 }}
                className="relative min-h-[88vh]"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                key="oem"
                style={{ background: "radial-gradient(130% 95% at 30% 70%, #0c1f10 0%, #081508 55%, #040a04 100%)" }}
                transition={{ duration: 0.7 }}
              >
                <div className="noise-overlay-dark" />
                <div className="container-x relative z-10 grid min-h-[88vh] items-center gap-16 py-24 lg:grid-cols-[1fr_1fr]">
                  <motion.div animate={{ opacity: 1 }} className="flex items-center justify-center" initial={{ opacity: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
                    <div className="mb-12">
                      <OrbitRing />
                    </div>
                  </motion.div>
                  <motion.div animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 18 }} transition={{ duration: 0.55, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}>
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-400">Nigerian OEM · African Hardware</p>
                    <h1 className="text-balance mt-4 font-display text-4xl font-extrabold leading-[1.06] tracking-tight text-white md:text-[3.2rem] lg:text-[3.6rem]">
                      <span className="block">Built in Nigeria.</span>
                      <span className="block text-emerald-400">Built for Africa.</span>
                    </h1>
                    <p className="mt-5 max-w-md text-lg leading-8 text-white/58">
                      Revrica designs and manufactures a full portfolio of devices — engineered for African realities and backed by local support you can actually reach.
                    </p>
                    <div className="mt-8 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      {ORBIT_ITEMS.map((d) => (
                        <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.05] px-4 py-2.5" key={d.label}>
                          <span className="text-base">{d.fallback}</span>
                          <span className="text-sm font-bold text-white">{d.label}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 flex flex-wrap gap-4">
                      <a href="#products"><Button>Explore devices <ArrowRight className="h-4 w-4" /></Button></a>
                      <Link href="/apply"><Button variant="ghost">Get a quote</Button></Link>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Carousel controls */}
          <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-4">
            <button className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition hover:bg-white/20" onClick={prev} type="button">
              <svg fill="none" height="16" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="16"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <div className="flex gap-2">
              {SLIDES.map((_, i) => (
                <button className={`h-1.5 rounded-full transition-all ${i === slide ? "w-6 bg-rev-orange" : "w-1.5 bg-white/30"}`} key={i} onClick={() => setSlide(i)} type="button" />
              ))}
            </div>
            <button className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition hover:bg-white/20" onClick={next} type="button">
              <svg fill="none" height="16" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="16"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </div>
        </section>

        {/* ── PRODUCTS ── */}
        <section className="bg-[#f5f5f7] py-24" id="products">
          <div className="container-x">
            <Reveal>
              <p className="text-center text-xs font-bold uppercase tracking-[0.22em] text-rev-orange">RevStore Catalogue</p>
              <h2 className="text-balance mx-auto mt-3 max-w-xl text-center font-display text-4xl font-extrabold tracking-tight text-[#1d1d1f] md:text-5xl">Hardware for every classroom.</h2>
              <p className="mx-auto mt-4 max-w-lg text-center text-base leading-7 text-[#6e6e73]">Every device is designed and manufactured by Revrica — tested for real-world African conditions and supported by a local team.</p>
            </Reveal>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {DEVICES.map((device, i) => (
                <Reveal delay={i * 0.06} key={device.name}>
                  <Link className="group flex flex-col overflow-hidden rounded-3xl border border-black/8 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl" href={device.href}>
                    <div className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-gradient-to-br from-[#f8f7f5] to-[#ede8e4] p-8">
                      <DeviceImg alt={device.name} className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" src={device.img} />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: device.color }}>{device.category}</p>
                      <h3 className="mt-1 font-display text-lg font-extrabold text-[#1d1d1f]">{device.name}</h3>
                      <p className="mt-0.5 text-sm font-medium text-[#6e6e73]">{device.tagline}</p>
                      <p className="mt-3 flex-1 text-sm leading-6 text-[#424245]">{device.desc}</p>
                      <div className="mt-5 flex items-center justify-end">
                        <span className="flex items-center gap-1 text-sm font-bold" style={{ color: device.color }}>Learn more <ArrowRight className="h-3.5 w-3.5" /></span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── TEACHER EMPOWERMENT FEATURE CARD ── */}
        <section className="bg-[#0e0e0e] py-24" id="empowerment">
          <div className="noise-overlay-dark" />
          <div className="container-x relative z-10">
            <Reveal>
              <div className="overflow-hidden rounded-3xl" style={{ background: "radial-gradient(130% 95% at 65% 20%, #7a1a1e 0%, #4a0e10 60%, #2e0608 100%)" }}>
                <div className="grid items-center lg:grid-cols-[1fr_300px]">
                  <div className="p-10 md:p-14">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-rev-orange">Teacher Digital Empowerment Programme</p>
                    <h2 className="text-balance mt-4 font-display text-3xl font-extrabold leading-tight text-white md:text-5xl">
                      Affordable monthly payments.<br /><span className="text-rev-peach">A brand-new laptop.</span>
                    </h2>
                    <p className="mt-5 max-w-lg text-base leading-7 text-white/58">
                      A structured programme that puts a Rev laptop in the hands of every Nigerian teacher — paid monthly through a regulated financial institution, over 12, 24, or 36 months. Zero upfront.
                    </p>
                    <div className="mt-9 flex flex-wrap gap-4">
                      <Link href="/teacher-empowerment"><Button>See the programme <ArrowRight className="h-4 w-4" /></Button></Link>
                      <Link href="/apply"><Button variant="ghost">Apply now</Button></Link>
                    </div>
                  </div>
                  <div className="hidden border-l border-white/8 lg:flex lg:flex-col lg:divide-y lg:divide-white/8">
                    {[{ val: "₦14,858", lbl: "From / month" }, { val: "36mo", lbl: "Max term" }, { val: "100%", lbl: "Bank backed" }, { val: "2yr", lbl: "Warranty" }].map((s) => (
                      <div className="flex flex-col gap-1 px-10 py-7" key={s.lbl}>
                        <span className="font-display text-2xl font-extrabold text-white">{s.val}</span>
                        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/35">{s.lbl}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <section className="bg-white py-24" id="benefits">
          <div className="container-x">
            <Reveal>
              <p className="text-center text-xs font-bold uppercase tracking-[0.22em] text-rev-orange">What's included</p>
              <h2 className="text-balance mx-auto mt-3 max-w-xl text-center font-display text-4xl font-extrabold tracking-tight text-[#1d1d1f] md:text-5xl">More than just a laptop.</h2>
            </Reveal>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {BENEFITS.map((b, i) => (
                <Reveal delay={i * 0.07} key={b.title}>
                  <div className="flex gap-4 rounded-2xl border border-black/6 p-7 transition hover:border-rev-orange/30 hover:shadow-sm">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rev-orange/8 text-rev-orange"><b.icon className="h-5 w-5" /></div>
                    <div>
                      <p className="font-display text-base font-bold text-[#1d1d1f]">{b.title}</p>
                      <p className="mt-1.5 text-sm leading-6 text-[#6e6e73]">{b.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── PARTNERS ── */}
        <section className="border-y border-black/6 bg-[#f5f5f7] py-14">
          <div className="container-x">
            <Reveal><p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-[#6e6e73]">Partners &amp; Financing Institutions</p></Reveal>
            <Reveal className="mt-8" delay={0.1}>
              <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
                {PARTNERS.map((p) => <PartnerLogo file={p.file} key={p.name} name={p.name} />)}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="bg-[#0e0e0e] py-24">
          <div className="noise-overlay-dark" />
          <div className="container-x relative z-10 max-w-3xl">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-rev-orange">Questions</p>
              <h2 className="mt-3 font-display text-3xl font-extrabold text-white md:text-4xl">Common questions about RevStore</h2>
            </Reveal>
            <Reveal className="mt-10" delay={0.08}><Accordion items={FAQS} /></Reveal>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="bg-[#1d1d1f] py-28">
          <div className="container-x text-center">
            <Reveal>
              <h2 className="text-balance mx-auto max-w-2xl font-display text-4xl font-extrabold text-white md:text-6xl">Ready to equip your school?</h2>
              <p className="mx-auto mt-5 max-w-xl text-lg leading-7 text-white/55">Browse devices, explore the Teacher Digital Empowerment Programme, or speak to our team about a custom procurement for your institution.</p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <a href="#products"><Button>Browse devices <ArrowRight className="h-4 w-4" /></Button></a>
                <Link href="/apply"><Button variant="ghost">Apply for a laptop</Button></Link>
              </div>
            </Reveal>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  );
}
