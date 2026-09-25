"use client";

import { motion } from "framer-motion";
import { CheckCircle2, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { StorefrontHeader } from "@/components/StorefrontHeader";
import { WHATSAPP_NUMBER } from "@/lib/contact";
import { StorefrontFooter } from "@/components/StorefrontFooter";

export default function SuccessPage() {
  return (
    <>
      <StorefrontHeader />
      <main className="maroon-glow relative flex min-h-screen items-center py-16">
        <div className="noise-overlay" />
        <section className="container-x relative z-10 text-center">

          <motion.div
            animate={{ scale: 1, opacity: 1 }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rev-orange"
            initial={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.5, ease: "backOut" }}
          >
            <CheckCircle2 className="h-10 w-10 text-white" />
          </motion.div>

          <motion.h1
            animate={{ opacity: 1, y: 0 }}
            className="text-balance mx-auto mt-8 max-w-2xl font-display text-4xl font-extrabold text-white md:text-6xl"
            initial={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Application received!
          </motion.h1>

          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mt-5 max-w-xl text-lg leading-8 text-white/65"
            initial={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.5, delay: 0.18 }}
          >
            Thank you for applying to the Teacher Digital Empowerment Program.
            Our team will review your application and someone will reach out to
            you — via WhatsApp or email — with your next steps.
          </motion.p>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mt-8 max-w-md rounded-2xl border border-white/12 bg-white/[0.06] px-6 py-5 text-left"
            initial={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.5, delay: 0.24 }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-rev-orange">What happens next</p>
            <ul className="mt-4 flex flex-col gap-3">
              {[
                "Our team reviews your application — usually within a few business days.",
                "If you're shortlisted, you'll be contacted on the phone number you provided.",
                "You may be asked to provide KYC documents (ID, proof of employment, payslip).",
                "Successful applicants are matched with a Lotus Bank payment plan.",
              ].map((step, i) => (
                <li className="flex items-start gap-3" key={i}>
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rev-orange/20 text-[11px] font-extrabold text-rev-orange">
                    {i + 1}
                  </span>
                  <span className="text-sm leading-6 text-white/65">{step}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mt-9 flex flex-wrap items-center justify-center gap-4"
            initial={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link href="/">
              <Button variant="ghost">Back to RevStore</Button>
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Button>
                <MessageCircle className="h-4 w-4" /> Chat with us on WhatsApp
              </Button>
            </a>
          </motion.div>

          <motion.p
            animate={{ opacity: 1 }}
            className="mx-auto mt-6 max-w-sm text-xs text-white/30"
            initial={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.36 }}
          >
            Submitting this form does not guarantee financing approval. Final
            decisions are made after verification and banking partner review.
          </motion.p>

        </section>
      </main>
      <StorefrontFooter />
    </>
  );
}