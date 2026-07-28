"use client";

import { useState } from "react";
import { Loader2, AlertCircle, FileText, Globe, Layout, Video, BookOpen, ArrowUpRight } from "lucide-react";
import { RevLearnShell } from "@/components/revlearn/shell";
import { useResources } from "@/lib/revlearn-hooks";
import type { Resource } from "@/lib/revlearn-types";

const D = '"Archivo Variable", ui-sans-serif, system-ui';

const TYPE_META: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  article:  { icon: <FileText  size={14} />, color: "#0056d2", bg: "#e8f0fe" },
  template: { icon: <Layout    size={14} />, color: "#6600cc", bg: "#f0e8ff" },
  app:      { icon: <Globe     size={14} />, color: "#0d7b6b", bg: "#e0f7f4" },
  website:  { icon: <Globe     size={14} />, color: "#58595c", bg: "#f0f2f5" },
  video:    { icon: <Video     size={14} />, color: "#FF6B1A", bg: "#fff4ee" },
};

const AUDIENCES = [
  { value: "all",     label: "All" },
  { value: "teacher", label: "For Teachers" },
  { value: "student", label: "For Students" },
  { value: "both",    label: "For Both" },
];
const TYPES = [
  { value: "all",      label: "All types" },
  { value: "article",  label: "Articles" },
  { value: "template", label: "Templates" },
  { value: "app",      label: "Apps" },
  { value: "website",  label: "Websites" },
  { value: "video",    label: "Videos" },
];

