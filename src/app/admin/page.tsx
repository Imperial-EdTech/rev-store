"use client";

import {
  AlertCircle, Building2, CheckCircle2, ClipboardCheck,
  Download, GraduationCap, Inbox, Loader2,
  RefreshCw, Search, Users,
} from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/shell";
import { TechAuditView } from "@/components/tech-audit-view";
import type { WaitlistRegistration } from "@/lib/types";

// ─── Note field helpers ───────────────────────────────────────
function getNote(notes: string | null | undefined, key: string): string {
  if (!notes) return "—";
  try { return JSON.parse(notes)?.[key] ?? "—"; } catch { return "—"; }
}

function isSchool(r: WaitlistRegistration): boolean {
  if (!r.notes) return false;
  try { return JSON.parse(r.notes)?.submissionType === "school"; } catch { return false; }
}

function getApplyAs(notes: string | null | undefined): string {
  if (!notes) return "Individual";
  try {
    const p = JSON.parse(notes);
    if (p?.submissionType === "school") return "School";
    if (p?.applyAs === "ltbt")       return "LTBT";
    if (p?.applyAs === "government") return "Government";
    return "Individual";
  } catch { return "Individual"; }
}

function getPathwayColor(label: string): string {
  switch (label) {
    case "School":     return "#581319";
    case "LTBT":       return "#f5a623";
    case "Government": return "#16a34a";
    default:           return "#6b7280";
  }
}

type FetchState = "idle" | "loading" | "error" | "ready";
type Tab = "individuals" | "schools" | "tech-audit";

