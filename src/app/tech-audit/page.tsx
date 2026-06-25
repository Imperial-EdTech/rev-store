"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { clsx } from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, ClipboardCheck, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Reveal } from "@/components/reveal";
import { SiteFooter, SiteHeader } from "@/components/shell";
import { Button } from "@/components/ui";
import { allPrompts, auditSections, type AuditOption } from "@/lib/audit-data";
import { roles } from "@/lib/data";

const letterSchema = z.enum(["A", "B", "C", "D", "E"]);

const schema = z.object({
  schoolName: z.string().min(2, "Enter your school or organization name"),
  contactName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone number"),
  role: z.enum(roles),
  deviceEstimate: z.string().optional(),
  answers: z.record(z.string(), z.array(letterSchema)),
  notes: z.string().optional()
});

type FormInput = z.input<typeof schema>;
type FormValues = z.output<typeof schema>;

// Step 0..39: one prompt each. Final step: contact details.
const totalSteps = allPrompts.length + 1;

const lightInputClass =
  "focus-ring h-12 w-full rounded-xl border border-black/12 bg-white px-4 text-sm text-slate-ink placeholder:text-slate-body/50";

/** Which section + numbered item a given prompt step belongs to, for the sidebar/progress context. */
function getPromptContext(step: number) {
  const prompt = allPrompts[step];
  if (!prompt) return null;
  for (const section of auditSections) {
    for (const item of section.items) {
      const promptIndex = item.prompts.findIndex((p) => p.id === prompt.id);
      if (promptIndex !== -1) {
        return { section, item, prompt, promptIndexInItem: promptIndex };
      }
    }
  }
  return null;
}

