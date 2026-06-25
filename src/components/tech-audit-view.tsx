"use client";

import { AlertCircle, ClipboardCheck, Download, Inbox, Loader2, RefreshCw, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  getAnsweredRate,
  getAverageOverallScore,
  getBandDistribution,
  getOptionFrequencies,
  getOverallBand,
  getSectionAverages
} from "@/lib/audit-analytics";
import { auditSections } from "@/lib/audit-data";
import { bandForScore } from "@/lib/audit-scoring";
import { roles } from "@/lib/data";
import type { TechAuditRequest } from "@/lib/types";

type FetchState = "idle" | "loading" | "error" | "ready";

const bandColors: Record<string, string> = {
  Foundation: "bg-rev-orange",
  Development: "bg-amber-500",
  Intermediate: "bg-yellow-500",
  Advanced: "bg-emerald-500",
  Excellence: "bg-maroon"
};

const sectionColors: Record<string, string> = {
  "Student Engagement & Learning Outcomes": "bg-rev-orange",
  "Teaching Effectiveness & Professional Development": "bg-maroon",
  "Infrastructure & Learning Environment": "bg-amber-500",
  "Strategic Vision & ROI Focus": "bg-slate-ink"
};

export function TechAuditView() {
  const [requests, setRequests] = useState<TechAuditRequest[]>([]);
  const [fetchState, setFetchState] = useState<FetchState>("idle");
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("All");

  async function loadRequests() {
    setFetchState("loading");
    setFetchError(null);
    try {
      const response = await fetch("/api/admin/tech-audit");
      const body = await response.json();
      if (!response.ok) {
        setFetchError(body?.error ?? "Could not load tech audit requests.");
        setFetchState("error");
        return;
      }
      setRequests(body.requests);
      setFetchState("ready");
    } catch {
      setFetchError("Could not reach the server. Check your connection and try again.");
      setFetchState("error");
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

  const filtered = useMemo(() => {
    return requests.filter((item) => {
      const q = query.toLowerCase();
      const matchesQuery = [item.schoolName, item.contactName, item.email, item.phone]
        .join(" ")
        .toLowerCase()
        .includes(q);
      const matchesRole = role === "All" || item.role === role;
      return matchesQuery && matchesRole;
    });
  }, [query, requests, role]);

  const avgScore = useMemo(() => getAverageOverallScore(requests), [requests]);
  const overallBand = useMemo(() => getOverallBand(requests), [requests]);
  const bandDistribution = useMemo(() => getBandDistribution(requests), [requests]);
  const sectionAverages = useMemo(() => getSectionAverages(requests), [requests]);
  const answeredRate = useMemo(() => getAnsweredRate(requests), [requests]);
  const optionFrequencies = useMemo(() => getOptionFrequencies(requests), [requests]);
  const lowMaturityOptions = useMemo(
    () => optionFrequencies.filter((entry) => entry.letter === "A" || entry.letter === "B").slice(0, 10),
    [optionFrequencies]
  );

  async function exportExcel() {
    const XLSX = await import("xlsx");
    const rows = filtered.map((item) => ({
      School: item.schoolName,
      Contact: item.contactName,
      Email: item.email,
      Phone: item.phone,
      Role: item.role,
      "Device Estimate": item.deviceEstimate ?? "",
      "Overall Score": item.overallScore ?? "",
      Notes: item.notes ?? "",
      Date: new Date(item.createdAt).toLocaleString()
    }));
    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet["!cols"] = [
      { wch: 26 },
      { wch: 22 },
      { wch: 26 },
      { wch: 16 },
      { wch: 18 },
      { wch: 16 },
      { wch: 14 },
      { wch: 30 },
      { wch: 18 }
    ];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tech Audit Requests");
    const dateStamp = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(workbook, `revrica-tech-audit-${dateStamp}.xlsx`);
  }

  if (fetchState === "error") {
    return (
      <div className="mt-8 flex items-start gap-4 rounded-2xl border border-white/15 bg-white/5 p-6">
        <AlertCircle className="h-6 w-6 shrink-0 text-rev-orange" />
        <div>
          <p className="font-display text-lg font-bold text-white">Couldn&apos;t load tech audit requests</p>
          <p className="mt-1 text-sm leading-6 text-white/60">{fetchError}</p>
          <button
            className="focus-ring mt-4 inline-flex h-10 items-center rounded-full border border-white/20 bg-white/5 px-4 text-sm font-bold text-white transition hover:border-white/40"
            onClick={loadRequests}
            type="button"
          >
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
        <p>Loading tech audit requests…</p>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-black/8 bg-white p-12 text-center shadow-sm">
        <Inbox className="h-9 w-9 text-slate-body/40" />
        <p className="font-display text-lg font-bold text-slate-ink">No tech audit requests yet</p>
        <p className="max-w-sm text-sm leading-6 text-slate-body">
          Once schools complete the assessment on the Free Tech Audit page, their responses will appear here.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-8 flex items-center justify-end gap-3">
        <button
          className="focus-ring inline-flex h-11 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 text-sm font-bold text-white transition hover:border-white/40 hover:bg-white/10"
          onClick={loadRequests}
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

      {/* TOP-LINE STATS */}
      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {[
          ["Total Requests", requests.length],
          ["Avg Maturity Score", avgScore !== null ? avgScore.toFixed(2) : "—"],
          ["Overall Band", overallBand?.label ?? "—"],
          ["Question Completion", `${answeredRate}%`]
        ].map(([label, value]) => (
          <div className="rounded-[1.5rem] border border-black/8 bg-white p-6 shadow-sm" key={String(label)}>
            <p className="font-display text-3xl font-extrabold text-slate-ink">{value}</p>
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.1em] text-slate-body/70">{label}</p>
          </div>
        ))}
      </div>

      {/* MATURITY BAND DISTRIBUTION + SECTION AVERAGES */}
      <div className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[1.5rem] border border-black/8 bg-white p-7 shadow-sm">
          <h2 className="font-display text-xl font-bold text-slate-ink">Maturity Band Distribution</h2>
          <p className="mt-1 text-sm text-slate-body/70">Foundation → Excellence, per the Imperial EdTech framework</p>
          <div className="mt-5 grid gap-3">
            {bandDistribution.map((entry) => (
              <div key={entry.band}>
                <div className="mb-2 flex justify-between text-sm text-slate-body">
                  <span className="font-bold text-slate-ink">{entry.band}</span>
                  <span>
                    {entry.count} {entry.count === 1 ? "school" : "schools"} ({entry.pct}%)
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-black/6">
                  <div
                    className={`h-full rounded-full ${bandColors[entry.band] ?? "bg-rev-orange"}`}
                    style={{ width: `${entry.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-black/8 bg-white p-7 shadow-sm">
          <h2 className="font-display text-xl font-bold text-slate-ink">Section Averages</h2>
          <p className="mt-1 text-sm text-slate-body/70">Average maturity score (1–5) per section</p>
          <div className="mt-5 grid gap-4">
            {sectionAverages.map((section) => (
              <div key={section.sectionId}>
                <div className="mb-2 flex items-baseline justify-between text-sm text-slate-body">
                  <span className="font-bold text-slate-ink">{section.title}</span>
                  <span>
                    {section.avgScore !== null ? section.avgScore.toFixed(2) : "—"}
                    {section.band ? ` · ${section.band.label}` : ""}
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-black/6">
                  <div
                    className={`h-full rounded-full ${sectionColors[section.title] ?? "bg-rev-orange"}`}
                    style={{ width: `${section.avgScore !== null ? (section.avgScore / 5) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROLE BREAKDOWN */}
      <div className="mt-6 rounded-[1.5rem] border border-black/8 bg-white p-7 shadow-sm">
        <h2 className="font-display text-xl font-bold text-slate-ink">Role Breakdown</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {["Teacher", "School Owner", "School Administrator", "Parent", "Education Professional"].map((name) => {
            const count = requests.filter((item) => item.role === name).length;
            const width = requests.length ? (count / requests.length) * 100 : 0;
            return (
              <div key={name}>
                <div className="mb-2 flex justify-between text-sm text-slate-body">
                  <span>{name}</span>
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

      {/* HIGHEST-IMPACT GAPS — A/B responses, per the source doc's "high-impact opportunity" framing */}
      <div className="mt-6 rounded-[1.5rem] border border-black/8 bg-white p-7 shadow-sm">
        <div className="flex items-center gap-3">
          <ClipboardCheck className="h-6 w-6 text-rev-orange" />
          <h2 className="font-display text-xl font-bold text-slate-ink">Highest-Impact Gaps</h2>
        </div>
        <p className="mt-1 text-sm text-slate-body/70">
          Most commonly checked Foundation/Development (A/B) answers — where schools have the most room to grow
        </p>
        <div className="mt-5 grid gap-4">
          {lowMaturityOptions.map((entry, index) => (
            <div key={`${entry.promptLabel}-${entry.letter}-${index}`}>
              <div className="mb-1.5 flex items-start justify-between gap-4 text-sm">
                <div className="min-w-0">
                  <span className="mr-2 figures text-xs font-bold text-stone">{`0${index + 1}`}</span>
                  <span className="font-bold text-slate-ink">{entry.optionText}</span>
                  <span className="ml-2 text-xs uppercase tracking-wide text-slate-body/50">
                    Q{entry.itemNumber} · {entry.sectionTitle}
                  </span>
                </div>
                <span className="shrink-0 font-bold text-slate-ink">
                  {entry.count} <span className="text-slate-body/50">({entry.pct}%)</span>
                </span>
              </div>
              <div className="h-2 rounded-full bg-black/6">
                <div className="h-full rounded-full bg-rev-orange" style={{ width: `${entry.pct}%` }} />
              </div>
            </div>
          ))}
        </div>

        <details className="mt-6">
          <summary className="cursor-pointer text-sm font-bold text-rev-orange">Show all 200 answer options</summary>
          <div className="mt-4 max-h-[480px] overflow-y-auto">
            {auditSections.map((section) => (
              <div className="mb-5" key={section.id}>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-body/50">{section.title}</p>
                <div className="mt-2 grid gap-2">
                  {optionFrequencies
                    .filter((entry) => entry.sectionTitle === section.title)
                    .map((entry, index) => (
                      <div className="flex items-center justify-between gap-4 border-t border-black/6 pt-2 text-sm" key={`${entry.promptLabel}-${entry.letter}-${index}-full`}>
                        <div className="min-w-0">
                          <span className="mr-1 font-bold text-slate-ink">{entry.letter}.</span>
                          <span className="text-slate-body">{entry.optionText}</span>
                        </div>
                        <span className="shrink-0 text-xs font-bold text-slate-body/60">
                          {entry.count} ({entry.pct}%)
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </details>
      </div>

      {/* SUBMISSIONS TABLE */}
      <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-black/8 bg-white shadow-sm">
        <div className="border-b border-black/8 p-6">
          <div className="grid gap-3 md:grid-cols-[1fr_220px]">
            <label className="relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-body/50" />
              <input
                className="focus-ring h-12 w-full rounded-xl border border-black/12 bg-white pl-12 pr-4 text-sm text-slate-ink placeholder:text-slate-body/50"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search school, contact, email..."
                value={query}
              />
            </label>
            <select
              className="focus-ring h-12 rounded-xl border border-black/12 bg-white px-4 text-sm text-slate-ink"
              onChange={(event) => setRole(event.target.value)}
              value={role}
            >
              {["All", ...roles].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead className="bg-black/3 text-xs uppercase tracking-[0.1em] text-slate-body/70">
              <tr>
                {["School", "Contact", "Email", "Phone", "Role", "Score", "Band", "Date"].map((heading) => (
                  <th className="px-6 py-4" key={heading}>{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const score = item.overallScore;
                const band = score !== null && score !== undefined ? bandForScore(score) : null;
                return (
                  <tr className="border-t border-black/6 align-top" key={item.id}>
                    <td className="px-6 py-5 font-bold text-slate-ink">{item.schoolName}</td>
                    <td className="px-6 py-5 text-slate-body">{item.contactName}</td>
                    <td className="px-6 py-5 text-slate-body">{item.email}</td>
                    <td className="px-6 py-5 text-slate-body">{item.phone}</td>
                    <td className="px-6 py-5 text-slate-ink">{item.role}</td>
                    <td className="px-6 py-5 font-bold text-slate-ink">
                      {score !== null && score !== undefined ? score.toFixed(2) : "—"}
                    </td>
                    <td className="px-6 py-5 text-slate-body">{band?.label ?? "—"}</td>
                    <td className="px-6 py-5 text-slate-body">{new Date(item.createdAt).toLocaleDateString()}</td>
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
