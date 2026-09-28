"use client";

import { AlertCircle, Download, Inbox, Loader2, RefreshCw, Search } from "lucide-react";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { clsx } from "clsx";
import { adminFetch } from "@/lib/admin-fetch";
import type { StatusTone } from "@/lib/statuses";

/**
 * Building blocks shared by the admin views (Orders, Applications, Leads), so
 * they look and behave the same.
 */

// ─── Data loading ─────────────────────────────────────────────

type LoadState<T> = { state: "loading" } | { state: "error"; error: string } | { state: "ready"; data: T };

/** Loads `url` and returns body[key]. `setData` updates the list after a confirmed change. */
export function useAdminList<T>(url: string, key: string) {
  const [load, setLoad] = useState<LoadState<T[]>>({ state: "loading" });

  const reload = useCallback(async () => {
    setLoad({ state: "loading" });
    try {
      const res = await adminFetch(url);
      const body = await res.json().catch(() => null);
      if (!res.ok) { setLoad({ state: "error", error: body?.error ?? "Could not load data." }); return; }
      setLoad({ state: "ready", data: body[key] as T[] });
    } catch {
      setLoad({ state: "error", error: "Could not reach the server." });
    }
  }, [url, key]);

  useEffect(() => { reload(); }, [reload]);

  const setData = useCallback((update: (list: T[]) => T[]) => {
    setLoad((l) => (l.state === "ready" ? { state: "ready", data: update(l.data) } : l));
  }, []);

  return { load, reload, setData };
}

