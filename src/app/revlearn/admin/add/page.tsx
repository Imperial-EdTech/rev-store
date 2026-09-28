"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Upload, Link as LinkIcon, Loader2, ArrowLeft, Plus, Trash2 } from "lucide-react";
import { RevLearnHeader } from "@/components/revlearn/shell";
import { useRevLearnContent } from "@/lib/revlearn/hooks";
import { deriveSourceName, getYoutubeThumbnail, newId, normaliseEmbedUrl } from "@/lib/revlearn/utils";
import type { CourseType } from "@/lib/revlearn/types";
import { adminFetch } from "@/lib/admin-fetch";


function AddResourceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryIdParam = searchParams.get("categoryId") ?? "";
  const { categories } = useRevLearnContent();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState(categoryIdParam);
  const [type, setType] = useState<CourseType>("single");
  const [url, setUrl] = useState("");
  const [sourceName, setSourceName] = useState("");
  const [duration, setDuration] = useState("");
  const [tags, setTags] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [lessons, setLessons] = useState<{ title: string; url: string }[]>([{ title: "", url: "" }]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Auto-fetch YouTube thumbnail when URL changes
  function handleUrlChange(val: string) {
    setUrl(val);
    if (!sourceName) setSourceName(deriveSourceName(val));
    const ytThumb = getYoutubeThumbnail(val);
    if (ytThumb && !thumbnailPreview) {
      setThumbnail(ytThumb);
      setThumbnailPreview(ytThumb);
    }
  }

  function handleThumbnailUrl(val: string) {
    setThumbnail(val);
    setThumbnailPreview(val);
  }

  /** Uploads the image to storage; the course keeps only its URL. */
  async function handleFileUpload(file: File) {
    if (!file.type.startsWith("image/")) return;
    setError("");
    setUploading(true);
    setThumbnailPreview(URL.createObjectURL(file));
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await adminFetch("/api/revlearn/thumbnails", { method: "POST", body: form });
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.error ?? "Could not upload the image.");
      setThumbnail(body.url);
      setThumbnailPreview(body.url);
    } catch (e) {
      setError((e as Error).message);
      setThumbnail("");
      setThumbnailPreview("");
    } finally {
      setUploading(false);
    }
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  }, []);

  function addLesson() {
    setLessons(l => [...l, { title: "", url: "" }]);
  }

  function removeLesson(i: number) {
    setLessons(l => l.filter((_, idx) => idx !== i));
  }

  function updateLesson(i: number, key: "title" | "url", val: string) {
    setLessons(l => l.map((item, idx) => idx === i ? { ...item, [key]: val } : item));
  }

  async function handleSave() {
    if (!title.trim()) { setError("Title is required."); return; }
    if (!categoryId) { setError("Please select a category."); return; }
    if (type === "single" && !url.trim()) { setError("Resource URL is required."); return; }
    setError("");
    setSaving(true);

    try {
      // The course and its lessons are saved together: all or nothing.
      const res = await adminFetch("/api/revlearn/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: newId(title),
          category_id: categoryId,
          title,
          description,
          thumbnail,
          tags: tags.split(",").map((t: string) => t.trim()).filter(Boolean),
          type,
          url: type === "single" ? normaliseEmbedUrl(url) : undefined,
          source_name: sourceName || deriveSourceName(url),
          duration,
          lessons: type === "multi"
            ? lessons
                .filter((l) => l.title.trim() && l.url.trim())
                .map((l, i) => ({ id: newId(l.title), title: l.title, url: normaliseEmbedUrl(l.url), position: i }))
            : undefined,
        }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.error ?? "Failed to save course.");

      router.push("/revlearn/admin");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <RevLearnHeader />
      <main className="rl-main">
        <div className="rl-container rl-add-page">
          {/* Back */}
          <a href="/revlearn/admin" className="rl-add-back">
            <ArrowLeft size={15} /> Back to dashboard
          </a>

          <div className="rl-add-layout">
            {/* Left — form */}
            <div className="rl-add-form-col">
              <h1 className="rl-add-title">Add a resource</h1>
              <p className="rl-add-subtitle">
                Paste a link to any YouTube video, Google Drive file, website, or article.
                RevLearn will embed it so teachers never leave the app.
              </p>

              {error && <div className="rl-add-error">{error}</div>}

              {/* Resource type */}
              <div className="rl-add-section">
                <label className="rl-admin-label">Resource type</label>
                <div className="rl-type-row">
                  <button
                    type="button"
                    className={`rl-type-btn${type === "single" ? " rl-type-btn--active" : ""}`}
                    onClick={() => setType("single")}
                  >
                    <LinkIcon size={15} /> Single resource
                  </button>
                  <button
                    type="button"
                    className={`rl-type-btn${type === "multi" ? " rl-type-btn--active" : ""}`}
                    onClick={() => setType("multi")}
                  >
                    <Plus size={15} /> Multi-lesson course
                  </button>
                </div>
              </div>

              {/* URL */}
              {type === "single" && (
                <div className="rl-add-section">
                  <label className="rl-admin-label">Resource URL</label>
                  <input
                    className="rl-add-input"
                    value={url}
                    onChange={e => handleUrlChange(e.target.value)}
                    placeholder="Paste a YouTube, Google Drive, website, or article URL"
                  />
                  {sourceName && (
                    <p className="rl-add-hint">Detected source: <strong>{sourceName}</strong></p>
                  )}
                </div>
              )}

              {/* Title */}
              <div className="rl-add-section">
                <label className="rl-admin-label">Title</label>
                <input
                  className="rl-add-input"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Getting Started with Excel"
                />
              </div>

              {/* Description */}
              <div className="rl-add-section">
                <label className="rl-admin-label">Description</label>
                <textarea
                  className="rl-add-input rl-add-textarea"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="What will teachers learn from this resource?"
                />
              </div>

              {/* Category */}
              <div className="rl-add-section">
                <label className="rl-admin-label">Category</label>
                <select
                  className="rl-add-input"
                  value={categoryId}
                  onChange={e => setCategoryId(e.target.value)}
                >
                  <option value="">Select a category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.icon} {c.title}</option>
                  ))}
                </select>
              </div>

              {/* Source + Duration row */}
              <div className="rl-add-row">
                <div className="rl-add-section" style={{ flex: 1 }}>
                  <label className="rl-admin-label">Source / Provider</label>
                  <input
                    className="rl-add-input"
                    value={sourceName}
                    onChange={e => setSourceName(e.target.value)}
                    placeholder="e.g. YouTube, Coursera"
                  />
                </div>
                <div className="rl-add-section" style={{ flex: 1 }}>
                  <label className="rl-admin-label">Duration</label>
                  <input
                    className="rl-add-input"
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
                    placeholder="e.g. 20 min"
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="rl-add-section">
                <label className="rl-admin-label">Tags (comma-separated)</label>
                <input
                  className="rl-add-input"
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                  placeholder="e.g. excel, beginner, spreadsheets"
                />
              </div>

              {/* Lessons for multi */}
              {type === "multi" && (
                <div className="rl-add-section">
                  <label className="rl-admin-label">Lessons</label>
                  <div className="rl-lessons-list">
                    {lessons.map((lesson, i) => (
                      <div key={i} className="rl-lesson-input-row">
                        <span className="rl-lesson-input-num">{i + 1}</span>
                        <div className="rl-lesson-input-fields">
                          <input
                            className="rl-add-input"
                            value={lesson.title}
                            onChange={e => updateLesson(i, "title", e.target.value)}
                            placeholder="Lesson title"
                          />
                          <input
                            className="rl-add-input"
                            value={lesson.url}
                            onChange={e => updateLesson(i, "url", e.target.value)}
                            placeholder="Lesson URL"
                            style={{ marginTop: "6px" }}
                          />
                        </div>
                        {lessons.length > 1 && (
                          <button type="button" className="rl-admin-icon-btn rl-admin-icon-btn--danger"
                            onClick={() => removeLesson(i)}>
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button type="button" className="rl-admin-add-lesson-btn" onClick={addLesson}>
                      <Plus size={13} /> Add lesson
                    </button>
                  </div>
                </div>
              )}

              {/* Save */}
              <button className="rl-add-save" onClick={handleSave} disabled={saving || uploading}>
                {saving ? <><Loader2 size={15} className="rl-spin" /> Saving…</> : "Save resource"}
              </button>
            </div>

            {/* Right — thumbnail */}
            <div className="rl-add-thumb-col">
              <label className="rl-admin-label">Thumbnail</label>
              <p className="rl-add-hint" style={{ marginBottom: ".875rem" }}>
                Auto-filled for YouTube links. Paste a URL or drag & drop an image.
              </p>

              {/* Preview */}
              <div
                className={`rl-thumb-drop${dragging ? " rl-thumb-drop--over" : ""}`}
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => fileRef.current?.click()}
              >
                {thumbnailPreview ? (
                  <img src={thumbnailPreview} alt="Thumbnail preview" className="rl-thumb-preview" />
                ) : (
                  <div className="rl-thumb-empty">
                    <Upload size={28} className="rl-thumb-empty-icon" />
                    <p>Drag & drop an image</p>
                    <span>or click to browse</span>
                  </div>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); }}
                />
              </div>

              {thumbnailPreview && (
                <button
                  type="button"
                  className="rl-thumb-clear"
                  onClick={() => { setThumbnail(""); setThumbnailPreview(""); }}
                >
                  Remove thumbnail
                </button>
              )}

              {/* Manual URL input */}
              <div className="rl-add-section" style={{ marginTop: "1rem" }}>
                <label className="rl-admin-label">Or paste image URL</label>
                <input
                  className="rl-add-input"
                  value={thumbnail.startsWith("data:") ? "" : thumbnail}
                  onChange={e => handleThumbnailUrl(e.target.value)}
                  placeholder="https://…"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default function AddResourcePage() {
  return (
    <Suspense fallback={<div className="rl-state-center"><Loader2 size={24} className="rl-spin" /></div>}>
      <AddResourceContent />
    </Suspense>
  );
}