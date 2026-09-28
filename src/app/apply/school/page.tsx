"use client";

// ═══════════════════════════════════════════════════════════════
// /apply/school  —  School interest capture form
//
// Short, purposeful form for school owners / administrators.
// Captures: contact, school name, role, devices needed,
// purpose, financing interest, comments.
// Submits to /api/school-registrations → success page.
// ═══════════════════════════════════════════════════════════════

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { StorefrontHeader } from "@/components/StorefrontHeader";
import { StorefrontFooter } from "@/components/StorefrontFooter";
import { SCHOOL_DEVICE_TYPES, SCHOOL_PURPOSES, SCHOOL_ROLES } from "@/lib/school-enquiry";

const JAKARTA = "'Plus Jakarta Sans', ui-sans-serif, system-ui";
const SORA    = "'Sora', ui-sans-serif, system-ui";

// Form options: src/lib/school-enquiry.ts (shared with the server).
const DEVICE_TYPES = SCHOOL_DEVICE_TYPES;
const PURPOSES = SCHOOL_PURPOSES;
const ROLES = SCHOOL_ROLES;

function Field({ label, error, children, optional }: {
  label: string; error?: string; optional?: boolean; children: React.ReactNode;
}) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
        <span style={{ fontSize: 11.5, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
        {optional && <span style={{ fontSize: 10, fontWeight: 600, color: "#9ca3af", background: "#f3f4f6", padding: "2px 7px", borderRadius: 4 }}>Optional</span>}
      </div>
      {children}
      {error && <p style={{ marginTop: 5, fontSize: 12, fontWeight: 700, color: "#dc2626" }}>{error}</p>}
    </div>
  );
}

const inp = { width: "100%", height: 46, borderRadius: 11, border: "1.5px solid #e8e8e8", background: "#fafafa", padding: "0 14px", fontSize: 13.5, color: "#111", outline: "none", boxSizing: "border-box" as const, fontFamily: JAKARTA };
const sel = { ...inp, cursor: "pointer" };