function ResourceCard({ r }: { r: Resource }) {
  const meta   = TYPE_META[r.type] ?? TYPE_META.website;
  const hasImg = !!r.thumbnail;
  return (
    <a
      href={r.url ?? "#"}
      target="_blank"
      rel="noopener noreferrer"
      style={{ display: "flex", flexDirection: "column", background: "var(--rl-bg)", border: "1px solid var(--rl-line)", borderRadius: 20, overflow: "hidden", textDecoration: "none", boxShadow: "var(--rl-shadow-xs)", transition: "border-color .2s, transform .25s cubic-bezier(.16,1,.3,1), box-shadow .2s" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--rl-maroon)"; e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "var(--rl-shadow)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--rl-line)"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "var(--rl-shadow-xs)"; }}
    >
      {/* Thumbnail */}
      <div style={{ width: "100%", aspectRatio: "16/9", background: hasImg ? `url(${r.thumbnail}) center/cover no-repeat` : "var(--rl-bg-subtle)", display: hasImg ? "block" : "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        {!hasImg && <BookOpen size={28} style={{ color: "var(--rl-line-strong)" }} />}
        {/* Type pill overlay */}
        <span style={{ position: "absolute", top: 10, left: 10, display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 9px", background: meta.bg, color: meta.color, borderRadius: "999px", fontSize: ".62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em" }}>
          {meta.icon} {r.type}
        </span>
        {r.audience && r.audience !== "both" && (
          <span style={{ position: "absolute", top: 10, right: 10, padding: "3px 9px", background: r.audience === "teacher" ? "var(--rl-maroon-light)" : "var(--rl-teal-soft)", color: r.audience === "teacher" ? "var(--rl-maroon)" : "var(--rl-teal)", borderRadius: "999px", fontSize: ".62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".04em" }}>
            {r.audience === "teacher" ? "Teacher" : "Student"}
          </span>
        )}
      </div>
      {/* Body */}
      <div style={{ padding: "1rem 1.125rem", flex: 1, display: "flex", flexDirection: "column", gap: ".3rem" }}>
        <h3 style={{ margin: 0, fontFamily: D, fontSize: ".925rem", fontWeight: 700, color: "var(--rl-ink)", lineHeight: 1.35, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any, overflow: "hidden" }}>
          {r.title}
        </h3>
        {r.description && (
          <p style={{ margin: 0, fontSize: ".78rem", color: "var(--rl-body)", lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any, overflow: "hidden" }}>
            {r.description}
          </p>
        )}
        {r.sourceName && (
          <p style={{ margin: "auto 0 0", paddingTop: ".5rem", fontSize: ".68rem", fontWeight: 600, color: "var(--rl-body)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>{r.sourceName}</span>
            <ArrowUpRight size={13} style={{ color: "var(--rl-maroon)" }} />
          </p>
        )}
      </div>
    </a>
  );
}

export default function ResourcesPage() {
  const { resources, loading, error, reload } = useResources();
  const [query, setQuery]     = useState("");
  const [audience, setAudience] = useState("all");
  const [type, setType]       = useState("all");

  const filtered = resources.filter((r: Resource) => {
    const matchQ = [r.title, r.description, r.sourceName, ...(r.tags ?? [])].join(" ").toLowerCase().includes(query.toLowerCase());
    const matchA = audience === "all" || r.audience === audience || r.audience === "both";
    const matchT = type === "all" || r.type === type;
    return matchQ && matchA && matchT;
  });

  const filterBtn = (active: boolean) => ({
    padding: "6px 14px", borderRadius: "999px", border: "1.5px solid",
    borderColor: active ? "var(--rl-maroon)" : "var(--rl-line)",
    background: active ? "var(--rl-maroon)" : "transparent",
    color: active ? "#fff" : "var(--rl-body)",
    fontSize: ".8rem", fontWeight: 600, cursor: "pointer" as const,
    whiteSpace: "nowrap" as const, fontFamily: "inherit",
  });

  return (
    <RevLearnShell>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #150708 0%, #3d0c0f 30%, #4a0e10 65%, #6b1518 100%)", padding: "2rem 2rem 1.75rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse at 75% 40%, rgba(255,107,26,.16) 0%, transparent 60%)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ margin: "0 0 .375rem", fontSize: ".7rem", fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--rl-orange)" }}>Resources Library</p>
          <h1 style={{ margin: "0 0 .5rem", fontFamily: D, fontSize: "clamp(1.5rem, 4vw, 2.25rem)", fontWeight: 800, color: "#fff", letterSpacing: "-.02em", lineHeight: 1.1 }}>Lesson plans, articles &amp; more</h1>
          <p style={{ margin: "0 0 1.25rem", fontSize: ".9rem", color: "rgba(255,255,255,.55)" }}>Curated resources for teachers and students — templates, guides, apps, and more.</p>
          <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,.11)", border: "1.5px solid rgba(255,255,255,.18)", borderRadius: "999px", padding: "0 1rem", maxWidth: 440 }}>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search resources…" style={{ flex: 1, height: 42, padding: "0 10px", background: "transparent", border: "none", color: "#fff", fontSize: ".875rem", outline: "none", fontFamily: "inherit" }} />
            {query && <button onClick={() => setQuery("")} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,.55)", cursor: "pointer" }}>✕</button>}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: "var(--rl-bg)", borderBottom: "1px solid var(--rl-line)", padding: ".875rem 2rem", display: "flex", flexDirection: "column", gap: ".625rem" }}>
        <div style={{ display: "flex", gap: ".375rem", overflowX: "auto", scrollbarWidth: "none" }}>
          {AUDIENCES.map(a => (
            <button key={a.value} onClick={() => setAudience(a.value)} style={filterBtn(audience === a.value)}>{a.label}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: ".375rem", overflowX: "auto", scrollbarWidth: "none" }}>
          {TYPES.map(t => (
            <button key={t.value} onClick={() => setType(t.value)} style={filterBtn(type === t.value)}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "1.75rem 2rem 4rem" }}>
        {loading && <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}><Loader2 size={24} className="rl-spin" style={{ color: "var(--rl-body)" }} /></div>}
        {error && (
          <div style={{ display: "flex", gap: "1rem", padding: "1rem 1.25rem", background: "var(--rl-maroon-light)", border: "1px solid rgba(74,14,16,.15)", borderRadius: 12, color: "var(--rl-maroon)", marginBottom: "1rem" }}>
            <AlertCircle size={16} />
            <div>
              <p style={{ margin: "0 0 .5rem", fontWeight: 700 }}>{error}</p>
              <button onClick={reload} style={{ padding: "6px 14px", background: "var(--rl-maroon)", color: "#fff", border: "none", borderRadius: "999px", fontSize: ".8rem", fontWeight: 700, cursor: "pointer" }}>Retry</button>
            </div>
          </div>
        )}
        {!loading && !error && (
          filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 1rem", color: "var(--rl-body)" }}>
              <p style={{ fontSize: "2.5rem", margin: "0 0 .5rem" }}>📚</p>
              <p style={{ margin: 0, fontSize: ".9rem" }}>{query ? `No resources match "${query}".` : "No resources yet."}</p>
            </div>
          ) : (
            <>
              {(query || audience !== "all" || type !== "all") && (
                <p style={{ fontSize: ".84rem", color: "var(--rl-body)", marginBottom: "1.25rem" }}>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</p>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "1.125rem" }}>
                {filtered.map((r: Resource) => <ResourceCard key={r.id} r={r} />)}
              </div>
            </>
          )
        )}
      </div>
    </RevLearnShell>
  );
}
