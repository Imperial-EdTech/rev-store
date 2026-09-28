"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { clsx } from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ClipboardCheck,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui";
import {
  allQuestions,
  auditSections,
  type AuditOption
} from "@/lib/audit-data";
import { roles } from "@/lib/data";
import { techAuditRequestSchema } from "@/lib/tech-audits/schema";
import { StorefrontHeader } from "@/components/StorefrontHeader";
import { StorefrontFooter } from "@/components/StorefrontFooter";

// ─── Schema ────────────────────────────────────────────────────────────────────
// Shared with POST /api/tech-audit: src/lib/tech-audits/schema.ts. Answers are
// keyed by question number; unanswered questions are simply left out of scoring.
const schema = techAuditRequestSchema;

type FormInput = z.input<typeof schema>;
type FormValues = z.output<typeof schema>;

const TOTAL_STEPS = allQuestions.length + 1; // 20 questions + contact step
const CONTACT_STEP = allQuestions.length; // 0-indexed

const lightInputClass =
  "focus-ring h-12 w-full rounded-xl border border-black/12 bg-white px-4 text-sm text-slate-ink placeholder:text-slate-body/50";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getSectionForStep(step: number) {
  if (step >= allQuestions.length) return null;
  const question = allQuestions[step];
  return auditSections.find((s) =>
    s.questions.some((q) => q.number === question.number)
  ) ?? null;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

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
    defaultValues: { role: "School Owner", answers: {} }
  });

  const answers = watch("answers") ?? {};
  const [submitError, setSubmitError] = useState<string | null>(null);

  function toggleOption(questionNumber: number, letter: AuditOption["letter"]) {
    const key = String(questionNumber);
    const current = (answers[key] ?? []) as AuditOption["letter"][];
    const next = current.includes(letter)
      ? current.filter((l) => l !== letter)
      : [...current, letter];
    (setValue as (path: string, value: unknown) => void)(`answers.${key}`, next);
  }

  function goNext() {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onSubmit(values: FormValues) {
    if (step !== CONTACT_STEP) return;
    setSubmitError(null);
    try {
      const res = await fetch("/api/tech-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setSubmitError(body?.error ?? "Something went wrong. Please try again.");
        return;
      }
      router.push("/tech-audit/success");
    } catch {
      setSubmitError("Could not reach the server. Check your connection and try again.");
    }
  }

  if (!started) return <TechAuditLanding onStart={() => setStarted(true)} />;

  const isContactStep = step === CONTACT_STEP;
  const currentQuestion = isContactStep ? null : allQuestions[step];
  const currentSection = getSectionForStep(step);
  const selectedLetters = currentQuestion
    ? ((answers[String(currentQuestion.number)] ?? []) as AuditOption["letter"][])
    : [];

  // How many questions answered so far (at least one option selected)
  const answeredCount = allQuestions.filter(
    (q) => ((answers[String(q.number)] ?? []) as string[]).length > 0
  ).length;

  return (
    <>
      <StorefrontHeader />
      <main className="maroon-glow relative min-h-screen py-12">
        <div className="noise-overlay" />
        <div className="container-x relative z-10 grid gap-8 lg:grid-cols-[0.8fr_1.1fr]">

          {/* ── Sidebar ── */}
          <aside className="pt-8">
            <button
              className="focus-ring inline-flex items-center text-sm font-bold text-white/60 hover:text-rev-orange"
              onClick={() => setStarted(false)}
              type="button"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </button>
            <p className="mt-12 text-xs font-bold uppercase tracking-[0.2em] text-rev-orange">
              Free Tech Audit
            </p>
            <h1 className="text-balance mt-4 font-display text-4xl font-extrabold leading-[1.05] text-white md:text-5xl">
              Let's see what your school is working with
            </h1>
            <p className="mt-6 max-w-md text-lg leading-8 text-white/65">
              Tick all options that apply — there are no wrong answers. Your
              selections help our team understand where to focus the audit.
            </p>

            {/* Section progress list */}
            <div className="mt-10 hidden flex-col gap-3 lg:flex">
              {auditSections.map((section) => {
                const sectionSteps = section.questions.map((q) =>
                  allQuestions.findIndex((aq) => aq.number === q.number)
                );
                const isActive = !isContactStep && sectionSteps.includes(step);
                const isDone = !isContactStep
                  ? step > Math.max(...sectionSteps)
                  : true;
                const sectionAnswered = section.questions.filter(
                  (q) => ((answers[String(q.number)] ?? []) as string[]).length > 0
                ).length;

                return (
                  <div
                    key={section.id}
                    className={clsx(
                      "flex items-center gap-3 rounded-xl border px-4 py-3 transition",
                      isActive
                        ? "border-rev-orange bg-rev-orange/10"
                        : "border-white/10 bg-white/[0.03]"
                    )}
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
                      <p
                        className={clsx(
                          "truncate text-sm font-bold",
                          isActive ? "text-white" : "text-white/60"
                        )}
                      >
                        {section.title}
                      </p>
                      <p className="text-xs text-white/40">
                        {sectionAnswered} of {section.questions.length} answered
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Contact step indicator */}
              <div
                className={clsx(
                  "flex items-center gap-3 rounded-xl border px-4 py-3 transition",
                  isContactStep
                    ? "border-rev-orange bg-rev-orange/10"
                    : "border-white/10 bg-white/[0.03]"
                )}
              >
                <span
                  className={clsx(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
                    isContactStep
                      ? "border-rev-orange text-rev-orange"
                      : "border-white/20 text-white/40"
                  )}
                >
                  ✉
                </span>
                <p
                  className={clsx(
                    "text-sm font-bold",
                    isContactStep ? "text-white" : "text-white/60"
                  )}
                >
                  Your Details
                </p>
              </div>
            </div>

            {/* Answered counter */}
            <p className="mt-6 text-sm text-white/40">
              {answeredCount} of {allQuestions.length} questions answered
            </p>
          </aside>

          {/* ── Form card ── */}
          <div className="rounded-3xl border border-black/8 bg-white p-6 shadow-xl md:p-8">
            {/* Progress bar */}
            <div className="mb-6 flex items-center justify-between text-xs font-bold uppercase tracking-[0.1em] text-slate-body/60">
              <span>
                {isContactStep
                  ? "Your Details"
                  : `Section ${currentSection?.letter} · Question ${currentQuestion?.number} of ${allQuestions.length}`}
              </span>
              <span>{Math.round(((step + 1) / TOTAL_STEPS) * 100)}%</span>
            </div>
            <div className="mb-8 h-1.5 overflow-hidden rounded-full bg-black/8">
              <motion.div
                animate={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
                className="h-full bg-rev-orange"
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>

            <form
              onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }}
              onSubmit={handleSubmit(onSubmit)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  initial={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* ── Question step ── */}
                  {!isContactStep && currentQuestion && currentSection ? (
                    <div className="space-y-5">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-rev-orange">
                          Section {currentSection.letter} · {currentSection.title}
                        </p>
                        <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-slate-body/50">
                          {currentQuestion.focus}
                        </p>
                        <h2 className="mt-2 font-display text-2xl font-bold text-slate-ink md:text-3xl">
                          {currentQuestion.number}. {currentQuestion.title}
                        </h2>
                      </div>
                      <p className="text-sm leading-6 text-slate-body">
                        {currentQuestion.instruction}
                      </p>
                      <div className="grid gap-3">
                        {currentQuestion.options.map((option) => {
                          const checked = selectedLetters.includes(option.letter);
                          return (
                            <label
                              key={option.letter}
                              className={clsx(
                                "flex min-h-14 cursor-pointer items-start gap-3 rounded-xl border p-4 text-sm font-medium leading-snug transition",
                                checked
                                  ? "border-rev-orange bg-rev-orange/10 text-slate-ink"
                                  : "border-black/10 bg-[#FAF8F6] text-slate-body active:border-rev-orange/40"
                              )}
                            >
                              <span
                                className={clsx(
                                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition",
                                  checked
                                    ? "border-rev-orange bg-rev-orange"
                                    : "border-black/20 bg-transparent"
                                )}
                              >
                                {checked ? (
                                  <Check className="h-3.5 w-3.5 text-white" />
                                ) : null}
                              </span>
                              <input
                                checked={checked}
                                className="sr-only"
                                onChange={() =>
                                  toggleOption(currentQuestion.number, option.letter)
                                }
                                type="checkbox"
                              />
                              <span>{option.text}</span>
                            </label>
                          );
                        })}
                      </div>
                      <p className="text-xs text-slate-body/50">
                        Tick all that apply. You may leave this question blank and continue.
                      </p>
                    </div>
                  ) : null}

                  {/* ── Contact step ── */}
                  {isContactStep ? (
                    <div className="space-y-5">
                      <div>
                        <h2 className="font-display text-2xl font-bold text-slate-ink md:text-3xl">
                          Where should we send your results?
                        </h2>
                        <p className="mt-2 text-slate-body">
                          We'll review your responses and reach out to schedule your free audit.
                        </p>
                      </div>
                      <Field error={errors.schoolName?.message} label="School / Organisation">
                        <input
                          className={lightInputClass}
                          placeholder="e.g. Greenfield International School"
                          {...register("schoolName")}
                        />
                      </Field>
                      <Field error={errors.contactName?.message} label="Your Full Name">
                        <input
                          className={lightInputClass}
                          placeholder="Enter full name"
                          {...register("contactName")}
                        />
                      </Field>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <Field error={errors.email?.message} label="Email Address">
                          <input
                            className={lightInputClass}
                            placeholder="name@example.com"
                            type="email"
                            {...register("email")}
                          />
                        </Field>
                        <Field error={errors.phone?.message} label="Phone Number">
                          <input
                            className={lightInputClass}
                            placeholder="+234..."
                            {...register("phone")}
                          />
                        </Field>
                      </div>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <Field error={errors.role?.message} label="Your Role">
                          <select className={lightInputClass} {...register("role")}>
                            {roles.map((r) => (
                              <option key={r} value={r}>{r}</option>
                            ))}
                          </select>
                        </Field>
                        <Field label="Roughly How Many Devices?">
                          <input
                            className={lightInputClass}
                            placeholder="e.g. 30, or 'not sure'"
                            {...register("deviceEstimate")}
                          />
                        </Field>
                      </div>
                      <Field label="Anything Else We Should Know? (Optional)">
                        <textarea
                          className="focus-ring min-h-24 w-full rounded-xl border border-black/12 bg-white px-4 py-3 text-sm text-slate-ink placeholder:text-slate-body/50"
                          placeholder="Tell us anything useful about your setup."
                          {...register("notes")}
                        />
                      </Field>
                      <p className="text-xs leading-5 text-slate-body/60">
                        Requesting an audit doesn't commit your school to any product or programme.
                        The audit itself is completely free.
                      </p>
                      {submitError ? (
                        <p className="rounded-xl border border-rev-orange/25 bg-rev-orange/5 px-4 py-3 text-sm font-semibold text-rev-orangeDeep">
                          {submitError}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="mt-8 flex items-center justify-between gap-3">
                <button
                  className="focus-ring h-12 rounded-full border border-black/12 px-5 text-sm font-bold text-slate-body transition hover:border-black/25 disabled:opacity-30"
                  disabled={step === 0}
                  onClick={goBack}
                  type="button"
                >
                  Back
                </button>
                {step < CONTACT_STEP ? (
                  <Button
                    onClick={(e) => { e.preventDefault(); goNext(); }}
                    type="button"
                  >
                    Continue <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button disabled={isSubmitting} type="submit">
                    {isSubmitting ? "Submitting…" : "Request My Free Audit"}
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

// ─── Landing page ─────────────────────────────────────────────────────────────

function TechAuditLanding({ onStart }: { onStart: () => void }) {
  return (
    <>
      <StorefrontHeader />
      <main className="maroon-glow relative min-h-screen">
        <div className="noise-overlay" />
        <section className="container-x relative z-10 grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-rev-orange">
                Free Tech Audit
              </p>
              <h1 className="text-balance mt-6 font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-white md:text-[3.4rem]">
                Find out exactly what your school needs.
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-8 text-white/65">
                Answer 20 questions on your classrooms, teachers, infrastructure, and strategy.
                Our team will review your answers and tell you precisely what to prioritise —
                and how Revrica can help.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <Button onClick={onStart}>
                  Start the Assessment <ArrowRight className="h-4 w-4" />
                </Button>
                <Link href="/early-access">
                  <Button variant="ghost">Join the Waitlist Instead</Button>
                </Link>
              </div>
              <p className="mt-5 text-sm text-white/45">
                Takes 5–8 minutes. No cost, no obligation.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <AuditIllustration />
          </Reveal>
        </section>

        <section className="ink-band relative py-16">
          <div className="noise-overlay-dark" />
          <div className="container-x relative z-10 grid gap-5 sm:grid-cols-3">
            {[
              {
                icon: ClipboardCheck,
                title: "4 Sections, 20 Questions",
                body: "Students, teachers, infrastructure, and strategy — tick all that apply per question."
              },
              {
                icon: ShieldCheck,
                title: "A Real Audit Follows",
                body: "Our team reviews your answers and schedules a full on-site or remote audit."
              },
              {
                icon: Sparkles,
                title: "No Cost, No Catch",
                body: "The audit is completely free. What you do with the recommendations is up to you."
              }
            ].map((item, i) => (
              <Reveal delay={i * 0.08} key={item.title}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                  <item.icon className="h-8 w-8 text-rev-orange" />
                  <p className="mt-5 font-display text-lg font-bold text-white">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/55">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </main>
      <StorefrontFooter />
    </>
  );
}

function AuditIllustration() {
  const sections = [
    { letter: "A", label: "How Students Learn", q: 5 },
    { letter: "B", label: "Supporting Teachers", q: 5 },
    { letter: "C", label: "School Infrastructure", q: 5 },
    { letter: "D", label: "Where You Want To Go", q: 5 }
  ];
  return (
    <div className="mx-auto w-full max-w-sm rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 shadow-2xl backdrop-blur">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-rev-peach">
          Audit Assessment
        </p>
        <span className="rounded-full bg-rev-orange/15 px-3 py-1 text-xs font-bold text-rev-orange">
          20 questions
        </span>
      </div>
      <div className="mt-6 space-y-3">
        {sections.map((s, i) => (
          <motion.div
            key={s.letter}
            animate={{ opacity: [0.5, 1, 1] }}
            className="flex items-center gap-3"
            initial={{ opacity: 0.5 }}
            transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.5, repeatDelay: 2 }}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-rev-orange/15 text-xs font-bold text-rev-orange">
              {s.letter}
            </span>
            <div className="flex-1">
              <p className="text-xs font-bold text-white">{s.label}</p>
              <p className="text-[10px] text-white/40">{s.q} questions</p>
            </div>
            <motion.span
              animate={{ backgroundColor: ["rgba(255,255,255,0.06)", "#FF6B1A", "#FF6B1A"] }}
              className="flex h-5 w-5 items-center justify-center rounded-md border border-white/15"
              transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.5, repeatDelay: 2 }}
            >
              <Check className="h-3 w-3 text-white" />
            </motion.span>
          </motion.div>
        ))}
      </div>
      <div className="mt-7 border-t border-white/10 pt-5">
        <p className="text-sm leading-6 text-white/55">
          Every answer helps our team understand where your school stands and what to fix first.
        </p>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Field({
  label,
  error,
  children
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold uppercase tracking-[0.08em] text-slate-body/80">
        {label}
      </span>
      {children}
      {error ? (
        <span className="mt-2 block text-sm font-bold text-rev-orange">{error}</span>
      ) : null}
    </label>
  );
}