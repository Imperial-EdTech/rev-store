"use client";

import { Users, RefreshCw, Loader2, AlertCircle, Inbox } from "lucide-react";
import type React from "react";
import { useState, useEffect, useMemo } from "react";
import type { WaitlistRegistration } from "@/lib/types";
import { StorefrontHeader } from "@/components/StorefrontHeader";
import { StorefrontFooter } from "@/components/StorefrontFooter";

// ── Partner config ────────────────────────────────────────────
// Each partner has: their display name, the value stored in notes.partnerOrg,
// and a unique passcode (set via env vars or hardcoded for now).
const PARTNERS = [
  {
    id: "let-there-be-teachers",
    name: "Let There Be Teachers Laptop Scheme",
    orgLabel: "Let There Be Teachers Laptop Scheme",
    // Set NEXT_PUBLIC_LTBT_PASSCODE in .env.local
    passcode: process.env.NEXT_PUBLIC_LTBT_PASSCODE ?? "ltbt-2026",
  },
] as const;

type PartnerId = (typeof PARTNERS)[number]["id"];
type FetchState = "idle" | "loading" | "error" | "ready";

// ── Extract partnerOrg from notes JSON ────────────────────────
function getPartnerOrg(notes: string | null | undefined): string {
  if (!notes) return "Independent";
  try { return JSON.parse(notes)?.partnerOrg ?? "Independent"; } catch { return "Independent"; }
}

function getNoteField(notes: string | null | undefined, key: string): string {
  if (!notes) return "—";
  try { return JSON.parse(notes)?.[key] ?? "—"; } catch { return "—"; }
}

// ── Page ──────────────────────────────────────────────────────
export default function PartnersPage() {
  const [partnerId, setPartnerId] = useState<PartnerId | null>(null);
  const [passcode, setPasscode]   = useState("");
  const [authError, setAuthError] = useState("");

  const partner = PARTNERS.find((p) => p.id === partnerId) ?? null;

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const matched = PARTNERS.find((p) => p.passcode === passcode);
    if (matched) { setPartnerId(matched.id); setAuthError(""); }
    else setAuthError("Incorrect passcode. Contact Revrica to retrieve yours.");
  }

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
                {authError && <p className="text-sm font-bold text-rev-orange">{authError}</p>}
                <button
                  className="focus-ring h-12 w-full rounded-full bg-rev-orange text-sm font-bold text-white shadow-glow transition hover:bg-rev-orangeDeep"
                  type="submit"
                >
                  Access Partner Dashboard
                </button>
              </form>
              <p className="mt-6 text-center text-xs text-slate-body/50">
                Don&apos;t have a passcode?{" "}
                <a className="font-bold text-rev-orange hover:underline" href="mailto:hello@revrica.com">
                  Contact Revrica
                </a>
              </p>
            </div>
          </section>
        </main>
      </>
    );
  }

  return <PartnerDashboard partner={partner} />;
}

// ── Dashboard ─────────────────────────────────────────────────
function PartnerDashboard({ partner }: { partner: (typeof PARTNERS)[number] }) {
  const [registrations, setRegistrations] = useState<WaitlistRegistration[]>([]);
  const [fetchState, setFetchState]       = useState<FetchState>("idle");
  const [fetchError, setFetchError]       = useState<string | null>(null);
  const [query, setQuery]                 = useState("");

  async function load() {
    setFetchState("loading");
    setFetchError(null);
    try {
      const res  = await fetch("/api/admin/registrations");
      const body = await res.json();
      if (!res.ok) { setFetchError(body?.error ?? "Could not load data."); setFetchState("error"); return; }
      setRegistrations(body.registrations);
      setFetchState("ready");
    } catch {
      setFetchError("Could not reach the server. Check your connection.");
      setFetchState("error");
    }
  }

  useEffect(() => { load(); }, []);

  // Filter to only this partner's applicants
  const partnerApplicants = useMemo(
    () => registrations.filter((r) => getPartnerOrg(r.notes) === partner.orgLabel),
    [registrations, partner.orgLabel]
  );

  const filtered = useMemo(() => {
    if (!query) return partnerApplicants;
    const q = query.toLowerCase();
    return partnerApplicants.filter(
      (r) => r.fullName.toLowerCase().includes(q) || r.phone.toLowerCase().includes(q)
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
                {["12 Months", "24 Months", "36 Months"].map((term) => {
                  const count = partnerApplicants.filter((r) => getNoteField(r.notes, "paymentOption") === term).length;
                  return (
                    <div className="rounded-2xl border border-black/8 bg-white p-7 shadow-sm" key={term}>
                      <p className="font-display text-4xl font-extrabold text-slate-ink">{count}</p>
                      <p className="mt-1 text-xs font-bold uppercase tracking-[0.1em] text-slate-body/70">{term} plan</p>
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
                      placeholder="Search by name or phone…"
                      value={query}
                    />
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[520px] text-left text-sm">
                      <thead className="bg-black/3 text-xs uppercase tracking-[0.1em] text-slate-body/70">
                        <tr>
                          <th className="px-6 py-4">#</th>
                          <th className="px-6 py-4">Full Name</th>
                          <th className="px-6 py-4">State</th>
                          <th className="px-6 py-4">Payment Plan</th>
                          <th className="px-6 py-4">Date Applied</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((r, i) => (
                          <tr className="border-t border-black/6 hover:bg-black/[0.015]" key={r.id}>
                            <td className="px-6 py-4 text-slate-body">{i + 1}</td>
                            <td className="px-6 py-4 font-bold text-slate-ink">{r.fullName}</td>
                            <td className="px-6 py-4 text-slate-body">{getNoteField(r.notes, "state")}</td>
                            <td className="px-6 py-4 text-slate-body">{getNoteField(r.notes, "paymentOption")}</td>
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