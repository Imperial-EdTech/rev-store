"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { StorefrontHeader } from "@/components/StorefrontHeader";
import { StorefrontFooter } from "@/components/StorefrontFooter";

export default function TechAuditSuccessPage() {
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
            <CheckCircle2 className="h-10 w-10 text-maroon-deep" />
          </motion.div>
          <motion.h1
            animate={{ opacity: 1, y: 0 }}
            className="text-balance mx-auto mt-8 max-w-2xl font-display text-4xl font-extrabold text-white md:text-6xl"
            initial={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Your audit request is in
          </motion.h1>
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mt-5 max-w-xl text-lg leading-8 text-white/65"
            initial={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.5, delay: 0.18 }}
          >
            Our team will review your checklist and reach out to schedule your free audit. There&apos;s nothing else
            you need to do right now.
          </motion.p>
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mt-9 inline-block"
            initial={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.5, delay: 0.26 }}
          >
            <Link href="/">
              <Button>Return Home</Button>
            </Link>
          </motion.div>
        </section>
      </main>
      <StorefrontFooter />
    </>
  );
}