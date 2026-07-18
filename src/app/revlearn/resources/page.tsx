"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, AlertCircle, FileText, Globe, Layout, Video, BookOpen } from "lucide-react";
import { RevLearnShell } from "@/components/revlearn/shell";
import { useResources } from "@/lib/revlearn-hooks";
import type { Resource, Audience, ResourceType } from "@/lib/revlearn-types";

const TYPE_ICONS: Record<string, React.ReactNode> = {
  article:  <FileText size={13} />,
  template: <Layout size={13} />,
  app:      <Globe size={13} />,
  website:  <Globe size={13} />,
  video:    <Video size={13} />,
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

export default function ResourcesPage() {
  const { resources, loading, error, reload } = useResources();
  const [query, setQuery] = useState("");
  const [audience, setAudience] = useState("all");
  const [type, setType] = useState("all");

  const filtered = resources.filter((r: Resource) => {
    const matchQ = [r.title, r.description, r.sourceName, ...(r.tags ?? [])]
      .join(" ").toLowerCase().includes(query.toLowerCase());
    const matchA = audience === "all" || r.audience === audience || r.audience === "both";
    const matchT = type === "all" || r.type === type;
    return matchQ && matchA && matchT;
  });

  return (
    <RevLearnShell>
      <div className="rl-page">
        <div className="rl-page-hero">
          <p className="rl-page-kicker">Resources Library</p>
          <h1 className="rl-page-title">Lesson plans, articles & more</h1>
          <p className="rl-page-sub">
            Curated resources for teachers and students — templates, guides, apps, and websites.
          </p>
          <input
            className="rl-page-search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search resources…"
          />
        </div>

        <div className="rl-page-body">
          <div className="rl-filter-row">
            <div className="rl-filter-group">
              {AUDIENCES.map(a => (
                <button key={a.value}
                  className={`rl-filter-btn${audience === a.value ? " rl-filter-btn--active" : ""}`}
                  onClick={() => setAudience(a.value)}>
                  {a.label}
                </button>
              ))}
            </div>
            <div className="rl-filter-group">
              {TYPES.map(t => (
                <button key={t.value}
                  className={`rl-filter-btn${type === t.value ? " rl-filter-btn--active" : ""}`}
                  onClick={() => setType(t.value)}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {loading && <div className="rl-state-center"><Loader2 size={24} className="rl-spin" /></div>}

          {error && (
            <div className="rl-error-box">
              <AlertCircle size={16} />
              <div>
                <p className="rl-error-title">{error}</p>
                <button className="rl-retry-btn" onClick={reload}>Retry</button>
              </div>
            </div>
          )}

          {!loading && !error && (
            <div className="rl-resources-grid">
              {filtered.map((r: Resource) => (
                <Link key={r.id} href={`/revlearn/resources/${r.id}`} className="rl-resource-card">
                  {r.thumbnail
                    ? <div className="rl-resource-thumb" style={{ backgroundImage: `url(${r.thumbnail})` }} />
                    : <div className="rl-resource-thumb rl-resource-thumb--empty"><BookOpen size={24} /></div>
                  }
                  <div className="rl-resource-card-body">
                    <div className="rl-resource-card-meta">
                      <span className={`rl-resource-type-pill rl-resource-type--${r.type}`}>
                        {TYPE_ICONS[r.type as ResourceType]} {r.type}
                      </span>
                      <span className={`rl-audience-pill rl-audience--${r.audience}`}>{r.audience}</span>
                    </div>
                    <h3 className="rl-resource-card-title">{r.title}</h3>
                    <p className="rl-resource-card-desc">{r.description}</p>
                    <span className="rl-resource-source">{r.sourceName}</span>
                  </div>
                </Link>
              ))}
              {filtered.length === 0 && (
                <div className="rl-empty" style={{ gridColumn: "1 / -1" }}>
                  <p className="rl-empty-icon">📚</p>
                  <p>No resources match your filters.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </RevLearnShell>
  );
}