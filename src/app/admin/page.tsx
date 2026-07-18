"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, ChevronDown, ChevronUp, Loader2, Check, X } from "lucide-react";
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
                <input
                  type="password"
                  className="rl-admin-input"
                  placeholder="Admin passcode"
                  value={pass}
                  onChange={e => setPass(e.target.value)}
                />
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
  const [expanded, setExpanded] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  type CatForm = { id: string; title: string; description: string; icon: string; accent: Accent; position: number };
  type CourseForm = { categoryId: string; id: string; title: string; description: string; thumbnail: string; tags: string; type: CourseType; url: string; sourceName: string; duration: string; position: number };
  type LessonForm = { courseId: string; id: string; title: string; url: string; position: number };

  const [catForm, setCatForm] = useState<CatForm | null>(null);
  const [courseForm, setCourseForm] = useState<CourseForm | null>(null);
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

  async function saveCourse() {
    if (!courseForm) return;
    setSaving(true);
    try {
      await api("/api/revlearn/courses", "POST", {
        id: courseForm.id || slugify(courseForm.title) + "-" + Date.now(),
        category_id: courseForm.categoryId,
        title: courseForm.title,
        description: courseForm.description,
        thumbnail: courseForm.thumbnail,
        tags: courseForm.tags.split(",").map((t: string) => t.trim()).filter(Boolean),
        type: courseForm.type,
        url: normaliseEmbedUrl(courseForm.url),
        source_name: courseForm.sourceName || deriveSourceName(courseForm.url),
        duration: courseForm.duration,
        position: courseForm.position,
      });
      setCourseForm(null); reload(); showToast("Course saved ✓");
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
          <div className="rl-admin-header">
            <div>
              <p className="rl-hero-kicker">RevLearn Admin</p>
              <h1 className="rl-admin-title">Course Manager</h1>
            </div>
            <button
              className="rl-admin-add-btn"
              onClick={() => setCatForm({
                id: "", title: "", description: "", icon: "📚",
                accent: "orange", position: categories.length
              })}
            >
              <Plus size={15} /> Add Category
            </button>
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

          {/* Categories */}
          {!loading && categories.map((cat: Category) => (
            <div key={cat.id} className="rl-admin-cat-block">
              <div className="rl-admin-cat-header">
                <button className="rl-admin-cat-toggle"
                  onClick={() => setExpanded(expanded === cat.id ? null : cat.id)}>
                  <span>{cat.icon} {cat.title}</span>
                  <span className="rl-admin-cat-meta">{cat.courses.length} courses</span>
                  {expanded === cat.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </button>
                <div className="rl-admin-cat-actions">
                  <button className="rl-admin-icon-btn" title="Edit"
                    onClick={() => setCatForm({ id: cat.id, title: cat.title, description: cat.description, icon: cat.icon, accent: cat.accent, position: cat.position })}>
                    <Edit2 size={13} />
                  </button>
                  <button className="rl-admin-icon-btn rl-admin-icon-btn--danger" title="Delete"
                    onClick={() => deleteCategory(cat.id)}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {expanded === cat.id && (
                <div className="rl-admin-courses">
                  {cat.courses.map((course: Course) => (
                    <CourseRow
                      key={course.id}
                      course={course}
                      onEdit={() => setCourseForm({
                        categoryId: cat.id, id: course.id, title: course.title,
                        description: course.description, thumbnail: course.thumbnail,
                        tags: course.tags.join(", "), type: course.type,
                        url: course.url ?? "", sourceName: course.sourceName,
                        duration: course.duration, position: course.position,
                      })}
                      onDelete={() => deleteCourse(course.id)}
                      onAddLesson={() => setLessonForm({
                        courseId: course.id, id: "", title: "", url: "",
                        position: course.lessons?.length ?? 0
                      })}
                      onDeleteLesson={deleteLesson}
                    />
                  ))}
                  <button className="rl-admin-add-course-btn"
                    onClick={() => setCourseForm({
                      categoryId: cat.id, id: "", title: "", description: "",
                      thumbnail: "", tags: "", type: "single", url: "",
                      sourceName: "", duration: "", position: cat.courses.length,
                    })}>
                    <Plus size={13} /> Add Course
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Course modal */}
          {courseForm && (
            <div className="rl-admin-overlay">
              <div className="rl-admin-modal">
                <div className="rl-admin-modal-header">
                  <h3 className="rl-admin-form-title">{courseForm.id ? "Edit" : "New"} Course</h3>
                  <button className="rl-admin-icon-btn" onClick={() => setCourseForm(null)}><X size={15} /></button>
                </div>
                <div className="rl-admin-form-grid">
                  <Field label="Title">
                    <input className="rl-admin-input" value={courseForm.title} placeholder="Course title"
                      onChange={e => setCourseForm(f => f && ({ ...f, title: e.target.value }))} />
                  </Field>
                  <Field label="Type">
                    <select className="rl-admin-input" value={courseForm.type}
                      onChange={e => setCourseForm(f => f && ({ ...f, type: e.target.value as CourseType }))}>
                      <option value="single">Single resource</option>
                      <option value="multi">Multi-lesson course</option>
                    </select>
                  </Field>
                  {courseForm.type === "single" && (
                    <Field label="Resource URL">
                      <input className="rl-admin-input" value={courseForm.url}
                        placeholder="Paste YouTube, Drive, or any URL"
                        onChange={e => setCourseForm(f => f && ({
                          ...f, url: e.target.value,
                          sourceName: f.sourceName || deriveSourceName(e.target.value)
                        }))} />
                    </Field>
                  )}
                  <Field label="Source / Provider">
                    <input className="rl-admin-input" value={courseForm.sourceName}
                      placeholder="e.g. YouTube, Coursera, Schoolinka"
                      onChange={e => setCourseForm(f => f && ({ ...f, sourceName: e.target.value }))} />
                  </Field>
                  <Field label="Duration">
                    <input className="rl-admin-input" value={courseForm.duration} placeholder="e.g. 20 min"
                      onChange={e => setCourseForm(f => f && ({ ...f, duration: e.target.value }))} />
                  </Field>
                  <Field label="Thumbnail URL">
                    <input className="rl-admin-input" value={courseForm.thumbnail} placeholder="https://…"
                      onChange={e => setCourseForm(f => f && ({ ...f, thumbnail: e.target.value }))} />
                  </Field>
                  <Field label="Tags (comma-separated)">
                    <input className="rl-admin-input" value={courseForm.tags}
                      placeholder="e.g. excel, beginner"
                      onChange={e => setCourseForm(f => f && ({ ...f, tags: e.target.value }))} />
                  </Field>
                  <Field label="Description">
                    <textarea className="rl-admin-input rl-admin-textarea" value={courseForm.description}
                      onChange={e => setCourseForm(f => f && ({ ...f, description: e.target.value }))} />
                  </Field>
                </div>
                <div className="rl-admin-form-actions">
                  <button className="rl-admin-cancel" onClick={() => setCourseForm(null)}>Cancel</button>
                  <button className="rl-admin-save" onClick={saveCourse} disabled={saving}>
                    {saving ? <Loader2 size={13} className="rl-spin" /> : <Check size={13} />} Save Course
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Lesson modal */}
          {lessonForm && (
            <div className="rl-admin-overlay">
              <div className="rl-admin-modal">
                <div className="rl-admin-modal-header">
                  <h3 className="rl-admin-form-title">Add Lesson</h3>
                  <button className="rl-admin-icon-btn" onClick={() => setLessonForm(null)}><X size={15} /></button>
                </div>
                <div className="rl-admin-form-grid">
                  <Field label="Lesson title">
                    <input className="rl-admin-input" value={lessonForm.title} placeholder="e.g. Introduction"
                      onChange={e => setLessonForm(f => f && ({ ...f, title: e.target.value }))} />
                  </Field>
                  <Field label="Resource URL">
                    <input className="rl-admin-input" value={lessonForm.url}
                      placeholder="Paste YouTube, Drive, or any URL"
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
            </div>
          )}
        </div>
      </main>

      {toast && <div className="rl-toast">{toast}</div>}
    </>
  );
}

function CourseRow({ course, onEdit, onDelete, onAddLesson, onDeleteLesson }: {
  course: Course;
  onEdit: () => void;
  onDelete: () => void;
  onAddLesson: () => void;
  onDeleteLesson: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rl-admin-course-row">
      <div className="rl-admin-course-header">
        <button className="rl-admin-course-toggle" onClick={() => course.type === "multi" && setOpen(o => !o)}>
          <span className="rl-admin-course-name">{course.title}</span>
          <span className="rl-admin-course-meta">{course.sourceName} · {course.type}</span>
          {course.type === "multi" && (open ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
        </button>
        <div className="rl-admin-course-actions">
          <button className="rl-admin-icon-btn" onClick={onEdit}><Edit2 size={12} /></button>
          <button className="rl-admin-icon-btn rl-admin-icon-btn--danger" onClick={onDelete}><Trash2 size={12} /></button>
        </div>
      </div>
      {course.type === "multi" && open && (
        <div className="rl-admin-lessons">
          {(course.lessons ?? []).map((lesson: Lesson, i: number) => (
            <div key={lesson.id} className="rl-admin-lesson-row">
              <span className="rl-admin-lesson-num">{i + 1}</span>
              <span className="rl-admin-lesson-title">{lesson.title}</span>
              <button className="rl-admin-icon-btn rl-admin-icon-btn--danger"
                onClick={() => onDeleteLesson(lesson.id)}><Trash2 size={11} /></button>
            </div>
          ))}
          <button className="rl-admin-add-lesson-btn" onClick={onAddLesson}>
            <Plus size={11} /> Add lesson
          </button>
        </div>
      )}
    </div>
  );
}