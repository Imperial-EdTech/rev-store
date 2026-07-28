"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  BookOpen, Wrench, FileText, Users, Search,
  ArrowRight, Clock, CheckCircle2, ChevronRight, ChevronLeft,
  ExternalLink, Download, Smartphone,
} from "lucide-react";
import { RevLearnShell, useActiveProfile } from "@/components/revlearn/shell";
import {
  useRevLearnContent, useTools, useResources,
  usePosts, useProgress, globalSearch,
} from "@/lib/revlearn-hooks";
import type { Category, Course, Tool, Resource, SearchResult } from "@/lib/revlearn-types";
import { getYoutubeThumbnail, timeAgo } from "@/lib/revlearn-utils";

const D = '"Archivo Variable", ui-sans-serif, system-ui';

// ── Motivational quotes ────────────────────────────────────────
const QUOTES = [
  { text: "The art of teaching is the art of assisting discovery.", author: "Mark Van Doren" },
  { text: "Education is not the filling of a pail, but the lighting of a fire.", author: "W.B. Yeats" },
  { text: "A good teacher can inspire hope, ignite the imagination, and instil a love of learning.", author: "Brad Henry" },
  { text: "Teaching is the one profession that creates all other professions.", author: "Unknown" },
  { text: "The influence of a great teacher can never be erased.", author: "Unknown" },
  { text: "Every child deserves a champion — an adult who will never give up on them.", author: "Rita Pierson" },
  { text: "In learning you will teach, and in teaching you will learn.", author: "Phil Collins" },
  { text: "To teach is to touch a life forever.", author: "Unknown" },
];

function MotivationalQuote({ name }: { name?: string }) {
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(255,107,26,.06) 0%, rgba(74,14,16,.04) 100%)",
      border: "1px solid rgba(255,107,26,.15)",
      borderLeft: "3px solid var(--rl-orange)",
      borderRadius: 12,
      padding: ".875rem 1.125rem",
      marginTop: ".875rem",
    }}>
      <p style={{ margin: "0 0 .25rem", fontSize: ".875rem", fontStyle: "italic", color: "var(--rl-ink)", lineHeight: 1.55 }}>
        &ldquo;{quote.text}&rdquo;
      </p>
      <p style={{ margin: 0, fontSize: ".72rem", fontWeight: 600, color: "var(--rl-body)" }}>
        — {quote.author}
      </p>
    </div>
  );
}

// ── RevStore carousel ──────────────────────────────────────────
const AD_SLIDES = [
  { id: "tdep", kicker: "Teacher Digital Empowerment Programme", headline: "Own a Rev Laptop from ₦15,000/month", sub: "Zero upfront. Bank-backed. Built for Nigerian teachers.", cta: "Apply now", href: "https://revstore.revrica.com/apply", bg: "linear-gradient(135deg,#1a0507 0%,#4a0e10 55%,#6b1518 100%)" },
  { id: "ltbt", kicker: "Let There Be Teachers Laptop Scheme", headline: "Member of Let There Be Teachers?", sub: "Apply through your scheme for exclusive terms.", cta: "Apply as member", href: "https://revstore.revrica.com/apply", bg: "linear-gradient(135deg,#0d0920 0%,#1a1040 55%,#2d1a6e 100%)" },
  { id: "store", kicker: "RevStore", headline: "Tablets. Smartboards. Servers.", sub: "Browse the full range of Revrica hardware.", cta: "Browse devices", href: "https://revstore.revrica.com", bg: "linear-gradient(135deg,#061510 0%,#0d2a18 55%,#1a4a2a 100%)" },
];

