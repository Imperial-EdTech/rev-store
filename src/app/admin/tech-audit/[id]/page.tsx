"use client";

/**
 * /admin/tech-audit/[id]/page.tsx
 *
 * Per-school audit report. Fetches one submission by ID and renders:
 *  1. Header — school name, contact, date, role
 *  2. Top product recommendations (trigger-count ranked)
 *  3. Section gap analysis (which sections have the most gaps)
 *  4. What the school actually selected (question-by-question summary)
 *  5. Print / export button
 *
 * Access: middleware redirects signed-out visitors to /admin/login, and
 * /api/admin/tech-audit/[id] checks the admin session itself.
 */

import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Printer
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/shell";
import { adminFetch } from "@/lib/admin-fetch";
import { allQuestions, auditSections, type AuditOption } from "@/lib/audit-data";
import { scoreAudit, sectionPriority, type AuditScore } from "@/lib/audit-scoring";
import type { TechAuditRequest } from "@/lib/tech-audits/schema";

// ─── Colour helpers ───────────────────────────────────────────────────────────

const PRIORITY_BG: Record<string, string> = {
  Critical: "bg-red-50 border-red-200",
  High: "bg-orange-50 border-orange-200",
  Medium: "bg-amber-50 border-amber-200",
  Low: "bg-yellow-50 border-yellow-100",
  Strong: "bg-emerald-50 border-emerald-200"
};

const PRIORITY_TEXT: Record<string, string> = {
  Critical: "text-red-700",
  High: "text-orange-700",
  Medium: "text-amber-700",
  Low: "text-yellow-700",
  Strong: "text-emerald-700"
};

const RANK_COLORS = [
  "bg-rev-orange text-white",
  "bg-maroon text-white",
  "bg-amber-500 text-white",
  "bg-slate-700 text-white",
  "bg-stone-500 text-white"
];

// ─── Report ───────────────────────────────────────────────────────────────────

