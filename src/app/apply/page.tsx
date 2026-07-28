"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { clsx } from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { SiteHeader } from "@/components/shell";
import { Button } from "@/components/ui";

// ── Partner organisations ─────────────────────────────────────
// Add new partners here — they appear automatically in Step 1.
const PARTNER_ORGS = [
  {
    id: "let-there-be-teachers",
    name: "Let There Be Teachers Laptop Scheme",
    shortName: "Let There Be Teachers",
  },
] as const;

type PartnerId = (typeof PARTNER_ORGS)[number]["id"];

// ── Nigerian states ───────────────────────────────────────────
const STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo",
  "Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa",
  "Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba",
  "Yobe","Zamfara",
];

// ── Schema ────────────────────────────────────────────────────
const schema = z.object({
  // Step 1 — partnership (optional, defaults to independent)
  partnerOrgId: z.string().optional(),

  // Step 2 — personal
  fullName:  z.string().min(2, "Enter your full name"),
  phone:     z.string().min(7, "Enter a valid phone number"),
  email:     z.string().email("Enter a valid email address"),
  gender:    z.enum(["Male", "Female"], { required_error: "Select your gender" }),

  // Step 3 — employment
  schoolName:    z.string().min(2, "Enter your school name"),
  schoolType:    z.enum(["Public", "Private"], { required_error: "Select school type" }),
  position:      z.string().min(2, "Enter your position or designation"),
  state:         z.string().min(2, "Select your state of residence"),
  lga:           z.string().min(2, "Enter your LGA"),
  yearsTeaching: z.string().min(1, "Select your years of experience"),

  // Step 4 — financial
  salaryBand: z.enum(
    ["Below ₦100,000","₦100,000 – ₦199,999","₦200,000 – ₦299,999","₦300,000 – ₦499,999","₦500,000 and above"],
    { required_error: "Select your salary range" }
  ),
  paymentOption: z.enum(["Buy Outright (Discounted)","12 Months","24 Months","36 Months"], {
    required_error: "Select your preferred payment option",
  }),
  monthlyBudget: z.string().optional(),

  // Step 5 — verification + consent
  ownsLaptop:   z.enum(["Yes","No"], { required_error: "Please answer this question" }),
  whyLaptop:    z.string().min(10, "Please give a brief explanation (at least 10 characters)"),
  kycConsent:   z.enum(["Yes","No"], { required_error: "Please answer this question" }),
  declaration:  z.literal(true, {
    errorMap: () => ({ message: "You must confirm this to submit" }),
  }),
});

type FormValues = z.infer<typeof schema>;

// ── Steps ─────────────────────────────────────────────────────
const STEPS = [
  {
    title: "How are you applying?",
    sub: "If you're part of a partner organisation, select it below. Otherwise, just continue.",
    fields: ["partnerOrgId"] as Array<keyof FormValues>,
  },
  {
    title: "Personal information",
    sub: "We'll use this to contact you and verify your application.",
    fields: ["fullName","phone","email","gender"] as Array<keyof FormValues>,
  },
  {
    title: "Employment information",
    sub: "Help us understand your teaching context.",
    fields: ["schoolName","schoolType","position","state","lga","yearsTeaching"] as Array<keyof FormValues>,
  },
  {
    title: "Financial information",
    sub: "This helps us match you with the right plan.",
    fields: ["salaryBand","paymentOption","monthlyBudget"] as Array<keyof FormValues>,
  },
  {
    title: "Verification &amp; consent",
    sub: "A few final questions before you submit.",
    fields: ["ownsLaptop","whyLaptop","kycConsent","declaration"] as Array<keyof FormValues>,
  },
];

// ── Shared styles ─────────────────────────────────────────────
const inputCls =
  "focus-ring h-12 w-full rounded-xl border border-black/12 bg-white px-4 text-sm text-slate-ink placeholder:text-slate-body/50";
const selectCls =
  "focus-ring h-12 w-full rounded-xl border border-black/12 bg-white px-4 text-sm text-slate-ink";
const textareaCls =
  "focus-ring min-h-[96px] w-full rounded-xl border border-black/12 bg-white px-4 py-3 text-sm text-slate-ink placeholder:text-slate-body/50 resize-none";

// ── Sub-components ────────────────────────────────────────────
function Field({
  label,
  error,
  optional,
  hint,
  children,
}: {
  label: string;
  error?: string;
  optional?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <span className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-slate-body/80">
        {label}
        {optional && (
          <span className="rounded bg-black/5 px-1.5 py-0.5 text-[10px] font-medium normal-case text-slate-body/50">
            Optional
          </span>
        )}
      </span>
      {hint && <p className="mb-2 text-xs leading-5 text-slate-body/60">{hint}</p>}
      {children}
      {error && <p className="mt-1.5 text-sm font-bold text-rev-orange">{error}</p>}
    </div>
  );
}