function RevStoreCarousel() {
  const [idx, setIdx]       = useState(0);
  const [paused, setPaused] = useState(false);
  const next = useCallback(() => setIdx(i => (i + 1) % AD_SLIDES.length), []);
  const prev = useCallback(() => setIdx(i => (i - 1 + AD_SLIDES.length) % AD_SLIDES.length), []);
  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [paused, next]);
  const s = AD_SLIDES[idx];
  return (
    <div style={{ borderRadius: 16, overflow: "hidden", position: "relative", background: s.bg, transition: "background .6s ease", border: "1px solid rgba(255,107,26,.15)" }}
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 80% 30%,rgba(255,107,26,.14) 0%,transparent 65%)", pointerEvents: "none" }} />
      <div style={{ padding: "1.25rem 1.125rem 0", position: "relative", zIndex: 1 }}>
        <p style={{ margin: "0 0 .3rem", fontSize: ".56rem", fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: "rgba(255,255,255,.4)" }}>{s.kicker}</p>
        <p style={{ margin: "0 0 .35rem", fontFamily: D, fontSize: ".975rem", fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>{s.headline}</p>
        <p style={{ margin: "0 0 .875rem", fontSize: ".76rem", color: "rgba(255,255,255,.55)", lineHeight: 1.5 }}>{s.sub}</p>
        <a href={s.href} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 14px", background: "var(--rl-orange)", color: "#fff", borderRadius: "999px", fontSize: ".78rem", fontWeight: 700, textDecoration: "none" }}>
          {s.cta} <ArrowRight size={12} />
        </a>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: ".875rem .875rem .875rem", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", gap: 5 }}>
          {AD_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} style={{ height: 4, borderRadius: "999px", border: "none", cursor: "pointer", background: i === idx ? "var(--rl-orange)" : "rgba(255,255,255,.25)", width: i === idx ? 20 : 6, transition: "all .3s", padding: 0 }} />
          ))}
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {[prev, next].map((fn, i) => (
            <button key={i} onClick={fn} style={{ width: 24, height: 24, borderRadius: "50%", border: "1px solid rgba(255,255,255,.2)", background: "rgba(255,255,255,.08)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              {i === 0 ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── PWA Install card ───────────────────────────────────────────
function InstallCard() {
  const [prompt, setPrompt]           = useState<Event | null>(null);
  const [dismissed, setDismissed]     = useState(false);
  const [installed, setInstalled]     = useState(false);
  const [showManual, setShowManual]   = useState(false);

  useEffect(() => {
    // Check if already installed (standalone mode)
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstalled(true);
      return;
    }
    const h = (e: Event) => { e.preventDefault(); setPrompt(e); };
    window.addEventListener("beforeinstallprompt", h);
    window.addEventListener("appinstalled", () => setInstalled(true));
    return () => window.removeEventListener("beforeinstallprompt", h);
  }, []);

  if (dismissed || installed) return null;

  async function handleInstall() {
    if (prompt) {
      (prompt as any).prompt();
      const result = await (prompt as any).userChoice;
      if (result.outcome === "accepted") setInstalled(true);
      setPrompt(null);
    } else {
      setShowManual(true);
    }
  }

  return (
    <div style={{ background: "var(--rl-bg)", border: "1px solid var(--rl-line)", borderRadius: 16, padding: "1.125rem 1.25rem", boxShadow: "var(--rl-shadow-xs)", display: "flex", alignItems: "flex-start", gap: ".875rem" }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--rl-maroon-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Smartphone size={22} style={{ color: "var(--rl-maroon)" }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: "0 0 .2rem", fontFamily: D, fontWeight: 700, fontSize: ".9rem", color: "var(--rl-ink)" }}>
          Install RevLearn
        </p>
        <p style={{ margin: "0 0 .75rem", fontSize: ".8rem", color: "var(--rl-body)", lineHeight: 1.5 }}>
          Add to your home screen for quick access — works offline too.
        </p>

        {showManual ? (
          <div style={{ fontSize: ".78rem", color: "var(--rl-body)", lineHeight: 1.7, background: "var(--rl-bg-subtle)", borderRadius: 10, padding: ".75rem 1rem" }}>
            <strong style={{ color: "var(--rl-ink)" }}>📱 iPhone/iPad:</strong> tap Share → Add to Home Screen<br />
            <strong style={{ color: "var(--rl-ink)" }}>🤖 Android:</strong> tap Menu (⋮) → Add to Home Screen<br />
            <strong style={{ color: "var(--rl-ink)" }}>💻 Chrome desktop:</strong> click the install icon in the address bar
          </div>
        ) : (
          <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
            <button
              onClick={handleInstall}
              style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "7px 14px", background: "var(--rl-maroon)", color: "#fff", border: "none", borderRadius: "999px", fontSize: ".82rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
            >
              <Download size={13} /> Install app
            </button>
            <button
              onClick={() => setDismissed(true)}
              style={{ padding: "7px 12px", background: "transparent", border: "1px solid var(--rl-line)", borderRadius: "999px", fontSize: ".78rem", color: "var(--rl-body)", cursor: "pointer", fontFamily: "inherit" }}
            >
              Not now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Section header ─────────────────────────────────────────────
function SHd({ title, icon, href, action }: { title: string; icon: React.ReactNode; href: string; action?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
      <h2 style={{ margin: 0, fontFamily: D, fontSize: "1rem", fontWeight: 700, color: "var(--rl-ink)", display: "flex", alignItems: "center", gap: ".4rem" }}>{icon} {title}</h2>
      <Link href={href} style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: ".8rem", fontWeight: 600, color: "var(--rl-maroon)", textDecoration: "none" }}>
        {action ?? "See all"} <ArrowRight size={12} />
      </Link>
    </div>
  );
}

// ── Coursera-style explore group ───────────────────────────────
function ExploreRow({ course, categoryId, done }: { course: Course; categoryId: string; done: boolean }) {
  const thumb = course.thumbnail || getYoutubeThumbnail(course.url ?? "") || "";
  return (
    <Link href={`/revlearn/${categoryId}/${course.id}`}
      style={{ display: "flex", alignItems: "center", gap: ".875rem", padding: ".75rem .875rem", background: "var(--rl-bg)", border: `1px solid ${done ? "var(--rl-teal)" : "var(--rl-line)"}`, borderRadius: 14, textDecoration: "none", transition: "border-color .15s, box-shadow .15s", boxShadow: "var(--rl-shadow-xs)" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--rl-maroon)"; e.currentTarget.style.boxShadow = "var(--rl-shadow-sm)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = done ? "var(--rl-teal)" : "var(--rl-line)"; e.currentTarget.style.boxShadow = "var(--rl-shadow-xs)"; }}
    >
      <div style={{ width: 52, height: 38, borderRadius: 8, flexShrink: 0, background: `var(--rl-bg-sunken) center/cover no-repeat${thumb ? ` url(${thumb})` : ""}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        {!thumb && <BookOpen size={16} style={{ color: "var(--rl-line-strong)" }} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: "0 0 .1rem", fontSize: ".65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--rl-orange)" }}>{course.sourceName}</p>
        <p style={{ margin: 0, fontFamily: D, fontSize: ".84rem", fontWeight: 700, color: "var(--rl-ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", lineHeight: 1.3 }}>{course.title}</p>
        {course.duration && <p style={{ margin: 0, display: "flex", alignItems: "center", gap: 3, fontSize: ".68rem", color: "var(--rl-body)", marginTop: 2 }}><Clock size={10} /> {course.duration}</p>}
      </div>
      {done ? <CheckCircle2 size={16} style={{ color: "var(--rl-teal)", flexShrink: 0 }} /> : <ChevronRight size={16} style={{ color: "var(--rl-body)", flexShrink: 0 }} />}
    </Link>
  );
}

// ── Tool chip ──────────────────────────────────────────────────
function ToolChip({ tool }: { tool: Tool }) {
  return (
    <a href={tool.externalUrl ?? `/revlearn/tools`} target={tool.externalUrl ? "_blank" : undefined} rel={tool.externalUrl ? "noopener noreferrer" : undefined}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: ".5rem", padding: "1rem .75rem", minWidth: 84, flexShrink: 0, background: "var(--rl-bg)", border: "1px solid var(--rl-line)", borderRadius: 16, textDecoration: "none", position: "relative", transition: "border-color .15s,transform .2s", boxShadow: "var(--rl-shadow-xs)" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--rl-maroon)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--rl-line)"; e.currentTarget.style.transform = "none"; }}
    >
      <div style={{ width: 44, height: 44, borderRadius: 11, background: "var(--rl-bg-subtle)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: D, fontSize: "1.125rem", fontWeight: 800, color: "var(--rl-maroon)" }}>
        {tool.logoUrl ? <img src={tool.logoUrl} alt={tool.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : tool.name[0]}
      </div>
      <span style={{ fontSize: ".68rem", fontWeight: 600, color: "var(--rl-ink)", textAlign: "center", lineHeight: 1.25, maxWidth: 76 }}>{tool.name}</span>
      {tool.externalUrl && <ExternalLink size={9} style={{ position: "absolute", top: 6, right: 6, color: "var(--rl-body)", opacity: .35 }} />}
    </a>
  );
}

// ── Side card ──────────────────────────────────────────────────
function SideCard({ title, icon, href, children }: { title: string; icon: React.ReactNode; href: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--rl-bg)", border: "1px solid var(--rl-line)", borderRadius: 16, padding: "1.125rem", boxShadow: "var(--rl-shadow-xs)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: ".875rem" }}>
        <h3 style={{ margin: 0, fontFamily: D, fontSize: ".9rem", fontWeight: 700, color: "var(--rl-ink)", display: "flex", alignItems: "center", gap: ".375rem" }}>{icon} {title}</h3>
        <Link href={href} style={{ fontSize: ".78rem", fontWeight: 600, color: "var(--rl-maroon)", textDecoration: "none" }}>See all</Link>
      </div>
      {children}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────
export default function RevLearnHome() {
  const { categories, loading: cL } = useRevLearnContent();
  const { tools }                   = useTools();
  const { resources }               = useResources();
  const { posts }                   = usePosts();
  const { isComplete, completedCount } = useProgress();
  const { active }                  = useActiveProfile();
  const [query, setQuery]           = useState("");

  const isSearching = query.trim().length > 1;
  const results: SearchResult[] = isSearching ? globalSearch(categories, tools, resources, query) : [];

  const allCourses: { course: Course; categoryId: string }[] = categories.flatMap((c: Category) =>
    c.courses.map((course: Course) => ({ course, categoryId: c.id }))
  );
  const incomplete        = allCourses.filter(({ course }) => !isComplete(course.id));
  const recentlyDone      = allCourses.filter(({ course }) => isComplete(course.id)).slice(0, 3);
  const continueItems     = incomplete.slice(0, 3);
  const featuredTools     = tools.filter((t: Tool) => t.featured).slice(0, 8);
  const featuredResources = resources.filter((r: Resource) => r.featured).slice(0, 4);
  const recentPosts       = posts.slice(0, 3);

  const hour      = new Date().getHours();
  const period    = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";
  const firstName = active?.name?.split(" ")?.[0];
  const greeting  = firstName ? `Good ${period}, ${firstName} 👋` : `Good ${period} 👋`;

  return (
    <RevLearnShell>
      {/* ── HERO ── */}
      <div style={{ background: "linear-gradient(135deg,#150708 0%,#3d0c0f 30%,#4a0e10 65%,#6b1518 100%)", padding: "2rem 2rem 1.75rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse at 80% 40%,rgba(255,107,26,.18) 0%,transparent 60%)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <h1 style={{ margin: "0 0 .25rem", fontFamily: D, fontSize: "clamp(1.375rem,4vw,2rem)", fontWeight: 800, color: "#fff", letterSpacing: "-.02em", lineHeight: 1.1 }}>{greeting}</h1>
          {active?.school && <p style={{ margin: "0 0 1.125rem", fontSize: ".875rem", color: "rgba(255,255,255,.5)" }}>{active.school}{active.subject ? ` · ${active.subject}` : ""}</p>}
          {/* Search */}
          <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,.11)", border: "1.5px solid rgba(255,255,255,.18)", borderRadius: "999px", padding: "0 1rem", maxWidth: 520 }}>
            <Search size={15} style={{ color: "rgba(255,255,255,.5)", flexShrink: 0 }} />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search courses, tools, resources…"
              style={{ flex: 1, height: 44, padding: "0 10px", background: "transparent", border: "none", color: "#fff", fontSize: ".875rem", outline: "none", fontFamily: "inherit" }} />
            {query && <button onClick={() => setQuery("")} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,.55)", cursor: "pointer" }}>✕</button>}
          </div>
        </div>
      </div>

      {/* ── SEARCH RESULTS ── */}
      {isSearching && (
        <div style={{ padding: "1.5rem 2rem 3rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <h2 style={{ margin: 0, fontFamily: D, fontSize: "1rem", fontWeight: 700, color: "var(--rl-ink)" }}>
              {results.length > 0 ? `${results.length} result${results.length !== 1 ? "s" : ""} for "${query}"` : `No results for "${query}"`}
            </h2>
            <button onClick={() => setQuery("")} style={{ fontSize: ".8rem", fontWeight: 600, color: "var(--rl-maroon)", background: "none", border: "none", cursor: "pointer" }}>Clear</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
            {results.map((r, i) => (
              <Link key={i} href={r.kind === "course" ? `/revlearn/${r.categoryId}/${r.id}` : `/revlearn/${r.kind === "tool" ? "tools" : "resources"}`}
                style={{ display: "flex", alignItems: "center", gap: "1rem", padding: ".875rem 1rem", background: "var(--rl-bg)", border: "1px solid var(--rl-line)", borderRadius: 12, textDecoration: "none", boxShadow: "var(--rl-shadow-xs)" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--rl-maroon)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--rl-line)")}
              >
                <span style={{ flexShrink: 0, fontSize: ".64rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", padding: "3px 8px", borderRadius: "999px", background: r.kind === "course" ? "var(--rl-maroon-light)" : r.kind === "tool" ? "var(--rl-teal-soft)" : "var(--rl-bg-subtle)", color: r.kind === "course" ? "var(--rl-maroon)" : r.kind === "tool" ? "var(--rl-teal)" : "var(--rl-body)" }}>{r.kind}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: ".9rem", fontWeight: 700, color: "var(--rl-ink)" }}>{r.title}</p>
                  <p style={{ margin: 0, fontSize: ".8rem", color: "var(--rl-body)" }}>{r.description}</p>
                </div>
                <ChevronRight size={16} style={{ color: "var(--rl-body)", flexShrink: 0 }} />
              </Link>
            ))}
            {results.length === 0 && <p style={{ color: "var(--rl-body)", fontSize: ".9rem" }}>Try &quot;Excel&quot;, &quot;lesson plan&quot;, or &quot;Canva&quot;.</p>}
          </div>
        </div>
      )}

      {/* ── MAIN ── */}
      {!isSearching && (
        <div style={{ padding: "1.5rem 2rem 5rem", display: "flex", flexDirection: "column", gap: "1.75rem" }}>

          {/* Motivational quote */}
          <MotivationalQuote name={firstName} />

          {/* Profile prompt */}
          {!active && (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.125rem 1.25rem", background: "var(--rl-maroon-light)", border: "1px solid rgba(74,14,16,.12)", borderRadius: 16, flexWrap: "wrap" }}>
              <div style={{ flex: 1 }}>
                <p style={{ margin: "0 0 .2rem", fontWeight: 700, fontSize: ".9rem", color: "var(--rl-ink)" }}>Set up your profile</p>
                <p style={{ margin: 0, fontSize: ".82rem", color: "var(--rl-body)" }}>Takes 30 seconds — track progress and post in community.</p>
              </div>
              <Link href="/revlearn/profile" style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "8px 16px", background: "var(--rl-maroon)", color: "#fff", borderRadius: "999px", fontSize: ".84rem", fontWeight: 700, textDecoration: "none", flexShrink: 0 }}>Set up →</Link>
            </div>
          )}

          {/* 2-col layout */}
          <div className="rl-dash-2col">

            {/* LEFT */}
            <div className="rl-dash-main" style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>

              {/* COURSES — "Resume your exploration" Coursera style */}
              <section>
                <SHd icon={<BookOpen size={16} />} title="Resume your exploration" href="/revlearn/courses" action="All courses" />

                {cL ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
                    {[1, 2, 3].map(i => <div key={i} style={{ height: 64, background: "var(--rl-bg-subtle)", borderRadius: 14, animation: "rl-pulse 1.5s ease-in-out infinite" }} />)}
                  </div>
                ) : allCourses.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "2rem 1rem", color: "var(--rl-body)", background: "var(--rl-bg-subtle)", borderRadius: 16 }}>
                    <p style={{ fontSize: "1.5rem", margin: "0 0 .5rem" }}>🎓</p>
                    <p style={{ margin: "0 0 .75rem", fontSize: ".875rem" }}>No courses yet.</p>
                    <Link href="/revlearn/admin/add" style={{ fontSize: ".84rem", fontWeight: 700, color: "var(--rl-maroon)", textDecoration: "none" }}>Add the first course →</Link>
                  </div>
                ) : (
                  <>
                    {/* Coursera-style grouped box — mobile responsive, side by side on desktop */}
                    <div style={{
                      background: "#eef2f8",
                      borderRadius: 16,
                      padding: "1.125rem",
                      display: "grid",
                      gridTemplateColumns: "1fr",
                      gap: "1rem",
                    }}
                      className="rl-explore-responsive"
                    >
                      <style>{`
                        @media (min-width: 640px) {
                          .rl-explore-responsive {
                            grid-template-columns: 1fr 1fr !important;
                          }
                        }
                      `}</style>

                      {/* Left group — continue learning */}
                      <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
                        <p style={{ margin: "0 0 .5rem", fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--rl-body)" }}>
                          {completedCount > 0 ? "Continue learning" : "Start here"}
                        </p>
                        {(continueItems.length > 0 ? continueItems : allCourses.slice(0, 3)).map(({ course, categoryId }) => (
                          <ExploreRow key={course.id} course={course} categoryId={categoryId} done={isComplete(course.id)} />
                        ))}
                      </div>

                      {/* Right group — recently completed or more courses */}
                      <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
                        <p style={{ margin: "0 0 .5rem", fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--rl-body)" }}>
                          {recentlyDone.length > 0 ? "Recently completed" : "More courses"}
                        </p>
                        {(recentlyDone.length > 0 ? recentlyDone : allCourses.slice(3, 6)).map(({ course, categoryId }) => (
                          <ExploreRow key={course.id} course={course} categoryId={categoryId} done={isComplete(course.id)} />
                        ))}
                      </div>
                    </div>

                    <Link href="/revlearn/courses" style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", padding: ".625rem 1rem", border: "1px solid var(--rl-line)", borderRadius: 8, color: "var(--rl-maroon)", fontSize: ".84rem", fontWeight: 600, textDecoration: "none", marginTop: ".875rem", background: "var(--rl-bg)" }}>
                      Browse all courses <ArrowRight size={14} />
                    </Link>
                  </>
                )}
              </section>

              {/* INSTALL CARD — bottom of main content, not in hero */}
              <InstallCard />
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="rl-dash-side">

              {/* Resources */}
              {featuredResources.length > 0 && (
                <SideCard title="Resources" icon={<FileText size={15} />} href="/revlearn/resources">
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {featuredResources.map((r: Resource) => (
                      <Link key={r.id} href="/revlearn/resources"
                        style={{ display: "flex", alignItems: "center", gap: ".75rem", padding: ".625rem .25rem", textDecoration: "none", borderBottom: "1px solid var(--rl-line)", transition: "background .12s" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "var(--rl-bg-subtle)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        <span style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, background: r.type === "video" ? "var(--rl-orange)" : r.type === "template" ? "#6600cc" : r.type === "app" ? "var(--rl-teal)" : "#0056d2" }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ margin: 0, fontSize: ".82rem", fontWeight: 600, color: "var(--rl-ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.title}</p>
                          <p style={{ margin: 0, fontSize: ".68rem", color: "var(--rl-body)" }}>{r.sourceName}</p>
                        </div>
                        <ChevronRight size={13} style={{ color: "var(--rl-body)", flexShrink: 0 }} />
                      </Link>
                    ))}
                  </div>
                </SideCard>
              )}

              {/* Community */}
              <SideCard title="Community" icon={<Users size={15} />} href="/revlearn/community">
                {recentPosts.length > 0 ? (
                  <>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {recentPosts.map((post: any) => (
                        <Link key={post.id} href={`/revlearn/community/${post.id}`}
                          style={{ display: "flex", alignItems: "flex-start", gap: ".625rem", padding: ".625rem .25rem", textDecoration: "none", borderBottom: "1px solid var(--rl-line)", transition: "background .12s" }}
                          onMouseEnter={e => (e.currentTarget.style.background = "var(--rl-bg-subtle)")}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        >
                          <div style={{ width: 28, height: 28, borderRadius: "50%", background: post.authorAvatar ?? "#e85d04", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: ".72rem" }}>
                            {post.authorName?.[0]?.toUpperCase()}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ margin: "0 0 .1rem", fontSize: ".78rem", fontWeight: 700, color: "var(--rl-ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{post.authorName}</p>
                            <p style={{ margin: 0, fontSize: ".75rem", color: "var(--rl-body)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any, overflow: "hidden" }}>{post.content}</p>
                          </div>
                          <span style={{ fontSize: ".65rem", color: "var(--rl-body)", whiteSpace: "nowrap", flexShrink: 0 }}>{timeAgo(post.createdAt)}</span>
                        </Link>
                      ))}
                    </div>
                    <Link href="/revlearn/community" style={{ display: "block", padding: ".625rem .25rem", fontSize: ".8rem", fontWeight: 600, color: "var(--rl-maroon)", textDecoration: "none", marginTop: ".25rem" }}>
                      Join the conversation →
                    </Link>
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: ".75rem 0" }}>
                    <p style={{ fontSize: ".84rem", color: "var(--rl-body)", margin: "0 0 .5rem" }}>No posts yet.</p>
                    <Link href="/revlearn/community" style={{ fontSize: ".82rem", fontWeight: 700, color: "var(--rl-maroon)", textDecoration: "none" }}>Start a conversation →</Link>
                  </div>
                )}
              </SideCard>

              {/* Tools — BELOW Community */}
              {featuredTools.length > 0 && (
                <SideCard title="Tools" icon={<Wrench size={15} />} href="/revlearn/tools">
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: ".5rem" }}>
                    {featuredTools.slice(0, 6).map((t: Tool) => (
                      <a key={t.id} href={t.externalUrl ?? `/revlearn/tools`} target={t.externalUrl ? "_blank" : undefined} rel={t.externalUrl ? "noopener noreferrer" : undefined}
                        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: ".35rem", padding: ".625rem .375rem", background: "var(--rl-bg-subtle)", borderRadius: 12, textDecoration: "none", transition: "background .15s" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "var(--rl-maroon-light)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "var(--rl-bg-subtle)")}
                      >
                        <div style={{ width: 36, height: 36, borderRadius: 9, background: "var(--rl-bg)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: D, fontSize: ".875rem", fontWeight: 800, color: "var(--rl-maroon)" }}>
                          {t.logoUrl ? <img src={t.logoUrl} alt={t.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : t.name[0]}
                        </div>
                        <span style={{ fontSize: ".6rem", fontWeight: 600, color: "var(--rl-ink)", textAlign: "center", lineHeight: 1.2, maxWidth: 64 }}>{t.name}</span>
                      </a>
                    ))}
                  </div>
                </SideCard>
              )}

              {/* RevStore carousel */}
              <RevStoreCarousel />
            </div>
          </div>
        </div>
      )}
    </RevLearnShell>
  );
}
