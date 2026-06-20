"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Banknote,
  CalendarClock,
  Cpu,
  GraduationCap,
  HandshakeIcon,
  ShieldCheck,
  Wrench
} from "lucide-react";
import Link from "next/link";
import { Accordion } from "@/src/components/accordion";
import { AnnouncementTicker } from "@/src/components/announcement-ticker";
import { RevLaptop } from "@/src/components/device-art";
import { Reveal } from "@/src/components/reveal";
import { SiteFooter, SiteHeader } from "@/src/components/shell";
import { Button, Card, GlassCard, SectionTitle, Tag } from "@/src/components/ui";

const faqs: [string, string][] = [
  ["Who can join the waitlist?", "Any teacher, school owner, or administrator in Nigeria. You don't need to be applying for financing specifically — the waitlist covers all of Revrica's devices and programs."],
  ["Does joining commit me to the Teacher Empowerment Program?", "No. Joining the waitlist registers your interest only. Tell us what you're interested in and our team will follow up with the right next step, whether that's financing, a direct device purchase, or the program."],
  ["How much do Teacher Empowerment Program plans cost?", "Plans start from ₦15,000 a month, spread over terms of up to 24 months depending on the device and plan you choose."],
  ["Can I just buy a laptop outright?", "Yes. Laptops and devices are available for direct purchase for schools, teachers, and individuals — financing through the program is optional, not required."],
  ["Can a school request devices for many staff at once?", "Yes. School owners and administrators can register interest for their whole staff in one submission."],
  ["What else does Revrica do besides devices?", "Revrica is an OEM hardware company. Beyond devices and the Teacher Empowerment Program, we run hardware training programs, technical support for institutions, and manufacturing partnerships across Africa."]
];

const services = [
  { icon: Cpu, title: "OEM Manufacturing", body: "Custom-manufactured hardware for institutions and partners across Africa." },
  { icon: GraduationCap, title: "Teacher Empowerment Program", body: "Financed laptops for teachers and schools, from ₦15,000/month." },
  { icon: Wrench, title: "Hardware Training", body: "Hands-on training programs building local technical capacity." },
  { icon: HandshakeIcon, title: "Partnerships & Support", body: "Technical support and collaboration with schools, government, and corporates." }
];

const specs = [
  { icon: ShieldCheck, label: "Built to Last", value: "Reinforced, classroom-ready" },
  { icon: Banknote, label: "From", value: "₦15,000 / month" },
  { icon: CalendarClock, label: "Spread Over", value: "Up to 24 months" }
];

