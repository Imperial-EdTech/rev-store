"use client";

// ═══════════════════════════════════════════════════════════════
// /apply — Teacher Digital Empowerment Programme Application
//
// Flow: /apply/devices → /apply?device=<id>
//
// Three application pathways:
//  1. Individual Teacher  — solo applicant
//  2. Let There Be Teachers — LTBT scheme (with logo)
//  3. Government Staff    — federal/state staff (with federal eagle)
//
// TRCN number is required for ALL pathways.
// ═══════════════════════════════════════════════════════════════

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { clsx } from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Building2, Check, GraduationCap, Star } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { Suspense, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui";
import { StorefrontHeader } from "@/components/StorefrontHeader";
import { StorefrontFooter } from "@/components/StorefrontFooter";
import { GOVERNMENT_BODIES } from "@/lib/organizations";
import { teacherApplicationSchema, type TeacherApplication } from "@/lib/applications/schema";
import { getProduct } from "@/lib/catalog";

const JAKARTA = "'Plus Jakarta Sans', ui-sans-serif, system-ui";
const SORA    = "'Sora', ui-sans-serif, system-ui";

// ── Government bodies (for Government Staff pathway) ──────────
// Government bodies: src/lib/organizations.ts (shared with the database seed).

// ── Nigerian states ───────────────────────────────────────────
const STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo",
  "Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa",
  "Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba",
  "Yobe","Zamfara",
];


// ── Schema ────────────────────────────────────────────────────
// Shared with the server: src/lib/applications/schema.ts
const schema = teacherApplicationSchema;
type FormValues = TeacherApplication;

const STEPS = [
  { title: "How are you applying?",  sub: "Choose your pathway — this determines how we process your application.", fields: ["applyAs","governmentBodyId"] as (keyof FormValues)[] },
  { title: "Personal information",   sub: "We'll use this to contact and verify you.",                              fields: ["fullName","phone","email","gender"] as (keyof FormValues)[] },
  { title: "Employment information", sub: "Help us understand your teaching context.",                              fields: ["schoolName","schoolType","position","state","lga","yearsTeaching"] as (keyof FormValues)[] },
  { title: "Financial information",  sub: "This helps us match you with the right plan.",                          fields: ["salaryBand","repaymentTenor","monthlyBudget"] as (keyof FormValues)[] },
  { title: "Verification &amp; consent", sub: "A few final questions before you submit.",                          fields: ["ownsLaptop","whyLaptop","kycConsent","declaration"] as (keyof FormValues)[] },
];

// ── Input styles ──────────────────────────────────────────────
const inputCls =
  "focus-ring h-12 w-full rounded-xl border border-black/12 bg-white px-4 text-sm text-slate-ink placeholder:text-slate-body/50";
const selectCls =
  "focus-ring h-12 w-full rounded-xl border border-black/12 bg-white px-4 text-sm text-slate-ink";
const textareaCls =
  "focus-ring min-h-[96px] w-full rounded-xl border border-black/12 bg-white px-4 py-3 text-sm text-slate-ink placeholder:text-slate-body/50 resize-none";

// ── Sub-components ────────────────────────────────────────────
function Field({ label, error, optional, hint, children }: {
  label: string; error?: string; optional?: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <span className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-slate-body/80">
        {label}
        {optional && <span className="rounded bg-black/5 px-1.5 py-0.5 text-[10px] font-medium normal-case text-slate-body/50">Optional</span>}
      </span>
      {hint && <p className="mb-2 text-xs leading-5 text-slate-body/60">{hint}</p>}
      {children}
      {error && <p className="mt-1.5 text-sm font-bold text-rev-orange">{error}</p>}
    </div>
  );
}

function RadioGroup({ options, value, onChange }: {
  options: string[]; value: string | undefined; onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {options.map(opt => (
        <label
          key={opt}
          className={clsx(
            "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition",
            value === opt ? "border-rev-orange bg-rev-orange/8 text-slate-ink" : "border-black/10 bg-[#FAF8F6] text-slate-body hover:border-rev-orange/40"
          )}
        >
          <span className={clsx("flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition", value === opt ? "border-rev-orange bg-rev-orange" : "border-black/25")}>
            {value === opt && <span className="h-1.5 w-1.5 rounded-full bg-white"/>}
          </span>
          <input className="sr-only" onChange={() => onChange(opt)} type="radio"/>
          {opt}
        </label>
      ))}
    </div>
  );
}

