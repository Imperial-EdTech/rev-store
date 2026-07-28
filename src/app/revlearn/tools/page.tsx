"use client";

import { useState } from "react";
import { Loader2, AlertCircle, ExternalLink, ArrowRight } from "lucide-react";
import Link from "next/link";
import { RevLearnShell } from "@/components/revlearn/shell";
import { useTools } from "@/lib/revlearn-hooks";
import type { Tool } from "@/lib/revlearn-types";

const D = '"Archivo Variable", ui-sans-serif, system-ui';

function ToolCard({ tool }: { tool: Tool }) {
  const isExternal = !!tool.externalUrl;
  const Tag = isExternal ? "a" : Link;
  const props = isExternal
    ? { href: tool.externalUrl!, target: "_blank", rel: "noopener noreferrer" }
    : { href: `/revlearn/tools/${tool.id}` };

  return (
    <Tag {...(props as any)}
      style={{ display:"flex", flexDirection:"column", background:"var(--rl-bg)", border:"1px solid var(--rl-line)", borderRadius:20, overflow:"hidden", textDecoration:"none", boxShadow:"var(--rl-shadow-xs)", transition:"border-color .2s,transform .25s,box-shadow .2s" }}
      onMouseEnter={(e: any) => { e.currentTarget.style.borderColor="var(--rl-maroon)"; e.currentTarget.style.transform="translateY(-5px)"; e.currentTarget.style.boxShadow="var(--rl-shadow)"; }}
      onMouseLeave={(e: any) => { e.currentTarget.style.borderColor="var(--rl-line)"; e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="var(--rl-shadow-xs)"; }}
    >
      {/* Logo zone */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:100, background:"var(--rl-bg-subtle)", borderBottom:"1px solid var(--rl-line)", position:"relative" }}>
        {tool.logoUrl
          ? <img src={tool.logoUrl} alt={tool.name} style={{ maxHeight:56, maxWidth:"70%", objectFit:"contain" }}/>
          : <span style={{ fontFamily:D, fontSize:"2.25rem", fontWeight:900, color:"var(--rl-maroon)", letterSpacing:"-.04em" }}>{tool.name[0]}</span>
        }
        {isExternal && (
          <span style={{ position:"absolute", top:10, right:10, display:"flex", alignItems:"center", justifyContent:"center", width:26, height:26, background:"var(--rl-bg)", border:"1px solid var(--rl-line)", borderRadius:"50%" }}>
            <ExternalLink size={12} style={{ color:"var(--rl-body)" }}/>
          </span>
        )}
        {tool.partnerName && (
          <span style={{ position:"absolute", bottom:8, left:10, fontSize:".6rem", fontWeight:700, textTransform:"uppercase", letterSpacing:".1em", color:"var(--rl-orange)" }}>{tool.partnerName}</span>
        )}
      </div>
      {/* Body */}
      <div style={{ padding:"1rem 1.125rem 1.25rem", flex:1, display:"flex", flexDirection:"column", gap:".3rem" }}>
        <h3 style={{ margin:0, fontFamily:D, fontSize:"1rem", fontWeight:700, color:"var(--rl-ink)", lineHeight:1.3 }}>{tool.name}</h3>
        <p style={{ margin:0, fontSize:".82rem", color:"var(--rl-body)", lineHeight:1.55, flex:1, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" as any, overflow:"hidden" }}>{tool.description}</p>
        {tool.tags?.length > 0 && (
          <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginTop:".25rem" }}>
            {tool.tags.slice(0,3).map((t: string) => (
              <span key={t} style={{ fontSize:".62rem", fontWeight:600, padding:"2px 8px", background:"var(--rl-bg-subtle)", borderRadius:"999px", color:"var(--rl-body)", border:"1px solid var(--rl-line)" }}>{t}</span>
            ))}
          </div>
        )}
      </div>
      <div style={{ padding:".75rem 1.125rem", borderTop:"1px solid var(--rl-line)", background:"var(--rl-bg-subtle)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <span style={{ fontSize:".78rem", fontWeight:700, color:"var(--rl-maroon)" }}>{isExternal ? "Open tool" : "View details"}</span>
        <ArrowRight size={14} style={{ color:"var(--rl-maroon)" }}/>
      </div>
    </Tag>
  );
}

export default function ToolsPage() {
  const { tools, loading, error, reload } = useTools();
  const [query, setQuery] = useState("");

  const categories = [...new Set(tools.map((t: Tool) => t.category))];
  const filtered   = tools.filter((t: Tool) =>
    [t.name, t.description, t.partnerName, t.category].join(" ").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <RevLearnShell>
      <div className="rl-page-hero">
        <p className="rl-page-kicker">Tools</p>
        <h1 className="rl-page-title">Apps &amp; tools to power your teaching</h1>
        <input className="rl-page-search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search tools…"/>
      </div>

      <div className="rl-page-body">
        {loading && <div className="rl-state-center"><Loader2 size={24} className="rl-spin"/></div>}
        {error && (
          <div className="rl-error-box">
            <AlertCircle size={16}/>
            <div><p className="rl-error-title">{error}</p><button className="rl-retry-btn" onClick={reload}>Retry</button></div>
          </div>
        )}
        {!loading && !error && tools.length === 0 && (
          <div className="rl-empty">
            <p className="rl-empty-icon">🛠️</p>
            <p>No tools yet. <a href="/revlearn/admin">Add some from the admin dashboard.</a></p>
          </div>
        )}
        {!loading && !error && tools.length > 0 && (
          query ? (
            <>
              <p style={{ fontSize:".84rem", color:"var(--rl-body)", marginBottom:"1.25rem" }}>{filtered.length} result{filtered.length !== 1 ? "s" : ""} for &quot;{query}&quot;</p>
              <div className="rl-tools-grid">{filtered.map((t: Tool) => <ToolCard key={t.id} tool={t}/>)}</div>
              {filtered.length === 0 && <p className="rl-empty-cat">No tools match &quot;{query}&quot;</p>}
            </>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:"2.5rem" }}>
              {categories.map(cat => (
                <section key={cat}>
                  <h2 style={{ margin:"0 0 1.125rem", fontFamily:D, fontSize:"1.05rem", fontWeight:700, color:"var(--rl-ink)", paddingBottom:".75rem", borderBottom:"2px solid var(--rl-line)", display:"flex", alignItems:"center", gap:".5rem" }}>
                    {cat}
                  </h2>
                  <div className="rl-tools-grid">{tools.filter((t: Tool) => t.category === cat).map((t: Tool) => <ToolCard key={t.id} tool={t}/>)}</div>
                </section>
              ))}
            </div>
          )
        )}
      </div>
    </RevLearnShell>
  );
}