export default function Home() {
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
                  A laptop for every teacher,
                </motion.span>
                <motion.span
                  animate={{ opacity: 1, y: 0 }}
                  className="block overflow-hidden text-rev-peach"
                  initial={{ opacity: 0, y: 28 }}
                  transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                >
                  from ₦15,000/mo.
                </motion.span>
              </h1>
              <motion.p
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 max-w-md text-lg leading-8 text-white/65"
                initial={{ opacity: 0, y: 18 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Pay monthly. Spread over up to 24 months.
              </motion.p>
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="mt-9 flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 18 }}
                transition={{ duration: 0.6, delay: 0.18 }}
              >
                <Link href="/early-access">
                  <Button>
                    Join the Waitlist <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#what-we-do">
                  <Button variant="ghost">See What We Do</Button>
                </Link>
              </motion.div>
            </div>

            {/* DEVICE SHOWCASE — laptop alone, no overlay cards */}
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

        {/* WHAT WE DO — black band */}
        <section className="ink-band py-20" id="what-we-do">
          <div className="noise-overlay-dark" />
          <div className="container-x relative z-10">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-rev-orange">What We Do</p>
              <h2 className="text-balance mt-3 max-w-2xl font-display text-3xl font-extrabold leading-tight text-white md:text-4xl">
                Africa&apos;s premier OEM hardware company — devices, training, and support
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

        {/* SPECS STRIP — white, breaks up the red/black rhythm */}
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

        {/* TEACHER PROGRAM DETAIL — light section */}
        <section className="paper-band py-24" id="program">
          <div className="container-x grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <GraduationCap className="h-10 w-10 text-rev-orange" />
              <h2 className="text-balance mt-6 font-display text-4xl font-extrabold leading-tight text-slate-ink md:text-5xl">
                The Teacher Empowerment Program
              </h2>
              <p className="mt-5 max-w-md text-lg leading-8 text-slate-body">
                A Rev laptop for every teacher — no upfront cost, just one affordable monthly payment.
              </p>
              <Link className="mt-8 inline-block" href="/early-access">
                <Button>
                  Join the Waitlist <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["No upfront cost", "Get approved, then pay monthly"],
                  ["For every educator", "Teachers, schools, and admins"],
                  ["Real support", "Training to put devices to work"],
                  ["Trusted partners", "Financing backed by real banks"]
                ].map(([title, body]) => (
                  <div className="rounded-2xl border border-black/8 bg-white p-6 shadow-sm" key={title}>
                    <p className="font-display text-lg font-bold text-slate-ink">{title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-body">{body}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* FINANCING / BNPL — restored maroon glass-card design */}
        <section className="maroon-soft relative border-y border-white/10 py-24" id="financing">
          <div className="noise-overlay" />
          <div className="container-x relative z-10">
            <Reveal>
              <SectionTitle kicker="Pay Monthly" title="Own it sooner. Spread the cost." />
            </Reveal>
            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              <Reveal>
                <GlassCard className="h-full p-8">
                  <Banknote className="h-9 w-9 text-rev-orange" />
                  <p className="mt-6 font-display text-3xl font-extrabold text-white">₦15,000</p>
                  <p className="mt-1 text-sm font-bold uppercase tracking-wide text-white/40">Starting monthly payment</p>
                  <p className="mt-4 text-sm leading-6 text-white/55">Affordable enough to fit a teacher&apos;s monthly budget.</p>
                </GlassCard>
              </Reveal>
              <Reveal delay={0.1}>
                <GlassCard className="h-full p-8">
                  <CalendarClock className="h-9 w-9 text-rev-orange" />
                  <p className="mt-6 font-display text-3xl font-extrabold text-white">24 Months</p>
                  <p className="mt-1 text-sm font-bold uppercase tracking-wide text-white/40">Maximum repayment term</p>
                  <p className="mt-4 text-sm leading-6 text-white/55">Choose a term that matches what you can pay.</p>
                </GlassCard>
              </Reveal>
              <Reveal delay={0.2}>
                <GlassCard className="h-full p-8">
                  <ShieldCheck className="h-9 w-9 text-rev-orange" />
                  <p className="mt-6 font-display text-3xl font-extrabold text-white">Bank-Backed</p>
                  <p className="mt-1 text-sm font-bold uppercase tracking-wide text-white/40">Trusted financing partners</p>
                  <p className="mt-4 text-sm leading-6 text-white/55">Repayment is structured and serviced by licensed banks.</p>
                </GlassCard>
              </Reveal>
            </div>
          </div>
        </section>

        {/* PARTNERS — light section */}
        <section className="paper-band py-20" id="partners">
          <div className="container-x">
            <Reveal>
              <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-slate-body/70">In Partnership With</p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-80">
                {["ImperialEdtech", "Sterling Bank", "FCMB", "Lotus Bank", "T2 Mobile"].map((partner) => (
                  <span className="font-display text-lg font-bold text-slate-ink" key={partner}>
                    {partner}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* FAQ — black band */}
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

        {/* FINAL CTA — maroon bookend, matches hero */}
        <section className="maroon-glow relative py-24">
          <div className="noise-overlay" />
          <div className="container-x relative z-10 text-center">
            <Reveal>
              <Tag>Join the Waitlist</Tag>
              <h2 className="text-balance mx-auto mt-6 max-w-2xl font-display text-4xl font-extrabold text-white md:text-6xl">
                Tell us what you&apos;re interested in
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg text-white/65">
                Devices, financing, training, or the Teacher Empowerment Program. Tell us what you&apos;re interested
                in, and we&apos;ll reach out.
              </p>
              <Link className="mt-9 inline-block" href="/early-access">
                <Button>
                  Join the Waitlist <ArrowRight className="h-4 w-4" />
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