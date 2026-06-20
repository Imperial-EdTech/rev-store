"use client";

import { clsx } from "clsx";
import { Check } from "lucide-react";

/**
 * The staircase is RevStore's signature device: BNPL is, literally, a big
 * cost broken into small climbable steps. This component renders that idea
 * directly rather than as a generic progress bar.
 */

type Step = {
  label: string;
  sublabel?: string;
};

export function HeroStaircase({ steps }: { steps: Step[] }) {
  return (
    <div aria-hidden="true" className="relative flex h-full w-full items-end justify-center gap-3 px-4 pb-2">
      {steps.map((step, index) => {
        const heightPct = 28 + index * 18;
        const delay = index * 110;
        return (
          <div className="flex flex-1 flex-col items-center justify-end gap-3" key={step.label}>
            <div
              className="step-rise w-full"
              style={{ animationDelay: `${delay}ms` }}
            >
              <div
                className={clsx(
                  "flex w-full flex-col items-center justify-start gap-1 border border-line-strong bg-white px-2 py-3 text-center shadow-card",
                  index === steps.length - 1 && "border-rev-orange bg-rev-orangeSoft"
                )}
                style={{ height: `${heightPct * 2.4}px` }}
              >
                <span className="figures text-xs font-semibold text-stone">{`0${index + 1}`}</span>
                <span className="text-[11px] font-bold leading-tight text-ink md:text-xs">{step.label}</span>
                {step.sublabel ? <span className="text-[10px] text-ink-soft">{step.sublabel}</span> : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ProcessStaircase({ steps }: { steps: { title: string; body: string }[] }) {
  return (
    <div className="flex flex-col gap-10 md:flex-row md:items-end md:gap-0">
      {steps.map((step, index) => (
        <div
          className="step-rise flex flex-1 flex-col md:px-5"
          key={step.title}
          style={{ animationDelay: `${index * 90}ms` }}
        >
          <div className="hidden h-12 md:block" style={{ height: `${(steps.length - 1 - index) * 22}px` }} />
          <div
            className={clsx(
              "flex h-12 w-12 items-center justify-center border-2 font-display text-base font-extrabold",
              index === steps.length - 1 ? "border-rev-orange bg-rev-orange text-paper" : "border-ink bg-paper text-ink"
            )}
          >
            {index + 1}
          </div>
          <div className="mt-4 border-t-2 border-ink pt-4 md:border-t-4">
            <h3 className="font-display text-lg font-bold text-ink">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-ink-soft">{step.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function StaircaseProgress({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-end gap-1.5" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={current + 1}>
      {Array.from({ length: total }).map((_, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <div className="flex flex-1 flex-col items-center gap-2" key={index}>
            <div
              className={clsx(
                "flex h-6 w-full items-center justify-center border text-[10px] font-bold transition-all duration-300",
                done && "border-rev-ledger bg-rev-ledger text-white",
                active && "border-rev-orange bg-rev-orange text-white",
                !done && !active && "border-line-strong bg-white text-stone"
              )}
              style={{ height: `${10 + index * 6}px` }}
            >
              {done ? <Check className="h-3 w-3" /> : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
