"use client";

import { motion } from "framer-motion";
import {
  ArrowRight, Award, BadgeCheck, BookOpen, ChevronDown, Heart, Laptop, Megaphone, ShieldCheck, Vote, Wallet,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { StorefrontFooter } from "@/components/StorefrontFooter";
import { StorefrontHeader } from "@/components/StorefrontHeader";
import { CAMPAIGN } from "@/lib/nominations/schema";

/** The nomination form has its own page. */
const FORM_HREF = "/nominate-a-teacher/form";

const HOW = [
  { icon: Heart,     title: "Nominate",          body: "Tell us about the teacher who made a difference in your life, and why." },
  { icon: BadgeCheck, title: "We verify",        body: "Our team reaches out to confirm each nominee with them and their school." },
  { icon: Megaphone, title: "Spotlight & vote",  body: "Nominees are celebrated on our pages, and everyone gets to vote for their hero." },
  { icon: Laptop,    title: "One teacher wins",  body: `The teacher with the most love takes home ${CAMPAIGN.prize}.` },
];

const REV = [
  { icon: Laptop,      title: "Built for classrooms", body: "Light, splash-resistant laptops with long battery life, made for the way Nigerian teachers work." },
  { icon: Wallet,      title: "Pay small, small",     body: "Spread the cost over monthly payments, from about ₦15,000 a month. No big upfront sum." },
  { icon: BookOpen,    title: "RevLearn preloaded",   body: "Courses, lesson tools and resources for teachers, ready on day one, even offline." },
  { icon: ShieldCheck, title: "Backed locally",       body: "Warranty and a support team here in Nigeria who understand your power and network realities." },
];

const FAQS = [
  { q: "Who can I nominate?", a: "Any teacher who has made a real difference in your life: primary, secondary, or tertiary; public or private school; still teaching or not. They should be reachable on the phone number you give us." },
  { q: "Who can nominate?", a: "Anyone: students, former students, parents, fellow teachers, principals and school owners." },
  { q: "Can I nominate more than one teacher?", a: "Yes. You can nominate as many different teachers as you like, but each teacher only once." },
  { q: "Does it help if a teacher is nominated many times?", a: "Every nomination is counted and helps our team decide who to spotlight. The winner is then decided by public votes." },
  { q: "When does voting start?", a: "Once nominations close and nominees have been verified. We'll announce the voting dates on this page and on our social channels." },
  { q: "What happens to the details I share?", a: "We use them only to run this programme: to verify the nomination with you and the teacher, and to feature the teacher only if they agree. We tell every nominated teacher how we got their details, and they can opt out. Phone numbers are never published, and we delete nominations after the campaign. Our privacy policy (revstore.revrica.com/privacy) has the details." },
];

export default function NominateATeacherPage() {
  return (
    <>
      <StorefrontHeader />
      <main className="overflow-hidden bg-white">
        <Hero />
        <HowItWorks />
        <NominationSection />
        <Faq />
        <AboutRev />
      </main>
      <StorefrontFooter />
    </>
  );
}

// ─── Hero ─────────────────────────────────────────────────────

function Hero() {
  return (
    <section
      className="relative overflow-hidden pb-20 pt-16 md:pb-28 md:pt-24"
      style={{ background: "radial-gradient(120% 90% at 70% 15%, #7a1a1e 0%, #4a0e10 55%, #2e0608 100%)" }}
    >
      <div className="noise-overlay" />
      <div className="container-x relative z-10 grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="text-center lg:text-left">
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/8 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-rev-peach"
            initial={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.5 }}
          >
            <Award className="h-3.5 w-3.5" /> A Teachers&apos; Day celebration
          </motion.p>
          <motion.h1
            animate={{ opacity: 1, y: 0 }}
            className="text-balance mt-5 font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-white md:text-7xl"
            initial={{ opacity: 0, y: 18 }}
            transition={{ duration: 0.6, delay: 0.08 }}
          >
            My Teacher,<br /><span className="text-rev-orange">My Hero.</span>
          </motion.h1>
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/70 lg:mx-0"
            initial={{ opacity: 0, y: 14 }}
            transition={{ duration: 0.55, delay: 0.14 }}
          >
            Somewhere along the way, a teacher believed in you. Imperial Edtech and Revrica want to celebrate them.
            Nominate the teacher who changed your story, and they could win{" "}
            <strong className="font-bold text-white">{CAMPAIGN.prize}</strong>.
          </motion.p>
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mt-9 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
            initial={{ opacity: 0, y: 14 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link href={FORM_HREF}><Button>Nominate a teacher <ArrowRight className="h-4 w-4" /></Button></Link>
            <a href="#how-it-works"><Button variant="ghost">How it works</Button></a>
          </motion.div>
        </div>

        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="relative mx-auto w-full max-w-lg"
          initial={{ opacity: 0, scale: 0.94 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="absolute inset-[12%] rounded-full bg-rev-orange/25 blur-3xl" />
          <img alt="A brand-new Rev laptop" className="relative w-full drop-shadow-2xl" src="/devices/rev_orion_laptop.png" />
          {/* Positioned by the wrapper; the inner element floats. (Motion's transform would override a translate class.) */}
          <div className="absolute inset-x-0 -bottom-2 flex justify-center md:justify-end">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              className="flex items-center gap-3 whitespace-nowrap rounded-2xl border border-white/15 bg-maroon-deep/85 px-5 py-3 shadow-card backdrop-blur"
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rev-orange text-white"><Award className="h-5 w-5" /></span>
              <span className="text-left">
                <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-rev-peach">The prize</span>
                <span className="block font-display text-base font-bold text-white">A brand-new Rev laptop</span>
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── How it works ─────────────────────────────────────────────

function HowItWorks() {
  return (
    <section className="scroll-mt-24 bg-cream py-20 md:py-24" id="how-it-works">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-rev-orange">How it works</p>
          <h2 className="text-balance mt-3 font-display text-3xl font-extrabold leading-[1.08] tracking-tight text-maroon-deep md:text-[2.75rem]">
            Say thank you in four simple steps
          </h2>
          <p className="mt-4 text-base leading-7 text-maroon-deep/70 md:text-lg">
            Great teachers rarely get the applause they deserve. This is our chance to give it to them, together.
          </p>
        </Reveal>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {HOW.map(({ icon: Icon, title, body }, i) => (
            <Reveal delay={i * 0.08} key={title}>
              <div className="relative h-full rounded-2xl border border-black/6 bg-white p-7 shadow-sm">
                <span className="absolute right-6 top-5 font-display text-4xl font-extrabold text-maroon-deep/8">0{i + 1}</span>
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-rev-orange/10 text-rev-orangeDeep">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold text-slate-ink">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-body">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Nomination form ──────────────────────────────────────────

function NominationSection() {
  return (
    <section className="maroon-glow relative py-20 md:py-24" id="nominate">
      <div className="noise-overlay" />
      <div className="container-x relative z-10 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-rev-orange">Nominate a teacher</p>
          <h2 className="text-balance mt-4 font-display text-4xl font-extrabold leading-[1.05] text-white md:text-5xl">
            Who&apos;s the teacher you&apos;ll never forget?
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/65">
            The one who stayed back after class. Who saw something in you before you did. Who made a hard subject finally
            make sense. Tell us about them.
          </p>
          <div className="mt-9">
            <Link href={FORM_HREF}><Button>Nominate a teacher <ArrowRight className="h-4 w-4" /></Button></Link>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <ul className="space-y-5 rounded-3xl border border-white/10 bg-white/[0.05] p-7 md:p-8">
            {[
              ["Takes about 2 minutes", "Your details, your teacher's details, and why they matter to you."],
              ["Nominate as many as you like", "Every teacher who shaped you deserves a mention."],
              ["Phone numbers stay private", "We only use them to verify nominees. They're never published."],
            ].map(([title, body]) => (
              <li className="flex gap-4" key={title}>
                <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-rev-orange" />
                <span>
                  <span className="block font-display text-base font-bold text-white">{title}</span>
                  <span className="mt-1 block text-sm leading-6 text-white/55">{body}</span>
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

// ─── What is Rev? ─────────────────────────────────────────────

function AboutRev() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28" style={{ background: "#0d0c0c" }}>
      <div className="noise-overlay" />
      <div className="container-x relative z-10 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <Reveal>
          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute inset-[14%] rounded-full bg-rev-orange/20 blur-3xl" />
            <img alt="A Rev laptop" className="relative w-full drop-shadow-2xl" src="/devices/rev_orion_laptop.png" />
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-rev-orange">Curious about Rev?</p>
          <h2 className="text-balance mt-3 font-display text-3xl font-extrabold leading-[1.08] tracking-tight text-white md:text-[2.75rem]">
            The laptop made for Nigerian teachers
          </h2>
          <p className="mt-4 text-base leading-7 text-white/65 md:text-lg">
            Rev is Revrica&apos;s range of laptops and tablets, powered by Imperial Edtech, built so every teacher and
            school can have the tools they deserve, without paying everything at once.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {REV.map(({ icon: Icon, title, body }) => (
              <div className="flex gap-4" key={title}>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rev-orange/15 text-rev-orange">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-base font-bold text-white">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-white/55">{body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/products"><Button>Get a Rev laptop <ArrowRight className="h-4 w-4" /></Button></Link>
            <Link href="/teacher-empowerment"><Button variant="ghost">Teacher Empowerment Programme</Button></Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────

function Faq() {
  return (
    <section className="bg-cream py-20 md:py-24">
      <div className="container-x max-w-3xl">
        <Reveal className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-rev-orange">Questions</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-maroon-deep md:text-4xl">Good to know</h2>
        </Reveal>
        <div className="mt-10 divide-y divide-black/8 rounded-2xl border border-black/6 bg-white px-6">
          {FAQS.map((f) => <FaqItem key={f.q} {...f} />)}
        </div>
        <div className="mt-12 text-center">
          <Link href={FORM_HREF}><Button><Vote className="h-4 w-4" /> Nominate your teacher</Button></Link>
        </div>
      </div>
    </section>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        <span className="font-display text-base font-bold text-slate-ink">{q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black/5 text-slate-body"
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </button>
      {open && <p className="pb-5 text-sm leading-7 text-slate-body">{a}</p>}
    </div>
  );
}
