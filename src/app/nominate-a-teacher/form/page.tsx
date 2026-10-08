"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { clsx } from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Award, BadgeCheck, Heart, PartyPopper, Share2 } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { forwardRef, type InputHTMLAttributes, useState } from "react";
import { type UseFormRegister, useForm } from "react-hook-form";
import type { z } from "zod";
import { Button } from "@/components/ui";
import { StorefrontFooter } from "@/components/StorefrontFooter";
import { StorefrontHeader } from "@/components/StorefrontHeader";
import { NIGERIAN_STATES } from "@/lib/nigeria";
import { PRIVACY } from "@/lib/privacy";
import { CAMPAIGN, NOMINATOR_ROLES, nominationRequestSchema } from "@/lib/nominations/schema";

// Shared with POST /api/nominations: src/lib/nominations/schema.ts
const schema = nominationRequestSchema;
type FormInput = z.input<typeof schema>;
type FormValues = z.output<typeof schema>;

const stepFields: Array<Array<keyof FormInput>> = [
  ["nominatorName", "nominatorPhone", "nominatorRole"],
  ["teacherName", "teacherPhone", "teacherSubject", "schoolName", "schoolState", "reason", "privacyAccepted", "ageConfirmed", "marketingOptIn"],
];

const lightInput =
  "focus-ring h-12 w-full rounded-xl border border-black/12 bg-white px-4 text-sm text-slate-ink placeholder:text-slate-body/50";

/** "My Teacher, My Hero" nomination form. The campaign page is /nominate-a-teacher. */
export default function NominationFormPage() {
  return (
    <>
      <StorefrontHeader />
      <main className="maroon-glow relative min-h-screen py-12 md:py-16">
        <div className="noise-overlay" />
        <div className="container-x relative z-10 grid gap-10 lg:grid-cols-[0.8fr_1.1fr] lg:gap-14">
          <aside className="lg:pt-4">
            <Link className="inline-flex items-center text-sm font-bold text-white/60 hover:text-rev-orange" href="/nominate-a-teacher">
              <ArrowLeft className="mr-2 h-4 w-4" /> {CAMPAIGN.name}
            </Link>
            <p className="mt-10 text-xs font-bold uppercase tracking-[0.2em] text-rev-orange">Nominate a teacher</p>
            <h1 className="text-balance mt-4 font-display text-4xl font-extrabold leading-[1.05] text-white md:text-5xl">
              Who&apos;s the teacher you&apos;ll never forget?
            </h1>
            <p className="mt-6 max-w-md text-lg leading-8 text-white/65">
              Tell us about them. Verified nominees are spotlighted, the public votes, and one teacher wins {CAMPAIGN.prize}.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-white/70">
              {["Takes about 2 minutes", "Nominate as many teachers as you like", "Phone numbers are never published"].map((t) => (
                <li className="flex items-center gap-3" key={t}>
                  <BadgeCheck className="h-5 w-5 shrink-0 text-rev-orange" /> {t}
                </li>
              ))}
            </ul>
            <div className="mt-10 hidden items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.05] p-4 lg:flex">
              <img alt="" className="h-16 w-auto" src="/devices/rev_orion_laptop.png" />
              <span>
                <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-rev-peach">
                  <Award className="h-3.5 w-3.5" /> The prize
                </span>
                <span className="mt-0.5 block font-display text-base font-bold text-white">A brand-new Rev laptop</span>
              </span>
            </div>
          </aside>
          <NominationForm />
        </div>
      </main>
      <StorefrontFooter />
    </>
  );
}

