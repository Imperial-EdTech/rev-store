"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";
import { SiteHeader } from "@/components/shell";

/** Only same-site paths are allowed as a return destination (prevents open redirects). */
function safeNext(value: string | null): string {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/admin";
}

function AdminLogin() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/auth/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.replace(next);
        router.refresh();
        return;
      }
      const body = await res.json().catch(() => null);
      setError(body?.error ?? "Could not sign in. Try again.");
    } catch {
      setError("Could not reach the server. Check your connection.");
    }
    setSubmitting(false);
  }

  return (
    <>
      <SiteHeader />
      <main className="maroon-glow relative flex min-h-screen items-center py-16">
        <div className="noise-overlay" />
        <section className="container-x relative z-10">
          <div className="mx-auto max-w-md rounded-3xl border border-black/8 bg-white p-8 shadow-xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-rev-orange">Revrica Admin</p>
            <h1 className="mt-3 font-display text-3xl font-extrabold text-slate-ink">Sign in</h1>
            <p className="mt-3 leading-7 text-slate-body">
              Enter the admin password to manage orders, leads and RevLearn content.
            </p>
            <form className="mt-6 space-y-4" onSubmit={onSubmit}>
              <label className="block">
                <span className="sr-only">Admin password</span>
                <input
                  autoComplete="current-password"
                  autoFocus
                  className="focus-ring h-12 w-full rounded-xl border border-black/12 bg-white px-4 text-sm text-slate-ink placeholder:text-slate-body/50"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Admin password"
                  required
                  type="password"
                  value={password}
                />
              </label>
              {error && <p className="text-sm font-bold text-rev-orange" role="alert">{error}</p>}
              <button
                className="focus-ring h-12 w-full rounded-full bg-rev-orange text-sm font-bold text-white transition hover:bg-rev-orangeDeep disabled:opacity-60"
                disabled={submitting || !password}
                type="submit"
              >
                {submitting ? "Signing in…" : "Sign in"}
              </button>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLogin />
    </Suspense>
  );
}
