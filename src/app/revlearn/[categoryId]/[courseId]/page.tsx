"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2, Circle, Loader2, AlertCircle, ChevronRight,
  Clock, BookOpen, FileText, Sparkles, ArrowLeft,
  MessageSquare, StickyNote, ChevronDown, ChevronUp,
} from "lucide-react";
import { useState } from "react";
import { RevLearnShell } from "@/components/revlearn/shell";
import { ResourceFrame } from "@/components/revlearn/resource-frame";
import { useRevLearnContent, useProgress } from "@/lib/revlearn-hooks";
import type { Category, Course, Lesson } from "@/lib/revlearn-types";
import { getYoutubeThumbnail } from "@/lib/revlearn-utils";

const D = '"Archivo Variable", ui-sans-serif, system-ui';

// ── AI Dive-deeper prompts (Coursera-style) ───────────────────
const PROMPTS = [
  "Give me practice questions",
  "Explain this in simple terms",
  "Give me a summary",
  "Give me real-life examples",
  "What are the key takeaways?",
];

function DiveDeeperPanel({ courseTitle }: { courseTitle: string }) {
  const [open, setOpen]     = useState(true);
  const [active, setActive] = useState<string | null>(null);

  return (
    <div style={{ border: "1px solid var(--rl-line)", borderRadius: 14, overflow: "hidden", marginTop: "1rem" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: ".875rem 1.125rem", background: "var(--rl-bg-subtle)", border: "none", cursor: "pointer", fontFamily: "inherit" }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: ".5rem", fontFamily: D, fontSize: ".875rem", fontWeight: 700, color: "var(--rl-ink)" }}>
          <Sparkles size={16} style={{ color: "#7c3aed" }} />
          Dive deeper on this topic
        </span>
        {open ? <ChevronUp size={16} style={{ color: "var(--rl-body)" }} /> : <ChevronDown size={16} style={{ color: "var(--rl-body)" }} />}
      </button>

      {open && (
        <div style={{ padding: "1rem 1.125rem", background: "var(--rl-bg)", display: "flex", flexDirection: "column", gap: ".875rem" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem" }}>
            {PROMPTS.map(p => (
              <button
                key={p}
                onClick={() => setActive(active === p ? null : p)}
                style={{
                  padding: "6px 14px", border: `1.5px solid ${active === p ? "#7c3aed" : "var(--rl-line)"}`,
                  borderRadius: "999px", background: active === p ? "#f5f3ff" : "var(--rl-bg)",
                  color: active === p ? "#7c3aed" : "var(--rl-ink)", fontSize: ".82rem", fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit", transition: "all .15s",
                }}
              >
                {p}
              </button>
            ))}
          </div>

          {active && (
            <div style={{ background: "#f5f3ff", border: "1px solid #ddd6fe", borderRadius: 10, padding: ".875rem 1rem", fontSize: ".84rem", color: "#4c1d95", lineHeight: 1.65 }}>
              <strong>RevLearn AI</strong> — This feature is coming soon. In the meantime, we suggest searching for <em>&ldquo;{active.toLowerCase()} {courseTitle}&rdquo;</em> to find helpful resources.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Tabs (Transcript, Notes, Files) ──────────────────────────
type Tab = "transcript" | "notes";

function CourseTabs({ courseTitle }: { courseTitle: string }) {
  const [tab, setTab]   = useState<Tab>("transcript");
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  function saveNote() {
    if (!note.trim()) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const tabBtn = (id: Tab, label: string, icon: React.ReactNode) => (
    <button
      onClick={() => setTab(id)}
      style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: ".375rem",
        padding: ".875rem", border: "none", borderBottom: `2px solid ${tab === id ? "var(--rl-maroon)" : "transparent"}`,
        background: "transparent", color: tab === id ? "var(--rl-maroon)" : "var(--rl-body)",
        fontSize: ".84rem", fontWeight: tab === id ? 700 : 500, cursor: "pointer", fontFamily: "inherit",
        transition: "color .15s, border-color .15s",
      }}
    >
      {icon} {label}
    </button>
  );

  return (
    <div style={{ border: "1px solid var(--rl-line)", borderRadius: 14, overflow: "hidden", marginTop: "1rem" }}>
      {/* Tab headers */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--rl-line)", background: "var(--rl-bg)" }}>
        {tabBtn("transcript", "Transcript", <MessageSquare size={14} />)}
        {tabBtn("notes", "My Notes", <StickyNote size={14} />)}
      </div>

      {/* Tab content */}
      <div style={{ padding: "1.125rem", background: "var(--rl-bg)" }}>
        {tab === "transcript" && (
          <div style={{ fontSize: ".84rem", color: "var(--rl-body)", lineHeight: 1.7 }}>
            <p style={{ margin: "0 0 .5rem", fontWeight: 600, color: "var(--rl-ink)" }}>Course: {courseTitle}</p>
            <p style={{ margin: 0 }}>
              Transcript is not available for this course. If this course is hosted on an external platform (YouTube, etc.), check the original video for captions or a transcript.
            </p>
          </div>
        )}

        {tab === "notes" && (
          <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder={`Take notes on "${courseTitle}"…`}
              rows={4}
              style={{ width: "100%", padding: ".75rem .875rem", background: "var(--rl-bg-subtle)", border: "1.5px solid var(--rl-line)", borderRadius: 10, color: "var(--rl-ink)", fontSize: ".875rem", outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box", transition: "border-color .15s" }}
              onFocus={e => (e.target.style.borderColor = "var(--rl-maroon)")}
              onBlur={e => (e.target.style.borderColor = "var(--rl-line)")}
            />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: ".72rem", color: "var(--rl-body)" }}>Notes are saved locally on this device.</span>
              <button onClick={saveNote} disabled={!note.trim()}
                style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 14px", background: saved ? "var(--rl-teal)" : "var(--rl-maroon)", color: "#fff", border: "none", borderRadius: "999px", fontSize: ".8rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "background .2s", opacity: note.trim() ? 1 : .45 }}>
                {saved ? "✓ Saved" : "Save note"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────
export default function CoursePage() {
  const params = useParams<{ categoryId: string; courseId: string }>();
  const { categories, loading, error } = useRevLearnContent();
  const { isComplete, markComplete, markIncomplete } = useProgress();
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  const category = categories.find((c: Category) => c.id === params.categoryId);
  const course   = category?.courses.find((c: Course) => c.id === params.courseId);
  const done     = course ? isComplete(course.id) : false;

  const currentLesson = activeLesson ?? (course?.type === "multi" ? course.lessons?.[0] ?? null : null);
  const activeUrl     = course?.type === "single" ? (course.url ?? "") : (currentLesson?.url ?? "");
  const activeTitle   = course?.type === "single" ? course.title : (currentLesson?.title ?? "");
  const related       = category?.courses.filter((c: Course) => c.id !== course?.id).slice(0, 5) ?? [];

  if (loading) {
    return (
      <RevLearnShell>
        <div className="rl-state-center" style={{ minHeight: "80vh" }}>
          <Loader2 size={28} className="rl-spin" />
          <span style={{ color: "var(--rl-body)", fontSize: ".9rem" }}>Loading course…</span>
        </div>
      </RevLearnShell>
    );
  }

  if (error || !category || !course) {
    return (
      <RevLearnShell>
        <div style={{ padding: "3rem 2rem" }}>
          <div className="rl-error-box">
            <AlertCircle size={20} />
            <div>
              <p className="rl-error-title">{error ?? "Course not found"}</p>
              <Link href="/revlearn/courses" className="rl-retry-btn" style={{ display: "inline-block", marginTop: ".75rem" }}>Back to courses</Link>
            </div>
          </div>
        </div>
      </RevLearnShell>
    );
  }

  return (
    <RevLearnShell>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 0 4rem" }}>

        {/* ── Breadcrumb ── */}
        <div style={{ padding: ".875rem 2rem", borderBottom: "1px solid var(--rl-line)", background: "var(--rl-bg)", display: "flex", alignItems: "center", gap: ".5rem", flexWrap: "wrap" }}>
          <Link href="/revlearn/courses" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: ".8rem", color: "var(--rl-maroon)", textDecoration: "none", fontWeight: 600 }}>
            <ArrowLeft size={13} /> Courses
          </Link>
          <ChevronRight size={12} style={{ color: "var(--rl-body)" }} />
          <span style={{ fontSize: ".8rem", color: "var(--rl-body)" }}>{category.title}</span>
          <ChevronRight size={12} style={{ color: "var(--rl-body)" }} />
          <span style={{ fontSize: ".8rem", color: "var(--rl-ink)", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 200 }}>{course.title}</span>
        </div>

        {/* ── Main layout ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }} className="rl-player-layout-v2">
          <style>{`
            @media (min-width: 960px) {
              .rl-player-layout-v2 {
                flex-direction: row !important;
                align-items: flex-start;
                gap: 0 !important;
              }
              .rl-player-left {
                flex: 1;
                min-width: 0;
              }
              .rl-player-right {
                width: 340px;
                flex-shrink: 0;
                border-left: 1px solid var(--rl-line);
                position: sticky;
                top: 64px;
                height: calc(100vh - 64px);
                overflow-y: auto;
              }
            }
          `}</style>

          {/* LEFT — video + info */}
          <div className="rl-player-left">
            {/* Video player */}
            <div style={{ background: "#0d0d0d", position: "relative" }}>
              {activeUrl ? (
                <ResourceFrame url={activeUrl} title={activeTitle} sourceName={course.sourceName} />
              ) : (
                <div style={{ aspectRatio: "16/9", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem", background: "#111" }}>
                  <BookOpen size={40} style={{ color: "rgba(255,255,255,.3)" }} />
                  <p style={{ fontSize: ".9rem", color: "rgba(255,255,255,.45)" }}>No video URL set for this course.</p>
                </div>
              )}
            </div>

            {/* Info area */}
            <div style={{ padding: "1.375rem 1.5rem 1rem", borderBottom: "1px solid var(--rl-line)", background: "var(--rl-bg)" }}>
              {/* Title + mark complete */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: ".625rem" }}>
                <h1 style={{ margin: 0, fontFamily: D, fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)", fontWeight: 800, color: "var(--rl-ink)", letterSpacing: "-.02em", lineHeight: 1.2, flex: 1 }}>
                  {course.type === "multi" && currentLesson ? currentLesson.title : course.title}
                </h1>
                <button
                  onClick={() => done ? markIncomplete(course.id) : markComplete(course.id)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 16px",
                    border: `2px solid ${done ? "var(--rl-teal)" : "var(--rl-line-strong)"}`,
                    borderRadius: "999px", background: done ? "var(--rl-teal-soft)" : "transparent",
                    color: done ? "var(--rl-teal)" : "var(--rl-body)", fontSize: ".82rem", fontWeight: 700,
                    cursor: "pointer", fontFamily: "inherit", transition: "all .2s", flexShrink: 0,
                  }}
                >
                  {done ? <><CheckCircle2 size={15} /> Completed</> : <><Circle size={15} /> Mark complete</>}
                </button>
              </div>

              {/* Meta row */}
              <div style={{ display: "flex", alignItems: "center", gap: ".75rem", flexWrap: "wrap" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", background: "var(--rl-maroon-light)", color: "var(--rl-maroon)", borderRadius: "999px", fontSize: ".72rem", fontWeight: 700 }}>
                  {course.sourceName}
                </span>
                {course.duration && (
                  <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: ".78rem", color: "var(--rl-body)" }}>
                    <Clock size={13} /> {course.duration}
                  </span>
                )}
                {course.type === "multi" && course.lessons && (
                  <span style={{ fontSize: ".78rem", color: "var(--rl-body)" }}>
                    {course.lessons.length} lesson{course.lessons.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {/* Description */}
              {course.description && (
                <p style={{ margin: "1rem 0 0", fontSize: ".875rem", lineHeight: 1.65, color: "var(--rl-body)" }}>
                  {course.description}
                </p>
              )}

              {/* Tags */}
              {course.tags?.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: ".875rem" }}>
                  {course.tags.map((t: string) => (
                    <span key={t} style={{ fontSize: ".66rem", fontWeight: 600, padding: "3px 9px", background: "var(--rl-bg-subtle)", borderRadius: "999px", color: "var(--rl-body)", border: "1px solid var(--rl-line)" }}>{t}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Dive deeper + Tabs */}
            <div style={{ padding: "0 1.5rem 2rem", background: "var(--rl-bg)" }}>
              <DiveDeeperPanel courseTitle={course.title} />
              <CourseTabs courseTitle={course.title} />
            </div>

            {/* Lesson list — mobile only */}
            {course.type === "multi" && course.lessons && course.lessons.length > 0 && (
              <div style={{ margin: "0 1.5rem 1.5rem", border: "1px solid var(--rl-line)", borderRadius: 14, overflow: "hidden", display: "block" }} className="rl-lessons-mobile">
                <div style={{ padding: ".875rem 1.125rem", borderBottom: "1px solid var(--rl-line)", background: "var(--rl-bg-subtle)" }}>
                  <h3 style={{ margin: 0, fontFamily: D, fontSize: ".9rem", fontWeight: 700, color: "var(--rl-ink)" }}>Course content</h3>
                </div>
                <ol style={{ listStyle: "none", padding: ".5rem", margin: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                  {course.lessons.map((lesson: Lesson, i: number) => {
                    const isActive = (currentLesson?.id ?? course.lessons![0]?.id) === lesson.id;
                    return (
                      <li key={lesson.id}>
                        <button onClick={() => setActiveLesson(lesson)}
                          style={{ display: "flex", alignItems: "flex-start", gap: ".625rem", width: "100%", padding: ".625rem .75rem", border: `1px solid ${isActive ? "var(--rl-maroon)" : "transparent"}`, borderRadius: 10, background: isActive ? "var(--rl-maroon-light)" : "transparent", textAlign: "left", cursor: "pointer", fontFamily: "inherit", transition: "background .15s" }}>
                          <span style={{ fontSize: ".68rem", fontWeight: 800, color: "var(--rl-maroon)", minWidth: 18, paddingTop: 1, flexShrink: 0 }}>{i + 1}</span>
                          <span style={{ fontSize: ".84rem", fontWeight: isActive ? 600 : 400, color: "var(--rl-ink)", lineHeight: 1.35 }}>{lesson.title}</span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR — desktop */}
          <div className="rl-player-right" style={{ padding: "1.25rem" }}>

            {/* Course lessons */}
            {course.type === "multi" && course.lessons && course.lessons.length > 0 && (
              <div style={{ marginBottom: "1.25rem" }}>
                <p style={{ margin: "0 0 .75rem", fontSize: ".64rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--rl-maroon)" }}>Course content</p>
                <p style={{ margin: "0 0 .875rem", fontFamily: D, fontSize: ".875rem", fontWeight: 700, color: "var(--rl-ink)", lineHeight: 1.3 }}>{course.title}</p>
                <div style={{ height: 1, background: "var(--rl-line)", margin: ".75rem 0" }} />
                <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                  {course.lessons.map((lesson: Lesson, i: number) => {
                    const isActive = (currentLesson?.id ?? course.lessons![0]?.id) === lesson.id;
                    return (
                      <li key={lesson.id}>
                        <button onClick={() => setActiveLesson(lesson)}
                          style={{ display: "flex", alignItems: "flex-start", gap: ".5rem", width: "100%", padding: ".5rem .625rem", border: `1px solid ${isActive ? "var(--rl-maroon)" : "transparent"}`, borderRadius: 10, background: isActive ? "var(--rl-maroon-light)" : "transparent", textAlign: "left", cursor: "pointer", fontFamily: "inherit", transition: "background .15s" }}>
                          <span style={{ fontSize: ".68rem", fontWeight: 800, color: "var(--rl-maroon)", minWidth: 16, paddingTop: 1, flexShrink: 0 }}>{i + 1}</span>
                          <span style={{ fontSize: ".82rem", fontWeight: isActive ? 600 : 400, color: "var(--rl-ink)", lineHeight: 1.35 }}>{lesson.title}</span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}

            {/* Related */}
            {related.length > 0 && (
              <>
                <div style={{ height: 1, background: "var(--rl-line)", margin: ".5rem 0 1rem" }} />
                <p style={{ margin: "0 0 .75rem", fontSize: ".64rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--rl-maroon)" }}>More in {category.title}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: ".375rem" }}>
                  {related.map((c: Course) => {
                    const thumb = c.thumbnail || getYoutubeThumbnail(c.url ?? "") || "";
                    return (
                      <Link key={c.id} href={`/revlearn/${category.id}/${c.id}`}
                        style={{ display: "flex", alignItems: "center", gap: ".75rem", padding: ".5rem .625rem", background: "var(--rl-bg-subtle)", border: "1px solid var(--rl-line)", borderRadius: 10, textDecoration: "none", transition: "border-color .15s" }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--rl-maroon)")}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--rl-line)")}
                      >
                        <div style={{ width: 44, height: 32, borderRadius: 6, flexShrink: 0, background: `var(--rl-bg-sunken) center/cover no-repeat${thumb ? ` url(${thumb})` : ""}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                          {!thumb && <BookOpen size={14} style={{ color: "var(--rl-line-strong)" }} />}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ margin: "0 0 .1rem", fontSize: ".62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--rl-orange)" }}>{c.sourceName}</p>
                          <p style={{ margin: 0, fontSize: ".8rem", fontWeight: 600, color: "var(--rl-ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", lineHeight: 1.3 }}>{c.title}</p>
                          {c.duration && <p style={{ margin: 0, fontSize: ".68rem", color: "var(--rl-body)" }}>{c.duration}</p>}
                        </div>
                      </Link>
                    );
                  })}
                </div>
                <Link href={`/revlearn/courses`} style={{ display: "block", fontSize: ".8rem", fontWeight: 600, color: "var(--rl-maroon)", textDecoration: "none", marginTop: ".875rem" }}>
                  Browse all courses →
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </RevLearnShell>
  );
}