function AuditReport({ request }: { request: TechAuditRequest }) {
  // Re-derive full score from raw answers so we always have complete data
  const score: AuditScore = scoreAudit(request.answers);
  const top5 = score.recommendations.slice(0, 5);
  const date = new Date(request.createdAt).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric"
  });

  return (
    <div className="min-h-screen bg-[#F3F1EF] print:bg-white">
      {/* Header bar */}
      <div className="maroon-glow relative border-b border-white/10 print:hidden">
        <div className="noise-overlay" />
        <div className="container-x relative z-10 flex h-16 items-center justify-between">
          <Link
            className="inline-flex items-center gap-2 text-sm font-bold text-white/70 hover:text-white"
            href="/admin"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          <button
            className="inline-flex items-center gap-2 rounded-full bg-rev-orange px-5 py-2.5 text-sm font-bold text-white"
            onClick={() => window.print()}
            type="button"
          >
            <Printer className="h-4 w-4" /> Print / Save PDF
          </button>
        </div>
      </div>

      <div className="container-x py-10 print:py-6">
        {/* ── 1. School header ── */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-black/8 bg-white p-8 shadow-sm"
          initial={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-rev-orange">
                Free Technology Audit — Confidential Report
              </p>
              <h1 className="mt-3 font-display text-4xl font-extrabold text-slate-ink">
                {request.schoolName}
              </h1>
              <p className="mt-2 text-lg text-slate-body">
                Contact: <strong>{request.contactName}</strong> ·{" "}
                <a className="text-rev-orange underline" href={`mailto:${request.email}`}>
                  {request.email}
                </a>{" "}
                · {request.phone}
              </p>
              <p className="mt-1 text-sm text-slate-body/70">
                Role: {request.role}
                {request.deviceEstimate ? ` · Device estimate: ${request.deviceEstimate}` : ""}
                {" · "}Submitted: {date}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2 text-right">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-body/50">
                Questions answered
              </p>
              <p className="font-display text-5xl font-extrabold text-slate-ink">
                {allQuestions.filter(
                  (q) => ((request.answers[String(q.number)] ?? []) as string[]).length > 0
                ).length}
                <span className="text-2xl text-slate-body/40">/{allQuestions.length}</span>
              </p>
              <p className="text-xs text-slate-body/50">
                {score.uniqueProductsTriggered} product areas triggered
              </p>
            </div>
          </div>
          {request.notes ? (
            <div className="mt-6 rounded-xl border border-black/8 bg-[#FAF8F6] px-5 py-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-body/50">
                Additional notes from school
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-body">{request.notes}</p>
            </div>
          ) : null}
        </motion.div>

        {/* ── 2. Top product recommendations ── */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-3xl border border-black/8 bg-white p-8 shadow-sm"
          initial={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <h2 className="font-display text-2xl font-bold text-slate-ink">
            Top Product Recommendations
          </h2>
          <p className="mt-1 text-sm text-slate-body/70">
            Ranked by how many of the school's selections point to each product.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {top5.map((rec, i) => (
              <div
                key={rec.product}
                className="flex items-start gap-4 rounded-2xl border border-black/8 bg-[#FAF8F6] p-5"
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${RANK_COLORS[i] ?? "bg-stone-400 text-white"}`}
                >
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="font-bold leading-tight text-slate-ink">{rec.product}</p>
                  <p className="mt-1 text-xs text-slate-body/60">
                    Triggered by {rec.triggerCount} selection
                    {rec.triggerCount !== 1 ? "s" : ""} · Q
                    {rec.triggeredByQuestions.join(", Q")}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {score.recommendations.length > 5 ? (
            <details className="mt-6">
              <summary className="cursor-pointer text-sm font-bold text-rev-orange">
                Show all {score.recommendations.length} triggered products
              </summary>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {score.recommendations.slice(5).map((rec) => (
                  <div
                    key={rec.product}
                    className="flex items-center justify-between rounded-xl border border-black/6 px-4 py-3"
                  >
                    <span className="text-sm font-medium text-slate-ink">{rec.product}</span>
                    <span className="text-xs font-bold text-slate-body/50">
                      {rec.triggerCount}×
                    </span>
                  </div>
                ))}
              </div>
            </details>
          ) : null}
        </motion.div>

        {/* ── 3. Section gap analysis ── */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-3xl border border-black/8 bg-white p-8 shadow-sm"
          initial={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h2 className="font-display text-2xl font-bold text-slate-ink">
            Where the Gaps Are
          </h2>
          <p className="mt-1 text-sm text-slate-body/70">
            Gap score = percentage of this section's triggering options that the school checked.
            Higher = more gaps = higher priority for intervention.
          </p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {score.sectionGaps.map((gap) => {
              const priority = sectionPriority(gap.gapScore);
              const section = auditSections.find((s) => s.id === gap.sectionId);
              return (
                <div
                  key={gap.sectionId}
                  className={`rounded-2xl border p-5 ${PRIORITY_BG[priority.label] ?? "bg-white border-black/8"}`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-slate-ink">{gap.sectionTitle}</p>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${PRIORITY_TEXT[priority.label] ?? "text-slate-body"}`}
                      style={{ backgroundColor: `${priority.color}18` }}
                    >
                      {priority.label}
                    </span>
                  </div>
                  <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-black/8">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${gap.gapScore}%`,
                        backgroundColor: priority.color
                      }}
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-body/60">
                    <span>
                      {gap.triggeringSelections} of {gap.maxTriggeringSelections} gap indicators
                    </span>
                    <span className="font-bold">{gap.gapScore}% gap score</span>
                  </div>
                  {section ? (
                    <p className="mt-3 text-xs text-slate-body/60">
                      Section {section.letter} · {section.questions.length} questions
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ── 4. Question-by-question summary ── */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-3xl border border-black/8 bg-white p-8 shadow-sm"
          initial={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <h2 className="font-display text-2xl font-bold text-slate-ink">
            Full Questionnaire Responses
          </h2>
          <p className="mt-1 text-sm text-slate-body/70">
            Every option the school selected, with the product triggers each option fires.
          </p>
          <div className="mt-6 space-y-8">
            {auditSections.map((section) => (
              <div key={section.id}>
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-rev-orange">
                  Section {section.letter} — {section.title}
                </p>
                <div className="space-y-5">
                  {section.questions.map((question) => {
                    const selected = (
                      (request.answers[String(question.number)] ?? []) as AuditOption["letter"][]
                    );
                    const unanswered = selected.length === 0;
                    return (
                      <div
                        key={question.number}
                        className="rounded-2xl border border-black/8 bg-[#FAF8F6] p-5"
                      >
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-body/40">
                          Q{question.number} · {question.focus}
                        </p>
                        <p className="mt-1 font-bold text-slate-ink">{question.title}</p>
                        <p className="mt-1 text-sm text-slate-body/70">{question.instruction}</p>

                        {unanswered ? (
                          <p className="mt-3 text-xs italic text-slate-body/40">
                            Not answered
                          </p>
                        ) : (
                          <div className="mt-3 space-y-2">
                            {question.options.map((option) => {
                              const isSelected = selected.includes(option.letter);
                              if (!isSelected) return null;
                              return (
                                <div
                                  key={option.letter}
                                  className="flex items-start gap-3 rounded-xl border border-rev-orange/25 bg-white px-4 py-3"
                                >
                                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-rev-orange" />
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium text-slate-ink">
                                      {option.text}
                                    </p>
                                    {option.triggers.length > 0 ? (
                                      <p className="mt-1 text-xs text-slate-body/55">
                                        → triggers:{" "}
                                        <span className="font-semibold text-rev-orange">
                                          {option.triggers.join(" · ")}
                                        </span>
                                      </p>
                                    ) : (
                                      <p className="mt-1 text-xs text-slate-body/40">
                                        No trigger (positive indicator)
                                      </p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── 5. Footer ── */}
        <div className="mt-8 rounded-2xl border border-black/8 bg-white p-6 text-center text-sm text-slate-body/50 shadow-sm print:mt-4">
          <p className="font-bold text-slate-ink">Revrica — Free Technology Audit Report</p>
          <p className="mt-1">
            Generated {new Date().toLocaleDateString("en-GB", {
              day: "numeric", month: "long", year: "numeric"
            })}{" "}
            · Confidential · For internal use and school communication only.
          </p>
          <p className="mt-1">revrica.com · info@revrica.com</p>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          .print\\:hidden { display: none !important; }
          body { background: white; }
          @page { margin: 1.5cm; }
        }
      `}</style>
    </div>
  );
}

// ─── Loader ────────────────────────────────────────────────────

export default function AuditReportPage() {
  const params = useParams<{ id: string }>();
  const [request, setRequest] = useState<TechAuditRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.id) return;
    setLoading(true);
    adminFetch(`/api/admin/tech-audit/${params.id}`)
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body?.error ?? "Could not load report");
        setRequest(body.request);
      })
      .catch((err: unknown) => {
        setLoadError(err instanceof Error ? err.message : "Unknown error");
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-rev-orange" />
      </div>
    );
  }

  if (loadError || !request) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <div className="flex items-start gap-4 rounded-2xl border border-red-200 bg-red-50 p-6">
          <AlertCircle className="h-6 w-6 shrink-0 text-red-600" />
          <div>
            <p className="font-bold text-red-700">Could not load report</p>
            <p className="mt-1 text-sm text-red-600">{loadError ?? "Submission not found."}</p>
            <Link
              className="mt-4 inline-block text-sm font-bold text-rev-orange hover:underline"
              href="/admin"
            >
              ← Back to dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <AuditReport request={request} />;
}
