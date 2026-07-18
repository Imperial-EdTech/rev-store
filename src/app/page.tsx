"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BadgeDollarSign,
  BookOpen,
  CalendarClock,
  ClipboardCheck,
  CreditCard,
  Cpu,
  GraduationCap,
  HandshakeIcon,
  Landmark,
  ShieldCheck,
  Users,
  Wrench
} from "lucide-react";
import Link from "next/link";
import { Accordion } from "@/components/accordion";
import { AnnouncementTicker } from "@/components/announcement-ticker";
import { RevLaptop } from "@/components/device-art";
import { Reveal } from "@/components/reveal";
import { SiteFooter, SiteHeader } from "@/components/shell";
import { Button, Card, GlassCard, SectionTitle, Tag } from "@/components/ui";

const faqs: [string, string][] = [
  ["Who can join the waitlist?", "Any teacher, school owner, or administrator in Nigeria. You don't need to be applying for financing specifically - the waitlist covers all of Revrica's devices and programs."],
  ["Does joining commit me to the Teacher Empowerment Program?", "No. Joining the waitlist registers your interest only. Tell us what you're interested in and our team will follow up with the right next step, whether that's financing, a direct device purchase, or the program."],
  ["How much do Teacher Empowerment Program plans cost?", "Plans start from ₦15,000 a month, spread over terms of up to 36 months depending on the device and plan you choose."],
  ["Can I just buy a laptop outright?", "Yes. Laptops and devices are available for direct purchase for schools, teachers, and individuals - financing through the program is optional, not required."],
  ["Can a school request devices for many staff at once?", "Yes. School owners and administrators can register interest for their whole staff in one submission."],
  ["Does the free tech audit cost anything?", "No. The tech audit is completely free and doesn't commit your school to financing, a purchase, or any program. It's simply a way for our team to understand your setup."],
  ["What else does Revrica do besides devices?", "Revrica is an OEM hardware company. Beyond devices and the Teacher Empowerment Program, we run hardware training programs, technical support for institutions, and manufacturing partnerships across Africa."]
];

const services = [
  { icon: Cpu, title: "OEM Manufacturing", body: "Custom-manufactured hardware for institutions and partners across Africa." },
  { icon: GraduationCap, title: "Teacher Empowerment Program", body: "Financed laptops for teachers and schools, from ₦15,000/month." },
  { icon: Wrench, title: "Hardware Training", body: "Hands-on training programs building local technical capacity." },
  { icon: HandshakeIcon, title: "Partnerships & Support", body: "Technical support and collaboration with schools, government, and corporates." }
];

const specs = [
  { icon: ShieldCheck, label: "Built for classrooms", value: "Rugged & reliable" },
  { icon: CreditCard, label: "Starting from", value: "₦15,000 / month" },
  { icon: CalendarClock, label: "Pay over", value: "12, 24, or 36 months" }
];

