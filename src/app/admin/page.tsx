"use client";

import {
  AlertCircle, ClipboardCheck, Download,
  Inbox, Loader2, RefreshCw, Search, Users,
} from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/shell";
import { TechAuditView } from "@/components/tech-audit-view";
import { roles } from "@/lib/data";
import type { WaitlistRegistration } from "@/lib/types";

// ── Partner list — keep in sync with apply/page.tsx ──────────
const PARTNER_ORGS = [
  { id: "let-there-be-teachers", name: "Let There Be Teachers Laptop Scheme" },
] as const;

// Pull partnerOrg out of the JSON notes field safely
function getPartnerOrg(notes: string | null | undefined): string {
  if (!notes) return "Independent";
  try {
    const parsed = JSON.parse(notes);
    return parsed?.partnerOrg ?? "Independent";
  } catch {
    return "Independent";
  }
}

function getNoteField(notes: string | null | undefined, key: string): string {
  if (!notes) return "—";
  try {
    const parsed = JSON.parse(notes);
    return parsed?.[key] ?? "—";
  } catch {
    return "—";
  }
}

type FetchState = "idle" | "loading" | "error" | "ready";
type Tab = "waitlist" | "tech-audit";

export default function AdminPage() {
  const [tab, setTab]             = useState<Tab>("waitlist");
  const [passcode, setPasscode]   = useState("");
  const [unlocked, setUnlocked]   = useState(false);
  const [authError, setAuthError] = useState("");

  function unlockDashboard(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const expected = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "revstore-admin";
    if (passcode === expected) { setUnlocked(true); setAuthError(""); return; }
    setAuthError("Enter the correct admin passcode.");
  }

  if (!unlocked) {
    return (
      <>
        <SiteHeader />
        <main className="maroon-glow relative flex min-h-screen items-center py-16">
          <div className="noise-overlay" />
          <section className="container-x relative z-10">
            <div className="mx-auto max-w-md rounded-3xl border border-black/8 bg-white p-8 shadow-xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-rev-orange">Revrica Admin</p>
              <h1 className="mt-3 font-display text-3xl font-extrabold text-slate-ink">Dashboard access</h1>
              <p className="mt-3 leading-7 text-slate-body">Enter the admin passcode to view registrations and analytics.</p>
              <form className="mt-6 space-y-4" onSubmit={unlockDashboard}>
                <input
                  className="focus-ring h-12 w-full rounded-xl border border-black/12 bg-white px-4 text-sm text-slate-ink placeholder:text-slate-body/50"
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Admin passcode"
                  type="password"
                  value={passcode}
                />
                {authError && <p className="text-sm font-bold text-rev-orange">{authError}</p>}
                <button
                  className="focus-ring h-12 w-full rounded-full bg-rev-orange text-sm font-bold text-white shadow-glow transition hover:bg-rev-orangeDeep"
                  type="submit"
                >
                  Open Dashboard
                </button>
              </form>
            </div>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="maroon-glow relative min-h-screen py-10">
        <div className="noise-overlay" />
        <div className="container-x relative z-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-rev-orange">Revrica Admin</p>
              <h1 className="mt-3 font-display text-4xl font-extrabold text-white md:text-5xl">Lead dashboard</h1>
              <p className="mt-3 text-white/60">Live data from Supabase.</p>
            </div>
            <div className="inline-flex gap-1 rounded-full border border-white/15 bg-white/5 p-1">
              <button
                className={`inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-bold transition ${
                  tab === "waitlist" ? "bg-rev-orange text-white" : "text-white/60 hover:text-white"
                }`}
                onClick={() => setTab("waitlist")}
                type="button"
              >
                <Users className="h-4 w-4" /> Applications
              </button>
              <button
                className={`inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-bold transition ${
                  tab === "tech-audit" ? "bg-rev-orange text-white" : "text-white/60 hover:text-white"
                }`}
                onClick={() => setTab("tech-audit")}
                type="button"
              >
                <ClipboardCheck className="h-4 w-4" /> Tech Audit
              </button>
            </div>
          </div>
          {tab === "waitlist" ? <WaitlistView /> : <TechAuditView />}
        </div>
      </main>
    </>
  );
}

// ── Waitlist view ─────────────────────────────────────────────
function WaitlistView() {
  const [registrations, setRegistrations] = useState<WaitlistRegistration[]>([]);
  const [fetchState, setFetchState]       = useState<FetchState>("idle");
  const [fetchError, setFetchError]       = useState<string | null>(null);
  const [query, setQuery]                 = useState("");
  const [roleFilter, setRoleFilter]       = useState("All");
  const [partnerFilter, setPartnerFilter] = useState("All");

  async function loadRegistrations() {
    setFetchState("loading");
    setFetchError(null);
    try {
      const res  = await fetch("/api/admin/registrations");
      const body = await res.json();
      if (!res.ok) { setFetchError(body?.error ?? "Could not load registrations."); setFetchState("error"); return; }
      setRegistrations(body.registrations);
      setFetchState("ready");
    } catch {
      setFetchError("Could not reach the server. Check your connection and try again.");
      setFetchState("error");
    }
  }

  useEffect(() => { loadRegistrations(); }, []);

  // Enrich each record with the partner org extracted from notes
  const enriched = useMemo(
    () => registrations.map((r) => ({ ...r, partnerOrg: getPartnerOrg(r.notes) })),
    [registrations]
  );

  // All unique partner values present in data
  const presentPartners = useMemo(() => {
    const set = new Set(enriched.map((r) => r.partnerOrg));
    return Array.from(set).sort();
  }, [enriched]);

  const filtered = useMemo(() => {
    return enriched.filter((item) => {
      const q = query.toLowerCase();
      const matchesQuery = [item.fullName, item.email, item.phone, item.organization, item.role, item.interests.join(" "), item.partnerOrg]
        .join(" ").toLowerCase().includes(q);
      const matchesRole    = roleFilter    === "All" || item.role      === roleFilter;
      const matchesPartner = partnerFilter === "All" || item.partnerOrg === partnerFilter;
      return matchesQuery && matchesRole && matchesPartner;
    });
  }, [query, enriched, roleFilter, partnerFilter]);

  const stats = useMemo(() => {
    const total     = registrations.length;
    const indep     = enriched.filter((r) => r.partnerOrg === "Independent").length;
    const byPartner = PARTNER_ORGS.map((p) => [p.name, enriched.filter((r) => r.partnerOrg === p.name).length] as [string, number]);
    return [
      ["Total Applications", total],
      ["Independent", indep],
      ...byPartner,
      ["Outright Purchase", enriched.filter((r) => r.interests.includes("Buy a Laptop Outright")).length],
      ["Financing", enriched.filter((r) => r.interests.includes("Laptop Financing")).length],
    ] as [string, number][];
  }, [registrations, enriched]);

  async function exportExcel() {
    const XLSX = await import("xlsx");
    const rows = filtered.map((item) => ({
      Name:            item.fullName,
      Email:           item.email,
      Phone:           item.phone,
      School:          item.organization,
      Role:            item.role,
      "Partner Org":   item.partnerOrg,
      "Payment Option": getNoteField(item.notes, "paymentOption"),
      State:           getNoteField(item.notes, "state"),
      LGA:             getNoteField(item.notes, "lga"),
      Position:        getNoteField(item.notes, "position"),
      "School Type":   getNoteField(item.notes, "schoolType"),
      "Salary Band":   getNoteField(item.notes, "salaryBand"),
      "Years Teaching": getNoteField(item.notes, "yearsTeaching"),
      "Owns Laptop":   getNoteField(item.notes, "ownsLaptop"),
      "KYC Consent":   getNoteField(item.notes, "kycConsent"),
      Date:            new Date(item.createdAt).toLocaleString(),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [
      { wch: 22 },{ wch: 26 },{ wch: 16 },{ wch: 28 },{ wch: 14 },
      { wch: 36 },{ wch: 20 },{ wch: 16 },{ wch: 16 },{ wch: 22 },
      { wch: 14 },{ wch: 22 },{ wch: 16 },{ wch: 12 },{ wch: 12 },{ wch: 18 },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Applications");
    XLSX.writeFile(wb, `revrica-applications-${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  if (fetchState === "error") {
    return (
      <div className="mt-8 flex items-start gap-4 rounded-2xl border border-white/15 bg-white/5 p-6">
        <AlertCircle className="h-6 w-6 shrink-0 text-rev-orange" />
        <div>
          <p className="font-display text-lg font-bold text-white">Couldn&apos;t load applications</p>
          <p className="mt-1 text-sm leading-6 text-white/60">{fetchError}</p>
          <button className="focus-ring mt-4 inline-flex h-10 items-center rounded-full border border-white/20 bg-white/5 px-4 text-sm font-bold text-white transition hover:border-white/40" onClick={loadRegistrations} type="button">
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (fetchState === "loading" || fetchState === "idle") {
    return (
      <div className="mt-16 flex flex-col items-center gap-3 text-white/60">
        <Loader2 className="h-7 w-7 animate-spin" />
        <p>Loading applications…</p>
      </div>
    );
  }

  if (registrations.length === 0) {
    return (
      <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-black/8 bg-white p-12 text-center shadow-sm">
        <Inbox className="h-9 w-9 text-slate-body/40" />
        <p className="font-display text-lg font-bold text-slate-ink">No applications yet</p>
        <p className="max-w-sm text-sm leading-6 text-slate-body">
          Once teachers submit the application form, their details will appear here.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* ── Toolbar ── */}
      <div className="mt-8 flex items-center justify-end gap-3">
        <button
          className="focus-ring inline-flex h-11 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 text-sm font-bold text-white transition hover:border-white/40 hover:bg-white/10"
          onClick={loadRegistrations}
          type="button"
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
        <button
          className="focus-ring inline-flex h-11 items-center gap-2 rounded-full bg-rev-orange px-5 text-sm font-bold text-white shadow-glow transition hover:bg-rev-orangeDeep disabled:cursor-not-allowed disabled:opacity-40"
          disabled={filtered.length === 0}
          onClick={exportExcel}
          type="button"
        >
          <Download className="h-4 w-4" /> Export Excel
        </button>
      </div>

      {/* ── Stat cards ── */}
      <div className="mt-6 grid gap-5 md:grid-cols-3 lg:grid-cols-6">
        {stats.map(([label, value]) => (
          <div className="rounded-[1.5rem] border border-black/8 bg-white p-6 shadow-sm" key={label}>
            <p className="font-display text-3xl font-extrabold text-slate-ink">{value}</p>
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.1em] text-slate-body/70">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Charts row ── */}
      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        {/* Partner breakdown */}
        <div className="rounded-[1.5rem] border border-black/8 bg-white p-7 shadow-sm">
          <h2 className="font-display text-xl font-bold text-slate-ink">Applications by Partner</h2>
          <div className="mt-5 grid gap-3">
            {["Independent", ...PARTNER_ORGS.map((p) => p.name)].map((name) => {
              const count = enriched.filter((r) => r.partnerOrg === name).length;
              const width = enriched.length ? (count / enriched.length) * 100 : 0;
              return (
                <div key={name}>
                  <div className="mb-2 flex justify-between text-sm text-slate-body">
                    <span className="max-w-[240px] truncate">{name}</span>
                    <span>{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-black/6">
                    <div className="h-full rounded-full bg-rev-orange" style={{ width: `${width}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment option breakdown */}
        <div className="rounded-[1.5rem] border border-black/8 bg-white p-7 shadow-sm">
          <h2 className="font-display text-xl font-bold text-slate-ink">Payment Options</h2>
          <div className="mt-5 grid gap-3">
            {["Buy Outright (Discounted)", "12 Months", "24 Months", "36 Months"].map((opt) => {
              const count = enriched.filter((r) => getNoteField(r.notes, "paymentOption") === opt).length;
              const width = enriched.length ? (count / enriched.length) * 100 : 0;
              return (
                <div key={opt}>
                  <div className="mb-2 flex justify-between text-sm text-slate-body">
                    <span>{opt}</span>
                    <span>{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-black/6">
                    <div className="h-full rounded-full bg-maroon" style={{ width: `${width}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Filters + Table ── */}
      <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-black/8 bg-white shadow-sm">
        <div className="border-b border-black/8 p-6">
          <div className="grid gap-3 md:grid-cols-[1fr_200px_200px]">
            {/* Search */}
            <label className="relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-body/50" />
              <input
                className="focus-ring h-12 w-full rounded-xl border border-black/12 bg-white pl-12 pr-4 text-sm text-slate-ink placeholder:text-slate-body/50"
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, email, school, state…"
                value={query}
              />
            </label>

            {/* Partner filter */}
            <select
              className="focus-ring h-12 rounded-xl border border-black/12 bg-white px-4 text-sm text-slate-ink"
              onChange={(e) => setPartnerFilter(e.target.value)}
              value={partnerFilter}
            >
              <option value="All">All partners</option>
              <option value="Independent">Independent</option>
              {PARTNER_ORGS.map((p) => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </select>

            {/* Role filter */}
            <select
              className="focus-ring h-12 rounded-xl border border-black/12 bg-white px-4 text-sm text-slate-ink"
              onChange={(e) => setRoleFilter(e.target.value)}
              value={roleFilter}
            >
              {["All", ...roles].map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>

          {/* Active filter badges */}
          {(partnerFilter !== "All" || roleFilter !== "All") && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-body/60">Filtering:</span>
              {partnerFilter !== "All" && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-rev-orange/10 px-3 py-1 text-xs font-bold text-rev-orange">
                  {partnerFilter}
                  <button className="text-rev-orange/60 hover:text-rev-orange" onClick={() => setPartnerFilter("All")} type="button">✕</button>
                </span>
              )}
              {roleFilter !== "All" && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-maroon/10 px-3 py-1 text-xs font-bold text-maroon">
                  {roleFilter}
                  <button className="text-maroon/60 hover:text-maroon" onClick={() => setRoleFilter("All")} type="button">✕</button>
                </span>
              )}
              <span className="text-xs text-slate-body/50">— {filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="bg-black/3 text-xs uppercase tracking-[0.1em] text-slate-body/70">
              <tr>
                {["Name","Email","Phone","School","Partner","Payment","State","Date"].map((h) => (
                  <th className="px-5 py-4" key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr className="border-t border-black/6 hover:bg-black/[0.015]" key={item.id}>
                  <td className="px-5 py-4 font-bold text-slate-ink">{item.fullName}</td>
                  <td className="px-5 py-4 text-slate-body">{item.email}</td>
                  <td className="px-5 py-4 text-slate-body">{item.phone}</td>
                  <td className="px-5 py-4 text-slate-body">{item.organization}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        item.partnerOrg === "Independent"
                          ? "bg-black/6 text-slate-body"
                          : "bg-rev-orange/12 text-rev-orange"
                      }`}
                    >
                      {item.partnerOrg === "Independent" ? "Independent" : item.partnerOrg.replace("Let There Be Teachers Laptop Scheme", "LTBT")}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-body">{getNoteField(item.notes, "paymentOption")}</td>
                  <td className="px-5 py-4 text-slate-body">{getNoteField(item.notes, "state")}</td>
                  <td className="px-5 py-4 text-slate-body">{new Date(item.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
