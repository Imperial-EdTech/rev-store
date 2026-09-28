"use client";

import { motion } from "framer-motion";
import { CheckCircle2, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui";
import { StorefrontFooter } from "@/components/StorefrontFooter";
import { StorefrontHeader } from "@/components/StorefrontHeader";
import { WHATSAPP_NUMBER } from "@/lib/contact";

/**
 * Confirmation after a public form:
 *   /success?ref=APP-XXXXXX  Teacher Empowerment application (shows the reference)
 *   /success?type=purchase   "Buy outright" on the Teacher Empowerment form
 *   /success?type=waitlist   Early-access waitlist
 */
type Variant = {
  title: string;
  intro: string;
  steps: string[];
  footnote?: string;
};

const VARIANTS = {
  application: {
    title: "Application received!",
    intro:
      "Thank you for applying to the Teacher Digital Empowerment Programme. Our team will review your application and reach out to you, via WhatsApp or email, with your next steps.",
    steps: [
      "Our team reviews your application, usually within a few business days.",
      "If you're shortlisted, you'll be contacted on the phone number you provided.",
      "You may be asked to provide KYC documents (ID, proof of employment, payslip).",
      "Successful applicants are matched with a Lotus Bank payment plan.",
    ],
    footnote:
      "Submitting this form does not guarantee financing approval. Final decisions are made after verification and banking partner review.",
  },
  purchase: {
    title: "Request received!",
    intro:
      "Thank you. You chose to buy your laptop outright at the programme's discounted price. Our team will contact you with the price and how to pay.",
    steps: [
      "We confirm your device and the discounted price, usually within a few business days.",
      "We send you payment details on WhatsApp or email.",
      "Once payment is confirmed, you collect your laptop or we deliver it.",
    ],
  },
  waitlist: {
    title: "You're on the list!",
    intro:
      "Thanks for registering your interest. We'll be in touch as soon as the programmes you picked open, and we'll only contact you about those.",
    steps: [
      "We review what you're interested in.",
      "When it's available, we contact you on WhatsApp or email.",
    ],
  },
} satisfies Record<string, Variant>;

const fadeUp = (delay: number) => ({
  animate: { opacity: 1, y: 0 },
  initial: { opacity: 0, y: 12 },
  transition: { duration: 0.5, delay },
});

function SuccessContent() {
  const params = useSearchParams();
  const ref = params.get("ref");
  const type = params.get("type");
  const variant: Variant = ref ? VARIANTS.application : type === "purchase" ? VARIANTS.purchase : type === "waitlist" ? VARIANTS.waitlist : VARIANTS.application;

  return (
    <section className="container-x relative z-10 text-center">
      <motion.div
        animate={{ scale: 1, opacity: 1 }}
        className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rev-orange"
        initial={{ scale: 0.6, opacity: 0 }}
        transition={{ duration: 0.5, ease: "backOut" }}
      >
        <CheckCircle2 className="h-10 w-10 text-white" />
      </motion.div>

      <motion.h1 className="text-balance mx-auto mt-8 max-w-2xl font-display text-4xl font-extrabold text-white md:text-6xl" {...fadeUp(0.1)}>
        {variant.title}
      </motion.h1>

      <motion.p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-white/65" {...fadeUp(0.18)}>
        {variant.intro}
      </motion.p>

      {ref && (
        <motion.div className="mx-auto mt-6 inline-flex flex-col items-center rounded-2xl border border-rev-orange/30 bg-rev-orange/10 px-6 py-4" {...fadeUp(0.22)}>
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-rev-orange">Your application reference</span>
          <span className="mt-1 font-mono text-2xl font-bold tracking-wider text-white">{ref}</span>
          <span className="mt-1 text-xs text-white/50">Quote it whenever you contact us.</span>
        </motion.div>
      )}

      <motion.div className="mx-auto mt-8 max-w-md rounded-2xl border border-white/12 bg-white/[0.06] px-6 py-5 text-left" {...fadeUp(0.26)}>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-rev-orange">What happens next</p>
        <ul className="mt-4 flex flex-col gap-3">
          {variant.steps.map((step, i) => (
            <li className="flex items-start gap-3" key={step}>
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rev-orange/20 text-[11px] font-extrabold text-rev-orange">
                {i + 1}
              </span>
              <span className="text-sm leading-6 text-white/65">{step}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div className="mt-9 flex flex-wrap items-center justify-center gap-4" {...fadeUp(0.3)}>
        <Link href="/">
          <Button variant="ghost">Back to RevStore</Button>
        </Link>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}${ref ? `?text=${encodeURIComponent(`Hi Revrica, my application reference is ${ref}.`)}` : ""}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Button>
            <MessageCircle className="h-4 w-4" /> Chat with us on WhatsApp
          </Button>
        </a>
      </motion.div>

      {variant.footnote && (
        <motion.p
          animate={{ opacity: 1 }}
          className="mx-auto mt-6 max-w-sm text-xs text-white/30"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.36 }}
        >
          {variant.footnote}
        </motion.p>
      )}
    </section>
  );
}

export default function SuccessPage() {
  return (
    <>
      <StorefrontHeader />
      <main className="maroon-glow relative flex min-h-screen items-center py-16">
        <div className="noise-overlay" />
        <Suspense fallback={null}>
          <SuccessContent />
        </Suspense>
      </main>
      <StorefrontFooter />
    </>
  );
}