export default function SchoolApplyPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    contactName: "",
    schoolName: "",
    role: "",
    phone: "",
    email: "",
    deviceTypes: [] as string[],
    estimatedCount: "",
    purposes: [] as string[],
    financingInterest: "" as "" | "yes" | "no" | "maybe",
    comments: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function setF(key: string, val: unknown) {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => { const n = { ...e }; delete n[key]; return n; });
  }

  function toggleArray(key: "deviceTypes" | "purposes", val: string) {
    setForm(f => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter(x => x !== val) : [...f[key], val],
    }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.contactName.trim()) e.contactName = "Enter your name";
    if (!form.schoolName.trim())  e.schoolName  = "Enter your school name";
    if (!form.role)               e.role        = "Select your role";
    if (!form.phone.trim())       e.phone       = "Enter a phone number";
    if (!form.email.includes("@")) e.email      = "Enter a valid email";
    if (form.deviceTypes.length === 0) e.deviceTypes = "Select at least one device type";
    if (form.purposes.length === 0)    e.purposes    = "Select at least one purpose";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "school",
          contactName: form.contactName,
          email: form.email,
          phone: form.phone,
          schoolName: form.schoolName,
          role: form.role,
          deviceTypes: form.deviceTypes,
          estimatedCount: parseInt(form.estimatedCount, 10) > 0 ? parseInt(form.estimatedCount, 10) : null,
          purposes: form.purposes,
          financingInterest: form.financingInterest || null,
          comments: form.comments.trim() || null,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setSubmitError(body?.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      router.push("/apply/school/success");
    } catch {
      setSubmitError("Could not reach the server. Check your connection.");
      setSubmitting(false);
    }
  }

  return (
    <>
      <StorefrontHeader />
      <main className="maroon-glow relative min-h-screen py-12" style={{ fontFamily: JAKARTA }}>
        <div className="noise-overlay" />
        <div style={{ maxWidth: 740, margin: "0 auto", padding: "0 20px", position: "relative", zIndex: 10 }}>

          {/* Back */}
          <Link href="/apply/devices" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.5)", textDecoration: "none", marginBottom: 32 }}>
            <ArrowLeft size={14} /> Back
          </Link>

          {/* Header copy */}
          <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", color: "#FF6B1A", textTransform: "uppercase", margin: "0 0 10px" }}>
            School Enquiry
          </p>
          <h1 style={{ fontFamily: SORA, fontWeight: 900, fontSize: "clamp(26px,3.5vw,38px)", color: "#fff", margin: "0 0 10px", letterSpacing: "-0.025em", lineHeight: 1.1 }}>
            Let&apos;s equip your school.
          </h1>
          <p style={{ fontSize: 14.5, color: "rgba(255,255,255,0.5)", lineHeight: 1.65, margin: "0 0 36px", maxWidth: 500 }}>
            Tell us what you need. We&apos;ll reach out within one business day with options, pricing and available financing.
          </p>

          {/* Form card */}
          <form onSubmit={handleSubmit}>
            <div style={{ background: "#fff", borderRadius: 24, border: "1px solid rgba(0,0,0,0.06)", padding: "36px 32px", boxShadow: "0 12px 48px rgba(0,0,0,0.12)", display: "flex", flexDirection: "column", gap: 24 }}>

              {/* Section 1: Contact */}
              <div>
                <p style={{ fontFamily: SORA, fontWeight: 800, fontSize: 15, color: "#111", margin: "0 0 18px", paddingBottom: 10, borderBottom: "1px solid #f0f0f0" }}>
                  1. Your contact details
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="form-two-col">
                  <Field label="Your Full Name" error={errors.contactName}>
                    <input style={inp} placeholder="Your name" value={form.contactName} onChange={e => setF("contactName", e.target.value)} />
                  </Field>
                  <Field label="School Name" error={errors.schoolName}>
                    <input style={inp} placeholder="Name of your school" value={form.schoolName} onChange={e => setF("schoolName", e.target.value)} />
                  </Field>
                  <Field label="Your Role" error={errors.role}>
                    <select style={sel} value={form.role} onChange={e => setF("role", e.target.value)}>
                      <option value="">Select role…</option>
                      {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </Field>
                  <Field label="Phone Number" error={errors.phone}>
                    <input style={inp} placeholder="+234…" value={form.phone} onChange={e => setF("phone", e.target.value)} />
                  </Field>
                  <Field label="Email Address" error={errors.email}>
                    <input style={inp} type="email" placeholder="you@school.edu.ng" value={form.email} onChange={e => setF("email", e.target.value)} />
                  </Field>
                  <Field label="Estimated No. of Devices" optional>
                    <input style={inp} type="number" min={1} placeholder="e.g. 40" value={form.estimatedCount} onChange={e => setF("estimatedCount", e.target.value)} />
                  </Field>
                </div>
              </div>

              {/* Section 2: Device types */}
              <div>
                <p style={{ fontFamily: SORA, fontWeight: 800, fontSize: 15, color: "#111", margin: "0 0 6px" }}>
                  2. What type of devices are you interested in?
                </p>
                <p style={{ fontSize: 12.5, color: "#6b7280", margin: "0 0 16px" }}>Select all that apply.</p>
                {errors.deviceTypes && <p style={{ fontSize: 12, color: "#dc2626", fontWeight: 700, marginBottom: 10 }}>{errors.deviceTypes}</p>}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }} className="form-two-col">
                  {DEVICE_TYPES.map(dt => {
                    const checked = form.deviceTypes.includes(dt.id);
                    return (
                      <button key={dt.id} type="button" onClick={() => toggleArray("deviceTypes", dt.id)}
                        style={{ borderRadius: 14, border: checked ? "2px solid #581319" : "2px solid #e8e8e8", background: checked ? "rgba(88,19,25,0.05)" : "#fafafa", padding: "14px 16px", cursor: "pointer", textAlign: "left", transition: "all 0.18s", display: "flex", alignItems: "flex-start", gap: 12 }}>
                        <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0 }}>{dt.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 2 }}>
                            <p style={{ fontSize: 13.5, fontWeight: 700, color: checked ? "#581319" : "#111", margin: 0 }}>{dt.label}</p>
                            {checked && <CheckCircle2 size={15} color="#581319" />}
                          </div>
                          <p style={{ fontSize: 11.5, color: "#9ca3af", margin: 0 }}>{dt.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 3: Purpose */}
              <div>
                <p style={{ fontFamily: SORA, fontWeight: 800, fontSize: 15, color: "#111", margin: "0 0 6px" }}>
                  3. What are the devices for?
                </p>
                <p style={{ fontSize: 12.5, color: "#6b7280", margin: "0 0 16px" }}>Select all that apply.</p>
                {errors.purposes && <p style={{ fontSize: 12, color: "#dc2626", fontWeight: 700, marginBottom: 10 }}>{errors.purposes}</p>}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }} className="form-two-col">
                  {PURPOSES.map(p => {
                    const checked = form.purposes.includes(p.id);
                    return (
                      <button key={p.id} type="button" onClick={() => toggleArray("purposes", p.id)}
                        style={{ borderRadius: 12, border: checked ? "2px solid #581319" : "2px solid #e8e8e8", background: checked ? "rgba(88,19,25,0.05)" : "#fafafa", padding: "13px 15px", cursor: "pointer", textAlign: "left", transition: "all 0.18s", display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${checked ? "#581319" : "#d1d5db"}`, background: checked ? "#581319" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
                          {checked && <Check size={11} color="#fff" strokeWidth={3} />}
                        </div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 700, color: checked ? "#581319" : "#374151", margin: "0 0 2px" }}>{p.label}</p>
                          <p style={{ fontSize: 11.5, color: "#9ca3af", margin: 0 }}>{p.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 4: Financing */}
              <div>
                <p style={{ fontFamily: SORA, fontWeight: 800, fontSize: 15, color: "#111", margin: "0 0 6px" }}>
                  4. Are you interested in our financing option?
                </p>
                <p style={{ fontSize: 12.5, color: "#6b7280", margin: "0 0 16px" }}>
                  Buy Now, Pay Later — spread the cost of devices over 12, 24 or 36 months.
                </p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {(["yes", "maybe", "no"] as const).map(opt => {
                    const labels = { yes: "Yes, definitely", maybe: "I'd like to know more", no: "Prefer to pay outright" };
                    const checked = form.financingInterest === opt;
                    return (
                      <button key={opt} type="button" onClick={() => setF("financingInterest", opt)}
                        style={{ height: 40, padding: "0 18px", borderRadius: 100, border: checked ? "2px solid #581319" : "2px solid #e8e8e8", background: checked ? "#581319" : "#fff", color: checked ? "#fff" : "#374151", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.18s", display: "flex", alignItems: "center", gap: 7 }}>
                        {checked && <Check size={12} strokeWidth={3} />}
                        {labels[opt]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 5: Comments */}
              <Field label="Anything else we should know?" optional>
                <textarea
                  style={{ ...inp, height: "auto", minHeight: 90, padding: "12px 14px", resize: "vertical" }}
                  placeholder="Timeline, budget, specific requirements, questions…"
                  value={form.comments}
                  onChange={e => setF("comments", e.target.value)} />
              </Field>

              {submitError && (
                <div style={{ borderRadius: 12, border: "1px solid rgba(220,38,38,0.2)", background: "rgba(220,38,38,0.05)", padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#dc2626" }}>
                  {submitError}
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                type="submit" disabled={submitting}
                style={{ width: "100%", height: 52, borderRadius: 14, background: "#581319", border: "none", color: "#fff", fontSize: 14.5, fontWeight: 800, cursor: submitting ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, opacity: submitting ? 0.7 : 1, fontFamily: JAKARTA }}
              >
                {submitting
                  ? <><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Submitting…</>
                  : <>Submit school enquiry <ArrowRight size={16} /></>}
              </motion.button>

              <p style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", margin: 0 }}>
                We&apos;ll be in touch within one business day. No commitment required.
              </p>
            </div>
          </form>
        </div>

        <style>{`
          @media (max-width: 580px) {
            .form-two-col { grid-template-columns: 1fr !important; }
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </main>
      <StorefrontFooter />
    </>
  );
}