"use client";

import { useMemo, useState } from "react";
import { APPLICANT_TYPE_LABEL, type FinancingApplication } from "@/lib/applications/schema";
import { formatNairaKobo } from "@/lib/catalog";
import { APPLICATION_STATUS, type ApplicationStatus } from "@/lib/statuses";
import {
  ContactCell, EmptyState, ErrorState, FilterPill, LoadingState, Panel, StatCard, StatusSelect, Table,
  exportToExcel, formatDate, patchStatus, useAdminList,
} from "./kit";

type Pathway = FinancingApplication["applicantType"] | "all";

const answer = (a: FinancingApplication, key: string) => (typeof a.answers[key] === "string" ? (a.answers[key] as string) : "");

/** Admin → Applications: financing applications and their review status. */
export function ApplicationsView() {
  const { load, reload, setData } = useAdminList<FinancingApplication>("/api/admin/applications", "applications");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ApplicationStatus | "all">("all");
  const [pathway, setPathway] = useState<Pathway>("all");
  const apps = load.state === "ready" ? load.data : [];

  const counts = useMemo(() => {
    const c = Object.fromEntries(APPLICATION_STATUS.list.map((s) => [s.value, 0])) as Record<ApplicationStatus, number>;
    for (const a of apps) c[a.status]++;
    return c;
  }, [apps]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return apps.filter((a) =>
      (status === "all" || a.status === status) &&
      (pathway === "all" || a.applicantType === pathway) &&
      (!q || [a.ref, a.contact.name, a.contact.email, a.contact.phone, a.school, a.sponsor, a.contact.state]
        .join(" ").toLowerCase().includes(q)));
  }, [apps, query, status, pathway]);

  async function update(id: string, next: ApplicationStatus) {
    const body = await patchStatus(`/api/admin/applications/${id}`, next);
    if (!body?.application) return false;
    setData((list) => list.map((a) => (a.id === id ? (body.application as FinancingApplication) : a)));
    return true;
  }

  if (load.state === "loading") return <LoadingState label="Loading applications…" />;
  if (load.state === "error") return <ErrorState message={load.error} onRetry={reload} />;

  const pathways = (["all", "individual", "partner_member", "government_staff"] as const);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Applications" value={apps.length} />
        <StatCard label="To review" value={counts.submitted + counts.under_review + counts.documents_requested} sub="Submitted, reviewing or waiting on documents" />
        <StatCard label="Approved" value={counts.approved + counts.device_delivered + counts.repaying + counts.completed} sub="Approved and later stages" />
        <StatCard label="Via partners" value={apps.filter((a) => a.applicantType === "partner_member").length} sub="e.g. Let There Be Teachers" />
      </div>

      <Panel
        canExport={filtered.length > 0}
        filters={
          <>
            {pathways.map((p) => (
              <FilterPill active={pathway === p} key={p} onClick={() => setPathway(p)}>
                {p === "all" ? "All pathways" : APPLICANT_TYPE_LABEL[p]}
              </FilterPill>
            ))}
            <select
              aria-label="Filter by status"
              className="h-9 rounded-full border border-black/12 bg-white px-3 text-xs font-bold text-slate-body"
              onChange={(e) => setStatus(e.target.value as ApplicationStatus | "all")}
              value={status}
            >
              <option value="all">All statuses ({apps.length})</option>
              {APPLICATION_STATUS.list.map((s) => <option key={s.value} value={s.value}>{s.label} ({counts[s.value]})</option>)}
            </select>
          </>
        }
        onExport={() => exportToExcel(filtered.map((a) => ({
          Reference: a.ref, Date: formatDate(a.createdAt), Status: APPLICATION_STATUS.label(a.status),
          Name: a.contact.name, Email: a.contact.email ?? "", Phone: a.contact.phone ?? "",
          Pathway: APPLICANT_TYPE_LABEL[a.applicantType], Sponsor: a.sponsor ?? "",
          Device: a.product?.name ?? "", "Term (months)": a.termMonths ?? "", "Monthly (₦)": a.monthlyAmount ?? "",
          School: a.school ?? "", State: a.contact.state ?? "", LGA: a.contact.lga ?? "", Position: a.contact.jobTitle ?? "",
          "Salary band": answer(a, "salaryBand"), "Years teaching": answer(a, "yearsTeaching"),
          "TRCN": answer(a, "trcnNumber"), "Owns laptop": answer(a, "ownsLaptop"), "Why a laptop": answer(a, "whyLaptop"),
          "KYC consent": a.kycConsent ? "Yes" : "No", "Imported from": a.importedFrom ?? "",
        })), "Applications", "revrica-financing-applications")}
        onQuery={setQuery}
        onRefresh={reload}
        placeholder="Reference, name, school, state…"
        query={query}
      >
        {apps.length === 0 ? (
          <EmptyState body="Teacher Empowerment applications appear here as they're submitted." title="No applications yet" />
        ) : filtered.length === 0 ? (
          <p className="p-10 text-center text-sm text-slate-body">No applications match this filter.</p>
        ) : (
          <Table headings={["Application", "Applicant", "Device & plan", "School", "Profile", "Status"]} minWidth={1180}>
            {filtered.map((a) => (
              <tr className="border-t border-black/5 align-top hover:bg-black/[0.012]" key={a.id}>
                <td className="px-5 py-4">
                  <p className="font-mono text-[13px] font-bold text-slate-ink">{a.ref}</p>
                  <p className="mt-1 text-xs text-slate-body/60">{formatDate(a.createdAt)}</p>
                  <p className="mt-1.5 text-xs font-bold text-slate-body">{APPLICANT_TYPE_LABEL[a.applicantType]}</p>
                  {a.sponsor && <p className="text-xs text-slate-body/70">{a.sponsor}</p>}
                  {a.importedFrom && <p className="mt-1 inline-block rounded bg-black/5 px-1.5 py-0.5 text-[10px] font-bold text-slate-body/70">Imported</p>}
                </td>
                <td className="px-5 py-4">
                  <ContactCell email={a.contact.email} name={a.contact.name} phone={a.contact.phone} />
                </td>
                <td className="px-5 py-4">
                  <p className="font-bold text-slate-ink">{a.product?.name ?? "Device not chosen"}</p>
                  {a.termMonths && <p className="text-xs text-slate-body">{a.termMonths} months</p>}
                  {a.monthlyAmount !== null && <p className="text-xs text-slate-body">{formatNairaKobo(a.monthlyAmount)}/month</p>}
                </td>
                <td className="max-w-[200px] px-5 py-4 text-slate-body">
                  <p className="text-slate-ink">{a.school ?? "—"}</p>
                  <p className="text-xs">{[a.contact.lga, a.contact.state].filter(Boolean).join(", ")}</p>
                  {a.contact.jobTitle && <p className="text-xs">{a.contact.jobTitle}</p>}
                </td>
                <td className="max-w-[220px] px-5 py-4 text-xs leading-5 text-slate-body">
                  {answer(a, "salaryBand") && <p>Salary: {answer(a, "salaryBand")}</p>}
                  {answer(a, "yearsTeaching") && <p>Teaching: {answer(a, "yearsTeaching")}</p>}
                  {answer(a, "trcnNumber") && <p>TRCN: {answer(a, "trcnNumber")}</p>}
                  {answer(a, "ownsLaptop") && <p>Owns a laptop: {answer(a, "ownsLaptop")}</p>}
                  <p>KYC consent: {a.kycConsent ? "Yes" : "No"}</p>
                  {answer(a, "whyLaptop") && <p className="mt-1 line-clamp-3 italic" title={answer(a, "whyLaptop")}>“{answer(a, "whyLaptop")}”</p>}
                </td>
                <td className="w-[210px] px-5 py-4">
                  <StatusSelect
                    changedAt={a.statusChangedAt}
                    label={`Status for application ${a.ref}`}
                    onChange={(next) => update(a.id, next)}
                    options={APPLICATION_STATUS.list}
                    tone={APPLICATION_STATUS.tone}
                    value={a.status}
                  />
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Panel>
    </div>
  );
}
