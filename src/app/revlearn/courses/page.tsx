"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, CheckCircle2, Clock, Search, ArrowLeft } from "lucide-react";
import { RevLearnShell } from "@/components/revlearn/shell";
import { useRevLearnContent, useProgress } from "@/lib/revlearn/hooks";
import type { Category, Course } from "@/lib/revlearn/types";
import { getYoutubeThumbnail } from "@/lib/revlearn/utils";

const D = '"Archivo Variable", ui-sans-serif, system-ui';

function CourseCard({ course, categoryId, done }: { course: Course; categoryId: string; done: boolean }) {
  const thumb = course.thumbnail || getYoutubeThumbnail(course.url ?? "") || "";
  return (
    <Link
      href={`/revlearn/${categoryId}/${course.id}`}
      className={`rl-course-card${done ? " rl-course-card--done" : ""}`}
    >
      {/* Thumbnail */}
      <div className="rl-course-thumb" style={{ backgroundImage: thumb ? `url(${thumb})` : undefined }}>
        {thumb
          ? <img src={thumb} alt="" className="rl-course-thumb-img" />
          : <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}><BookOpen size={28} style={{ color:"var(--rl-line-strong)" }}/></div>
        }
        {done && (
          <span className="rl-course-done-badge"><CheckCircle2 size={11}/> Done</span>
        )}
      </div>
      {/* Body */}
      <div className="rl-course-card-body">
        {/* Provider row — Coursera style */}
        <div className="rl-course-provider">
          <div className="rl-course-provider-logo">
            <span style={{ fontSize:".6rem", fontWeight:800, color:"var(--rl-maroon)", fontFamily:D }}>{course.sourceName?.[0]}</span>
          </div>
          <span className="rl-course-provider-name">{course.sourceName}</span>
        </div>
        <h3 className="rl-course-title">{course.title}</h3>
        {course.description && <p className="rl-course-desc">{course.description}</p>}
        <div className="rl-course-meta">
          {course.duration && <><Clock size={11}/> {course.duration}</>}
          <span className="rl-course-type-label">{course.type === "multi" ? "Course series" : "Course"}</span>
        </div>
      </div>
    </Link>
  );
}

export default function CoursesPage() {
  const { categories, loading, error } = useRevLearnContent();
  const { isComplete, completedCount } = useProgress();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const totalCourses = categories.reduce((s: number, c: Category) => s + c.courses.length, 0);
  const displayCategories = activeCategory
    ? categories.filter((c: Category) => c.id === activeCategory)
    : categories;
  const filtered = displayCategories.map((c: Category) => ({
    ...c,
    courses: c.courses.filter((course: Course) =>
      !query || course.title.toLowerCase().includes(query.toLowerCase()) || course.sourceName?.toLowerCase().includes(query.toLowerCase())
    ),
  })).filter((c: Category) => c.courses.length > 0);

  return (
    <RevLearnShell>
      {/* Hero */}
      <div className="rl-page-hero">
        <Link href="/revlearn" style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:".78rem", fontWeight:600, color:"rgba(255,255,255,.55)", textDecoration:"none", marginBottom:".875rem" }}>
          <ArrowLeft size={14}/> Dashboard
        </Link>
        <p className="rl-page-kicker">RevLearn</p>
        <h1 className="rl-page-title">Courses</h1>
        <input
          className="rl-page-search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search courses…"
        />
      </div>

      {/* Category filter */}
      {categories.length > 1 && (
        <div style={{ display:"flex", gap:".5rem", overflowX:"auto", padding:".875rem 2rem", background:"var(--rl-bg)", borderBottom:"1px solid var(--rl-line)", scrollbarWidth:"none" }}>
          <button onClick={() => setActiveCategory(null)} className={`rl-filter-btn${activeCategory === null ? " rl-filter-btn--active" : ""}`}>All</button>
          {categories.map((cat: Category) => (
            <button key={cat.id} onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)} className={`rl-filter-btn${activeCategory === cat.id ? " rl-filter-btn--active" : ""}`}>
              {cat.icon} {cat.title}
            </button>
          ))}
        </div>
      )}

      {/* Catalogue */}
      <div className="rl-page-body">
        {loading ? (
          <div className="rl-course-grid">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{ background:"var(--rl-bg)", border:"1px solid var(--rl-line)", borderRadius:22, overflow:"hidden" }}>
                <div style={{ width:"100%", aspectRatio:"16/9", background:"var(--rl-bg-sunken)", animation:"rl-pulse 1.5s ease-in-out infinite" }}/>
                <div style={{ padding:".875rem", display:"flex", flexDirection:"column", gap:".5rem" }}>
                  {[50,90,70].map((w,j) => <div key={j} style={{ height:12, width:`${w}%`, background:"var(--rl-bg-sunken)", borderRadius:4 }}/>)}
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rl-error-box"><p className="rl-error-title">{error}</p></div>
        ) : filtered.length === 0 ? (
          <div className="rl-empty">
            <p className="rl-empty-icon">🎓</p>
            <p>{query ? `No courses matching "${query}".` : "No courses yet."}</p>
            {!query && <Link href="/revlearn/admin/add" style={{ color:"var(--rl-maroon)", fontWeight:600 }}>Add the first course →</Link>}
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:"2.5rem" }}>
            {filtered.map((cat: Category) => (
              <section key={cat.id}>
                <div style={{ display:"flex", alignItems:"center", gap:".5rem", marginBottom:"1.125rem", paddingBottom:".75rem", borderBottom:"2px solid var(--rl-line)" }}>
                  <span style={{ fontSize:"1.25rem" }}>{cat.icon}</span>
                  <h2 style={{ margin:0, fontFamily:D, fontSize:"1.05rem", fontWeight:700, color:"var(--rl-ink)" }}>{cat.title}</h2>
                </div>
                <div className="rl-course-grid">
                  {cat.courses.map((course: Course) => (
                    <CourseCard key={course.id} course={course} categoryId={cat.id} done={isComplete(course.id)}/>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </RevLearnShell>
  );
}
