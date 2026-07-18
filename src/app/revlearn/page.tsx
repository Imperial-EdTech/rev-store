"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Wrench, FileText, Users, Search, ArrowRight, Clock } from "lucide-react";
import { RevLearnShell } from "@/components/revlearn/shell";
import { useRevLearnContent, useTools, useResources, usePosts, useProgress, globalSearch } from "@/lib/revlearn-hooks";
import type { Category, Course, Tool, Resource, SearchResult } from "@/lib/revlearn-types";
import { getYoutubeThumbnail, timeAgo } from "@/lib/revlearn-utils";

export default function RevLearnHome() {
  const { categories, loading: cLoading } = useRevLearnContent();
  const { tools, loading: tLoading } = useTools();
  const { resources, loading: rLoading } = useResources();
  const { posts, loading: pLoading } = usePosts();
  const { isComplete, completedCount } = useProgress();
  const [query, setQuery] = useState("");

  const loading = cLoading || tLoading || rLoading || pLoading;
  const isSearching = query.trim().length > 1;
  const results: SearchResult[] = isSearching ? globalSearch(categories, tools, resources, query) : [];

  const totalCourses = categories.reduce((s: number, c: Category) => s + c.courses.length, 0);
  const featuredTools = tools.filter((t: Tool) => t.featured).slice(0, 4);
  const featuredResources = resources.filter((r: Resource) => r.featured).slice(0, 4);
  const recentPosts = posts.slice(0, 3);

  return (
    <RevLearnShell>
      <div className="rl-home">

        {/* Hero */}
        <div className="rl-home-hero">
          <h1 className="rl-home-title">Everything you need to teach with confidence.</h1>
          <p className="rl-home-sub">Free resources for teachers — all in one place.</p>
          <div className="rl-home-search-wrap">
            <Search size={17} className="rl-home-search-icon" />
            <input
              className="rl-home-search-input"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={
                loading
                  ? "Loading…"
                  : `Search across ${totalCourses} courses, tools, and resources…`
              }
              autoComplete="off"
            />
            {query && (
              <button className="rl-home-search-clear" onClick={() => setQuery("")}>✕</button>
            )}
          </div>
          {completedCount > 0 && (
            <p className="rl-home-progress">
              ✓ {completedCount} course{completedCount !== 1 ? "s" : ""} completed on this device
            </p>
          )}
        </div>

        {/* Search results */}
        {isSearching && (
          <div className="rl-home-section">
            <div className="rl-home-section-hd">
              <h2 className="rl-home-section-title">
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
                    r.kind === "course" ? `/revlearn/courses/${r.categoryId}/${r.id}` :
                    r.kind === "tool"   ? `/revlearn/tools/${r.id}` :
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
                <p className="rl-search-empty">
                  Try "Excel", "lesson plan", or "games".
                </p>
              )}
            </div>
          </div>
        )}

        {/* Main content */}
        {!isSearching && !loading && (
          <>
            {/* Stats strip */}
            <div className="rl-stats-strip">
              {[
                { icon: BookOpen, label: "Courses",   value: totalCourses,   href: "/revlearn/courses" },
                { icon: Wrench,   label: "Tools",     value: tools.length,   href: "/revlearn/tools" },
                { icon: FileText, label: "Resources", value: resources.length, href: "/revlearn/resources" },
                { icon: Users,    label: "Community", value: posts.length > 0 ? `${posts.length} posts` : "Join", href: "/revlearn/community" },
              ].map(({ icon: Icon, label, value, href }) => (
                <Link key={label} href={href} className="rl-stat-card">
                  <Icon size={20} className="rl-stat-icon" />
                  <span className="rl-stat-value">{value}</span>
                  <span className="rl-stat-label">{label}</span>
                </Link>
              ))}
            </div>

            {/* Courses */}
            {categories.length > 0 && (
              <div className="rl-home-section">
                <div className="rl-home-section-hd">
                  <h2 className="rl-home-section-title"><BookOpen size={16} /> Courses</h2>
                  <Link href="/revlearn/courses" className="rl-see-all">See all <ArrowRight size={13} /></Link>
                </div>
                <div className="rl-home-cards">
                  {categories
                    .flatMap((c: Category) => c.courses.map((course: Course) => ({ course, category: c })))
                    .slice(0, 4)
                    .map(({ course, category }) => (
                      <Link
                        key={course.id}
                        href={`/revlearn/courses/${category.id}/${course.id}`}
                        className={`rl-mini-card${isComplete(course.id) ? " rl-mini-card--done" : ""}`}
                      >
                        <div
                          className="rl-mini-thumb"
                          style={{
                            backgroundImage: `url(${
                              course.thumbnail || getYoutubeThumbnail(course.url ?? "") || ""
                            })`
                          }}
                        />
                        <div className="rl-mini-body">
                          <span className="rl-mini-source">{course.sourceName}</span>
                          <p className="rl-mini-title">{course.title}</p>
                          {course.duration && (
                            <span className="rl-mini-meta"><Clock size={11} /> {course.duration}</span>
                          )}
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            )}

            {/* Partner Tools */}
            {featuredTools.length > 0 && (
              <div className="rl-home-section">
                <div className="rl-home-section-hd">
                  <h2 className="rl-home-section-title"><Wrench size={16} /> Partner Tools</h2>
                  <Link href="/revlearn/tools" className="rl-see-all">See all <ArrowRight size={13} /></Link>
                </div>
                <div className="rl-home-cards">
                  {featuredTools.map((tool: Tool) => (
                    <Link
                      key={tool.id}
                      href={`/revlearn/tools/${tool.id}`}
                      className="rl-mini-card rl-mini-card--tool"
                    >
                      <div className="rl-tool-logo-wrap">
                        {tool.logoUrl
                          ? <img src={tool.logoUrl} alt={tool.name} className="rl-tool-logo-img" />
                          : <span className="rl-tool-logo-fallback">{tool.name[0]}</span>}
                      </div>
                      <div className="rl-mini-body">
                        <span className="rl-mini-source">{tool.partnerName}</span>
                        <p className="rl-mini-title">{tool.name}</p>
                        <p className="rl-mini-desc">{tool.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Resources */}
            {featuredResources.length > 0 && (
              <div className="rl-home-section">
                <div className="rl-home-section-hd">
                  <h2 className="rl-home-section-title"><FileText size={16} /> Resources</h2>
                  <Link href="/revlearn/resources" className="rl-see-all">See all <ArrowRight size={13} /></Link>
                </div>
                <div className="rl-home-cards">
                  {featuredResources.map((r: Resource) => (
                    <Link
                      key={r.id}
                      href={`/revlearn/resources/${r.id}`}
                      className="rl-mini-card"
                    >
                      <div
                        className="rl-mini-thumb"
                        style={{
                          background: "var(--rl-bg-sunken)",
                          display: "flex", alignItems: "center", justifyContent: "center"
                        }}
                      >
                        <span className={`rl-resource-type-pill rl-resource-type--${r.type}`}>{r.type}</span>
                      </div>
                      <div className="rl-mini-body">
                        <span className="rl-mini-source">{r.sourceName}</span>
                        <p className="rl-mini-title">{r.title}</p>
                        <span className={`rl-audience-pill rl-audience--${r.audience}`}>{r.audience}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Community */}
            {recentPosts.length > 0 && (
              <div className="rl-home-section" style={{ paddingBottom: "1.5rem" }}>
                <div className="rl-home-section-hd">
                  <h2 className="rl-home-section-title"><Users size={16} /> Community</h2>
                  <Link href="/revlearn/community" className="rl-see-all">See all <ArrowRight size={13} /></Link>
                </div>
                <div className="rl-community-preview">
                  {recentPosts.map(post => (
                    <Link
                      key={post.id}
                      href={`/revlearn/community/${post.id}`}
                      className="rl-community-preview-item"
                    >
                      <div
                        className="rl-community-preview-avatar"
                        style={{ background: post.authorAvatar ?? "#e85d04" }}
                      >
                        {post.authorName?.[0]?.toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p className="rl-community-preview-author">
                          {post.authorName}
                          {post.authorSchool && (
                            <span className="rl-community-preview-school"> · {post.authorSchool}</span>
                          )}
                        </p>
                        <p className="rl-community-preview-content">{post.content}</p>
                      </div>
                      <span className="rl-community-preview-time">{timeAgo(post.createdAt)}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state — no content at all */}
            {categories.length === 0 && tools.length === 0 && resources.length === 0 && (
              <div className="rl-empty" style={{ padding: "4rem 1.5rem" }}>
                <p className="rl-empty-icon">📚</p>
                <p>
                  No content yet.{" "}
                  <a href="/revlearn/admin">Add courses, tools, and resources from the admin dashboard.</a>
                </p>
              </div>
            )}
          </>
        )}

        {/* Loading state */}
        {!isSearching && loading && (
          <div className="rl-state-center" style={{ minHeight: "40vh" }}>
            <div className="rl-frame-spinner" />
            <p>Loading…</p>
          </div>
        )}
      </div>
    </RevLearnShell>
  );
}