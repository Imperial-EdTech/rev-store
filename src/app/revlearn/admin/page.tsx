"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, Loader2, Check, X, ExternalLink } from "lucide-react";
import Link from "next/link";
import { RevLearnHeader } from "@/components/revlearn/shell";
import { useRevLearnContent } from "@/lib/revlearn-hooks";
import { slugify, deriveSourceName, normaliseEmbedUrl } from "@/lib/revlearn-utils";
import type { Accent, CourseType, Category, Course, Lesson } from "@/lib/revlearn-types";

const PASSCODE = process.env.NEXT_PUBLIC_ADMIN_PASSCODE ?? "revlearn-admin";
const ACCENTS: Accent[] = ["orange", "maroon", "teal", "amber"];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="rl-admin-field">
      <span className="rl-admin-label">{label}</span>
      {children}
    </label>
  );
}

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [pass, setPass] = useState("");
  const [passErr, setPassErr] = useState("");

  function unlock(e: React.FormEvent) {
    e.preventDefault();
    if (pass === PASSCODE) { setUnlocked(true); setPassErr(""); }
    else setPassErr("Incorrect passcode.");
  }

  if (!unlocked) {
    return (
      <>
        <RevLearnHeader />
        <main className="rl-main">
          <div className="rl-container">
            <div className="rl-admin-gate">
              <p className="rl-hero-kicker">RevLearn Admin</p>
              <h1 className="rl-admin-gate-title">Dashboard access</h1>
              <p style={{ fontSize: ".875rem", color: "var(--rl-body)", marginBottom: "1.25rem" }}>
                Enter your admin passcode to manage courses and categories.
              </p>
              <form onSubmit={unlock} className="rl-admin-gate-form">
                <input type="password" className="rl-admin-input" placeholder="Admin passcode"
                  value={pass} onChange={e => setPass(e.target.value)} />
                {passErr && <p className="rl-admin-err">{passErr}</p>}
                <button type="submit" className="rl-admin-submit">Open Dashboard</button>
              </form>
            </div>
          </div>
        </main>
      </>
    );
  }

  return <AdminDashboard />;
}

