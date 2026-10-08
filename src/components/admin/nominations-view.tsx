"use client";

import { ShieldCheck, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import { type Nomination, nominationStatusLabel, nominatorRoleLabel } from "@/lib/nominations/schema";
import {
  ContactCell, EmptyState, ErrorState, LoadingState, Panel, StatCard, Table, exportToExcel, formatDate, useAdminList,
} from "./kit";

/** Phone numbers are stored as +234…; this matches a nominee however often they were nominated. */
const teacherKey = (n: Nomination) => n.teacher.phone;

/**
 * Admin → Nominations: "My Teacher, My Hero" entries, for the team to verify
 * nominees and pick who to spotlight.
 */
export function NominationsView() {
  const { load, reload, setData } = useAdminList<Nomination>("/api/admin/nominations", "nominations");
  const [query, setQuery] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  /** Permanent: for erasure requests and teachers who don't want to take part. */
  async function remove(n: Nomination) {
    const ok = window.confirm(
      `Permanently delete nomination ${n.ref} (${n.teacher.name}, nominated by ${n.nominator.name})?

` +
      "Use this when the teacher or nominator asks for their data to be deleted, or the teacher doesn't want to take part. This can't be undone.",
    );
    if (!ok) return;
    setDeleting(n.id);
    try {
      const res = await adminFetch(`/api/admin/nominations/${n.id}`, { method: "DELETE" });
      if (res.ok || res.status === 404) setData((list) => list.filter((x) => x.id !== n.id));
      else window.alert((await res.json().catch(() => null))?.error ?? "Could not delete the nomination.");
    } finally {
      setDeleting(null);
    }
  }
  const nominations = load.state === "ready" ? load.data : [];

  /** How many times each teacher has been nominated. */
  const tally = useMemo(() => {
    const t = new Map<string, number>();
    for (const n of nominations) t.set(teacherKey(n), (t.get(teacherKey(n)) ?? 0) + 1);
    return t;
  }, [nominations]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return nominations.filter((n) => !q || [
      n.ref, n.teacher.name, n.teacher.phone, n.teacher.subject, n.school.name, n.school.state,
      n.nominator.name, n.nominator.phone, n.reason,
    ].join(" ").toLowerCase().includes(q));
  }, [nominations, query]);

  if (load.state === "loading") return <LoadingState label="Loading nominations…" />;
  if (load.state === "error") return <ErrorState message={load.error} onRetry={reload} />;

  const states = new Set(nominations.map((n) => n.school.state)).size;
  const schools = new Set(nominations.map((n) => n.school.name.toLowerCase())).size;

  function exportRows() {
    exportToExcel(filtered.map((n) => ({
      Ref: n.ref,
      Submitted: formatDate(n.createdAt),
      Status: nominationStatusLabel(n.status),
      Teacher: n.teacher.name,
      "Teacher phone": n.teacher.phone,
      Subject: n.teacher.subject ?? "",
      School: n.school.name,
      State: n.school.state,
      "Times nominated": tally.get(teacherKey(n)) ?? 1,
      "Nominated by": n.nominator.name,
      "Nominator phone": n.nominator.phone,
      "Nominator is": nominatorRoleLabel(n.nominator.role),
      "Marketing opt-in": n.marketingOptIn ? "Yes" : "No",
      Reason: n.reason,
    })), "Nominations", "teacher-nominations");
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Nominations" value={nominations.length} />
        <StatCard label="Teachers nominated" value={tally.size} sub="Counted by phone number" />
        <StatCard label="Schools" value={schools} />
        <StatCard label="States" value={states} />
      </div>

      <div className="flex gap-3 rounded-2xl border border-white/12 bg-white/5 p-4 text-sm leading-6 text-white/70">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-rev-orange" />
        <p>
          <strong className="text-white">Data protection (NDPA / GDPR).</strong> Teachers didn&apos;t give us these
          details themselves. When you first contact a teacher, say you&apos;re from Imperial Edtech / Revrica, that
          they were nominated for {"“"}My Teacher, My Hero{"”"}, and that they can opt out; if they do, delete the
          nomination. Get their agreement before publishing their name, photo or story. Only message nominators about
          Rev products if they opted in. Exports contain personal data: keep them off shared drives and delete them
          when you&apos;re done.
        </p>
      </div>

      <Panel
        canExport={filtered.length > 0}
        onExport={exportRows}
        onQuery={setQuery}
        onRefresh={reload}
        placeholder="Search teacher, school, nominator…"
        query={query}
      >
        {filtered.length === 0 ? (
          <EmptyState
            body={nominations.length ? "No nominations match your search." : "Nominations from /nominate-a-teacher will appear here."}
            title={nominations.length ? "Nothing found" : "No nominations yet"}
          />
        ) : (
          <Table headings={["Teacher", "School", "Why they were nominated", "Nominated by", "Submitted", ""]}>
            {filtered.map((n) => {
              const times = tally.get(teacherKey(n)) ?? 1;
              return (
                <tr className="border-t border-black/6 align-top" key={n.id}>
                  <td className="px-5 py-4">
                    <ContactCell
                      name={n.teacher.name}
                      phone={n.teacher.phone}
                      sub={(n.teacher.subject || times > 1) && <>
                        {n.teacher.subject}
                        {times > 1 && <span className="ml-1 font-bold text-rev-orangeDeep">· nominated {times}×</span>}
                      </>}
                    />
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-ink">{n.school.name}</p>
                    <p className="text-xs text-slate-body/70">{n.school.state}</p>
                  </td>
                  <td className="max-w-md px-5 py-4 text-slate-body">
                    <p className="line-clamp-4 whitespace-pre-line" title={n.reason}>{n.reason}</p>
                  </td>
                  <td className="px-5 py-4">
                    <ContactCell
                      name={n.nominator.name}
                      phone={n.nominator.phone}
                      sub={<>
                        {nominatorRoleLabel(n.nominator.role)}
                        {n.marketingOptIn && <span className="ml-1 font-bold text-emerald-700">· OK to market</span>}
                      </>}
                    />
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-body/70">
                    <p className="font-mono font-bold text-slate-ink">{n.ref}</p>
                    <p className="mt-1">{formatDate(n.createdAt)}</p>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      aria-label={`Delete nomination ${n.ref}`}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-black/10 px-3 text-xs font-bold text-red-700 hover:bg-red-50 disabled:opacity-40"
                      disabled={deleting === n.id}
                      onClick={() => remove(n)}
                      title="Delete permanently (erasure request or teacher opted out)"
                      type="button"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> {deleting === n.id ? "Deleting…" : "Delete"}
                    </button>
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
