"use client";

import { useMemo, useState } from "react";
import { getProduct } from "@/lib/catalog";
import { LEAD_INTENT_LABEL, LEAD_SOURCE_LABEL, type Lead } from "@/lib/leads/schema";
import { LEAD_STATUS, type LeadStatus } from "@/lib/statuses";
import {
  ContactCell, EmptyState, ErrorState, FilterPill, LoadingState, Panel, StatCard, StatusSelect, Table,
  exportToExcel, formatDate, patchStatus, useAdminList,
} from "./kit";

/** Readable summary of a lead's form answers (details JSON). */
function detailLines(l: Lead): string[] {
  const d = l.details as Record<string, unknown>;
  const text = (k: string) => (typeof d[k] === "string" && d[k] ? (d[k] as string) : null);
  const list = (k: string) => (Array.isArray(d[k]) ? (d[k] as string[]).join(", ") : text(k));
  return [
    text("organization") && `Organisation: ${text("organization")}`,
    list("purposes") && `For: ${list("purposes")}`,
    text("financingInterest") && `Financing: ${text("financingInterest")}`,
    text("salaryBand") && `Salary: ${text("salaryBand")}`,
    text("comments") && `“${text("comments")}”`,
    text("notes") && `“${text("notes")}”`,
    text("whyLaptop") && `“${text("whyLaptop")}”`,
  ].filter(Boolean) as string[];
}

/**
 * Admin → Leads: everyone who showed interest (website, schools, tech audits,
 * events, imported spreadsheets) for the team to follow up.
 */
