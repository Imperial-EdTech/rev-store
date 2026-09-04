"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ClipboardCheck } from "lucide-react";
import Link from "next/link";
import { SiteHeader } from "@/components/shell";

const SORA    = "'Sora', ui-sans-serif, system-ui";
const JAKARTA = "'Plus Jakarta Sans', ui-sans-serif, system-ui";

const E: [number,number,number,number] = [0.16, 1, 0.3, 1];

export default function SchoolSuccessPage() {
  return (
    <>
      <SiteHeader />
      <main className="maroon-glow relative flex min-h-screen items-center py-16" style={{ fontFamily: JAKARTA }}>
        <div className="noise-overlay" />
        <div style={{ maxWidth: 620, margin: "0 auto", padding: "0 20px", position: "relative", zIndex: 10, textAlign: "center" }}>

          {/* Check circle */}
          <motion.div
            animate={{ scale: 1, opacity: 1 }}
            initial={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.5, ease: "backOut" }}
            style={{ width: 80, height: 80, borderRadius: "50%", background: "#FF6B1A", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px" }}
          >
            <CheckCircle2 size={40} color="#fff" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 14 }}
            transition={{ duration: 0.5, delay: 0.1, ease: E }}
            style={{ fontFamily: SORA, fontWeight: 900, fontSize: "clamp(28px,4vw,42px)", color: "#fff", margin: "0 0 14px", letterSpacing: "-0.025em", lineHeight: 1.1 }}
          >
            Your enquiry is in.<br />We&apos;ll be in touch.
          </motion.h1>

          <motion.p
            animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 14 }}
            transition={{ duration: 0.5, delay: 0.18, ease: E }}
            style={{ fontSize: 15, color: "rgba(255,255,255,0.58)", lineHeight: 1.7, margin: "0 0 40px", maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}
          >
            Thank you for submitting your school&apos;s details. Our team will review what you need and reach out within one business day with device options, pricing and financing details.
          </motion.p>

          {/* Tech audit CTA card */}
          <motion.div
            animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 18 }}
            transition={{ duration: 0.5, delay: 0.28, ease: E }}
            style={{ borderRadius: 22, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", backdropFilter: "blur(12px)", padding: "28px 28px 24px", marginBottom: 20 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, justifyContent: "center" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,107,26,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ClipboardCheck size={20} color="#FF6B1A" />
              </div>
              <p style={{ fontFamily: SORA, fontWeight: 800, fontSize: 17, color: "#fff", margin: 0 }}>
                How ready is your school&apos;s technology?
              </p>
            </div>
            <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.52)", lineHeight: 1.65, margin: "0 0 20px" }}>
              Take our <strong style={{ color: "#fff" }}>free Tech Audit</strong> to get a clear picture of where your school stands — and a practical roadmap to get it where it needs to be. No obligation, no sales pitch.
            </p>
            <Link href="/tech-audit" style={{ textDecoration: "none" }}>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                type="button"
                style={{ width: "100%", height: 50, borderRadius: 12, background: "#FF6B1A", border: "none", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 9, fontFamily: JAKARTA }}
              >
                <ClipboardCheck size={16} />
                Access your free School Tech Audit
                <ArrowRight size={14} />
              </motion.button>
            </Link>
            <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.28)", margin: "10px 0 0" }}>
              Free · Takes about 5 minutes · No sign-up required
            </p>
          </motion.div>

          {/* Return home */}
          <motion.div
            animate={{ opacity: 1 }} initial={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <Link href="/" style={{ fontSize: 13.5, fontWeight: 700, color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>
              ← Return to store
            </Link>
          </motion.div>

        </div>
      </main>
    </>
  );
}