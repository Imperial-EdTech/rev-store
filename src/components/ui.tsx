"use client";

import { motion } from "framer-motion";
import { clsx } from "clsx";
import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Eyebrow({ className, children }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={clsx("inline-flex items-center gap-2 rounded-full bg-white/8 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-rev-peach", className)}>
      {children}
    </p>
  );
}

export function SectionTitle({
  kicker,
  title,
  align = "center",
  tone = "dark",
  children,
  className
}: HTMLAttributes<HTMLDivElement> & { kicker?: string; title: string; align?: "center" | "left"; tone?: "dark" | "light" }) {
  return (
    <div className={clsx("max-w-2xl", align === "center" ? "mx-auto text-center" : "text-left", className)}>
      {kicker ? (
        <p className={clsx("text-xs font-bold uppercase tracking-[0.2em]", tone === "dark" ? "text-rev-orange" : "text-rev-orange")}>{kicker}</p>
      ) : null}
      <h2 className={clsx("text-balance mt-3 font-display text-3xl font-extrabold leading-[1.08] tracking-tight md:text-[2.75rem]", tone === "dark" ? "text-white" : "text-maroon-deep")}>
        {title}
      </h2>
      {children ? <div className={clsx("mt-4 text-base leading-7 md:text-lg", tone === "dark" ? "text-white/65" : "text-maroon-deep/70")}>{children}</div> : null}
    </div>
  );
}

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "light" }) {
  const styles = {
    primary: "bg-rev-orange text-white shadow-glow hover:bg-rev-orangeDeep",
    ghost: "border border-white/20 text-white hover:border-white/45 hover:bg-white/5",
    light: "bg-white text-maroon-deep hover:bg-cream"
  } as const;
  return (
    <motion.button
      className={clsx(
        "focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        styles[variant],
        className
      )}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      {...(props as any)}
    />
  );
}

export function GlassCard({ className, children }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx("glass-card rounded-2xl shadow-glass", className)}>{children}</div>;
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx("rounded-2xl border border-white/10 bg-white/[0.04] p-7", className)} {...props} />;
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={clsx(
        "focus-ring h-12 w-full rounded-xl border border-white/15 bg-white/5 px-4 text-sm text-white placeholder:text-white/35",
        className
      )}
      {...props}
    />
  );
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={clsx("focus-ring h-12 w-full rounded-xl border border-white/15 bg-white/5 px-4 text-sm text-white", className)}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={clsx(
        "focus-ring min-h-28 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35",
        className
      )}
      {...props}
    />
  );
}

export function Tag({ className, children }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={clsx("inline-flex items-center rounded-full bg-rev-orange/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-rev-orange", className)}>
      {children}
    </span>
  );
}