export function LeadsView() {
  const { load, reload, setData } = useAdminList<Lead>("/api/admin/leads", "leads");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<LeadStatus | "open" | "all">("open");
  const [source, setSource] = useState<string>("all");
  const leads = load.state === "ready" ? load.data : [];

  const counts = useMemo(() => {
    const c = Object.fromEntries(LEAD_STATUS.list.map((s) => [s.value, 0])) as Record<LeadStatus, number>;
    for (const l of leads) c[l.status]++;
    return c;
  }, [leads]);
  const open = counts.new + counts.contacted + counts.qualified;
  const sources = useMemo(() => [...new Set(leads.map((l) => l.source))].sort(), [leads]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((l) =>
      (status === "all" || (status === "open" ? ["new", "contacted", "qualified"].includes(l.status) : l.status === status)) &&
      (source === "all" || l.source === source) &&
      (!q || [l.contact.name, l.contact.email, l.contact.phone, l.organization, l.sourceDetail, ...l.interests]
        .join(" ").toLowerCase().includes(q)));
  }, [leads, query, status, source]);

  async function update(id: string, next: LeadStatus) {
    const body = await patchStatus(`/api/admin/leads/${id}`, next);
    if (!body) return false;
    setData((list) => list.map((l) => (l.id === id ? { ...l, status: next, statusChangedAt: body.statusChangedAt as string } : l)));
    return true;
  }

  if (load.state === "loading") return <LoadingState label="Loading leads…" />;
  if (load.state === "error") return <ErrorState message={load.error} onRetry={reload} />;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Open leads" value={open} sub="New, contacted or qualified" />
        <StatCard label="Not yet contacted" value={counts.new} />
        <StatCard label="Converted" value={counts.converted} sub="Became an order or application" />
        <StatCard label="Schools" value={leads.filter((l) => l.organization && l.source !== "website_waitlist").length} sub="Leads linked to a school" />
      </div>

      <Panel
        canExport={filtered.length > 0}
        filters={
          <>
            {([["open", `Open ${open}`], ["new", `New ${counts.new}`], ["all", `All ${leads.length}`]] as const).map(([v, label]) => (
              <FilterPill active={status === v} key={v} onClick={() => setStatus(v)}>{label}</FilterPill>
            ))}
            <select
              aria-label="Filter by status"
              className="h-9 rounded-full border border-black/12 bg-white px-3 text-xs font-bold text-slate-body"
              onChange={(e) => setStatus(e.target.value as LeadStatus)}
              value={["open", "all", "new"].includes(status) ? "" : status}
            >
              <option disabled value="">Other status…</option>
              {LEAD_STATUS.list.filter((s) => s.value !== "new").map((s) => (
                <option key={s.value} value={s.value}>{s.label} ({counts[s.value]})</option>
              ))}
            </select>
            <select
              aria-label="Filter by source"
              className="h-9 rounded-full border border-black/12 bg-white px-3 text-xs font-bold text-slate-body"
              onChange={(e) => setSource(e.target.value)}
              value={source}
            >
              <option value="all">All sources</option>
              {sources.map((s) => <option key={s} value={s}>{LEAD_SOURCE_LABEL[s] ?? s}</option>)}
            </select>
          </>
        }
        onExport={() => exportToExcel(filtered.map((l) => ({
          Date: formatDate(l.createdAt), Status: LEAD_STATUS.label(l.status),
          Name: l.contact.name, Email: l.contact.email ?? "", Phone: l.contact.phone ?? "",
          Organisation: l.organization ?? "", Role: l.contact.jobTitle ?? "", State: l.contact.state ?? "",
          Source: LEAD_SOURCE_LABEL[l.source] ?? l.source, "Source detail": l.sourceDetail ?? "",
          "Wants": LEAD_INTENT_LABEL[l.intent] ?? l.intent, Interests: l.interests.join(", "),
          Device: l.productId ? getProduct(l.productId)?.name ?? l.productId : "", "Device count": l.deviceCount ?? "",
          Details: detailLines(l).join(" | "), "Imported from": l.importedFrom ?? "",
        })), "Leads", "revrica-leads")}
        onQuery={setQuery}
        onRefresh={reload}
        placeholder="Name, phone, school, interest…"
        query={query}
      >
        {leads.length === 0 ? (
          <EmptyState body="Waitlist sign-ups, school enquiries, tech audits and imported contacts appear here." title="No leads yet" />
        ) : filtered.length === 0 ? (
          <p className="p-10 text-center text-sm text-slate-body">No leads match this filter.</p>
        ) : (
          <Table headings={["Received", "Person", "Wants", "Details", "Status"]}>
            {filtered.map((l) => {
              const lines = detailLines(l);
              return (
                <tr className="border-t border-black/5 align-top hover:bg-black/[0.012]" key={l.id}>
                  <td className="px-5 py-4">
                    <p className="text-xs font-bold text-slate-ink">{formatDate(l.createdAt, false)}</p>
                    <p className="mt-1 text-xs text-slate-body">{LEAD_SOURCE_LABEL[l.source] ?? l.source}</p>
                    {l.sourceDetail && <p className="text-xs text-slate-body/60">{l.sourceDetail}</p>}
                  </td>
                  <td className="px-5 py-4">
                    <ContactCell
                      email={l.contact.email}
                      name={l.contact.name}
                      phone={l.contact.phone}
                      sub={[l.contact.jobTitle, l.organization].filter(Boolean).join(" · ") || undefined}
                    />
                  </td>
                  <td className="max-w-[240px] px-5 py-4">
                    <p className="font-bold text-slate-ink">{LEAD_INTENT_LABEL[l.intent] ?? l.intent}</p>
                    {l.productId && <p className="text-xs text-slate-body">{getProduct(l.productId)?.name ?? l.productId}</p>}
                    {l.interests.length > 0 && <p className="mt-1 text-xs text-slate-body">{l.interests.join(", ")}</p>}
                    {l.deviceCount && <p className="text-xs text-slate-body">{l.deviceCount} devices</p>}
                  </td>
                  <td className="max-w-[280px] px-5 py-4 text-xs leading-5 text-slate-body">
                    {lines.length ? lines.map((line) => <p className="line-clamp-2" key={line} title={line}>{line}</p>) : "—"}
                  </td>
                  <td className="w-[190px] px-5 py-4">
                    <StatusSelect
                      changedAt={l.statusChangedAt}
                      label={`Status for lead ${l.contact.name}`}
                      onChange={(next) => update(l.id, next)}
                      options={LEAD_STATUS.list}
                      tone={LEAD_STATUS.tone}
                      value={l.status}
                    />
                  </td>
                </tr>
              );
            })}
          </Table>
        )}
      </Panel>
    </div>
  );
}