export default function Home() {
  const plans = ["12 months", "24 months", "36 months"];
  const [planIndex, setPlanIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setPlanIndex((i) => (i + 1) % plans.length), 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <SiteHeader />
      <AnnouncementTicker />
      <main className="overflow-hidden bg-maroon">
        {/* HERO */}
        <section className="maroon-glow relative pb-24 pt-16 md:pt-20">
          <div className="noise-overlay" />
          <div className="container-x relative z-10 grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <h1 className="text-balance font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-white md:text-[3.6rem]">
                <motion.span
                  animate={{ opacity: 1, y: 0 }}
                  className="block overflow-hidden"
                  initial={{ opacity: 0, y: 28 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  Every teacher deserves
                </motion.span>
                <motion.span
                  animate={{ opacity: 1, y: 0 }}
                  className="block overflow-hidden text-rev-peach"
                  initial={{ opacity: 0, y: 28 }}
                  transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                >
                  a great laptop.
                </motion.span>
              </h1>
              <motion.p
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 max-w-md text-lg leading-8 text-white/65"
                initial={{ opacity: 0, y: 18 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Get yours for as low as ₦15,000/month. Buy outright or spread payments over{" "}
                <span className="inline-flex h-7 w-24 items-center overflow-hidden align-middle">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={planIndex}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -16, opacity: 0 }}
                      initial={{ y: 16, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="inline-block font-bold text-rev-peach"
                    >
                      {plans[planIndex]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </motion.p>
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="mt-9 flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 18 }}
                transition={{ duration: 1.0, delay: 0.30 }}
              >
                <Link href="/early-access">
                  <Button>
                    Get Your Device <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button variant="ghost">See How It Works</Button>
                </Link>
              </motion.div>
            </div>

            {/* DEVICE SHOWCASE */}
            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto w-full max-w-xl px-6 py-10 sm:px-10"
              initial={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <RevLaptop className="w-full drop-shadow-2xl" />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* WHAT WE DO - black band */}
        <section className="ink-band py-20" id="how-it-works">
          <div className="noise-overlay-dark" />
          <div className="container-x relative z-10">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-rev-orange">What We Do</p>
              <h2 className="text-balance mt-3 max-w-2xl font-display text-3xl font-extrabold leading-tight text-white md:text-4xl">
                Devices, financing, and the tools schools need to teach better
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((service, index) => (
                <Reveal delay={index * 0.07} key={service.title}>
                  <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                    <service.icon className="h-8 w-8 text-rev-orange" />
                    <p className="mt-5 font-display text-lg font-bold text-white">{service.title}</p>
                    <p className="mt-2 text-sm leading-6 text-white/55">{service.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* SPECS STRIP */}
        <section className="border-y border-black/8 bg-white py-10">
          <div className="container-x grid gap-6 sm:grid-cols-3">
            {specs.map((spec, index) => (
              <Reveal delay={index * 0.08} key={spec.label}>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rev-orange/10 text-rev-orange">
                    <spec.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-body">{spec.label}</p>
                    <p className="font-display text-lg font-bold text-slate-ink">{spec.value}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* TEACHER PROGRAM DETAIL */}
        <section className="paper-band py-24" id="program">
          <div className="container-x grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <GraduationCap className="h-10 w-10 text-rev-orange" />
              <h2 className="text-balance mt-6 font-display text-4xl font-extrabold leading-tight text-slate-ink md:text-5xl">
                The Teacher Empowerment Program
              </h2>
              <p className="mt-5 max-w-md text-lg leading-8 text-slate-body">
                A quality laptop in the hands of every teacher - paid for ₦15,000 at a time. No lump sum, no stress. Just a device that works, and a plan that fits.
              </p>
              <Link className="mt-8 inline-block" href="/early-access">
                <Button>
                  Join the Program <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { icon: BadgeDollarSign, title: "₦0 upfront", body: "Get approved and start using your device before you pay a kobo" },
                  { icon: Users, title: "For every educator", body: "Individual teachers, whole schools, and administrators" },
                  { icon: BookOpen, title: "Support included", body: "Training and onboarding so the device actually gets used" },
                  { icon: Landmark, title: "Bank-backed plans", body: "Financing structured and serviced by licensed Nigerian banks" }
                ].map(({ icon: Icon, title, body }) => (
                  <div className="rounded-2xl border border-black/8 bg-white p-6 shadow-sm" key={title}>
                    <Icon className="h-7 w-7 text-rev-orange" />
                    <p className="mt-4 font-display text-lg font-bold text-slate-ink">{title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-body">{body}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* FINANCING */}
        <section className="maroon-soft relative border-y border-white/10 py-24" id="financing">
          <div className="noise-overlay" />
          <div className="container-x relative z-10">
            <Reveal>
              <SectionTitle kicker="Own It Your Way" title="Buy outright or pay monthly - you choose.">
                <p className="mt-4 text-white/60">No single plan fits everyone. Pick what works for your budget right now.</p>
              </SectionTitle>
            </Reveal>
            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              <Reveal>
                <GlassCard className="h-full p-8">
                  <CreditCard className="h-9 w-9 text-rev-orange" />
                  <p className="mt-6 font-display text-3xl font-extrabold text-white">Buy Outright</p>
                  <p className="mt-1 text-sm font-bold uppercase tracking-wide text-white/40">One-time payment</p>
                  <p className="mt-4 text-sm leading-6 text-white/55">Pay once and it&apos;s yours - no monthly commitments, no interest, no paperwork.</p>
                </GlassCard>
              </Reveal>
              <Reveal delay={0.1}>
                <GlassCard className="h-full p-8">
                  <CalendarClock className="h-9 w-9 text-rev-orange" />
                  <p className="mt-6 font-display text-3xl font-extrabold text-white">From ₦15,000</p>
                  <p className="mt-1 text-sm font-bold uppercase tracking-wide text-white/40">Per month · 12, 24, or 36 months</p>
                  <p className="mt-4 text-sm leading-6 text-white/55">Spread the cost across a plan that fits your income - the shorter the term, the less you pay overall.</p>
                </GlassCard>
              </Reveal>
              <Reveal delay={0.2}>
                <GlassCard className="h-full p-8">
                  <ShieldCheck className="h-9 w-9 text-rev-orange" />
                  <p className="mt-6 font-display text-3xl font-extrabold text-white">Bank-Backed</p>
                  <p className="mt-1 text-sm font-bold uppercase tracking-wide text-white/40">Structured & transparent</p>
                  <p className="mt-4 text-sm leading-6 text-white/55">Every financing plan is structured and serviced by licensed Nigerian banks - no hidden fees, no surprises.</p>
                </GlassCard>
              </Reveal>
            </div>
          </div>
        </section>

        {/* FREE TECH AUDIT */}
        <section className="border-y border-black/8 bg-white py-24" id="tech-audit">
          <div className="container-x grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <ClipboardCheck className="h-10 w-10 text-rev-orange" />
              <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-rev-orange">Free for Schools</p>
              <h2 className="text-balance mt-3 font-display text-4xl font-extrabold leading-tight text-slate-ink md:text-5xl">
                Free School Tech Audit
              </h2>
              <p className="mt-5 max-w-md text-lg leading-8 text-slate-body">
                Not sure what technology your school needs? Our free Tech Audit assesses your school&apos;s current devices, software, infrastructure, and budget - then tells you exactly what to prioritise and why.
              </p>
              <p className="mt-4 max-w-md text-base leading-7 text-slate-body/70">
                No cost. No obligation. Just a clear picture of where your school stands and what to do next.
              </p>
              <Link className="mt-8 inline-block" href="/tech-audit">
                <Button>
                  Request Your Free Audit <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="rounded-2xl border border-black/8 bg-[#FAF8F6] p-8">
                <p className="font-display text-lg font-bold text-slate-ink">What the audit covers</p>
                <ul className="mt-5 space-y-3">
                  {[
                    "Devices & hardware - what you have, what's failing, what's missing",
                    "Software & systems - LMS, MDM, data protection, and security",
                    "Network & infrastructure - connectivity, cloud, and classroom setup",
                    "Budget & planning - how you're currently investing in technology"
                  ].map((item) => (
                    <li className="flex items-start gap-3 text-sm leading-6 text-slate-body" key={item}>
                      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rev-orange/10 text-rev-orange text-xs font-bold">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-xs text-slate-body/50">Takes 3–4 minutes. Our team follows up with a full report.</p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* PARTNERS */}
        <section className="paper-band py-20" id="partners">
          <div className="container-x">
            <Reveal>
              <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-slate-body/70">In Partnership With</p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
                {[
                  { name: "ImperialEdtech", file: "imperial-edtech.png" },
                  { name: "Sterling Bank", file: "sterling-bank.png" },
                  { name: "FCMB", file: "fcmb.png" },
                  { name: "Lotus Bank", file: "lotus-bank.png" },
                  { name: "T2 Mobile", file: "t2-mobile.png" }
                ].map(({ name, file }) => (
                  <img
                    alt={name}
                    className="h-30 w-auto object-contain opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
                    key={name}
                    src={`/partners/${file}`}
                  />
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* FAQ */}
        <section className="ink-band py-24" id="faq">
          <div className="noise-overlay-dark" />
          <div className="container-x relative z-10 max-w-3xl">
            <Reveal>
              <SectionTitle kicker="Questions" title="Everything you need to know" />
            </Reveal>
            <Reveal className="mt-12" delay={0.1}>
              <Accordion items={faqs} />
            </Reveal>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="maroon-glow relative py-24">
          <div className="noise-overlay" />
          <div className="container-x relative z-10 text-center">
            <Reveal>
              <Tag>Get Started</Tag>
              <h2 className="text-balance mx-auto mt-6 max-w-2xl font-display text-4xl font-extrabold text-white md:text-6xl">
                Get the device. Pick your plan.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg text-white/65">
                Buy outright, or spread payments across 12, 24, or 36 months - starting from ₦15,000/month. Tell us what you need and we&apos;ll take it from there.
              </p>
              <Link className="mt-9 inline-block" href="/early-access">
                <Button>
                  Get Your Device <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}