export default function TechAuditPage() {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<FormInput, unknown, FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: "Teacher", answers: {} }
  });
  const answers = watch("answers") ?? {};
  const [submitError, setSubmitError] = useState<string | null>(null);

  function toggleOption(promptId: string, letter: AuditOption["letter"]) {
    const current = answers[promptId] ?? [];
    const next = current.includes(letter) ? current.filter((value) => value !== letter) : [...current, letter];
    // react-hook-form can't infer a literal path type for dynamic keys
    // coming from a z.record() schema, so this dotted path is cast —
    // same pattern as the existing any-casts in components/ui.tsx.
    (setValue as (path: string, value: unknown, options?: Record<string, unknown>) => void)(
      `answers.${promptId}`,
      next,
      { shouldValidate: false }
    );
  }

  function goNext() {
    setStep((value) => Math.min(value + 1, totalSteps - 1));
  }

  function goBack() {
    setStep((value) => Math.max(value - 1, 0));
  }

  async function onSubmit(values: FormValues) {
    if (step !== totalSteps - 1) return;

    setSubmitError(null);
    try {
      const response = await fetch("/api/tech-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schoolName: values.schoolName,
          contactName: values.contactName,
          email: values.email,
          phone: values.phone,
          role: values.role,
          deviceEstimate: values.deviceEstimate ?? null,
          answers: values.answers,
          notes: values.notes ?? null
        })
      });

      if (!response.ok) {
        const responseBody = await response.json().catch(() => null);
        setSubmitError(responseBody?.error ?? "Something went wrong. Please try again.");
        return;
      }

      router.push("/tech-audit/success");
    } catch {
      setSubmitError("Could not reach the server. Check your connection and try again.");
    }
  }

  if (!started) {
    return <TechAuditLanding onStart={() => setStarted(true)} />;
  }

  const isContactStep = step === totalSteps - 1;
  const context = isContactStep ? null : getPromptContext(step);

  return (
    <>
      <SiteHeader />
      <main className="maroon-glow relative min-h-screen py-12">
        <div className="noise-overlay" />
        <div className="container-x relative z-10 grid gap-8 lg:grid-cols-[0.8fr_1.1fr]">
          <aside className="pt-8">
            <button
              className="focus-ring inline-flex items-center text-sm font-bold text-white/60 hover:text-rev-orange"
              onClick={() => setStarted(false)}
              type="button"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </button>
            <p className="mt-12 text-xs font-bold uppercase tracking-[0.2em] text-rev-orange">Free Tech Audit</p>
            <h1 className="text-balance mt-4 font-display text-4xl font-extrabold leading-[1.05] text-white md:text-5xl">
              Let&apos;s see what your school is working with
            </h1>
            <p className="mt-6 max-w-md text-lg leading-8 text-white/65">
              Pick whatever applies — you can select more than one option per question. There&apos;s no wrong
              answer; this just tells our team where to focus the audit.
            </p>
            <div className="mt-10 hidden flex-col gap-3 lg:flex">
              {auditSections.map((section) => {
                const sectionPromptIds = section.items.flatMap((item) => item.prompts.map((p) => p.id));
                const sectionStepIndices = sectionPromptIds.map((id) => allPrompts.findIndex((p) => p.id === id));
                const isActive = !isContactStep && sectionStepIndices.includes(step);
                const isDone = !isContactStep ? step > Math.max(...sectionStepIndices) : true;
                const answeredInSection = sectionPromptIds.filter((id) => (answers[id] ?? []).length > 0).length;
                return (
                  <div
                    className={clsx(
                      "flex items-center gap-3 rounded-xl border px-4 py-3 transition",
                      isActive ? "border-rev-orange bg-rev-orange/10" : "border-white/10 bg-white/[0.03]"
                    )}
                    key={section.id}
                  >
                    <span
                      className={clsx(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
                        isDone
                          ? "border-rev-orange bg-rev-orange text-white"
                          : isActive
                            ? "border-rev-orange text-rev-orange"
                            : "border-white/20 text-white/40"
                      )}
                    >
                      {isDone ? <Check className="h-3.5 w-3.5" /> : section.letter}
                    </span>
                    <div className="min-w-0">
                      <p className={clsx("truncate text-sm font-bold", isActive ? "text-white" : "text-white/60")}>
                        {section.title}
                      </p>
                      <p className="text-xs text-white/40">
                        {answeredInSection} of {sectionPromptIds.length} answered
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>

          <div className="rounded-3xl border border-black/8 bg-white p-6 shadow-xl md:p-8">
            <div className="mb-6 flex items-center justify-between text-xs font-bold uppercase tracking-[0.1em] text-slate-body/60">
              <span>
                Question {Math.min(step + 1, totalSteps - 1)} of {allPrompts.length}
              </span>
              <span>{Math.round(((step + 1) / totalSteps) * 100)}%</span>
            </div>
            <div className="mb-8 h-1.5 overflow-hidden rounded-full bg-black/8">
              <motion.div
                animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
                className="h-full bg-rev-orange"
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>

            <form
              onKeyDown={(event) => {
                if (event.key === "Enter") event.preventDefault();
              }}
              onSubmit={handleSubmit(onSubmit)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  initial={{ opacity: 0, x: 16 }}
                  key={step}
                  transition={{ duration: 0.25 }}
                >
                  {!isContactStep && context ? (
                    <div className="space-y-5">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-rev-orange">
                          Section {context.section.letter} · {context.section.title}
                        </p>
                        <h2 className="mt-2 font-display text-2xl font-bold text-slate-ink md:text-3xl">
                          {context.item.number}. {context.item.title}
                        </h2>
                      </div>
                      <p className="text-sm font-bold text-slate-body/80">{context.prompt.label}</p>
                      <div className="grid gap-3">
                        {context.prompt.options.map((option) => {
                          const checked = (answers[context.prompt.id] ?? []).includes(option.letter);
                          return (
                            <label
                              className={clsx(
                                "flex min-h-16 cursor-pointer items-start gap-3 rounded-xl border p-4 text-sm font-bold leading-snug transition",
                                checked
                                  ? "border-rev-orange bg-rev-orange/10 text-slate-ink"
                                  : "border-black/10 bg-[#FAF8F6] text-slate-body active:border-rev-orange/50"
                              )}
                              key={option.letter}
                            >
                              <span
                                className={clsx(
                                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition",
                                  checked ? "border-rev-orange bg-rev-orange" : "border-black/20 bg-transparent"
                                )}
                              >
                                {checked ? <Check className="h-3.5 w-3.5 text-white" /> : null}
                              </span>
                              <input
                                checked={checked}
                                className="sr-only"
                                onChange={() => toggleOption(context.prompt.id, option.letter)}
                                type="checkbox"
                              />
                              <span>{option.text}</span>
                            </label>
                          );
                        })}
                      </div>
                      <p className="text-sm text-slate-body/70">Select all that apply.</p>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <div>
                        <h2 className="font-display text-2xl font-bold text-slate-ink md:text-3xl">
                          Where should we send your results?
                        </h2>
                        <p className="mt-2 text-slate-body">
                          We&apos;ll use this to schedule your free audit and share what we find.
                        </p>
                      </div>
                      <Field error={errors.schoolName?.message} label="School / Organization">
                        <input className={lightInputClass} placeholder="e.g. Greenfield International School" {...register("schoolName")} />
                      </Field>
                      <Field error={errors.contactName?.message} label="Your Full Name">
                        <input className={lightInputClass} placeholder="Enter full name" {...register("contactName")} />
                      </Field>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <Field error={errors.email?.message} label="Email Address">
                          <input className={lightInputClass} placeholder="name@example.com" type="email" {...register("email")} />
                        </Field>
                        <Field error={errors.phone?.message} label="Phone Number">
                          <input className={lightInputClass} placeholder="+234..." {...register("phone")} />
                        </Field>
                      </div>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <Field error={errors.role?.message} label="Your Role">
                          <select className={lightInputClass} {...register("role")}>
                            {roles.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                        </Field>
                        <Field label="Roughly How Many Devices?">
                          <input className={lightInputClass} placeholder="e.g. 30, or 'not sure'" {...register("deviceEstimate")} />
                        </Field>
                      </div>
                      <Field error={errors.notes?.message} label="Anything Else We Should Know? (Optional)">
                        <textarea
                          className="focus-ring min-h-24 w-full rounded-xl border border-black/12 bg-white px-4 py-3 text-sm text-slate-ink placeholder:text-slate-body/50"
                          placeholder="Tell us anything useful about your setup."
                          {...register("notes")}
                        />
                      </Field>
                      <p className="text-xs leading-5 text-slate-body/70">
                        Requesting an audit doesn&apos;t commit your school to financing or any program. The audit
                        itself is free.
                      </p>
                      {submitError ? (
                        <p className="rounded-xl border border-rev-orange/25 bg-rev-orange/5 px-4 py-3 text-sm font-semibold text-rev-orangeDeep">
                          {submitError}
                        </p>
                      ) : null}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="mt-8 flex items-center justify-between gap-3">
                <button
                  className="focus-ring h-12 rounded-full border border-black/12 px-5 text-sm font-bold text-slate-body transition hover:border-black/25 disabled:opacity-30"
                  disabled={step === 0}
                  onClick={goBack}
                  type="button"
                >
                  Back
                </button>
                {step < totalSteps - 1 ? (
                  <Button
                    onClick={(event) => {
                      event.preventDefault();
                      goNext();
                    }}
                    type="button"
                  >
                    Continue <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button disabled={isSubmitting} type="submit">
                    {isSubmitting ? "Submitting..." : "Request My Free Audit"}
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

function TechAuditLanding({ onStart }: { onStart: () => void }) {
  return (
    <>
      <SiteHeader />
      <main className="maroon-glow relative min-h-screen">
        <div className="noise-overlay" />
        <section className="container-x relative z-10 grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Reveal>
              <h1 className="text-balance mt-6 font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-white md:text-[3.4rem]">
                Find out what your school really needs.
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-8 text-white/65">
                A free tech audit from Revrica. Answer
                questions on engagement, teaching, infrastructure, and strategy — our team will tell you
                exactly what&apos;s working, what isn&apos;t, and what to fix first.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <Button onClick={onStart}>
                  Start the Assessment <ArrowRight className="h-4 w-4" />
                </Button>
                <Link href="/early-access">
                  <Button variant="ghost">Join the Waitlist Instead</Button>
                </Link>
              </div>
              <p className="mt-5 text-sm text-white/45">Takes about 8–10 minutes. No cost, no obligation.</p>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <AuditClipboardArt />
          </Reveal>
        </section>

        <section className="ink-band relative py-16">
          <div className="noise-overlay-dark" />
          <div className="container-x relative z-10 grid gap-5 sm:grid-cols-3">
            {[
              { icon: ClipboardCheck, title: "4 Sections, 20 Questions", body: "Engagement, teaching, infrastructure, and strategy — pick all that apply." },
              { icon: ShieldCheck, title: "A Real Audit Follows", body: "Our team reviews your answers and schedules a proper on-site or remote audit." },
              { icon: Sparkles, title: "No Cost, No Catch", body: "The audit is free. What you do with the results is entirely up to you." }
            ].map((item, index) => (
              <Reveal delay={index * 0.08} key={item.title}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                  <item.icon className="h-8 w-8 text-rev-orange" />
                  <p className="mt-5 font-display text-lg font-bold text-white">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-white/55">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function AuditClipboardArt() {
  const rows = [62, 88, 45, 74, 55];
  return (
    <div className="mx-auto w-full max-w-sm rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 shadow-2xl backdrop-blur">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-rev-peach">Audit Assessment</p>
        <span className="rounded-full bg-rev-orange/15 px-3 py-1 text-xs font-bold text-rev-orange">20 questions</span>
      </div>
      <div className="mt-6 space-y-3">
        {rows.map((width, index) => (
          <motion.div
            animate={{ opacity: [0.5, 1, 1] }}
            className="flex items-center gap-3"
            initial={{ opacity: 0.5 }}
            key={index}
            transition={{ duration: 2.4, repeat: Infinity, delay: index * 0.5, repeatDelay: 2 }}
          >
            <motion.span
              animate={{ backgroundColor: ["rgba(255,255,255,0.06)", "#FF6B1A", "#FF6B1A"] }}
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-white/15"
              transition={{ duration: 2.4, repeat: Infinity, delay: index * 0.5, repeatDelay: 2 }}
            >
              <Check className="h-3 w-3 text-white" />
            </motion.span>
            <span className="h-2.5 flex-1 rounded-full bg-white/10" style={{ maxWidth: `${width}%` }} />
          </motion.div>
        ))}
      </div>
      <div className="mt-7 border-t border-white/10 pt-5">
        <p className="text-sm leading-6 text-white/55">
          Every answer helps our team understand where your school stands today, from foundation to excellence.
        </p>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold uppercase tracking-[0.08em] text-slate-body/80">{label}</span>
      {children}
      {error ? <span className="mt-2 block text-sm font-bold text-rev-orange">{error}</span> : null}
    </label>
  );
}
