import type { Metadata } from "next";
import { ArrowRight, Factory, Handshake, MapPin, Sprout } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { StorefrontFooter } from "@/components/StorefrontFooter";
import { StorefrontHeader } from "@/components/StorefrontHeader";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Revrica is a pioneering African hardware OEM, manufacturing technology locally for educational institutions, government agencies and organisations across the continent.",
  alternates: { canonical: "/about" },
};

const PROMISES = [
  { icon: Factory, title: "Manufactured for African contexts" },
  { icon: MapPin,  title: "Supported by local experts" },
  { icon: Sprout,  title: "Designed for long-term impact" },
];

const PARTNERS = ["Educational institutions", "Government agencies", "Organisations"];

export default function AboutPage() {
  return (
    <>
      <StorefrontHeader />
      <main className="overflow-hidden bg-white">

        {/* ── HERO ── */}
        <section
          className="relative overflow-hidden pb-24 pt-20"
          style={{ background: "radial-gradient(130% 95% at 65% 20%, #7a1a1e 0%, #4a0e10 55%, #2e0608 100%)" }}
        >
          <div className="noise-overlay" />
          <div className="container-x relative z-10 max-w-3xl text-center">
            <Reveal y={12}>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-rev-orange">About Us</p>
            </Reveal>
            <Reveal delay={0.08} y={18}>
              <h1 className="text-balance mx-auto mt-4 font-display text-4xl font-extrabold leading-[1.06] tracking-tight text-white md:text-6xl">
                Technology that<br />
                <span className="text-rev-peach">works for Africa.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.14} y={14}>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/62">
                At Revrica, we believe in technology that works for Africa. As a pioneering hardware OEM company,
                we&apos;re transforming how institutions across the continent access and utilise technology.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── VISION ── */}
        <section className="bg-white py-24">
          <div className="container-x grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-rev-orange">Our Vision</p>
              <h2 className="text-balance mt-3 font-display text-4xl font-extrabold tracking-tight text-[#1d1d1f] md:text-5xl">
                Locally made hardware for every African institution.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-lg leading-8 text-[#6e6e73]">
                We&apos;re creating a future where every African institution has access to locally manufactured
                hardware solutions that truly serve their needs.
              </p>
              <p className="mt-5 text-lg leading-8 text-[#6e6e73]">
                Through our innovative manufacturing and training infrastructure, we&apos;re bridging digital divides
                and empowering communities.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── COMMITMENT ── */}
        <section className="bg-[#f5f5f7] py-24">
          <div className="container-x">
            <Reveal>
              <p className="text-center text-xs font-bold uppercase tracking-[0.22em] text-rev-orange">
                Our Commitment
              </p>
              <h2 className="text-balance mx-auto mt-3 max-w-2xl text-center font-display text-4xl font-extrabold tracking-tight text-[#1d1d1f] md:text-5xl">
                Lasting technological change, built together.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-7 text-[#6e6e73]">
                We partner with educational institutions, government agencies, and organisations to create lasting
                technological change. Through innovation-driven manufacturing and local context expertise, we&apos;re
                establishing new standards for hardware excellence across Africa.
              </p>
            </Reveal>

            <Reveal className="mt-10 flex flex-wrap justify-center gap-3" delay={0.1}>
              {PARTNERS.map((p) => (
                <span
                  className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white px-5 py-2.5 text-sm font-bold text-[#1d1d1f]"
                  key={p}
                >
                  <Handshake className="h-4 w-4 text-rev-orange" /> {p}
                </span>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ── PARTNER, NOT PROVIDER ── */}
        <section
          className="relative overflow-hidden py-24"
          style={{ background: "radial-gradient(130% 95% at 35% 20%, #7a1a1e 0%, #4a0e10 55%, #2e0608 100%)" }}
        >
          <div className="noise-overlay" />
          <div className="container-x relative z-10">
            <Reveal>
              <h2 className="text-balance mx-auto max-w-2xl text-center font-display text-3xl font-extrabold tracking-tight text-white md:text-5xl">
                More than a technology provider. <span className="text-rev-peach">Your partner in transformation.</span>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-center text-base leading-7 text-white/60">
                Every solution we deliver is:
              </p>
            </Reveal>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {PROMISES.map((item, i) => (
                <Reveal delay={i * 0.08} key={item.title}>
                  <div className="h-full rounded-3xl border border-white/10 bg-white/[0.06] p-8">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rev-orange/15 text-rev-orange">
                      <item.icon className="h-6 w-6" />
                    </span>
                    <h3 className="mt-6 font-display text-xl font-extrabold text-white">{item.title}</h3>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-14 flex flex-wrap items-center justify-center gap-4" delay={0.2}>
              <Link href="/products"><Button>Explore our devices <ArrowRight className="h-4 w-4" /></Button></Link>
              <Link href="/tech-audit"><Button variant="ghost">Book a school tech audit</Button></Link>
            </Reveal>
          </div>
        </section>
      </main>
      <StorefrontFooter />
    </>
  );
}