// ═══════════════════════════════════════════════════════════════
// ROOT PAGE
// ═══════════════════════════════════════════════════════════════
export default function AdminPage() {
  const [passcode,  setPasscode]  = useState("");
  const [unlocked,  setUnlocked]  = useState(false);
  const [authError, setAuthError] = useState("");
  const [tab,       setTab]       = useState<Tab>("individuals");

  function unlock(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const expected = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "revstore-admin";
    if (passcode === expected) { setUnlocked(true); setAuthError(""); return; }
    setAuthError("Incorrect passcode. Try again.");
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
              <p className="mt-3 leading-7 text-slate-body">Enter the admin passcode to view leads and analytics.</p>
              <form className="mt-6 space-y-4" onSubmit={unlock}>
                <input
                  className="focus-ring h-12 w-full rounded-xl border border-black/12 bg-white px-4 text-sm text-slate-ink placeholder:text-slate-body/50"
                  onChange={e => setPasscode(e.target.value)}
                  placeholder="Admin passcode"
                  type="password"
                  value={passcode}
                />
                {authError && <p className="text-sm font-bold text-rev-orange">{authError}</p>}
                <button className="focus-ring h-12 w-full rounded-full bg-rev-orange text-sm font-bold text-white transition hover:bg-rev-orangeDeep" type="submit">
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

          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-rev-orange">Revrica Admin</p>
              <h1 className="mt-3 font-display text-4xl font-extrabold text-white md:text-5xl">Lead Dashboard</h1>
              <p className="mt-2 text-white/50 text-sm">Live data from Supabase — all submissions in one place.</p>
            </div>
            {/* Tab switcher */}
            <div className="inline-flex gap-1 rounded-2xl border border-white/12 bg-white/5 p-1.5">
              {([
                { id: "individuals", label: "Individuals", Icon: GraduationCap },
                { id: "schools",     label: "Schools",     Icon: Building2 },
                { id: "tech-audit",  label: "Tech Audit",  Icon: ClipboardCheck },
              ] as const).map(({ id, label, Icon }) => (
                <button key={id} type="button" onClick={() => setTab(id)}
                  className={`inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-bold transition ${tab === id ? "bg-rev-orange text-white shadow-sm" : "text-white/55 hover:text-white"}`}>
                  <Icon className="h-4 w-4" /> {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8">
            {tab === "individuals" && <IndividualsView />}
            {tab === "schools"     && <SchoolsView />}
            {tab === "tech-audit"  && <TechAuditView />}
          </div>
        </div>
      </main>
    </>
  );
}

// ─── Shared data hook ─────────────────────────────────────────
function useRegistrations() {
  const [data,  setData]  = useState<WaitlistRegistration[]>([]);
  const [state, setState] = useState<FetchState>("idle");
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setState("loading"); setError(null);
    try {
      const res  = await fetch("/api/admin/registrations");
      const body = await res.json();
      if (!res.ok) { setError(body?.error ?? "Failed to load."); setState("error"); return; }
      setData(body.registrations);
      setState("ready");
    } catch {
      setError("Could not reach the server."); setState("error");
    }
  }

  useEffect(() => { load(); }, []);
  return { data, state, error, reload: load };
}

// ─── Stat card ────────────────────────────────────────────────
function StatCard({ label, value, sub, color }: { label: string; value: number | string; sub?: string; color?: string }) {
  return (
    <div className="rounded-2xl border border-black/8 bg-white p-5 shadow-sm">
      <p className="font-display text-3xl font-extrabold" style={{ color: color ?? "#1e1b1a" }}>{value}</p>
      <p className="mt-1.5 text-xs font-bold uppercase tracking-[0.1em] text-slate-body/65">{label}</p>
      {sub && <p className="mt-0.5 text-[11px] text-slate-body/45">{sub}</p>}
    </div>
  );
}

// ─── Loading / error / empty states ──────────────────────────
function LoadingState() {
  return <div className="mt-16 flex flex-col items-center gap-3 text-white/55"><Loader2 className="h-7 w-7 animate-spin" /><p>Loading…</p></div>;
}
function ErrorState({ msg, onRetry }: { msg: string; onRetry: () => void }) {
  return (
    <div className="mt-8 flex items-start gap-4 rounded-2xl border border-white/15 bg-white/5 p-6">
      <AlertCircle className="h-6 w-6 shrink-0 text-rev-orange" />
      <div>
        <p className="font-display text-lg font-bold text-white">Couldn&apos;t load data</p>
        <p className="mt-1 text-sm text-white/55">{msg}</p>
        <button className="mt-4 inline-flex h-10 items-center rounded-full border border-white/20 bg-white/5 px-4 text-sm font-bold text-white" onClick={onRetry} type="button">Try again</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// INDIVIDUALS VIEW
// ═══════════════════════════════════════════════════════════════
function IndividualsView() {
  const { data: all, state, error, reload } = useRegistrations();
  const [query,      setQuery]      = useState("");
  const [pathway,    setPathway]    = useState("All");
  const [repayment,  setRepayment]  = useState("All");

  // Only non-school registrations
  const individuals = useMemo(() => all.filter(r => !isSchool(r)), [all]);

  const filtered = useMemo(() => {
    return individuals.filter(r => {
      const q = query.toLowerCase();
      const matchQ = [r.fullName, r.email, r.phone, r.organization, r.role, getApplyAs(r.notes), getNote(r.notes, "state")]
        .join(" ").toLowerCase().includes(q);
      const matchP = pathway   === "All" || getApplyAs(r.notes)              === pathway;
      const matchR = repayment === "All" || getNote(r.notes, "repaymentTenor") === repayment;
      return matchQ && matchP && matchR;
    });
  }, [individuals, query, pathway, repayment]);

  const stats = useMemo(() => [
    { label: "Total Individuals", value: individuals.length },
    { label: "Independent",       value: individuals.filter(r => getApplyAs(r.notes) === "Individual").length },
    { label: "Via LTBT",          value: individuals.filter(r => getApplyAs(r.notes) === "LTBT").length },
    { label: "Government Staff",  value: individuals.filter(r => getApplyAs(r.notes) === "Government").length },
    { label: "Buy Outright",      value: individuals.filter(r => getNote(r.notes, "repaymentTenor") === "Buy Outright (Discounted)").length },
    { label: "Financing",         value: individuals.filter(r => getNote(r.notes, "repaymentTenor") !== "Buy Outright (Discounted)" && getNote(r.notes, "repaymentTenor") !== "—").length },
  ], [individuals]);

  async function exportExcel() {
    const XLSX = await import("xlsx");
    const rows = filtered.map(r => ({
      Name:           r.fullName,
      Email:          r.email,
      Phone:          r.phone,
      School:         r.organization,
      Role:           r.role,
      Pathway:        getApplyAs(r.notes),
      "Gov Body":     getNote(r.notes, "applyAs") === "government" ? getNote(r.notes, "governmentBodyId") : "—",
      Device:         getNote(r.notes, "device"),
      Repayment:      getNote(r.notes, "repaymentTenor"),
      "Salary Band":  getNote(r.notes, "salaryBand"),
      State:          getNote(r.notes, "state"),
      LGA:            getNote(r.notes, "lga"),
      Position:       getNote(r.notes, "position"),
      "School Type":  getNote(r.notes, "schoolType"),
      "Yrs Teaching": getNote(r.notes, "yearsTeaching"),
      "Owns Laptop":  getNote(r.notes, "ownsLaptop"),
      "KYC Consent":  getNote(r.notes, "kycConsent"),
      Date:           new Date(r.createdAt).toLocaleString(),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Individuals");
    XLSX.writeFile(wb, `revrica-individuals-${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  if (state === "loading" || state === "idle") return <LoadingState />;
  if (state === "error") return <ErrorState msg={error!} onRetry={reload} />;
  if (individuals.length === 0) return (
    <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-black/8 bg-white p-12 text-center shadow-sm">
      <Inbox className="h-9 w-9 text-slate-body/40" />
      <p className="font-display text-lg font-bold text-slate-ink">No individual applications yet</p>
    </div>
  );

  return (
    <>
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map(s => <StatCard key={s.label} label={s.label} value={s.value} />)}
      </div>

      {/* Breakdown charts */}
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-black/8 bg-white p-6 shadow-sm">
          <h3 className="font-display text-base font-bold text-slate-ink mb-4">By Pathway</h3>
          {["Individual", "LTBT", "Government"].map(p => {
            const count = individuals.filter(r => getApplyAs(r.notes) === p).length;
            const pct   = individuals.length ? (count / individuals.length) * 100 : 0;
            return (
              <div key={p} className="mb-3">
                <div className="mb-1.5 flex justify-between text-sm text-slate-body"><span>{p}</span><span className="font-bold">{count}</span></div>
                <div className="h-2 rounded-full bg-black/6"><div className="h-full rounded-full" style={{ width: `${pct}%`, background: getPathwayColor(p) }} /></div>
              </div>
            );
          })}
        </div>
        <div className="rounded-2xl border border-black/8 bg-white p-6 shadow-sm">
          <h3 className="font-display text-base font-bold text-slate-ink mb-4">By Repayment</h3>
          {["Buy Outright (Discounted)", "12 Months", "24 Months", "36 Months"].map(opt => {
            const count = individuals.filter(r => getNote(r.notes, "repaymentTenor") === opt).length;
            const pct   = individuals.length ? (count / individuals.length) * 100 : 0;
            return (
              <div key={opt} className="mb-3">
                <div className="mb-1.5 flex justify-between text-sm text-slate-body"><span>{opt}</span><span className="font-bold">{count}</span></div>
                <div className="h-2 rounded-full bg-black/6"><div className="h-full rounded-full bg-[#581319]" style={{ width: `${pct}%` }} /></div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="mt-5 overflow-hidden rounded-2xl border border-black/8 bg-white shadow-sm">
        <div className="border-b border-black/8 p-5">
          <div className="grid gap-3 md:grid-cols-[1fr_180px_220px]">
            <label className="relative">
              <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-body/40" />
              <input className="focus-ring h-11 w-full rounded-xl border border-black/12 bg-white pl-11 pr-4 text-sm text-slate-ink placeholder:text-slate-body/45"
                onChange={e => setQuery(e.target.value)} placeholder="Search name, email, school, state…" value={query} />
            </label>
            <select className="focus-ring h-11 rounded-xl border border-black/12 bg-white px-4 text-sm text-slate-ink"
              onChange={e => setPathway(e.target.value)} value={pathway}>
              {["All", "Individual", "LTBT", "Government"].map(p => <option key={p}>{p}</option>)}
            </select>
            <select className="focus-ring h-11 rounded-xl border border-black/12 bg-white px-4 text-sm text-slate-ink"
              onChange={e => setRepayment(e.target.value)} value={repayment}>
              {["All", "Buy Outright (Discounted)", "12 Months", "24 Months", "36 Months"].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
            <p className="text-xs text-slate-body/55">{filtered.length} record{filtered.length !== 1 ? "s" : ""}</p>
            <div className="flex gap-2">
              <button onClick={reload} className="inline-flex h-9 items-center gap-2 rounded-full border border-black/12 px-4 text-xs font-bold text-slate-body transition hover:border-black/25" type="button">
                <RefreshCw className="h-3.5 w-3.5" /> Refresh
              </button>
              <button onClick={exportExcel} disabled={filtered.length === 0}
                className="inline-flex h-9 items-center gap-2 rounded-full bg-[#581319] px-4 text-xs font-bold text-white disabled:opacity-40" type="button">
                <Download className="h-3.5 w-3.5" /> Export
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead className="bg-black/[0.025] text-[11px] uppercase tracking-[0.1em] text-slate-body/60">
              <tr>
                {["Name","Email","Phone","School / Org","Pathway","Device","Repayment","State","Date"].map(h => (
                  <th className="px-5 py-3.5" key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => {
                const pw = getApplyAs(r.notes);
                return (
                  <tr className="border-t border-black/5 hover:bg-black/[0.012]" key={r.id}>
                    <td className="px-5 py-4 font-bold text-slate-ink">{r.fullName}</td>
                    <td className="px-5 py-4 text-slate-body">{r.email}</td>
                    <td className="px-5 py-4 text-slate-body">{r.phone}</td>
                    <td className="px-5 py-4 text-slate-body">{r.organization}</td>
                    <td className="px-5 py-4">
                      <span className="inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white" style={{ background: getPathwayColor(pw) }}>{pw}</span>
                    </td>
                    <td className="px-5 py-4 text-slate-body">{getNote(r.notes, "device") || "—"}</td>
                    <td className="px-5 py-4 text-slate-body">{getNote(r.notes, "repaymentTenor")}</td>
                    <td className="px-5 py-4 text-slate-body">{getNote(r.notes, "state")}</td>
                    <td className="px-5 py-4 text-slate-body">{new Date(r.createdAt).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// SCHOOLS VIEW
// ═══════════════════════════════════════════════════════════════
function SchoolsView() {
  const { data: all, state, error, reload } = useRegistrations();
  const [query,   setQuery]   = useState("");
  const [devType, setDevType] = useState("All");
  const [purpose, setPurpose] = useState("All");

  const schools = useMemo(() => all.filter(r => isSchool(r)), [all]);

  const filtered = useMemo(() => {
    return schools.filter(r => {
      const q = query.toLowerCase();
      const matchQ = [r.fullName, r.email, r.phone, r.organization, getNote(r.notes, "role")]
        .join(" ").toLowerCase().includes(q);
      const dt  = getNote(r.notes, "deviceTypes");
      const pur = getNote(r.notes, "purposes");
      const matchDT  = devType  === "All" || dt.includes(devType.toLowerCase());
      const matchPur = purpose  === "All" || pur.includes(purpose.toLowerCase());
      return matchQ && matchDT && matchPur;
    });
  }, [schools, query, devType, purpose]);

  const stats = useMemo(() => {
    const financing = (val: string) => {
      try { return (JSON.parse(val)?.financingInterest === "yes"); } catch { return false; }
    };
    return [
      { label: "Total Schools",       value: schools.length },
      { label: "Interested in Finance",value: schools.filter(r => r.notes && financing(r.notes)).length },
      { label: "Want Laptops",         value: schools.filter(r => getNote(r.notes, "deviceTypes").includes("laptops")).length },
      { label: "Want Tablets",         value: schools.filter(r => getNote(r.notes, "deviceTypes").includes("tablets")).length },
      { label: "Lab Setups",           value: schools.filter(r => getNote(r.notes, "purposes").includes("lab")).length },
      { label: "For Teachers",         value: schools.filter(r => getNote(r.notes, "purposes").includes("teachers")).length },
    ];
  }, [schools]);

  async function exportExcel() {
    const XLSX = await import("xlsx");
    const rows = filtered.map(r => ({
      "Contact Name":       r.fullName,
      Email:                r.email,
      Phone:                r.phone,
      "School Name":        r.organization,
      Role:                 getNote(r.notes, "role"),
      "Device Types":       getNote(r.notes, "deviceTypes"),
      "Est. Device Count":  r.deviceCount ?? "—",
      "Purposes":           getNote(r.notes, "purposes"),
      "Financing Interest": getNote(r.notes, "financingInterest"),
      Comments:             getNote(r.notes, "comments"),
      Date:                 new Date(r.createdAt).toLocaleString(),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Schools");
    XLSX.writeFile(wb, `revrica-schools-${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  if (state === "loading" || state === "idle") return <LoadingState />;
  if (state === "error") return <ErrorState msg={error!} onRetry={reload} />;
  if (schools.length === 0) return (
    <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-black/8 bg-white p-12 text-center shadow-sm">
      <Building2 className="h-9 w-9 text-slate-body/40" />
      <p className="font-display text-lg font-bold text-slate-ink">No school enquiries yet</p>
      <p className="max-w-sm text-sm leading-6 text-slate-body">School submissions via /apply/school will appear here.</p>
    </div>
  );

  return (
    <>
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map(s => <StatCard key={s.label} label={s.label} value={s.value} color={s.label === "Interested in Finance" ? "#581319" : undefined} />)}
      </div>

      {/* Device interest breakdown */}
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-black/8 bg-white p-6 shadow-sm">
          <h3 className="font-display text-base font-bold text-slate-ink mb-4">Device Interest</h3>
          {["laptops", "tablets", "all-in-ones", "cloud-server", "interactive-boards"].map(d => {
            const label = { "laptops": "Laptops", "tablets": "Tablets", "all-in-ones": "All-in-One PCs", "cloud-server": "Cloud / Server", "interactive-boards": "Interactive Boards" }[d] ?? d;
            const count = schools.filter(r => getNote(r.notes, "deviceTypes").includes(d)).length;
            const pct   = schools.length ? (count / schools.length) * 100 : 0;
            return (
              <div key={d} className="mb-3">
                <div className="mb-1.5 flex justify-between text-sm text-slate-body"><span>{label}</span><span className="font-bold">{count}</span></div>
                <div className="h-2 rounded-full bg-black/6"><div className="h-full rounded-full bg-[#581319]" style={{ width: `${pct}%` }} /></div>
              </div>
            );
          })}
        </div>
        <div className="rounded-2xl border border-black/8 bg-white p-6 shadow-sm">
          <h3 className="font-display text-base font-bold text-slate-ink mb-4">Purpose</h3>
          {[["teachers","For Teachers"],["students","For Students"],["lab","Lab Setup"],["admin","Administrative"]].map(([id, label]) => {
            const count = schools.filter(r => getNote(r.notes, "purposes").includes(id)).length;
            const pct   = schools.length ? (count / schools.length) * 100 : 0;
            return (
              <div key={id} className="mb-3">
                <div className="mb-1.5 flex justify-between text-sm text-slate-body"><span>{label}</span><span className="font-bold">{count}</span></div>
                <div className="h-2 rounded-full bg-black/6"><div className="h-full rounded-full bg-[#FF6B1A]" style={{ width: `${pct}%` }} /></div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="mt-5 overflow-hidden rounded-2xl border border-black/8 bg-white shadow-sm">
        <div className="border-b border-black/8 p-5">
          <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
            <label className="relative">
              <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-body/40" />
              <input className="focus-ring h-11 w-full rounded-xl border border-black/12 bg-white pl-11 pr-4 text-sm text-slate-ink placeholder:text-slate-body/45"
                onChange={e => setQuery(e.target.value)} placeholder="Search school, contact, email…" value={query} />
            </label>
            <select className="focus-ring h-11 rounded-xl border border-black/12 bg-white px-4 text-sm text-slate-ink"
              onChange={e => setDevType(e.target.value)} value={devType}>
              {["All", "Laptops", "Tablets", "All-in-Ones", "Cloud / Server", "Interactive Boards"].map(o => <option key={o}>{o}</option>)}
            </select>
            <select className="focus-ring h-11 rounded-xl border border-black/12 bg-white px-4 text-sm text-slate-ink"
              onChange={e => setPurpose(e.target.value)} value={purpose}>
              {["All", "Teachers", "Students", "Lab", "Admin"].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
            <p className="text-xs text-slate-body/55">{filtered.length} school{filtered.length !== 1 ? "s" : ""}</p>
            <div className="flex gap-2">
              <button onClick={reload} className="inline-flex h-9 items-center gap-2 rounded-full border border-black/12 px-4 text-xs font-bold text-slate-body" type="button">
                <RefreshCw className="h-3.5 w-3.5" /> Refresh
              </button>
              <button onClick={exportExcel} disabled={filtered.length === 0}
                className="inline-flex h-9 items-center gap-2 rounded-full bg-[#581319] px-4 text-xs font-bold text-white disabled:opacity-40" type="button">
                <Download className="h-3.5 w-3.5" /> Export
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-black/[0.025] text-[11px] uppercase tracking-[0.1em] text-slate-body/60">
              <tr>
                {["Contact","Email","Phone","School","Role","Devices Wanted","Est. Count","For","Finance?","Date"].map(h => (
                  <th className="px-5 py-3.5" key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => {
                const fi = getNote(r.notes, "financingInterest");
                const fiColor = fi === "yes" ? "#16a34a" : fi === "maybe" ? "#d97706" : fi === "no" ? "#9ca3af" : "#9ca3af";
                const fiLabel = fi === "yes" ? "Yes" : fi === "maybe" ? "Maybe" : fi === "no" ? "No" : "—";
                return (
                  <tr className="border-t border-black/5 hover:bg-black/[0.012]" key={r.id}>
                    <td className="px-5 py-4 font-bold text-slate-ink">{r.fullName}</td>
                    <td className="px-5 py-4 text-slate-body">{r.email}</td>
                    <td className="px-5 py-4 text-slate-body">{r.phone}</td>
                    <td className="px-5 py-4 font-semibold text-slate-ink">{r.organization}</td>
                    <td className="px-5 py-4 text-slate-body text-xs">{getNote(r.notes, "role")}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(() => {
                          try {
                            const dt = JSON.parse(r.notes ?? "{}").deviceTypes ?? [];
                            return dt.map((d: string) => (
                              <span key={d} className="inline-block rounded-full bg-[#581319]/8 px-2 py-0.5 text-[10px] font-bold text-[#581319]">{d}</span>
                            ));
                          } catch { return "—"; }
                        })()}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-body text-center">{r.deviceCount ?? "—"}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(() => {
                          try {
                            const pur = JSON.parse(r.notes ?? "{}").purposes ?? [];
                            return pur.map((p: string) => (
                              <span key={p} className="inline-block rounded-full bg-[#FF6B1A]/10 px-2 py-0.5 text-[10px] font-bold text-[#FF6B1A]">{p}</span>
                            ));
                          } catch { return "—"; }
                        })()}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white" style={{ background: fiColor }}>{fiLabel}</span>
                    </td>
                    <td className="px-5 py-4 text-slate-body">{new Date(r.createdAt).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}