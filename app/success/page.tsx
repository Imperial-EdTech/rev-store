"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { SiteHeader } from "@/src/components/shell";
import { Button } from "@/src/components/ui";

export default function SuccessPage() {
  return (
    <>
      <SiteHeader />
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
            You&apos;re on the list
          </motion.h1>
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mt-5 max-w-xl text-lg leading-8 text-white/65"
            initial={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.5, delay: 0.18 }}
          >
            We&apos;ve received your details. Our team will review what you&apos;re interested in and reach out with
            next steps. No payment is required at this stage.
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
    </>
  );
}