function RadioGroup({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string | undefined;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((opt) => (
        <label
          className={clsx(
            "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition",
            value === opt
              ? "border-rev-orange bg-rev-orange/8 text-slate-ink"
              : "border-black/10 bg-[#FAF8F6] text-slate-body hover:border-rev-orange/40"
          )}
          key={opt}
        >
          <span
            className={clsx(
              "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition",
              value === opt ? "border-rev-orange bg-rev-orange" : "border-black/25"
            )}
          >
            {value === opt && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
          </span>
          <input className="sr-only" onChange={() => onChange(opt)} type="radio" />
          {opt}
        </label>
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────
export default function ApplyPage() {
  const router = useRouter();
  const [step, setStep]           = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register, handleSubmit, trigger, watch,
    control, setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { partnerOrgId: "" },
  });

  const partnerOrgId   = watch("partnerOrgId");
  const declaration    = watch("declaration");
  const selectedPartner = PARTNER_ORGS.find((p) => p.id === partnerOrgId);

  async function nextStep(e?: React.MouseEvent) {
    e?.preventDefault();
    e?.stopPropagation();
    const ok = await trigger(STEPS[step].fields as any);
    if (ok) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  async function onSubmit(values: FormValues) {
    if (step !== STEPS.length - 1) return;
    setSubmitError(null);

    const partnerLabel = selectedPartner?.name ?? "Independent";

    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName:     values.fullName,
          email:        values.email,
          phone:        values.phone,
          organization: values.schoolName,
          role:         "Teacher",
          interests:    [
            values.paymentOption === "Buy Outright (Discounted)"
              ? "Buy a Laptop Outright"
              : "Laptop Financing",
          ],
          notes: JSON.stringify({
            partnerOrg:    partnerLabel,
            gender:        values.gender,
            schoolType:    values.schoolType,
            position:      values.position,
            state:         values.state,
            lga:           values.lga,
            yearsTeaching: values.yearsTeaching,
            salaryBand:    values.salaryBand,
            paymentOption: values.paymentOption,
            monthlyBudget: values.monthlyBudget ?? "",
            ownsLaptop:    values.ownsLaptop,
            whyLaptop:     values.whyLaptop,
            kycConsent:    values.kycConsent,
          }),
        }),
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
      <SiteHeader />
      <main className="maroon-glow relative min-h-screen py-12">
        <div className="noise-overlay" />
        <div className="container-x relative z-10 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">

          {/* ── Left panel ── */}
          <aside className="pt-8">
            <Link
              className="inline-flex items-center text-sm font-bold text-white/60 hover:text-rev-orange"
              href="/"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back home
            </Link>

            <p className="mt-12 text-xs font-bold uppercase tracking-[0.2em] text-rev-orange">
              Teacher Digital Empowerment Program
            </p>
            <h1 className="text-balance mt-3 font-display text-3xl font-extrabold leading-[1.06] text-white md:text-4xl">
              Apply for your Rev Laptop
            </h1>
            <p className="mt-4 max-w-sm text-base leading-7 text-white/58">
              Buy outright or spread the cost over 12, 24, or 36 months — from{" "}
              <strong className="text-white">₦15,000/month</strong>, in partnership with Lotus Bank.
            </p>

            {/* Partner badge */}
            {selectedPartner && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 flex items-center gap-3 rounded-2xl border border-rev-orange/25 bg-rev-orange/10 px-4 py-3"
                initial={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.3 }}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rev-orange/20 text-xs font-bold text-rev-orange">
                  ✓
                </span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-rev-orange">
                    Partner application
                  </p>
                  <p className="text-sm font-bold text-white">{selectedPartner.shortName}</p>
                </div>
              </motion.div>
            )}

            {/* Step sidebar */}
            <div className="mt-10 hidden flex-col gap-3 lg:flex">
              {STEPS.map((s, i) => (
                <div className="flex items-center gap-3" key={s.title}>
                  <span
                    className={clsx(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors",
                      i < step
                        ? "border-rev-orange bg-rev-orange text-white"
                        : i === step
                        ? "border-white bg-white text-maroon"
                        : "border-white/20 text-white/30"
                    )}
                  >
                    {i < step ? <Check className="h-3 w-3" /> : i + 1}
                  </span>
                  <span
                    className={clsx(
                      "text-sm transition-colors",
                      i === step ? "font-bold text-white" : i < step ? "text-white/55" : "text-white/25"
                    )}
                  >
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
                  <motion.div
                    animate={{ width: i <= step ? "100%" : "0%" }}
                    className="h-full bg-rev-orange"
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  />
                </div>
              ))}
            </div>

            <form
              onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }}
              onSubmit={handleSubmit(onSubmit)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  initial={{ opacity: 0, x: 16 }}
                  key={step}
                  transition={{ duration: 0.22 }}
                >
                  {/* Step heading */}
                  <div className="mb-7">
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-rev-orange/70">
                      Step {step + 1} of {STEPS.length}
                    </p>
                    <h2
                      className="mt-1 font-display text-2xl font-bold text-slate-ink"
                      dangerouslySetInnerHTML={{ __html: STEPS[step].title }}
                    />
                    <p className="mt-1 text-sm text-slate-body">{STEPS[step].sub}</p>
                  </div>

                  {/* ── STEP 0: Partnership ── */}
                  {step === 0 && (
                    <div className="space-y-3">
                      {/* Independent */}
                      <label
                        className={clsx(
                          "flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-4 transition",
                          !partnerOrgId
                            ? "border-rev-orange bg-rev-orange/8"
                            : "border-black/10 bg-[#FAF8F6] hover:border-rev-orange/40"
                        )}
                      >
                        <span
                          className={clsx(
                            "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition",
                            !partnerOrgId ? "border-rev-orange bg-rev-orange" : "border-black/25"
                          )}
                        >
                          {!partnerOrgId && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                        </span>
                        <input
                          className="sr-only"
                          onChange={() => setValue("partnerOrgId", "")}
                          type="radio"
                        />
                        <div>
                          <p className="text-sm font-bold text-slate-ink">Applying on my own</p>
                          <p className="mt-0.5 text-xs text-slate-body">
                            As an individual teacher, or a school not listed below.
                          </p>
                        </div>
                      </label>

                      {/* Partner options */}
                      {PARTNER_ORGS.map((org) => (
                        <label
                          className={clsx(
                            "flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-4 transition",
                            partnerOrgId === org.id
                              ? "border-rev-orange bg-rev-orange/8"
                              : "border-black/10 bg-[#FAF8F6] hover:border-rev-orange/40"
                          )}
                          key={org.id}
                        >
                          <span
                            className={clsx(
                              "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition",
                              partnerOrgId === org.id ? "border-rev-orange bg-rev-orange" : "border-black/25"
                            )}
                          >
                            {partnerOrgId === org.id && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                          </span>
                          <input
                            className="sr-only"
                            onChange={() => setValue("partnerOrgId", org.id)}
                            type="radio"
                          />
                          <div>
                            <p className="text-sm font-bold text-slate-ink">{org.name}</p>
                            <p className="mt-0.5 text-xs text-slate-body">
                              I am a member applying through this partner scheme.
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* ── STEP 1: Personal ── */}
                  {step === 1 && (
                    <div className="space-y-5">
                      <Field error={errors.fullName?.message} label="Full Name">
                        <input className={inputCls} placeholder="Your full name" {...register("fullName")} />
                      </Field>
                      <Field
                        error={errors.phone?.message}
                        hint="WhatsApp preferred — we may reach out via WhatsApp."
                        label="Phone Number"
                      >
                        <input className={inputCls} placeholder="+234..." type="tel" {...register("phone")} />
                      </Field>
                      <Field error={errors.email?.message} label="Email Address">
                        <input className={inputCls} placeholder="name@example.com" type="email" {...register("email")} />
                      </Field>
                      <Field error={errors.gender?.message} label="Gender">
                        <Controller
                          control={control}
                          name="gender"
                          render={({ field }) => (
                            <RadioGroup onChange={field.onChange} options={["Male", "Female"]} value={field.value} />
                          )}
                        />
                      </Field>
                    </div>
                  )}

                  {/* ── STEP 2: Employment ── */}
                  {step === 2 && (
                    <div className="space-y-5">
                      <Field error={errors.schoolName?.message} label="Name of School">
                        <input className={inputCls} placeholder="Full school name" {...register("schoolName")} />
                      </Field>
                      <Field error={errors.schoolType?.message} label="School Type">
                        <Controller
                          control={control}
                          name="schoolType"
                          render={({ field }) => (
                            <RadioGroup onChange={field.onChange} options={["Public","Private"]} value={field.value} />
                          )}
                        />
                      </Field>
                      <Field
                        error={errors.position?.message}
                        hint="e.g. Classroom Teacher, Principal, Vice Principal, Administrator"
                        label="Position / Designation"
                      >
                        <input className={inputCls} placeholder="Your role at the school" {...register("position")} />
                      </Field>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field error={errors.state?.message} label="State of Residence">
                          <select className={selectCls} {...register("state")}>
                            <option value="">Select state</option>
                            {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </Field>
                        <Field error={errors.lga?.message} label="LGA">
                          <input className={inputCls} placeholder="Local Government Area" {...register("lga")} />
                        </Field>
                      </div>
                      <Field error={errors.yearsTeaching?.message} label="Years of Teaching Experience">
                        <select className={selectCls} {...register("yearsTeaching")}>
                          <option value="">Select range</option>
                          {["Less than 1 year","1–2 years","3–5 years","6–10 years","11–20 years","Over 20 years"].map(
                            (y) => <option key={y} value={y}>{y}</option>
                          )}
                        </select>
                      </Field>
                    </div>
                  )}

                  {/* ── STEP 3: Financial ── */}
                  {step === 3 && (
                    <div className="space-y-5">
                      <Field error={errors.salaryBand?.message} label="Monthly Net Salary / Income">
                        <Controller
                          control={control}
                          name="salaryBand"
                          render={({ field }) => (
                            <RadioGroup
                              onChange={field.onChange}
                              options={[
                                "Below ₦100,000",
                                "₦100,000 – ₦199,999",
                                "₦200,000 – ₦299,999",
                                "₦300,000 – ₦499,999",
                                "₦500,000 and above",
                              ]}
                              value={field.value}
                            />
                          )}
                        />
                      </Field>
                      <Field error={errors.paymentOption?.message} label="Preferred Payment Option">
                        <Controller
                          control={control}
                          name="paymentOption"
                          render={({ field }) => (
                            <RadioGroup
                              onChange={field.onChange}
                              options={["Buy Outright (Discounted)","12 Months","24 Months","36 Months"]}
                              value={field.value}
                            />
                          )}
                        />
                      </Field>
                      <Field error={errors.monthlyBudget?.message} label="Preferred Monthly Budget" optional>
                        <input
                          className={inputCls}
                          placeholder="e.g. ₦20,000"
                          {...register("monthlyBudget")}
                        />
                      </Field>
                    </div>
                  )}

                  {/* ── STEP 4: Verification + Consent ── */}
                  {step === 4 && (
                    <div className="space-y-5">
                      <Field error={errors.ownsLaptop?.message} label="Do you currently own a laptop?">
                        <Controller
                          control={control}
                          name="ownsLaptop"
                          render={({ field }) => (
                            <RadioGroup onChange={field.onChange} options={["Yes","No"]} value={field.value} />
                          )}
                        />
                      </Field>
                      <Field
                        error={errors.whyLaptop?.message}
                        hint="Short response — how will you use the laptop for your teaching?"
                        label="Why do you need a laptop?"
                      >
                        <textarea
                          className={textareaCls}
                          placeholder="Briefly describe how you'll use it..."
                          {...register("whyLaptop")}
                        />
                      </Field>
                      <Field
                        error={errors.kycConsent?.message}
                        hint="Valid ID, proof of employment, payslip, or other documents may be required if selected."
                        label="Will you provide KYC documents if selected?"
                      >
                        <Controller
                          control={control}
                          name="kycConsent"
                          render={({ field }) => (
                            <RadioGroup onChange={field.onChange} options={["Yes","No"]} value={field.value} />
                          )}
                        />
                      </Field>

                      {/* Declaration checkbox */}
                      <div className="rounded-xl border border-black/10 bg-[#FAF8F6] p-4">
                        <Controller
                          control={control}
                          name="declaration"
                          render={({ field }) => (
                            <label className="flex cursor-pointer items-start gap-3">
                              <button
                                className={clsx(
                                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition",
                                  field.value
                                    ? "border-rev-orange bg-rev-orange"
                                    : "border-black/25 bg-white"
                                )}
                                onClick={() => field.onChange(field.value ? undefined : true)}
                                type="button"
                              >
                                {field.value && <Check className="h-3 w-3 text-white" />}
                              </button>
                              <p className="text-xs leading-5 text-slate-body">
                                I confirm that the information I have provided is accurate and complete. I understand
                                that submitting this form does not guarantee approval. If selected, I may be contacted
                                by the Revrica team or a banking partner for further verification before financing is
                                approved.
                              </p>
                            </label>
                          )}
                        />
                        {errors.declaration && (
                          <p className="mt-2 text-sm font-bold text-rev-orange">
                            {errors.declaration.message}
                          </p>
                        )}
                      </div>

                      {submitError && (
                        <div className="rounded-xl border border-rev-orange/25 bg-rev-orange/5 px-4 py-3 text-sm font-semibold text-rev-orangeDeep">
                          {submitError}
                        </div>
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
                  onClick={() => setStep((s) => Math.max(s - 1, 0))}
                  type="button"
                >
                  Back
                </button>
                {step < STEPS.length - 1 ? (
                  <Button onClick={nextStep} type="button">
                    Continue <ArrowRight className="h-4 w-4" />
                  </Button>
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
