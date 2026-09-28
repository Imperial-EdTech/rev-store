"use client";

import {
  AlertCircle,
  Download,
  ExternalLink,
  Inbox,
  Loader2,
  RefreshCw,
  Search
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { auditSections } from "@/lib/audit-data";
import {
  aggregateProductFrequencies,
  aggregateSectionGaps,
  scoreAudit,
  sectionPriority
} from "@/lib/audit-scoring";
import { roles } from "@/lib/data";
import type { TechAuditRequest } from "@/lib/tech-audits/schema";
import { adminFetch } from "@/lib/admin-fetch";

type FetchState = "idle" | "loading" | "error" | "ready";

// Product categories for colour grouping in the bar chart
const PRODUCT_COLORS: Record<string, string> = {
  "School Management Systems": "bg-maroon",
  "LMS": "bg-maroon",
  "E-Boards": "bg-rev-orange",
  "Tablets / Laptops": "bg-rev-orange",
  "Teacher Laptop Ownership Programme": "bg-amber-500",
  "Rev Micro-Cloud Server": "bg-amber-500",
  "Mobile Device Management (MDM)": "bg-slate-600",
  "STEM / Robotics Labs": "bg-emerald-600",
  "Digital Learning Content": "bg-sky-600",
  "Capacity Development": "bg-purple-600"
};

function productColor(product: string) {
  return PRODUCT_COLORS[product] ?? "bg-stone-500";
}

export function TechAuditView() {
  const [requests, setRequests] = useState<TechAuditRequest[]>([]);
  const [fetchState, setFetchState] = useState<FetchState>("idle");
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  async function loadRequests() {
    setFetchState("loading");
    setFetchError(null);
    try {
      const res = await adminFetch("/api/admin/tech-audit");
      const body = await res.json();
      if (!res.ok) {
        setFetchError(body?.error ?? "Could not load requests.");
        setFetchState("error");
        return;
      }
      setRequests(body.requests);
      setFetchState("ready");
    } catch {
      setFetchError("Could not reach the server. Check your connection.");
      setFetchState("error");
    }
  }

  useEffect(() => { loadRequests(); }, []);

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      const q = query.toLowerCase();
      const matchQ = [r.schoolName, r.contactName, r.email, r.phone]
        .join(" ").toLowerCase().includes(q);
      const matchR = roleFilter === "All" || r.role === roleFilter;
      return matchQ && matchR;
    });
  }, [query, roleFilter, requests]);

  // Aggregate analytics
  const allAnswers = useMemo(() => requests.map((r) => r.answers), [requests]);
  const productFreqs = useMemo(() => aggregateProductFrequencies(allAnswers), [allAnswers]);
  const sectionGapAvgs = useMemo(() => aggregateSectionGaps(allAnswers), [allAnswers]);
  const top10Products = productFreqs.slice(0, 10);

  async function exportExcel() {
    const XLSX = await import("xlsx");

    // Sheet 1: submissions
    const submissionRows = filtered.map((r) => ({
      School: r.schoolName,
      Contact: r.contactName,
      Email: r.email,
      Phone: r.phone,
      Role: r.role,
      "Device Estimate": r.deviceEstimate ?? "",
      "Top Product 1": r.topProducts[0] ?? "",
      "Top Product 2": r.topProducts[1] ?? "",
      "Top Product 3": r.topProducts[2] ?? "",
      Notes: r.notes ?? "",
      Date: new Date(r.createdAt).toLocaleString()
    }));

    // Sheet 2: per-school section gaps
    const gapRows = filtered.map((r) => {
      const score = scoreAudit(r.answers);
      const row: Record<string, string | number> = {
        School: r.schoolName,
        Email: r.email
      };
      for (const gap of score.sectionGaps) {
        row[`${gap.sectionTitle} — Gap Score`] = gap.gapScore;
      }
      return row;
    });

    // Sheet 3: aggregate product frequencies
    const freqRows = productFreqs.map((f) => ({
      Product: f.product,
      "Schools Triggering": f.count,
      "% of Submissions": f.pct
    }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(submissionRows), "Submissions");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(gapRows), "Section Gaps");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(freqRows), "Product Frequencies");

    const stamp = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `revrica-tech-audit-${stamp}.xlsx`);
  }

  // ── States ──────────────────────────────────────────────────────────────────

  if (fetchState === "error") {
    return (
      <div className="mt-8 flex items-start gap-4 rounded-2xl border border-white/15 bg-white/5 p-6">
        <AlertCircle className="h-6 w-6 shrink-0 text-rev-orange" />
        <div>
          <p className="font-display text-lg font-bold text-white">Couldn't load tech audit requests</p>
          <p className="mt-1 text-sm text-white/60">{fetchError}</p>
          <button
            className="focus-ring mt-4 inline-flex h-10 items-center rounded-full border border-white/20 bg-white/5 px-4 text-sm font-bold text-white"
            onClick={loadRequests}
            type="button"
          >Try again</button>
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
        <p className="font-display text-lg font-bold text-slate-ink">No tech audit submissions yet</p>
        <p className="max-w-sm text-sm leading-6 text-slate-body">
          Once schools complete the assessment at /tech-audit, their responses will appear here.
        </p>
      </div>
    );
  }

  // ── Dashboard ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Toolbar */}
      <div className="mt-8 flex items-center justify-end gap-3">
        <button
          className="focus-ring inline-flex h-11 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 text-sm font-bold text-white transition hover:border-white/40 hover:bg-white/10"
          onClick={loadRequests}
          type="button"
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
        <button
          className="focus-ring inline-flex h-11 items-center gap-2 rounded-full bg-rev-orange px-5 text-sm font-bold text-white disabled:opacity-40"
          disabled={filtered.length === 0}
          onClick={exportExcel}
          type="button"
        >
          <Download className="h-4 w-4" /> Export Excel
        </button>
      </div>

      {/* Top-line stats */}
      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {[
          ["Total Submissions", requests.length],
          ["Most Triggered Product", top10Products[0]?.product ?? "—"],
          ["Sections with Most Gaps", sectionGapAvgs.sort((a, b) => b.avgGapScore - a.avgGapScore)[0]?.sectionTitle.split(" ")[0] ?? "—"],
          ["Unique Products Triggered", new Set(requests.flatMap((r) => r.topProducts)).size]
        ].map(([label, value]) => (
          <div className="rounded-[1.5rem] border border-black/8 bg-white p-6 shadow-sm" key={String(label)}>
            <p className="font-display text-3xl font-extrabold text-slate-ink leading-tight">{value}</p>
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.1em] text-slate-body/70">{label}</p>
          </div>
        ))}
      </div>

      {/* Product frequencies + Section gaps */}
      <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Most triggered products */}
        <div className="rounded-[1.5rem] border border-black/8 bg-white p-7 shadow-sm">
          <h2 className="font-display text-xl font-bold text-slate-ink">
            Most Triggered Products
          </h2>
          <p className="mt-1 text-sm text-slate-body/70">
            How many schools' answers point to each product
          </p>
          <div className="mt-5 space-y-3">
            {top10Products.map((f) => (
              <div key={f.product}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="font-medium text-slate-ink">{f.product}</span>
                  <span className="text-slate-body/60">{f.count} schools ({f.pct}%)</span>
                </div>
                <div className="h-2.5 rounded-full bg-black/6">
                  <div
                    className={`h-full rounded-full ${productColor(f.product)}`}
                    style={{ width: `${f.pct}%` }}
                  />
                </div>
              </div>
            ))}
            {productFreqs.length > 10 && (
              <p className="text-xs text-slate-body/40 pt-2">
                +{productFreqs.length - 10} more products triggered across submissions
              </p>
            )}
          </div>
        </div>

        {/* Section gap averages */}
        <div className="rounded-[1.5rem] border border-black/8 bg-white p-7 shadow-sm">
          <h2 className="font-display text-xl font-bold text-slate-ink">Section Gap Averages</h2>
          <p className="mt-1 text-sm text-slate-body/70">
            Average gap score per section across all schools (higher = more gaps)
          </p>
          <div className="mt-5 space-y-4">
            {[...sectionGapAvgs]
              .sort((a, b) => b.avgGapScore - a.avgGapScore)
              .map((s) => {
                const priority = sectionPriority(s.avgGapScore);
                const section = auditSections.find((sec) => sec.id === s.sectionId);
                return (
                  <div key={s.sectionId}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-ink">
                        {section ? `${section.letter}. ` : ""}{s.sectionTitle}
                      </span>
                      <span
                        className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                        style={{ color: priority.color, backgroundColor: `${priority.color}18` }}
                      >
                        {priority.label}
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full bg-black/6">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${s.avgGapScore}%`,
                          backgroundColor: priority.color
                        }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-body/40">
                      Avg gap score: {s.avgGapScore}%
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Role breakdown */}
      <div className="mt-6 rounded-[1.5rem] border border-black/8 bg-white p-7 shadow-sm">
        <h2 className="font-display text-xl font-bold text-slate-ink">Role Breakdown</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {["Teacher", "School Owner", "School Administrator", "Parent", "Education Professional", "Other"].map(
            (name) => {
              const count = requests.filter((r) => r.role === name).length;
              const pct = requests.length ? (count / requests.length) * 100 : 0;
              return (
                <div key={name}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="text-slate-body">{name}</span>
                    <span className="font-bold text-slate-ink">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-black/6">
                    <div className="h-full rounded-full bg-maroon" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* Submissions table */}
      <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-black/8 bg-white shadow-sm">
        <div className="border-b border-black/8 p-6">
          <div className="grid gap-3 md:grid-cols-[1fr_220px]">
            <label className="relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-body/50" />
              <input
                className="focus-ring h-12 w-full rounded-xl border border-black/12 bg-white pl-12 pr-4 text-sm text-slate-ink placeholder:text-slate-body/50"
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search school, contact, email…"
                value={query}
              />
            </label>
            <select
              className="focus-ring h-12 rounded-xl border border-black/12 bg-white px-4 text-sm text-slate-ink"
              onChange={(e) => setRoleFilter(e.target.value)}
              value={roleFilter}
            >
              {["All", ...roles].map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1040px] text-left text-sm">
            <thead className="bg-black/3 text-xs uppercase tracking-[0.1em] text-slate-body/70">
              <tr>
                {["School", "Contact", "Email", "Role", "Top Recommendations", "Date", "Report"].map((h) => (
                  <th className="px-6 py-4" key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr className="border-t border-black/6 align-top" key={item.id}>
                  <td className="px-6 py-5 font-bold text-slate-ink">{item.schoolName}</td>
                  <td className="px-6 py-5 text-slate-body">{item.contactName}</td>
                  <td className="px-6 py-5 text-slate-body">{item.email}</td>
                  <td className="px-6 py-5 text-slate-ink">{item.role}</td>
                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-1.5">
                      {(item.topProducts ?? []).slice(0, 3).map((p) => (
                        <span
                          key={p}
                          className="inline-block rounded-full bg-rev-orange/10 px-2.5 py-1 text-[11px] font-bold text-rev-orange"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-slate-body">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-5">
                    <Link
                      className="inline-flex items-center gap-1.5 rounded-full border border-rev-orange/30 px-3 py-1.5 text-xs font-bold text-rev-orange transition hover:bg-rev-orange hover:text-white"
                      href={`/admin/tech-audit/${item.id}`}
                      target="_blank"
                    >
                      View <ExternalLink className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
