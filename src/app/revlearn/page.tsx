"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen, Wrench, FileText, Users,
  Search, ArrowRight, Clock, ExternalLink,
  CheckCircle2, Wifi, WifiOff,
} from "lucide-react";
import { RevLearnShell, useActiveProfile } from "@/components/revlearn/shell";
import {
  useRevLearnContent, useTools, useResources,
  usePosts, useProgress, globalSearch,
} from "@/lib/revlearn-hooks";
import type { Category, Course, Tool, Resource, SearchResult } from "@/lib/revlearn-types";
import { getYoutubeThumbnail, timeAgo } from "@/lib/revlearn-utils";

function OnlineBanner() {
  const [online, setOnline] = useState(true);
  const [justBack, setJustBack] = useState(false);

  useEffect(() => {
    setOnline(navigator.onLine);
    const up = () => { setOnline(true); setJustBack(true); setTimeout(() => setJustBack(false), 4000); };
    const dn = () => setOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", dn);
    return () => { window.removeEventListener("online", up); window.removeEventListener("offline", dn); };
  }, []);

  if (online && !justBack) return null;
  return (
    <div className={`rl-connectivity-banner${online ? " rl-connectivity-banner--back" : ""}`}>
      {online
        ? <><Wifi size={14} /> Back online</>
        : <><WifiOff size={14} /> You're offline — showing saved content</>}
    </div>
  );
}

function OfflinePanel() {
  const [saved, setSaved] = useState<{ id: string; title: string; size: number }[]>([]);

  useEffect(() => {
    import("@/lib/revlearn-offline").then(({ getAllCachedPDFs }) => {
      getAllCachedPDFs()
        .then(pdfs => setSaved(pdfs.map(p => ({ id: p.id, title: p.title, size: p.size }))))
        .catch(() => {});
    });
  }, []);

  if (saved.length === 0) return null;

  return (
    <div className="rl-right-card">
      <div className="rl-right-card-hd">
        <h3 className="rl-right-card-title">📥 Saved Offline</h3>
      </div>
      <div className="rl-offline-list">
        {saved.map(s => (
          <div key={s.id} className="rl-offline-item">
            <FileText size={14} style={{ color: "var(--rl-orange)", flexShrink: 0 }} />
            <span className="rl-offline-title">{s.title}</span>
            <span className="rl-offline-size">{(s.size / (1024 * 1024)).toFixed(1)} MB</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RevLearnHome() {
  const { categories, loading: cL } = useRevLearnContent();
  const { tools, loading: tL }      = useTools();
  const { resources, loading: rL }  = useResources();
  const { posts }                   = usePosts();
  const { isComplete, completedCount } = useProgress();
  const { active }                  = useActiveProfile();
  const [query, setQuery]           = useState("");

  const loading     = cL || tL || rL;
  const isSearching = query.trim().length > 1;
  const results: SearchResult[] = isSearching
    ? globalSearch(categories, tools, resources, query)
    : [];

  const totalCourses      = categories.reduce((s: number, c: Category) => s + c.courses.length, 0);
  const featuredTools     = tools.filter((t: Tool) => t.featured).slice(0, 6);
  const featuredResources = resources.filter((r: Resource) => r.featured).slice(0, 4);
  const recentCourses     = categories
    .flatMap((c: Category) => c.courses.map((course: Course) => ({ course, category: c })))
    .slice(0, 6);

  return (
    <RevLearnShell>
      <OnlineBanner />
      <div className="rl-dashboard">

        {/* Welcome banner */}
        <div className="rl-welcome-banner">
          <div className="rl-welcome-banner-left">
            <p className="rl-welcome-banner-sub">
              {new Date().toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
            <h1 className="rl-welcome-banner-title">
              {active ? `Welcome back, ${active.name.split(" ")[0]}!` : "Welcome to RevLearn!"}
            </h1>
            <p className="rl-welcome-banner-desc">
              {active?.school
                ? `${active.school} · ${active.subject}`
                : "Set up your profile to personalise your experience."}
            </p>
            {!active && (
              <Link href="/revlearn/profile" className="rl-welcome-cta">Set up profile →</Link>
            )}
          </div>
          <div className="rl-welcome-banner-right">
            <div className="rl-welcome-stats">
              <div className="rl-welcome-stat">
                <span className="rl-welcome-stat-val">{totalCourses}</span>
                <span className="rl-welcome-stat-label">Courses</span>
              </div>
              <div className="rl-welcome-stat-divider" />
              <div className="rl-welcome-stat">
                <span className="rl-welcome-stat-val">{completedCount}</span>
                <span className="rl-welcome-stat-label">Completed</span>
              </div>
              <div className="rl-welcome-stat-divider" />
              <div className="rl-welcome-stat">
                <span className="rl-welcome-stat-val">{tools.length}</span>
                <span className="rl-welcome-stat-label">Tools</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="rl-dashboard-search-wrap">
          <Search size={16} className="rl-dashboard-search-icon" />
          <input
            className="rl-dashboard-search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search courses, tools, and resources…"
            autoComplete="off"
          />
          {query && <button className="rl-dashboard-search-clear" onClick={() => setQuery("")}>✕</button>}
        </div>

        {/* Search results */}
        {isSearching && (
          <div className="rl-dashboard-section" style={{ padding: "0 1.5rem" }}>
            <div className="rl-dashboard-section-hd">
              <h2 className="rl-dashboard-section-title">
                {results.length > 0
                  ? `${results.length} result${results.length !== 1 ? "s" : ""} for "${query}"`
                  : `No results for "${query}"`}
              </h2>
              <button className="rl-clear" onClick={() => setQuery("")}>Clear</button>
            </div>
            <div className="rl-search-results">
              {results.map((r: SearchResult, i: number) => (
                <Link
                  key={i}
                  href={
                    r.kind === "course"   ? `/revlearn/courses/${r.categoryId}/${r.id}` :
                    r.kind === "tool"     ? `/revlearn/tools/${r.id}` :
                    `/revlearn/resources/${r.id}`
                  }
                  className="rl-search-result-item"
                >
                  <span className={`rl-search-kind rl-search-kind--${r.kind}`}>
                    {r.kind === "course" ? "Course" : r.kind === "tool" ? "Tool" : "Resource"}
                  </span>
                  <div>
                    <p className="rl-search-result-title">{r.title}</p>
                    <p className="rl-search-result-sub">{r.description}</p>
                  </div>
                </Link>
              ))}
              {results.length === 0 && (
                <p className="rl-search-empty">Try "Excel", "lesson plan", or "Google Classroom".</p>
              )}
            </div>
          </div>
        )}

        {/* Dashboard grid */}
        {!isSearching && (
          <div className="rl-dashboard-grid">
            <div className="rl-dashboard-left">

              {/* Metric cards */}
              <div className="rl-metric-cards">
                {[
                  { label: "Total Courses",  value: totalCourses,    color: "var(--rl-maroon)", icon: "🎓" },
                  { label: "Completed",      value: completedCount,  color: "#0d7b6b",          icon: "✅" },
                  { label: "Tools",          value: tools.length,    color: "#b45309",          icon: "🛠️" },
                  { label: "Resources",      value: resources.length, color: "#023e8a",         icon: "📚" },
                ].map(m => (
                  <div key={m.label} className="rl-metric-card" style={{ "--metric-color": m.color } as React.CSSProperties}>
                    <span className="rl-metric-icon">{m.icon}</span>
                    <span className="rl-metric-value">{m.value}</span>
                    <span className="rl-metric-label">{m.label}</span>
                  </div>
                ))}
              </div>

              {/* Quick links */}
              {featuredTools.length > 0 && (
                <div className="rl-dashboard-section">
                  <div className="rl-dashboard-section-hd">
                    <h2 className="rl-dashboard-section-title"><Wrench size={15} /> Quick Links</h2>
                    <Link href="/revlearn/tools" className="rl-see-all">See all <ArrowRight size={13} /></Link>
                  </div>
                  <div className="rl-quicklinks">
                    {featuredTools.map((tool: Tool) => (
                      <Link
                        key={tool.id}
                        href={tool.externalUrl ?? `/revlearn/tools/${tool.id}`}
                        className="rl-quicklink"
                        target={tool.externalUrl ? "_blank" : undefined}
                        rel={tool.externalUrl ? "noopener noreferrer" : undefined}
                      >
                        <div className="rl-quicklink-logo">
                          {tool.logoUrl
                            ? <img src={tool.logoUrl} alt={tool.name} />
                            : <span>{tool.name[0]}</span>}
                        </div>
                        <span className="rl-quicklink-name">{tool.name}</span>
                        {tool.externalUrl && <ExternalLink size={10} className="rl-quicklink-ext" />}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent courses */}
              {recentCourses.length > 0 && (
                <div className="rl-dashboard-section">
                  <div className="rl-dashboard-section-hd">
                    <h2 className="rl-dashboard-section-title"><BookOpen size={15} /> Recent Courses</h2>
                    <Link href="/revlearn/courses" className="rl-see-all">See all <ArrowRight size={13} /></Link>
                  </div>
                  <div className="rl-course-cards">
                    {recentCourses.map(({ course, category }) => (
                      <Link
                        key={course.id}
                        href={`/revlearn/courses/${category.id}/${course.id}`}
                        className={`rl-course-card${isComplete(course.id) ? " rl-course-card--done" : ""}`}
                      >
                        <div
                          className="rl-course-card-thumb"
                          style={{ backgroundImage: `url(${course.thumbnail || getYoutubeThumbnail(course.url ?? "") || ""})` }}
                        >
                          {isComplete(course.id) && (
                            <span className="rl-course-card-done-badge">
                              <CheckCircle2 size={12} /> Done
                            </span>
                          )}
                        </div>
                        <div className="rl-course-card-body">
                          <span className="rl-course-card-source">{course.sourceName}</span>
                          <p className="rl-course-card-title">{course.title}</p>
                          {course.duration && (
                            <span className="rl-course-card-meta"><Clock size={11} /> {course.duration}</span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {!loading && recentCourses.length === 0 && featuredTools.length === 0 && (
                <div className="rl-empty">
                  <p className="rl-empty-icon">📚</p>
                  <p>No content yet. <a href="/revlearn/admin">Add some from the admin dashboard.</a></p>
                </div>
              )}
            </div>

            {/* Right column */}
            <div className="rl-dashboard-right">

              {featuredResources.length > 0 && (
                <div className="rl-right-card">
                  <div className="rl-right-card-hd">
                    <h3 className="rl-right-card-title"><FileText size={15} /> Resources</h3>
                    <Link href="/revlearn/resources" className="rl-see-all">See all</Link>
                  </div>
                  <div className="rl-resource-list">
                    {featuredResources.map((r: Resource) => (
                      <Link key={r.id} href={`/revlearn/resources/${r.id}`} className="rl-resource-list-item">
                        <span className={`rl-resource-type-dot rl-type-dot--${r.type}`} />
                        <div className="rl-resource-list-text">
                          <p className="rl-resource-list-title">{r.title}</p>
                          <p className="rl-resource-list-meta">{r.sourceName} · {r.audience}</p>
                        </div>
                        <ArrowRight size={13} className="rl-resource-list-arrow" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="rl-right-card">
                <div className="rl-right-card-hd">
                  <h3 className="rl-right-card-title"><Users size={15} /> Community</h3>
                  <Link href="/revlearn/community" className="rl-see-all">See all</Link>
                </div>
                {posts.length > 0 ? (
                  <div className="rl-community-list">
                    {posts.slice(0, 4).map(post => (
                      <Link key={post.id} href={`/revlearn/community/${post.id}`} className="rl-community-list-item">
                        <div className="rl-community-list-avatar" style={{ background: post.authorAvatar ?? "#e85d04" }}>
                          {post.authorName?.[0]?.toUpperCase()}
                        </div>
                        <div className="rl-community-list-text">
                          <p className="rl-community-list-author">
                            {post.authorName}
                            {post.authorSchool && <span> · {post.authorSchool}</span>}
                          </p>
                          <p className="rl-community-list-content">{post.content}</p>
                        </div>
                        <span className="rl-community-list-time">{timeAgo(post.createdAt)}</span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="rl-right-empty">
                    <p>No posts yet.</p>
                    <Link href="/revlearn/community" className="rl-see-all">Start a conversation →</Link>
                  </div>
                )}
              </div>

              <OfflinePanel />
            </div>
          </div>
        )}
      </div>
    </RevLearnShell>
  );
}