function NominationForm() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState<{ ref: string; teacher: string } | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register, handleSubmit, trigger, reset, watch,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, unknown, FormValues>({ resolver: zodResolver(schema), mode: "onTouched" });
  const reasonLength = (watch("reason") ?? "").trim().length;

  async function nextStep(event?: React.MouseEvent) {
    event?.preventDefault();
    if (await trigger(stepFields[0])) setStep(1);
  }

  async function onSubmit(values: FormValues) {
    if (step !== 1) return;
    setSubmitError(null);
    try {
      const response = await fetch("/api/nominations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) {
        setSubmitError(body?.error ?? "Something went wrong. Please try again.");
        return;
      }
      setSubmitted({ ref: body.ref, teacher: values.teacherName });
    } catch {
      setSubmitError("Could not reach the server. Check your connection and try again.");
    }
  }

  /** Keeps the nominator's details so nominating a second teacher is quick. */
  function nominateAnother() {
    const { nominatorName, nominatorPhone, nominatorRole } = watch();
    reset({ nominatorName, nominatorPhone, nominatorRole });
    setSubmitted(null);
    setStep(1);
  }

  if (submitted) return <ThankYou onAnother={nominateAnother} refCode={submitted.ref} teacher={submitted.teacher} />;

  return (
    <div className="rounded-3xl border border-black/8 bg-white p-6 shadow-xl [color-scheme:light] md:p-8">
      <div className="mb-8 flex gap-2">
        {[0, 1].map((i) => (
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-black/8" key={i}>
            <motion.div
              animate={{ width: i <= step ? "100%" : "0%" }}
              initial={false}
              className="h-full bg-rev-orange"
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        ))}
      </div>
      <form
        noValidate
        onKeyDown={(e) => {
          // Enter in a text field must not submit; only the Submit button does.
          if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA") e.preventDefault();
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
            {step === 0 ? (
              <div className="space-y-5">
                <StepTitle text="So we can thank you, and reach you if your teacher is shortlisted." title="First, about you" />
                <Field error={errors.nominatorName?.message} label="Your full name">
                  <input autoComplete="name" className={lightInput} placeholder="e.g. Chiamaka Okafor" {...register("nominatorName")} />
                </Field>
                <Field error={errors.nominatorPhone?.message} label="Your phone number">
                  <input autoComplete="tel" className={lightInput} inputMode="tel" placeholder="0803 123 4567" type="tel" {...register("nominatorPhone")} />
                </Field>
                <Field error={errors.nominatorRole?.message} label="I am a…">
                  <RolePicker register={register} selected={watch("nominatorRole")} />
                </Field>
              </div>
            ) : (
              <div className="space-y-5">
                <StepTitle text="Tell us who they are, where they teach, and what they mean to you." title="Now, your hero" />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field error={errors.teacherName?.message} label="Teacher's full name">
                    <input className={lightInput} placeholder="e.g. Mrs. Funmilayo Adeyemi" {...register("teacherName")} />
                  </Field>
                  <Field error={errors.teacherPhone?.message} label="Teacher's phone number">
                    <input className={lightInput} inputMode="tel" placeholder="0803 123 4567" type="tel" {...register("teacherPhone")} />
                  </Field>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field error={errors.schoolName?.message} label="Their school">
                    <input className={lightInput} placeholder="e.g. Queen's College, Yaba" {...register("schoolName")} />
                  </Field>
                  <Field error={errors.schoolState?.message} label="State">
                    <select className={lightInput} defaultValue="" {...register("schoolState")}>
                      <option disabled value="">Select state</option>
                      {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </Field>
                </div>
                <Field error={errors.teacherSubject?.message} label="Subject or class (optional)">
                  <input className={lightInput} placeholder="e.g. Mathematics, Primary 4" {...register("teacherSubject")} />
                </Field>
                <Field error={errors.reason?.message} label="Why are you nominating them?">
                  <textarea
                    className="focus-ring min-h-36 w-full rounded-xl border border-black/12 bg-white px-4 py-3 text-sm leading-6 text-slate-ink placeholder:text-slate-body/50"
                    placeholder="What did they do that you'll never forget? How did they change your life, your class, or your community?"
                    {...register("reason")}
                  />
                  <span className={clsx("mt-1.5 block text-right text-xs", reasonLength >= 40 ? "text-emerald-700" : "text-slate-body/60")}>
                    {reasonLength < 40 ? `${40 - reasonLength} more characters to go` : "Beautiful, thank you"}
                  </span>
                </Field>
                {submitError ? (
                  <p className="rounded-xl border border-rev-orange/25 bg-rev-orange/5 px-4 py-3 text-sm font-semibold text-rev-orangeDeep" role="alert">
                    {submitError}
                  </p>
                ) : null}
                <PrivacyNotice />
                <div className="space-y-3">
                  <Check error={errors.privacyAccepted?.message} {...register("privacyAccepted")}>
                    I&apos;ve read the{" "}
                    <Link className="font-bold text-rev-orangeDeep underline" href="/privacy#nominations" target="_blank">privacy notice</Link>.
                    The details are accurate, and I believe the teacher would be happy to be contacted about this.
                  </Check>
                  <Check error={errors.ageConfirmed?.message} {...register("ageConfirmed")}>
                    I&apos;m 18 or older, or my parent or guardian has agreed to me making this nomination.
                  </Check>
                  <Check {...register("marketingOptIn")}>
                    <span className="text-slate-body/80">Optional:</span> send me news and offers about Rev laptops and
                    tablets. You can opt out any time.
                  </Check>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex items-center justify-between gap-3">
          {step === 1 ? (
            <button
              className="focus-ring h-12 rounded-full border border-black/12 px-5 text-sm font-bold text-slate-body transition hover:border-black/25"
              onClick={() => setStep(0)}
              type="button"
            >
              Back
            </button>
          ) : <span />}
          {step === 0 ? (
            <Button onClick={nextStep} type="button">Continue <ArrowRight className="h-4 w-4" /></Button>
          ) : (
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? "Submitting…" : <>Submit nomination <Heart className="h-4 w-4" /></>}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

function RolePicker({ register, selected }: { register: UseFormRegister<FormInput>; selected?: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {NOMINATOR_ROLES.map((r) => (
        <label
          className={clsx(
            "cursor-pointer rounded-full border px-4 py-2 text-sm font-bold transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-rev-orange",
            selected === r.id
              ? "border-rev-orange bg-rev-orange text-white"
              : "border-black/12 bg-[#FAF8F6] text-slate-body hover:border-rev-orange/50",
          )}
          key={r.id}
        >
          <input className="sr-only" type="radio" value={r.id} {...register("nominatorRole")} />
          {r.label}
        </label>
      ))}
    </div>
  );
}

function ThankYou({ teacher, refCode, onAnother }: { teacher: string; refCode: string; onAnother: () => void }) {
  function share() {
    const url = `${window.location.origin}/nominate-a-teacher`;
    const text = `I just nominated ${teacher} for ${CAMPAIGN.name}! 🎉 Is there a teacher who changed your life? Nominate them too, and they could win ${CAMPAIGN.prize}: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-black/8 bg-white p-8 text-center shadow-xl md:p-12"
      initial={{ opacity: 0, y: 16 }}
      role="status"
    >
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rev-orange/10 text-rev-orangeDeep">
        <PartyPopper className="h-8 w-8" />
      </span>
      <h3 className="mt-6 font-display text-3xl font-extrabold text-slate-ink">Thank you!</h3>
      <p className="mx-auto mt-3 max-w-md text-base leading-7 text-slate-body">
        <strong className="text-slate-ink">{teacher}</strong> has been nominated. We&apos;ll be in touch once nominees
        are verified and voting opens.
      </p>
      <p className="mt-4 text-xs text-slate-body/70">
        Your reference: <span className="font-mono font-bold text-slate-ink">{refCode}</span>
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button onClick={share} type="button"><Share2 className="h-4 w-4" /> Share on WhatsApp</Button>
        <button
          className="focus-ring h-12 rounded-full border border-black/12 px-6 text-sm font-bold text-slate-body transition hover:border-black/25"
          onClick={onAnother}
          type="button"
        >
          Nominate another teacher
        </button>
      </div>
    </motion.div>
  );
}

/** What happens to the details, at the point of collection (NDPA s.27, GDPR arts. 13–14). */
function PrivacyNotice() {
  return (
    <div className="rounded-xl border border-black/8 bg-[#FAF8F6] p-4 text-xs leading-5 text-slate-body">
      <p className="font-bold text-slate-ink">How we use these details</p>
      <p className="mt-1">
        {PRIVACY.controller} uses them only to run {CAMPAIGN.name}: to verify the nomination with you and the teacher,
        and, if the teacher agrees, to feature them and run the vote. We&apos;ll tell the teacher who we are and how
        we got their details, and they can opt out at any time. Phone numbers are never published. We keep
        nominations for {PRIVACY.nominationRetention}, then delete them. To see, correct or delete your data, email{" "}
        <a className="font-bold text-rev-orangeDeep underline" href={`mailto:${PRIVACY.contactEmail}`}>{PRIVACY.contactEmail}</a>.
      </p>
    </div>
  );
}

const Check = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { error?: string; children: React.ReactNode }>(
  function Check({ error, children, ...input }, ref) {
    return (
      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-slate-ink">
          <input className="mt-1 h-4 w-4 shrink-0 accent-[#FF6B1A]" ref={ref} type="checkbox" {...input} />
          <span>{children}</span>
        </label>
        {error ? <span className="ml-7 mt-1 block text-sm font-bold text-rev-orange">{error}</span> : null}
      </div>
    );
  },
);

function StepTitle({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <h3 className="font-display text-2xl font-bold text-slate-ink md:text-3xl">{title}</h3>
      <p className="mt-2 text-slate-body">{text}</p>
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
