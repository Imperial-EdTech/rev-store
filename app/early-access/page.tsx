"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { clsx } from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SiteHeader } from "@/src/components/shell";
import { Button } from "@/src/components/ui";
import { interests, roles } from "@/src/lib/data";

const schema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone number"),
  organization: z.string().min(2, "Enter your school or organization"),
  role: z.enum(roles),
  interests: z.array(z.string()).min(1, "Select at least one interest"),
  deviceCount: z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    z.coerce.number().int().positive().optional()
  ),
  notes: z.string().optional()
});

type FormInput = z.input<typeof schema>;
type FormValues = z.output<typeof schema>;

const stepFields: Array<Array<keyof FormInput>> = [
  ["fullName", "email", "phone"],
  ["organization", "role"],
  ["interests"],
  ["deviceCount", "notes"]
];

const lightInputClass =
  "focus-ring h-12 w-full rounded-xl border border-black/12 bg-white px-4 text-sm text-slate-ink placeholder:text-slate-body/50";

export default function EarlyAccessPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<FormInput, unknown, FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: "Teacher", interests: [] }
  });
  const watchedInterests = watch("interests") ?? [];

  async function nextStep(event?: React.MouseEvent) {
    event?.preventDefault();
    event?.stopPropagation();
    const ok = await trigger(stepFields[step]);
    if (ok) setStep((value) => Math.min(value + 1, 3));
  }

  const [submitError, setSubmitError] = useState<string | null>(null);

  async function onSubmit(values: FormValues) {
    // Guard: only the explicit Submit button on the final step may ever
    // call this. Whatever event path got us here (click, Enter, a stray
    // bubbled submit from an animated button), if we're not on step 3 this
    // is not a real submission attempt — ignore it.
    if (step !== 3) return;

    setSubmitError(null);
    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
          organization: values.organization,
          role: values.role,
          interests: values.interests,
          deviceCount: values.deviceCount ?? null,
          notes: values.notes ?? null
        })
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
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
        <div className="container-x relative z-10 grid gap-8 lg:grid-cols-[0.8fr_1.1fr]">
          <aside className="pt-8">
            <Link className="inline-flex items-center text-sm font-bold text-white/60 hover:text-rev-orange" href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back home
            </Link>
            <p className="mt-12 text-xs font-bold uppercase tracking-[0.2em] text-rev-orange">Join the Waitlist</p>
            <h1 className="text-balance mt-4 font-display text-4xl font-extrabold leading-[1.05] text-white md:text-5xl">
              Tell us what you&apos;re interested in
            </h1>
            <p className="mt-6 max-w-md text-lg leading-8 text-white/65">
              Devices, financing, training, or the Teacher Empowerment Program. Tell us what you&apos;re interested
              in, and we&apos;ll reach out.
            </p>
          </aside>

          {/* Form card: white, intentionally a different color from the maroon page background */}
          <div className="rounded-3xl border border-black/8 bg-white p-6 shadow-xl md:p-8">
            <div className="mb-8 flex gap-2">
              {[0, 1, 2, 3].map((i) => (
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-black/8" key={i}>
                  <motion.div
                    animate={{ width: i <= step ? "100%" : "0%" }}
                    className="h-full bg-rev-orange"
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </div>
              ))}
            </div>
            <form
              onKeyDown={(event) => {
                // Never submit on Enter from any field. The only way to
                // submit is an explicit click on the Submit button below.
                if (event.key === "Enter") {
                  event.preventDefault();
                }
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
                      <StepTitle text="We'll use this to follow up with you." title="Your details" />
                      <Field error={errors.fullName?.message} label="Full Name">
                        <input className={lightInputClass} placeholder="Enter full name" {...register("fullName")} />
                      </Field>
                      <Field error={errors.email?.message} label="Email Address">
                        <input className={lightInputClass} placeholder="name@example.com" type="email" {...register("email")} />
                      </Field>
                      <Field error={errors.phone?.message} label="Phone Number">
                        <input className={lightInputClass} placeholder="+234..." {...register("phone")} />
                      </Field>
                    </div>
                  ) : null}

                  {step === 1 ? (
                    <div className="space-y-5">
                      <StepTitle text="Help us understand where you're coming from." title="Your role" />
                      <Field error={errors.organization?.message} label="School / Organization">
                        <input
                          className={lightInputClass}
                          placeholder="School, organization, or independent"
                          {...register("organization")}
                        />
                      </Field>
                      <Field error={errors.role?.message} label="Role">
                        <select className={lightInputClass} {...register("role")}>
                          {roles.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      </Field>
                    </div>
                  ) : null}

                  {step === 2 ? (
                    <div className="space-y-5">
                      <StepTitle text="Select every category that applies. This isn't an application — just tell us what you'd like to know more about." title="What are you interested in?" />
                      <div className="grid gap-3 sm:grid-cols-2">
                        {interests.map((interest) => {
                          const checked = watchedInterests.includes(interest);
                          return (
                            <label
                              className={clsx(
                                "flex min-h-16 cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm font-bold transition",
                                checked
                                  ? "border-rev-orange bg-rev-orange/10 text-slate-ink"
                                  : "border-black/10 bg-[#FAF8F6] text-slate-body active:border-rev-orange/50"
                              )}
                              key={interest}
                            >
                              <span
                                className={clsx(
                                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition",
                                  checked ? "border-rev-orange bg-rev-orange" : "border-black/20 bg-transparent"
                                )}
                              >
                                {checked ? <Check className="h-3.5 w-3.5 text-white" /> : null}
                              </span>
                              <input className="sr-only" type="checkbox" value={interest} {...register("interests")} />
                              {interest}
                            </label>
                          );
                        })}
                      </div>
                      {errors.interests?.message ? <p className="text-sm font-bold text-rev-orange">{errors.interests.message}</p> : null}
                      <p className="text-sm text-slate-body/70">{watchedInterests.length} selected</p>
                    </div>
                  ) : null}

                  {step === 3 ? (
                    <div className="space-y-5">
                      <StepTitle text="Optional, but useful for routing your interest to the right team." title="Almost done" />
                      <Field error={errors.deviceCount?.message} label="Number of Devices Needed">
                        <input className={lightInputClass} min={1} placeholder="Example: 25" type="number" {...register("deviceCount")} />
                      </Field>
                      <Field error={errors.notes?.message} label="Additional Notes">
                        <textarea
                          className="focus-ring min-h-28 w-full rounded-xl border border-black/12 bg-white px-4 py-3 text-sm text-slate-ink placeholder:text-slate-body/50"
                          placeholder="Tell us anything useful about your needs."
                          {...register("notes")}
                        />
                      </Field>
                      <p className="text-xs leading-5 text-slate-body/70">
                        This registers your interest only — it doesn&apos;t commit you to financing or any specific
                        program. We&apos;ll follow up with the right next step.
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

              <div className="mt-8 flex items-center justify-between gap-3">
                <button
                  className="focus-ring h-12 rounded-full border border-black/12 px-5 text-sm font-bold text-slate-body transition hover:border-black/25 disabled:opacity-30"
                  disabled={step === 0}
                  onClick={() => setStep((value) => Math.max(value - 1, 0))}
                  type="button"
                >
                  Back
                </button>
                {step < 3 ? (
                  <Button onClick={nextStep} type="button">
                    Continue <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button disabled={isSubmitting} type="submit">
                    {isSubmitting ? "Submitting..." : "Submit"}
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

function StepTitle({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-slate-ink md:text-3xl">{title}</h2>
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