// ── Federal Eagle SVG ─────────────────────────────────────────
function FederalEagle({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Shield body */}
      <path d="M32 6 L52 14 L52 32 C52 44 43 54 32 58 C21 54 12 44 12 32 L12 14 Z" fill="#006600" stroke="#004400" strokeWidth="1"/>
      {/* White stripe */}
      <path d="M32 6 L36 8 L36 58 L32 58 L28 58 L28 8 Z" fill="#fff" opacity="0.9"/>
      {/* Eagle wings suggestion */}
      <path d="M12 28 Q4 20 8 12 Q16 8 24 16" stroke="#888" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M52 28 Q60 20 56 12 Q48 8 40 16" stroke="#888" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Eagle body */}
      <ellipse cx="32" cy="32" rx="9" ry="11" fill="#888"/>
      <ellipse cx="32" cy="26" rx="6" ry="6" fill="#888"/>
      {/* Beak */}
      <path d="M32 23 L35 26 L32 27 Z" fill="#f2760f"/>
    </svg>
  );
}

// ── LTBT Logo SVG ─────────────────────────────────────────────
function LTBTLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="30" fill="#f5a623" opacity="0.12" stroke="#f5a623" strokeWidth="1.5"/>
      <path d="M20 44 L20 20 L26 20 L26 38 L44 38 L44 44 Z" fill="#f5a623"/>
      <circle cx="40" cy="22" r="8" fill="#f5a623" opacity="0.6"/>
      <circle cx="40" cy="22" r="5" fill="#f5a623"/>
      <path d="M36 22 L38 24 L44 18" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ── Pathway card ──────────────────────────────────────────────
