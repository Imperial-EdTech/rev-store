"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, AlertCircle } from "lucide-react";
import { RevLearnShell } from "@/components/revlearn/shell";
import { useTools } from "@/lib/revlearn-hooks";
import type { Tool } from "@/lib/revlearn-types";

export default function ToolsPage() {
  const { tools, loading, error, reload } = useTools();
  const [query, setQuery] = useState("");

  const categories = [...new Set(tools.map((t: Tool) => t.category))];
  const filtered = tools.filter((t: Tool) =>
    [t.name, t.description, t.partnerName, t.category].join(" ").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <RevLearnShell>
      <div className="rl-page">
        <div className="rl-page-hero">
          <p className="rl-page-kicker">Partner Tools</p>
          <h1 className="rl-page-title">Apps & tools for your classroom</h1>
          <p className="rl-page-sub">
            Software and platforms from our partners — open them right here, without leaving RevLearn.
          </p>
          <input
            className="rl-page-search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search tools…"
          />
        </div>

        <div className="rl-page-body">
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
            query ? (
              <>
                <p style={{ fontSize: ".84rem", color: "var(--rl-body)", marginBottom: "1rem" }}>
                  {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "{query}"
                </p>
                <div className="rl-tools-grid">
                  {filtered.map((tool: Tool) => <ToolCard key={tool.id} tool={tool} />)}
                </div>
                {filtered.length === 0 && (
                  <p className="rl-empty-cat">No tools match "{query}"</p>
                )}
              </>
            ) : (
              categories.map(cat => {
                const catTools = tools.filter((t: Tool) => t.category === cat);
                return (
                  <div key={cat} className="rl-cat-section">
                    <h2 className="rl-section-title">{cat}</h2>
                    <div className="rl-tools-grid">
                      {catTools.map((tool: Tool) => <ToolCard key={tool.id} tool={tool} />)}
                    </div>
                  </div>
                );
              })
            )
          )}

          {!loading && !error && tools.length === 0 && (
            <div className="rl-empty">
              <p className="rl-empty-icon">🛠️</p>
              <p>No tools yet. Add some from the <a href="/revlearn/admin">admin dashboard</a>.</p>
            </div>
          )}
        </div>
      </div>
    </RevLearnShell>
  );
}

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link href={`/revlearn/tools/${tool.id}`} className="rl-tool-card">
      <div className="rl-tool-card-logo">
        {tool.logoUrl
          ? <img src={tool.logoUrl} alt={tool.name} />
          : <span className="rl-tool-logo-fallback">{tool.name[0]}</span>}
      </div>
      <div className="rl-tool-card-body">
        <p className="rl-tool-card-partner">{tool.partnerName}</p>
        <h3 className="rl-tool-card-name">{tool.name}</h3>
        <p className="rl-tool-card-desc">{tool.description}</p>
        {tool.tags?.length > 0 && (
          <div className="rl-tags" style={{ marginTop: ".5rem" }}>
            {tool.tags.slice(0, 3).map((t: string) => <span key={t} className="rl-tag">{t}</span>)}
          </div>
        )}
      </div>
      <span className="rl-tool-card-cta">Open →</span>
    </Link>
  );
}