function AdminDashboard() {
  const { categories, loading, error, reload } = useRevLearnContent();
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  type CatForm = { id: string; title: string; description: string; icon: string; accent: Accent; position: number };
  type LessonForm = { courseId: string; id: string; title: string; url: string; position: number };

  const [catForm, setCatForm] = useState<CatForm | null>(null);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [lessonForm, setLessonForm] = useState<LessonForm | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  async function api(path: string, method: string, body: unknown) {
    const res = await fetch(path, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      throw new Error(j.error ?? "Request failed");
    }
    return res.json();
  }

  async function saveCategory() {
    if (!catForm) return;
    setSaving(true);
    try {
      await api("/api/revlearn/categories", "POST", catForm);
      setCatForm(null); reload(); showToast("Category saved ✓");
    } catch (e) { showToast((e as Error).message); }
    finally { setSaving(false); }
  }

  async function deleteCategory(id: string) {
    if (!confirm("Delete this category and all its courses?")) return;
    setSaving(true);
    try {
      await api("/api/revlearn/categories", "DELETE", { id });
      reload(); showToast("Category deleted");
    } catch (e) { showToast((e as Error).message); }
    finally { setSaving(false); }
  }

  async function deleteCourse(id: string) {
    if (!confirm("Delete this course?")) return;
    setSaving(true);
    try {
      await api("/api/revlearn/courses", "DELETE", { id });
      reload(); showToast("Course deleted");
    } catch (e) { showToast((e as Error).message); }
    finally { setSaving(false); }
  }

  async function saveLesson() {
    if (!lessonForm) return;
    setSaving(true);
    try {
      await api("/api/revlearn/lessons", "POST", {
        id: lessonForm.id || slugify(lessonForm.title) + "-" + Date.now(),
        course_id: lessonForm.courseId,
        title: lessonForm.title,
        url: normaliseEmbedUrl(lessonForm.url),
        position: lessonForm.position,
      });
      setLessonForm(null); reload(); showToast("Lesson saved ✓");
    } catch (e) { showToast((e as Error).message); }
    finally { setSaving(false); }
  }

  async function deleteLesson(id: string) {
    if (!confirm("Delete this lesson?")) return;
    setSaving(true);
    try {
      await api("/api/revlearn/lessons", "DELETE", { id });
      reload(); showToast("Lesson deleted");
    } catch (e) { showToast((e as Error).message); }
    finally { setSaving(false); }
  }

  return (
    <>
      <RevLearnHeader />
      <main className="rl-main">
        <div className="rl-container rl-admin-page">

          {/* Header */}
          <div className="rl-admin-header">
            <div>
              <p className="rl-hero-kicker">RevLearn Admin</p>
              <h1 className="rl-admin-title">Course Manager</h1>
              <p style={{ color: "var(--rl-body)", fontSize: ".875rem", marginTop: ".25rem" }}>
                {categories.reduce((s, c) => s + c.courses.length, 0)} courses across {categories.length} categories
              </p>
            </div>
            <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
              <Link href="/revlearn/admin/add" className="rl-admin-add-btn" style={{ textDecoration: "none" }}>
                <Plus size={15} /> Add Resource
              </Link>
              <button
                className="rl-admin-add-btn"
                style={{ background: "var(--rl-bg-subtle)", color: "var(--rl-ink)", border: "1px solid var(--rl-line-strong)" }}
                onClick={() => setCatForm({ id: "", title: "", description: "", icon: "📚", accent: "orange", position: categories.length })}
              >
                <Plus size={15} /> Add Category
              </button>
            </div>
          </div>

          {loading && <div className="rl-state-center"><Loader2 size={22} className="rl-spin" /></div>}
          {error && <div className="rl-error-box"><p className="rl-error-title">{error}</p><button className="rl-retry-btn" onClick={reload}>Retry</button></div>}

          {/* Category form */}
          {catForm && (
            <div className="rl-admin-form-card">
              <h3 className="rl-admin-form-title">{catForm.id ? "Edit" : "New"} Category</h3>
              <div className="rl-admin-form-grid">
                <Field label="Title">
                  <input className="rl-admin-input" value={catForm.title} placeholder="Category title"
                    onChange={e => setCatForm(f => f && ({ ...f, title: e.target.value, id: f.id || slugify(e.target.value) }))} />
                </Field>
                <Field label="ID (auto-filled)">
                  <input className="rl-admin-input" value={catForm.id} placeholder="e.g. digital-skills"
                    onChange={e => setCatForm(f => f && ({ ...f, id: e.target.value }))} />
                </Field>
                <Field label="Icon (emoji)">
                  <input className="rl-admin-input" value={catForm.icon}
                    onChange={e => setCatForm(f => f && ({ ...f, icon: e.target.value }))} />
                </Field>
                <Field label="Accent colour">
                  <select className="rl-admin-input" value={catForm.accent}
                    onChange={e => setCatForm(f => f && ({ ...f, accent: e.target.value as Accent }))}>
                    {ACCENTS.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </Field>
                <Field label="Description">
                  <textarea className="rl-admin-input rl-admin-textarea" value={catForm.description}
                    onChange={e => setCatForm(f => f && ({ ...f, description: e.target.value }))} />
                </Field>
              </div>
              <div className="rl-admin-form-actions">
                <button className="rl-admin-cancel" onClick={() => setCatForm(null)}>Cancel</button>
                <button className="rl-admin-save" onClick={saveCategory} disabled={saving}>
                  {saving ? <Loader2 size={13} className="rl-spin" /> : <Check size={13} />} Save
                </button>
              </div>
            </div>
          )}

          {/* Lesson form */}
          {lessonForm && (
            <div className="rl-admin-form-card">
              <h3 className="rl-admin-form-title">Add Lesson</h3>
              <div className="rl-admin-form-grid">
                <Field label="Lesson title">
                  <input className="rl-admin-input" value={lessonForm.title} placeholder="e.g. Introduction"
                    onChange={e => setLessonForm(f => f && ({ ...f, title: e.target.value }))} />
                </Field>
                <Field label="Resource URL">
                  <input className="rl-admin-input" value={lessonForm.url} placeholder="Paste any URL"
                    onChange={e => setLessonForm(f => f && ({ ...f, url: e.target.value }))} />
                </Field>
              </div>
              <div className="rl-admin-form-actions">
                <button className="rl-admin-cancel" onClick={() => setLessonForm(null)}>Cancel</button>
                <button className="rl-admin-save" onClick={saveLesson} disabled={saving}>
                  {saving ? <Loader2 size={13} className="rl-spin" /> : <Check size={13} />} Save Lesson
                </button>
              </div>
            </div>
          )}

          {/* Categories — all expanded as card grids */}
          {!loading && categories.map((cat: Category) => (
            <div key={cat.id} className="rl-admin-cat-section">
              {/* Category header */}
              <div className="rl-admin-cat-hd">
                <span className="rl-admin-cat-hd-icon">{cat.icon}</span>
                <div className="rl-admin-cat-hd-text">
                  <h2 className="rl-admin-cat-hd-title">{cat.title}</h2>
                  <p className="rl-admin-cat-hd-desc">{cat.description}</p>
                </div>
                <div className="rl-admin-cat-hd-actions">
                  <button className="rl-admin-icon-btn" title="Edit category"
                    onClick={() => setCatForm({ id: cat.id, title: cat.title, description: cat.description, icon: cat.icon, accent: cat.accent, position: cat.position })}>
                    <Edit2 size={13} />
                  </button>
                  <button className="rl-admin-icon-btn rl-admin-icon-btn--danger" title="Delete category"
                    onClick={() => deleteCategory(cat.id)}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Course cards grid */}
              <div className="rl-admin-course-grid">
                {cat.courses.map((course: Course) => (
                  <div key={course.id} className={`rl-admin-course-card${editingCourseId === course.id ? " rl-admin-course-card--editing" : ""}`}>
                    {/* Thumbnail */}
                    {course.thumbnail && (
                      <div className="rl-admin-course-thumb">
                        <img src={course.thumbnail} alt={course.title} />
                      </div>
                    )}
                    {!course.thumbnail && (
                      <div className="rl-admin-course-thumb rl-admin-course-thumb--empty">
                        <span style={{ fontSize: "1.5rem" }}>{cat.icon}</span>
                      </div>
                    )}

                    {/* Body */}
                    <div className="rl-admin-course-card-body">
                      <div className="rl-admin-course-card-top">
                        <span className="rl-admin-course-source">{course.sourceName}</span>
                        <span className="rl-admin-course-type">{course.type === "multi" ? `${course.lessons?.length ?? 0} lessons` : "single"}</span>
                      </div>
                      <h3 className="rl-admin-course-card-title">{course.title}</h3>
                      {course.description && (
                        <p className="rl-admin-course-card-desc">{course.description}</p>
                      )}
                      {course.tags?.length > 0 && (
                        <div className="rl-tags" style={{ marginTop: ".5rem" }}>
                          {course.tags.slice(0, 3).map((t: string) => <span key={t} className="rl-tag">{t}</span>)}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="rl-admin-course-card-actions">
                      <Link href={`/revlearn/${cat.id}/${course.id}`}
                        className="rl-admin-course-action-btn" target="_blank" title="Preview">
                        <ExternalLink size={13} /> Preview
                      </Link>
                      <Link href={`/revlearn/admin/add?edit=${course.id}&categoryId=${cat.id}`}
                        className="rl-admin-course-action-btn" title="Edit">
                        <Edit2 size={13} /> Edit
                      </Link>
                      {course.type === "multi" && (
                        <button className="rl-admin-course-action-btn"
                          onClick={() => setLessonForm({ courseId: course.id, id: "", title: "", url: "", position: course.lessons?.length ?? 0 })}>
                          <Plus size={13} /> Lesson
                        </button>
                      )}
                      <button className="rl-admin-course-action-btn rl-admin-course-action-btn--danger"
                        onClick={() => deleteCourse(course.id)}>
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add course card */}
                <Link href={`/revlearn/admin/add?categoryId=${cat.id}`} className="rl-admin-add-course-card">
                  <Plus size={22} />
                  <span>Add resource</span>
                </Link>
              </div>
            </div>
          ))}

          {!loading && categories.length === 0 && (
            <div className="rl-empty">
              <p className="rl-empty-icon">📂</p>
              <p>No categories yet. Add one to get started.</p>
            </div>
          )}
        </div>
      </main>

      {toast && <div className="rl-toast">{toast}</div>}
    </>
  );
}