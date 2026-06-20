"use client";

import { AlertCircle, Download, Inbox, Loader2, RefreshCw, Search } from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/src/components/shell";
import { roles } from "@/src/lib/data";
import type { WaitlistRegistration } from "@/src/lib/types";

type FetchState = "idle" | "loading" | "error" | "ready";

export default function AdminPage() {
  const [registrations, setRegistrations] = useState<WaitlistRegistration[]>([]);
  const [fetchState, setFetchState] = useState<FetchState>("idle");
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("All");
  const [passcode, setPasscode] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [authError, setAuthError] = useState("");

  async function loadRegistrations() {
    setFetchState("loading");
    setFetchError(null);
    try {
      const response = await fetch("/api/admin/registrations");
      const body = await response.json();
      if (!response.ok) {
        setFetchError(body?.error ?? "Could not load registrations.");
        setFetchState("error");
        return;
      }
      setRegistrations(body.registrations);
      setFetchState("ready");
    } catch {
      setFetchError("Could not reach the server. Check your connection and try again.");
      setFetchState("error");
    }
  }

  useEffect(() => {
    if (unlocked) {
      loadRegistrations();
    }
  }, [unlocked]);

  const filtered = useMemo(() => {
    return registrations.filter((item) => {
      const q = query.toLowerCase();
      const matchesQuery = [item.fullName, item.email, item.phone, item.organization, item.role, item.interests.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(q);
      const matchesRole = role === "All" || item.role === role;
      return matchesQuery && matchesRole;
    });
  }, [query, registrations, role]);

  const stats = useMemo(() => {
    const countInterest = (name: string) => registrations.filter((item) => item.interests.includes(name)).length;
    return [
      ["Total Registrations", registrations.length],
      ["Teachers", registrations.filter((item) => item.role === "Teacher").length],
      ["School Owners", registrations.filter((item) => item.role === "School Owner").length],
      ["Administrators", registrations.filter((item) => item.role === "School Administrator").length],
      ["Laptop Financing", countInterest("Laptop Financing")],
      ["Teacher Empowerment", countInterest("Teacher Empowerment Program")]
    ];
  }, [registrations]);

  async function exportExcel() {
    const XLSX = await import("xlsx");
    const rows = filtered.map((item) => ({
      Name: item.fullName,
      Email: item.email,
      Phone: item.phone,
      Organization: item.organization,
      Role: item.role,
      Interests: item.interests.join(", "),
      "Device Count": item.deviceCount ?? "",
      Notes: item.notes ?? "",
      Date: new Date(item.createdAt).toLocaleString()
    }));
    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet["!cols"] = [
      { wch: 22 },
      { wch: 26 },
      { wch: 16 },
      { wch: 24 },
      { wch: 18 },
      { wch: 36 },
      { wch: 12 },
      { wch: 30 },
      { wch: 18 }
    ];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");
    const dateStamp = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(workbook, `revrica-registrations-${dateStamp}.xlsx`);
  }

  function unlockDashboard(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const expected = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "revstore-admin";
    if (passcode === expected) {
      setUnlocked(true);
      setAuthError("");
      return;
    }
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
                  onChange={(event) => setPasscode(event.target.value)}
                  placeholder="Admin passcode"
                  type="password"
                  value={passcode}
                />
                {authError ? <p className="text-sm font-bold text-rev-orange">{authError}</p> : null}
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
              <p className="mt-3 text-white/60">Live registrations from Supabase.</p>
            </div>
            <div className="flex gap-3">
              <button
                className="focus-ring inline-flex h-11 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 text-sm font-bold text-white transition hover:border-white/40 hover:bg-white/10"
                onClick={loadRegistrations}
                type="button"
              >
                <RefreshCw className={fetchState === "loading" ? "h-4 w-4 animate-spin" : "h-4 w-4"} /> Refresh
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
          </div>

          {fetchState === "error" ? (
            <div className="mt-8 flex items-start gap-4 rounded-2xl border border-white/15 bg-white/5 p-6">
              <AlertCircle className="h-6 w-6 shrink-0 text-rev-orange" />
              <div>
                <p className="font-display text-lg font-bold text-white">Couldn&apos;t load registrations</p>
                <p className="mt-1 text-sm leading-6 text-white/60">{fetchError}</p>
                <button
                  className="focus-ring mt-4 inline-flex h-10 items-center rounded-full border border-white/20 bg-white/5 px-4 text-sm font-bold text-white transition hover:border-white/40"
                  onClick={loadRegistrations}
                  type="button"
                >
                  Try again
                </button>
              </div>
            </div>
          ) : null}

          {fetchState === "loading" ? (
            <div className="mt-16 flex flex-col items-center gap-3 text-white/60">
              <Loader2 className="h-7 w-7 animate-spin" />
              <p>Loading registrations…</p>
            </div>
          ) : null}

          {fetchState === "ready" && registrations.length === 0 ? (
            <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-black/8 bg-white p-12 text-center shadow-sm">
              <Inbox className="h-9 w-9 text-slate-body/40" />
              <p className="font-display text-lg font-bold text-slate-ink">No registrations yet</p>
              <p className="max-w-sm text-sm leading-6 text-slate-body">
                Once people join the waitlist on the homepage, their details will appear here.
              </p>
            </div>
          ) : null}

          {fetchState === "ready" && registrations.length > 0 ? (
            <>
              <div className="mt-8 grid gap-5 md:grid-cols-3 lg:grid-cols-6">
                {stats.map(([label, value]) => (
                  <div className="rounded-[1.5rem] border border-black/8 bg-white p-6 shadow-sm" key={String(label)}>
                    <p className="font-display text-3xl font-extrabold text-slate-ink">{value}</p>
                    <p className="mt-2 text-xs font-bold uppercase tracking-[0.1em] text-slate-body/70">{label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_0.8fr]">
                <div className="rounded-[1.5rem] border border-black/8 bg-white p-7 shadow-sm">
                  <h2 className="font-display text-xl font-bold text-slate-ink">Interest Breakdown</h2>
                  <div className="mt-5 grid gap-3">
                    {["Teacher Empowerment Program", "Laptop Financing", "Buy a Laptop Outright", "Smartboards", "Hardware Training"].map((name) => {
                      const count = registrations.filter((item) => item.interests.includes(name)).length;
                      const width = registrations.length ? (count / registrations.length) * 100 : 0;
                      return (
                        <div key={name}>
                          <div className="mb-2 flex justify-between text-sm text-slate-body">
                            <span>{name}</span>
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
                <div className="rounded-[1.5rem] border border-black/8 bg-white p-7 shadow-sm">
                  <h2 className="font-display text-xl font-bold text-slate-ink">Role Breakdown</h2>
                  <div className="mt-5 grid gap-3">
                    {["Teacher", "School Owner", "School Administrator", "Parent", "Education Professional"].map((name) => {
                      const count = registrations.filter((item) => item.role === name).length;
                      const width = registrations.length ? (count / registrations.length) * 100 : 0;
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
              </div>

              <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-black/8 bg-white shadow-sm">
                <div className="border-b border-black/8 p-6">
                  <div className="grid gap-3 md:grid-cols-[1fr_220px]">
                    <label className="relative">
                      <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-body/50" />
                      <input
                        className="focus-ring h-12 w-full rounded-xl border border-black/12 bg-white pl-12 pr-4 text-sm text-slate-ink placeholder:text-slate-body/50"
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search name, email, organization, interest..."
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
                  <table className="w-full min-w-[960px] text-left text-sm">
                    <thead className="bg-black/3 text-xs uppercase tracking-[0.1em] text-slate-body/70">
                      <tr>
                        {["Name", "Email", "Phone", "Organization", "Role", "Interests", "Date"].map((heading) => (
                          <th className="px-6 py-4" key={heading}>{heading}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((item) => (
                        <tr className="border-t border-black/6" key={item.id}>
                          <td className="px-6 py-5 font-bold text-slate-ink">{item.fullName}</td>
                          <td className="px-6 py-5 text-slate-body">{item.email}</td>
                          <td className="px-6 py-5 text-slate-body">{item.phone}</td>
                          <td className="px-6 py-5 text-slate-body">{item.organization}</td>
                          <td className="px-6 py-5 text-slate-ink">{item.role}</td>
                          <td className="px-6 py-5 text-slate-body">{item.interests.join(", ")}</td>
                          <td className="px-6 py-5 text-slate-body">{new Date(item.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </main>
    </>
  );
}