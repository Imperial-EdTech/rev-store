"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Circle, Loader2, AlertCircle, ChevronRight, Clock } from "lucide-react";
import { useState } from "react";
import { RevLearnHeader } from "@/components/revlearn/shell";
import { ResourceFrame } from "@/components/revlearn/resource-frame";
import { useRevLearnContent, useProgress } from "@/lib/revlearn-hooks";
import type { Category, Course, Lesson } from "@/lib/revlearn-types";

export default function CoursePage() {
  const params = useParams<{ categoryId: string; courseId: string }>();
  const { categories, loading, error } = useRevLearnContent();
  const { isComplete, markComplete, markIncomplete, completedCount } = useProgress();
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  const category = categories.find((c: Category) => c.id === params.categoryId);
  const course = category?.courses.find((c: Course) => c.id === params.courseId);
  const done = course ? isComplete(course.id) : false;

  const currentLesson = activeLesson ?? (course?.type === "multi" ? course.lessons?.[0] ?? null : null);
  const activeUrl = course?.type === "single" ? (course.url ?? "") : (currentLesson?.url ?? "");
  const activeTitle = course?.type === "single" ? course.title : (currentLesson?.title ?? "");

  if (loading) {
    return (
      <>
        <RevLearnHeader completedCount={completedCount} />
        <div className="rl-state-center" style={{ minHeight: "80vh" }}>
          <Loader2 size={28} className="rl-spin" />
        </div>
      </>
    );
  }

  if (error || !category || !course) {
    return (
      <>
        <RevLearnHeader completedCount={completedCount} />
        <div className="rl-container" style={{ padding: "3rem 20px" }}>
          <div className="rl-error-box">
            <AlertCircle size={20} />
            <div>
              <p className="rl-error-title">{error ?? "Course not found"}</p>
              <Link href="/revlearn" className="rl-retry-btn"
                style={{ display: "inline-block", marginTop: ".75rem" }}>
                Back to courses
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  const related = category.courses.filter((c: Course) => c.id !== course.id).slice(0, 5);

  return (
    <>
      <RevLearnHeader completedCount={completedCount} />
      <main className="rl-main">
        <div className="rl-udemy-layout">

          {/* ── LEFT / MAIN COLUMN ─────────────────────────── */}
          <div className="rl-udemy-main">

            {/* Breadcrumb */}
            <nav className="rl-breadcrumb rl-udemy-breadcrumb">
              <Link href="/revlearn">Courses</Link>
              <ChevronRight size={13} />
              <Link href={`/revlearn/${category.id}`}>{category.title}</Link>
              <ChevronRight size={13} />
              <span>{course.title}</span>
            </nav>

            {/* Player */}
            <div className="rl-udemy-player-wrap">
              {activeUrl ? (
                <ResourceFrame url={activeUrl} title={activeTitle} sourceName={course.sourceName} />
              ) : (
                <div className="rl-frame-fallback">
                  <p>No URL set for this course.</p>
                </div>
              )}
            </div>

            {/* Course info below player */}
            <div className="rl-udemy-info">
              <div className="rl-udemy-info-top">
                <span className="rl-source-pill">{course.sourceName}</span>
                {course.duration && (
                  <span className="rl-udemy-duration"><Clock size={13} /> {course.duration}</span>
                )}
              </div>
              <h1 className="rl-udemy-title">{course.title}</h1>
              <p className="rl-udemy-desc">{course.description}</p>

              {course.tags?.length > 0 && (
                <div className="rl-tags" style={{ marginTop: ".875rem" }}>
                  {course.tags.map((t: string) => <span key={t} className="rl-tag">{t}</span>)}
                </div>
              )}

              <div className="rl-udemy-actions">
                <button
                  className={`rl-complete-btn${done ? " rl-complete-btn--done" : ""}`}
                  onClick={() => done ? markIncomplete(course.id) : markComplete(course.id)}
                >
                  {done
                    ? <><CheckCircle2 size={16} /> Marked as complete</>
                    : <><Circle size={16} /> Mark as complete</>}
                </button>
              </div>
            </div>

            {/* Lesson list for multi — shown below player on mobile */}
            {course.type === "multi" && course.lessons && course.lessons.length > 0 && (
              <div className="rl-udemy-lessons-mobile">
                <h3 className="rl-sidebar-title" style={{ marginBottom: ".625rem" }}>Lessons</h3>
                <ol className="rl-lesson-list-flat">
                  {course.lessons.map((lesson: Lesson, i: number) => {
                    const isActive = (currentLesson?.id ?? course.lessons![0]?.id) === lesson.id;
                    return (
                      <li key={lesson.id}>
                        <button
                          className={`rl-lesson-flat-btn${isActive ? " rl-lesson-flat-btn--active" : ""}`}
                          onClick={() => setActiveLesson(lesson)}
                        >
                          <span className="rl-lesson-num">{i + 1}</span>
                          <span className="rl-lesson-label">{lesson.title}</span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}
          </div>

          {/* ── RIGHT SIDEBAR ──────────────────────────────── */}
          <aside className="rl-udemy-sidebar">

            {/* Lesson list for multi — sidebar on desktop */}
            {course.type === "multi" && course.lessons && course.lessons.length > 0 && (
              <div className="rl-udemy-sidebar-card">
                <p className="rl-udemy-sidebar-label">Course content</p>
                <p className="rl-udemy-sidebar-course">{course.title}</p>
                <div className="rl-sidebar-divider" style={{ margin: ".75rem 0" }} />
                <ol className="rl-lesson-list">
                  {course.lessons.map((lesson: Lesson, i: number) => {
                    const isActive = (currentLesson?.id ?? course.lessons![0]?.id) === lesson.id;
                    return (
                      <li key={lesson.id}>
                        <button
                          className={`rl-lesson-btn${isActive ? " rl-lesson-btn--active" : ""}`}
                          onClick={() => setActiveLesson(lesson)}
                        >
                          <span className="rl-lesson-num">{i + 1}</span>
                          <span className="rl-lesson-label">{lesson.title}</span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}

            {/* Related courses */}
            {related.length > 0 && (
              <div className="rl-udemy-sidebar-card">
                <p className="rl-udemy-sidebar-label">More in {category.title}</p>
                <div className="rl-related-list">
                  {related.map((c: Course) => (
                    <Link key={c.id} href={`/revlearn/${category.id}/${c.id}`} className="rl-related-item">
                      <span className="rl-related-source">{c.sourceName}</span>
                      <span className="rl-related-name">{c.title}</span>
                      {c.duration && <span className="rl-related-dur">{c.duration}</span>}
                    </Link>
                  ))}
                </div>
                <Link href={`/revlearn/${category.id}`} className="rl-related-all">
                  See all in {category.title} →
                </Link>
              </div>
            )}
          </aside>
        </div>
      </main>
    </>
  );
}