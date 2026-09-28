"use client";

import { ClipboardCheck, GraduationCap, LogOut, ShoppingBag, Users } from "lucide-react";
import { useState } from "react";
import { ApplicationsView } from "@/components/admin/applications-view";
import { LeadsView } from "@/components/admin/leads-view";
import { OrdersView } from "@/components/admin/orders-view";
import { SiteHeader } from "@/components/shell";
import { TechAuditView } from "@/components/tech-audit-view";
import { signOutAdmin } from "@/lib/admin-fetch";

const TABS = [
  { id: "orders", label: "Orders", Icon: ShoppingBag },
  { id: "applications", label: "Applications", Icon: GraduationCap },
  { id: "leads", label: "Leads", Icon: Users },
  { id: "tech-audit", label: "Tech Audit", Icon: ClipboardCheck },
] as const;
type Tab = (typeof TABS)[number]["id"];

/**
 * Admin dashboard. Access is enforced on the server: middleware redirects
 * signed-out visitors to /admin/login, and every admin API checks the session.
 */
export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("orders");

  return (
    <>
      <SiteHeader />
      <main className="maroon-glow relative min-h-screen py-10">
        <div className="noise-overlay" />
        <div className="container-x relative z-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-rev-orange">Revrica Admin</p>
              <h1 className="mt-3 font-display text-4xl font-extrabold text-white md:text-5xl">Dashboard</h1>
              <p className="mt-2 text-sm text-white/50">Orders, financing applications, leads and tech audits in one place.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex flex-wrap gap-1 rounded-2xl border border-white/12 bg-white/5 p-1.5" role="tablist">
                {TABS.map(({ id, label, Icon }) => (
                  <button
                    aria-selected={tab === id}
                    className={`inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-bold transition ${tab === id ? "bg-rev-orange text-white shadow-sm" : "text-white/55 hover:text-white"}`}
                    key={id}
                    onClick={() => setTab(id)}
                    role="tab"
                    type="button"
                  >
                    <Icon className="h-4 w-4" /> {label}
                  </button>
                ))}
              </div>
              <button
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/15 px-4 text-sm font-bold text-white/70 transition hover:border-white/35 hover:text-white"
                onClick={signOutAdmin}
                type="button"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          </div>

          <div className="mt-8" role="tabpanel">
            {tab === "orders" && <OrdersView />}
            {tab === "applications" && <ApplicationsView />}
            {tab === "leads" && <LeadsView />}
            {tab === "tech-audit" && <TechAuditView />}
          </div>
        </div>
      </main>
    </>
  );
}