/** PATCHes a status; resolves to the response body, or null on failure. */
export async function patchStatus(url: string, status: string): Promise<Record<string, unknown> | null> {
  try {
    const res = await adminFetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

// ─── Formatting ───────────────────────────────────────────────

export function formatDate(iso: string, withTime = true) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

/** Nigerian local numbers (0803…) → wa.me link (234803…). */
export function whatsappHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits.startsWith("0") ? "234" + digits.slice(1) : digits}`;
}

export async function exportToExcel(rows: Record<string, unknown>[], sheet: string, filePrefix: string) {
  const XLSX = await import("xlsx");
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, XLSX.utils.json_to_sheet(rows), sheet);
  XLSX.writeFile(book, `${filePrefix}-${new Date().toISOString().slice(0, 10)}.xlsx`);
}

// ─── Layout pieces ────────────────────────────────────────────

export function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-2xl border border-black/8 bg-white p-5 shadow-sm">
      <p className="font-display text-3xl font-extrabold text-slate-ink">{value}</p>
      <p className="mt-1.5 text-xs font-bold uppercase tracking-[0.1em] text-slate-body/65">{label}</p>
      {sub && <p className="mt-0.5 text-[11px] text-slate-body/45">{sub}</p>}
    </div>
  );
}

export function LoadingState({ label }: { label: string }) {
  return (
    <div className="mt-16 flex flex-col items-center gap-3 text-white/55">
      <Loader2 className="h-7 w-7 animate-spin" />
      <p>{label}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-white/15 bg-white/5 p-6">
      <AlertCircle className="h-6 w-6 shrink-0 text-rev-orange" />
      <div>
        <p className="font-display text-lg font-bold text-white">Couldn&apos;t load this</p>
        <p className="mt-1 text-sm text-white/55">{message}</p>
        <button className="mt-4 inline-flex h-10 items-center rounded-full border border-white/20 bg-white/5 px-4 text-sm font-bold text-white" onClick={onRetry} type="button">
          Try again
        </button>
      </div>
    </div>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col items-center gap-3 p-14 text-center">
      <Inbox className="h-9 w-9 text-slate-body/35" />
      <p className="font-display text-lg font-bold text-slate-ink">{title}</p>
      <p className="max-w-sm text-sm leading-6 text-slate-body">{body}</p>
    </div>
  );
}

/** White panel with a toolbar: filter pills on the left; search, refresh and export on the right. */
export function Panel({
  filters, query, onQuery, placeholder, onRefresh, onExport, canExport, children,
}: {
  filters?: ReactNode;
  query: string;
  onQuery: (q: string) => void;
  placeholder: string;
  onRefresh: () => void;
  onExport: () => void;
  canExport: boolean;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/8 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-black/6 p-5 lg:flex-row lg:items-center">
        {filters && <div className="flex flex-wrap gap-1.5">{filters}</div>}
        <div className="flex flex-1 gap-2 lg:justify-end">
          <label className="relative flex-1 lg:max-w-xs">
            <span className="sr-only">Search</span>
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-body/45" />
            <input
              className="focus-ring h-10 w-full rounded-xl border border-black/12 bg-white pl-10 pr-3 text-sm text-slate-ink placeholder:text-slate-body/45"
              onChange={(e) => onQuery(e.target.value)}
              placeholder={placeholder}
              value={query}
            />
          </label>
          <button aria-label="Refresh" className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/12 text-slate-body hover:bg-black/[0.04]" onClick={onRefresh} type="button">
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-rev-orange px-4 text-sm font-bold text-white disabled:opacity-40"
            disabled={!canExport}
            onClick={onExport}
            type="button"
          >
            <Download className="h-4 w-4" /> Export
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}

export function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      aria-pressed={active}
      className={clsx(
        "h-9 rounded-full px-3.5 text-xs font-bold transition",
        active ? "bg-slate-ink text-white" : "bg-black/[0.04] text-slate-body hover:bg-black/[0.08]",
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

export function Table({ headings, minWidth = 1080, children }: { headings: string[]; minWidth?: number; children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm" style={{ minWidth }}>
        <thead className="bg-black/[0.025] text-[11px] uppercase tracking-[0.1em] text-slate-body/60">
          <tr>{headings.map((h) => <th className="px-5 py-3.5" key={h} scope="col">{h}</th>)}</tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function ContactCell({ name, email, phone, sub }: { name: string; email?: string | null; phone?: string | null; sub?: ReactNode }) {
  return (
    <>
      <p className="font-bold text-slate-ink">{name}</p>
      {sub && <p className="mt-0.5 text-xs text-slate-body/70">{sub}</p>}
      {email && <a className="mt-0.5 block text-xs text-slate-body hover:text-rev-orange" href={`mailto:${email}`}>{email}</a>}
      {phone && (
        <span className="mt-0.5 flex gap-2 text-xs">
          <a className="text-slate-body hover:text-rev-orange" href={`tel:${phone}`}>{phone}</a>
          <a className="font-bold text-emerald-700 hover:underline" href={whatsappHref(phone)} rel="noopener noreferrer" target="_blank">WhatsApp</a>
        </span>
      )}
    </>
  );
}

// ─── Status select ────────────────────────────────────────────

const TONE_STYLE: Record<StatusTone, string> = {
  waiting: "bg-amber-50 text-amber-800 border-amber-200",
  active: "bg-sky-50 text-sky-800 border-sky-200",
  success: "bg-emerald-50 text-emerald-800 border-emerald-200",
  neutral: "bg-stone-100 text-stone-700 border-stone-200",
  danger: "bg-red-50 text-red-700 border-red-200",
};

/**
 * Status dropdown. The list only changes once the server confirms the change;
 * moving to a "danger" status (cancel, decline…) asks for confirmation.
 */
export function StatusSelect<S extends string>({
  label, value, options, tone, changedAt, onChange,
}: {
  label: string;
  value: S;
  options: readonly { value: S; label: string; tone: StatusTone }[];
  tone: (s: S) => StatusTone;
  changedAt?: string;
  onChange: (next: S) => Promise<boolean>;
}) {
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);

  async function change(next: S) {
    if (next === value) return;
    const option = options.find((o) => o.value === next);
    if (option?.tone === "danger" && !window.confirm(`Change status to "${option.label}"?`)) return;
    setSaving(true);
    setFailed(false);
    const ok = await onChange(next);
    setSaving(false);
    setFailed(!ok);
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="relative">
        <select
          aria-label={label}
          className={clsx(
            "h-9 w-full cursor-pointer appearance-none rounded-lg border px-3 pr-8 text-xs font-bold disabled:cursor-wait disabled:opacity-60",
            TONE_STYLE[tone(value)],
          )}
          disabled={saving}
          onChange={(e) => change(e.target.value as S)}
          value={value}
        >
          {options.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        {saving && <Loader2 className="pointer-events-none absolute right-2.5 top-2.5 h-4 w-4 animate-spin" />}
      </div>
      {failed && <p className="text-[11px] font-bold text-red-600" role="alert">Couldn’t save. Try again.</p>}
      {changedAt && <p className="text-[11px] text-slate-body/50">Updated {formatDate(changedAt)}</p>}
    </div>
  );
}