function PathwayCard({ icon, logo, title, description, selected, onClick }: {
  icon?: React.ReactNode;
  logo?: React.ReactNode;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={clsx(
        "w-full rounded-2xl border-2 p-5 text-left transition-all duration-200",
        selected ? "border-rev-orange bg-rev-orange/6 shadow-sm" : "border-black/10 bg-[#FAF8F6] hover:border-rev-orange/40 hover:bg-rev-orange/3"
      )}
      onClick={onClick}
      type="button"
    >
      <div className="flex items-start gap-4">
        <div className={clsx("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors overflow-hidden", selected ? "bg-rev-orange" : "bg-black/6")}>
          {logo || <span className={selected ? "text-white" : "text-slate-body"}>{icon}</span>}
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex items-center justify-between gap-2">
            <p className={clsx("font-display text-base font-bold", selected ? "text-slate-ink" : "text-slate-body")}>{title}</p>
            <span className={clsx("flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition", selected ? "border-rev-orange bg-rev-orange" : "border-black/20 bg-white")}>
              {selected && <Check className="h-3 w-3 text-white"/>}
            </span>
          </div>
          <p className="mt-1 text-xs leading-5 text-slate-body">{description}</p>
        </div>
      </div>
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════
// Inner form (reads search params)
// ═══════════════════════════════════════════════════════════════
function ApplyForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const deviceId     = searchParams.get("device") ?? "";
  const deviceName   = getProduct(deviceId)?.name ?? null;

  const [step, setStep]           = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { register, handleSubmit, trigger, watch, control, setValue, formState: { errors, isSubmitting } } =
    useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: { applyAs: "individual" },
    });

  const applyAs         = watch("applyAs");
  const declaration     = watch("declaration");
  const governmentBodyId = watch("governmentBodyId");

  async function nextStep(e?: React.MouseEvent) {
    e?.preventDefault(); e?.stopPropagation();
    const ok = await trigger(STEPS[step].fields as any);
    if (ok) setStep(s => Math.min(s + 1, STEPS.length - 1));
  }

  async function onSubmit(values: FormValues) {
    if (step !== STEPS.length - 1) return;
    setSubmitError(null);

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, deviceId: deviceId || undefined }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setSubmitError(body?.error ?? "Something went wrong. Please try again.");
        return;
      }
      router.push("/success");
    } catch {
      setSubmitError("Could not reach the server. Check your connection and try again.");
    }
  }

  return (
    <>
      <StorefrontHeader />
      <main className="maroon-glow relative min-h-screen py-12" style={{ fontFamily: JAKARTA }}>
        <div className="noise-overlay"/>
        <div className="container-x relative z-10 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">

          {/* ── Left panel ── */}
          <aside className="pt-8">
            <Link className="inline-flex items-center text-sm font-bold text-white/60 hover:text-rev-orange" href="/apply/devices">
              <ArrowLeft className="mr-2 h-4 w-4"/> Back to devices
            </Link>

            <p className="mt-10 text-xs font-bold uppercase tracking-[0.2em] text-rev-orange">Teacher Digital Empowerment Programme</p>
            <h1 className="text-balance mt-3 font-display text-3xl font-extrabold leading-[1.06] text-white md:text-4xl">
              Apply for your Rev Laptop
            </h1>

            {/* Device chosen badge */}
            {deviceName && (
              <motion.div
                animate={{ opacity:1, y:0 }}
                className="mt-5 flex items-center gap-3 rounded-2xl border border-rev-orange/25 bg-rev-orange/10 px-4 py-3"
                initial={{ opacity:0, y:8 }}
                transition={{ duration:0.3 }}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rev-orange/20 text-xs font-bold text-rev-orange">✓</span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-rev-orange">Device selected</p>
                  <p className="text-sm font-bold text-white">{deviceName}</p>
                </div>
              </motion.div>
            )}

            {/* Pathway badge */}
            {applyAs === "ltbt" && (
              <motion.div animate={{ opacity:1, y:0 }} className="mt-4 flex items-center gap-3 rounded-2xl border border-yellow-400/30 bg-yellow-400/10 px-4 py-3" initial={{ opacity:0, y:8 }} transition={{ duration:0.3 }}>
                <LTBTLogo size={28}/>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-yellow-400">Applying via</p>
                  <p className="text-sm font-bold text-white">Let There Be Teachers</p>
                </div>
              </motion.div>
            )}
            {applyAs === "government" && (
              <motion.div animate={{ opacity:1, y:0 }} className="mt-4 flex items-center gap-3 rounded-2xl border border-green-400/30 bg-green-400/10 px-4 py-3" initial={{ opacity:0, y:8 }} transition={{ duration:0.3 }}>
                <FederalEagle size={28}/>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-green-400">Government Staff</p>
                  <p className="text-sm font-bold text-white">{GOVERNMENT_BODIES.find(b => b.id === governmentBodyId)?.name ?? "Select your body below"}</p>
                </div>
              </motion.div>
            )}

            <p className="mt-5 max-w-sm text-base leading-7 text-white/55">
              Spread the cost over 12, 24, or 36 months — from <strong className="text-white">₦15,000/month</strong>, in partnership with Lotus Bank.
            </p>

            {/* Step sidebar */}
            <div className="mt-10 hidden flex-col gap-3 lg:flex">
              {STEPS.map((s, i) => (
                <div className="flex items-center gap-3" key={s.title}>
                  <span className={clsx("flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors",
                    i < step ? "border-rev-orange bg-rev-orange text-white" : i === step ? "border-white bg-white text-maroon" : "border-white/20 text-white/30")}>
                    {i < step ? <Check className="h-3 w-3"/> : i + 1}
                  </span>
                  <span className={clsx("text-sm transition-colors", i === step ? "font-bold text-white" : i < step ? "text-white/55" : "text-white/25")}>
                    {s.title}
                  </span>
                </div>
              ))}
            </div>
          </aside>

          {/* ── Form card ── */}
          <div className="rounded-3xl border border-black/8 bg-white p-6 shadow-xl md:p-8">
            {/* Progress bar */}
            <div className="mb-8 flex gap-1.5">
              {STEPS.map((_, i) => (
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-black/8" key={i}>
                  <motion.div animate={{ width: i <= step ? "100%" : "0%" }} className="h-full bg-rev-orange" transition={{ duration:0.35, ease:"easeOut" }}/>
                </div>
              ))}
            </div>

            <form onKeyDown={e => { if (e.key === "Enter") e.preventDefault(); }} onSubmit={handleSubmit(onSubmit)}>
              <AnimatePresence mode="wait">
                <motion.div animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-16 }} initial={{ opacity:0, x:16 }} key={step} transition={{ duration:0.22 }}>

                  {/* Step heading */}
                  <div className="mb-7">
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-rev-orange/70">Step {step + 1} of {STEPS.length}</p>
                    <h2 className="mt-1 font-display text-2xl font-bold text-slate-ink" dangerouslySetInnerHTML={{ __html: STEPS[step].title }}/>
                    <p className="mt-1 text-sm text-slate-body">{STEPS[step].sub}</p>
                  </div>


                  {/* ── STEP 0: Pathway ── */}
                  {step === 0 && (
                    <div className="space-y-4">
                      <Controller control={control} name="applyAs" render={({ field }) => (
                        <>
                          <PathwayCard
                            icon={<GraduationCap className="h-5 w-5"/>}
                            title="Individual Teacher"
                            description="Applying directly as a teacher — no intermediary required."
                            selected={field.value === "individual"}
                            onClick={() => { field.onChange("individual"); setValue("governmentBodyId",""); }}
                          />
                          <PathwayCard
                            logo={<LTBTLogo size={36}/>}
                            title="Let There Be Teachers"
                            description="Applying through the Let There Be Teachers laptop scheme."
                            selected={field.value === "ltbt"}
                            onClick={() => { field.onChange("ltbt"); setValue("governmentBodyId",""); }}
                          />
                          <PathwayCard
                            logo={<FederalEagle size={36}/>}
                            title="Government Staff"
                            description="Applying as a federal or state government education staff member."
                            selected={field.value === "government"}
                            onClick={() => field.onChange("government")}
                          />
                        </>
                      )}/>

                      {/* Government body selector */}
                      <AnimatePresence>
                        {applyAs === "government" && (
                          <motion.div animate={{ height:"auto", opacity:1 }} exit={{ height:0, opacity:0 }} initial={{ height:0, opacity:0 }} transition={{ duration:0.25 }}>
                            <div className="overflow-hidden pt-1">
                              <Field error={errors.governmentBodyId?.message} label="Government Body / Agency">
                                <select className={selectCls} {...register("governmentBodyId")}>
                                  <option value="">Select your body…</option>
                                  {GOVERNMENT_BODIES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                </select>
                              </Field>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* TRCN — only required for government staff */}
                      {applyAs === "government" && (
                        <motion.div animate={{ height:"auto", opacity:1 }} exit={{ height:0, opacity:0 }} initial={{ height:0, opacity:0 }} transition={{ duration:0.25 }}>
                          <div className="overflow-hidden">
                            <div className="rounded-xl border border-rev-orange/20 bg-rev-orange/4 p-4">
                              <Field
                                error={errors.trcnNumber?.message}
                                hint="Your TRCN number is on your registration certificate or at trcn.gov.ng"
                                label="TRCN Registration Number"
                              >
                                <input className={inputCls} placeholder="e.g. TRCN/2019/123456" {...register("trcnNumber")}/>
                              </Field>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* ── STEP 1: Personal ── */}
                  {step === 1 && (
                    <div className="space-y-5">
                      <Field error={errors.fullName?.message} label="Full Name">
                        <input className={inputCls} placeholder="Your full name" {...register("fullName")}/>
                      </Field>
                      <Field error={errors.phone?.message} hint="WhatsApp preferred." label="Phone Number">
                        <input className={inputCls} placeholder="+234..." type="tel" {...register("phone")}/>
                      </Field>
                      <Field error={errors.email?.message} label="Email Address">
                        <input className={inputCls} placeholder="name@example.com" type="email" {...register("email")}/>
                      </Field>
                      <Field error={errors.gender?.message} label="Gender">
                        <Controller control={control} name="gender" render={({ field }) => (
                          <RadioGroup onChange={field.onChange} options={["Male","Female"]} value={field.value}/>
                        )}/>
                      </Field>
                    </div>
                  )}

                  {/* ── STEP 2: Employment ── */}
                  {step === 2 && (
                    <div className="space-y-5">
                      <Field error={errors.schoolName?.message} label="Name of School / Institution">
                        <input className={inputCls} placeholder="Full institution name" {...register("schoolName")}/>
                      </Field>
                      <Field error={errors.schoolType?.message} label="School Type">
                        <Controller control={control} name="schoolType" render={({ field }) => (
                          <RadioGroup onChange={field.onChange} options={["Public","Private"]} value={field.value}/>
                        )}/>
                      </Field>
                      <Field error={errors.position?.message} hint="e.g. Classroom Teacher, Principal, Administrator" label="Position / Designation">
                        <input className={inputCls} placeholder="Your role" {...register("position")}/>
                      </Field>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field error={errors.state?.message} label="State of Residence">
                          <select className={selectCls} {...register("state")}>
                            <option value="">Select state</option>
                            {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </Field>
                        <Field error={errors.lga?.message} label="LGA">
                          <input className={inputCls} placeholder="Local Government Area" {...register("lga")}/>
                        </Field>
                      </div>
                      <Field error={errors.yearsTeaching?.message} label="Years of Teaching Experience">
                        <select className={selectCls} {...register("yearsTeaching")}>
                          <option value="">Select range</option>
                          {["Less than 1 year","1–2 years","3–5 years","6–10 years","11–20 years","Over 20 years"].map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </Field>
                    </div>
                  )}

                  {/* ── STEP 3: Financial ── */}
                  {step === 3 && (
                    <div className="space-y-5">
                      <Field error={errors.salaryBand?.message} label="Monthly Net Salary / Income">
                        <Controller control={control} name="salaryBand" render={({ field }) => (
                          <RadioGroup onChange={field.onChange} options={["₦0 – ₦50,000","₦51,000 – ₦100,000","Above ₦100,000"]} value={field.value}/>
                        )}/>
                      </Field>
                      <Field error={errors.repaymentTenor?.message} label="Preferred Repayment Tenor">
                        <Controller control={control} name="repaymentTenor" render={({ field }) => (
                          <RadioGroup onChange={field.onChange} options={["Buy Outright (Discounted)","12 Months","24 Months","36 Months"]} value={field.value}/>
                        )}/>
                      </Field>
                      <Field error={errors.monthlyBudget?.message} label="Preferred Monthly Budget" optional>
                        <input className={inputCls} placeholder="e.g. ₦20,000" {...register("monthlyBudget")}/>
                      </Field>
                    </div>
                  )}

                  {/* ── STEP 4: Verification + Consent ── */}
                  {step === 4 && (
                    <div className="space-y-5">
                      <Field error={errors.ownsLaptop?.message} label="Do you currently own a laptop?">
                        <Controller control={control} name="ownsLaptop" render={({ field }) => (
                          <RadioGroup onChange={field.onChange} options={["Yes","No"]} value={field.value}/>
                        )}/>
                      </Field>
                      <Field error={errors.whyLaptop?.message} hint="How will you use this laptop for your teaching?" label="Why do you need a laptop?">
                        <textarea className={textareaCls} placeholder="Briefly describe…" {...register("whyLaptop")}/>
                      </Field>
                      <Field error={errors.kycConsent?.message} hint="Valid ID, proof of employment, payslip, or other docs may be required." label="Will you provide KYC documents if selected?">
                        <Controller control={control} name="kycConsent" render={({ field }) => (
                          <RadioGroup onChange={field.onChange} options={["Yes","No"]} value={field.value}/>
                        )}/>
                      </Field>

                      <div className="rounded-xl border border-black/10 bg-[#FAF8F6] p-4">
                        <Controller control={control} name="declaration" render={({ field }) => (
                          <label className="flex cursor-pointer items-start gap-3">
                            <button className={clsx("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition", field.value ? "border-rev-orange bg-rev-orange" : "border-black/25 bg-white")} onClick={() => field.onChange(field.value ? undefined : true)} type="button">
                              {field.value && <Check className="h-3 w-3 text-white"/>}
                            </button>
                            <p className="text-xs leading-5 text-slate-body">
                              I confirm that the information I have provided is accurate and complete. Submitting this form does not guarantee approval. I may be contacted for further verification before financing is approved.
                            </p>
                          </label>
                        )}/>
                        {errors.declaration && <p className="mt-2 text-sm font-bold text-rev-orange">{errors.declaration.message}</p>}
                      </div>

                      {submitError && (
                        <div className="rounded-xl border border-rev-orange/25 bg-rev-orange/5 px-4 py-3 text-sm font-semibold text-rev-orangeDeep">{submitError}</div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="mt-8 flex items-center justify-between gap-3">
                <button
                  className="focus-ring h-12 rounded-full border border-black/12 px-5 text-sm font-bold text-slate-body transition hover:border-black/25 disabled:opacity-30"
                  disabled={step === 0}
                  onClick={() => setStep(s => Math.max(s - 1, 0))}
                  type="button"
                >
                  Back
                </button>
                {step < STEPS.length - 1 ? (
                  <Button onClick={nextStep} type="button">Continue <ArrowRight className="h-4 w-4"/></Button>
                ) : (
                  <Button disabled={isSubmitting || !declaration} type="submit">
                    {isSubmitting ? "Submitting…" : "Submit Application"}
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}

// ─── Suspense wrapper (useSearchParams needs it) ──────────────
export default function ApplyPage() {
  return (
    <>
      <Suspense fallback={<div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff" }}>Loading…</div>}>
        <ApplyForm />
      </Suspense>
      <StorefrontFooter />
    </>
  );
}