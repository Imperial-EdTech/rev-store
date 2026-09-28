"use client";

import { Users, RefreshCw, Loader2, AlertCircle, Inbox } from "lucide-react";
import type React from "react";
import { useState, useEffect, useMemo } from "react";
import type { PartnerApplicant } from "@/lib/partners";
import { StorefrontHeader } from "@/components/StorefrontHeader";
import { StorefrontFooter } from "@/components/StorefrontFooter";
import { CONTACT } from "@/lib/contact";

// Partner sign-in is checked on the server (/api/auth/partner), and
// /api/partner/applications returns only the signed-in partner's applicants.
type SignedInPartner = { id: string; name: string };
type FetchState = "idle" | "loading" | "error" | "ready";


// ── Page ──────────────────────────────────────────────────────
export default function PartnersPage() {
  const [partner, setPartner]       = useState<SignedInPartner | null>(null);
  const [checking, setChecking]     = useState(true);
  const [passcode, setPasscode]     = useState("");
  const [authError, setAuthError]   = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Restore an existing session (httpOnly cookie) on load.
  useEffect(() => {
    fetch("/api/auth/partner")
      .then((res) => res.json())
      .then((body) => setPartner(body?.partner ?? null))
      .catch(() => setPartner(null))
      .finally(() => setChecking(false));
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setAuthError("");
    try {
      const res  = await fetch("/api/auth/partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      const body = await res.json().catch(() => null);
      if (res.ok && body?.partner) { setPartner(body.partner); setPasscode(""); }
      else setAuthError(body?.error ?? "Could not sign in. Try again.");
    } catch {
      setAuthError("Could not reach the server. Check your connection.");
    }
    setSubmitting(false);
  }

  async function handleSignOut() {
    await fetch("/api/auth/partner", { method: "DELETE" });
    setPartner(null);
  }

  if (checking) return <StorefrontHeader />;

  if (!partner) {
    return (
      <>
        <StorefrontHeader />
        <main className="maroon-glow relative flex min-h-screen items-center py-16">
          <div className="noise-overlay" />
          <section className="container-x relative z-10">
            <div className="mx-auto max-w-md rounded-3xl border border-black/8 bg-white p-8 shadow-xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-rev-orange">Partner Portal</p>
              <h1 className="mt-3 font-display text-3xl font-extrabold text-slate-ink">Partner login</h1>
              <p className="mt-3 leading-7 text-slate-body">
                Enter the passcode provided by Revrica to access your organisation's application data.
              </p>
              <form className="mt-6 space-y-4" onSubmit={handleLogin}>
                <input
                  autoComplete="off"
                  className="focus-ring h-12 w-full rounded-xl border border-black/12 bg-white px-4 text-sm text-slate-ink placeholder:text-slate-body/50"
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Partner passcode"
                  type="password"
                  value={passcode}
                />
                {authError && <p className="text-sm font-bold text-rev-orange" role="alert">{authError}</p>}
                <button
                  className="focus-ring h-12 w-full rounded-full bg-rev-orange text-sm font-bold text-white shadow-glow transition hover:bg-rev-orangeDeep disabled:opacity-60"
                  disabled={submitting || !passcode}
                  type="submit"
                >
                  {submitting ? "Checking…" : "Access Partner Dashboard"}
                </button>
              </form>
              <p className="mt-6 text-center text-xs text-slate-body/50">
                Don&apos;t have a passcode?{" "}
                <a className="font-bold text-rev-orange hover:underline" href={`mailto:${CONTACT.supportEmail}`}>
                  Contact Revrica
                </a>
              </p>
            </div>
          </section>
        </main>
      </>
    );
  }

  return <PartnerDashboard onSignOut={handleSignOut} partner={partner} />;
}

// ── Dashboard ─────────────────────────────────────────────────
function PartnerDashboard({ partner, onSignOut }: { partner: SignedInPartner; onSignOut: () => void }) {
  const [applicants, setApplicants]       = useState<PartnerApplicant[]>([]);
  const [fetchState, setFetchState]       = useState<FetchState>("idle");
  const [fetchError, setFetchError]       = useState<string | null>(null);
  const [query, setQuery]                 = useState("");

  async function load() {
    setFetchState("loading");
    setFetchError(null);
    try {
      const res  = await fetch("/api/partner/applications");
      const body = await res.json();
      if (!res.ok) { setFetchError(body?.error ?? "Could not load data."); setFetchState("error"); return; }
      setApplicants(body.applications);
      setFetchState("ready");
    } catch {
      setFetchError("Could not reach the server. Check your connection.");
      setFetchState("error");
    }
  }

  useEffect(() => { load(); }, []);

  // Already limited to this partner by the server.
  const partnerApplicants = applicants;

  const filtered = useMemo(() => {
    if (!query) return partnerApplicants;
    const q = query.toLowerCase();
    return partnerApplicants.filter(
      (r) => [r.name, r.ref, r.school ?? "", r.state ?? ""].join(" ").toLowerCase().includes(q)
    );
  }, [partnerApplicants, query]);

  return (
    <>
      <StorefrontHeader />
      <main className="maroon-glow relative min-h-screen py-10">
        <div className="noise-overlay" />
        <div className="container-x relative z-10 max-w-4xl">

          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-rev-orange">Partner Portal</p>
              <h1 className="mt-2 font-display text-3xl font-extrabold text-white md:text-4xl">
                {partner.name}
              </h1>
              <p className="mt-2 text-white/55">Application data for your scheme members.</p>
              <button className="mt-3 text-xs font-bold text-white/50 underline underline-offset-4 hover:text-white" onClick={onSignOut} type="button">
                Sign out
              </button>
            </div>
            <button
              className="inline-flex h-11 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 text-sm font-bold text-white transition hover:border-white/40 hover:bg-white/10"
              onClick={load}
              type="button"
            >
              <RefreshCw className={fetchState === "loading" ? "h-4 w-4 animate-spin" : "h-4 w-4"} /> Refresh
            </button>
          </div>

          {/* Error */}
          {fetchState === "error" && (
            <div className="mt-8 flex items-start gap-4 rounded-2xl border border-white/15 bg-white/5 p-6">
              <AlertCircle className="h-6 w-6 shrink-0 text-rev-orange" />
              <div>
                <p className="font-bold text-white">Couldn&apos;t load data</p>
                <p className="mt-1 text-sm text-white/60">{fetchError}</p>
                <button className="mt-3 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-bold text-white" onClick={load} type="button">
                  Try again
                </button>
              </div>
            </div>
          )}

          {/* Loading */}
          {(fetchState === "loading" || fetchState === "idle") && (
            <div className="mt-16 flex flex-col items-center gap-3 text-white/60">
              <Loader2 className="h-7 w-7 animate-spin" />
              <p>Loading data…</p>
            </div>
          )}

          {/* Ready */}
          {fetchState === "ready" && (
            <>
              {/* Count card */}
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-black/8 bg-white p-7 shadow-sm">
                  <div className="flex items-center gap-3">
                    <Users className="h-7 w-7 text-rev-orange" />
                    <div>
                      <p className="font-display text-4xl font-extrabold text-slate-ink">{partnerApplicants.length}</p>
                      <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-body/70">Total applicants</p>
                    </div>
                  </div>
                </div>

                {/* Payment split */}
                {[12, 24, 36].map((term) => {
                  const count = partnerApplicants.filter((r) => r.termMonths === term).length;
                  return (
                    <div className="rounded-2xl border border-black/8 bg-white p-7 shadow-sm" key={term}>
                      <p className="font-display text-4xl font-extrabold text-slate-ink">{count}</p>
                      <p className="mt-1 text-xs font-bold uppercase tracking-[0.1em] text-slate-body/70">{term}-month plan</p>
                    </div>
                  );
                })}
              </div>

              {/* Applicant list */}
              {partnerApplicants.length === 0 ? (
                <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-black/8 bg-white p-12 text-center shadow-sm">
                  <Inbox className="h-9 w-9 text-slate-body/40" />
                  <p className="font-display text-lg font-bold text-slate-ink">No applicants yet</p>
                  <p className="max-w-sm text-sm text-slate-body">
                    When members apply using the <strong>{partner.name}</strong> option, they'll appear here.
                  </p>
                </div>
              ) : (
                <div className="mt-6 overflow-hidden rounded-2xl border border-black/8 bg-white shadow-sm">
                  <div className="border-b border-black/8 p-5">
                    <input
                      className="focus-ring h-11 w-full rounded-xl border border-black/12 bg-white px-4 text-sm text-slate-ink placeholder:text-slate-body/50"
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search by name, reference, school or state…"
                      value={query}
                    />
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-left text-sm">
                      <thead className="bg-black/3 text-xs uppercase tracking-[0.1em] text-slate-body/70">
                        <tr>
                          <th className="px-6 py-4">Reference</th>
                          <th className="px-6 py-4">Full Name</th>
                          <th className="px-6 py-4">School &amp; state</th>
                          <th className="px-6 py-4">Device &amp; plan</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Date Applied</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((r) => (
                          <tr className="border-t border-black/6 hover:bg-black/[0.015]" key={r.ref}>
                            <td className="px-6 py-4 font-mono text-xs font-bold text-slate-body">{r.ref}</td>
                            <td className="px-6 py-4 font-bold text-slate-ink">{r.name}</td>
                            <td className="px-6 py-4 text-slate-body">{[r.school, r.state].filter(Boolean).join(", ") || "—"}</td>
                            <td className="px-6 py-4 text-slate-body">
                              {r.device ?? "Not chosen"}{r.termMonths ? ` · ${r.termMonths} months` : ""}
                            </td>
                            <td className="px-6 py-4 font-bold text-slate-ink">{r.statusLabel}</td>
                            <td className="px-6 py-4 text-slate-body">{new Date(r.createdAt).toLocaleDateString("en-NG")}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="border-t border-black/6 px-6 py-4">
                    <p className="text-xs text-slate-body/50">
                      Showing {filtered.length} of {partnerApplicants.length} applicant{partnerApplicants.length !== 1 ? "s" : ""}
                      {query && ` matching "${query}"`}.
                      {" "}For full application details, contact the Revrica admin team.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <StorefrontFooter />
    </>
  );
}