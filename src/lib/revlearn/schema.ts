import { z } from "zod";

/**
 * RevLearn write payloads, validated by the API routes. Column names are the
 * database's (snake_case), since admin screens send rows as they're stored.
 */

const id = z.string().trim().min(1).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and dashes");
/** Web links only: no data:, javascript: or other schemes (these end up in href and src). */
const url = z.string().trim().max(2000).url().refine((v) => /^https?:\/\//i.test(v), "Use a link starting with http:// or https://");
const text = (max: number) => z.string().trim().max(max);
const tags = z.array(z.string().trim().min(1).max(40)).max(20).default([]);
const position = z.number().int().min(0).max(100_000).default(0);

export const categorySchema = z.object({
  id,
  title: text(120).min(1),
  description: text(1000).default(""),
  icon: text(16).min(1).default("📚"),
  accent: z.enum(["orange", "maroon", "teal", "amber"]).default("orange"),
  position,
});

export const lessonSchema = z.object({
  id,
  course_id: id,
  title: text(200).min(1),
  url,
  position,
});

/** A lesson as sent inside a course save (the course id comes from the course). */
const courseLessonSchema = lessonSchema.omit({ course_id: true });

/**
 * A course, optionally with its full lesson list. When `lessons` is present
 * the course's lessons become exactly that list, in one transaction.
 */
export const courseSchema = z
  .object({
    id,
    category_id: id,
    title: text(200).min(1),
    description: text(2000).default(""),
    /** Image URL (uploaded thumbnail or YouTube still), or empty. */
    thumbnail: z.union([url, z.literal("")]).default(""),
    tags,
    type: z.enum(["single", "multi"]).default("single"),
    url: url.optional(),
    source_name: text(120).min(1).default("External"),
    duration: text(40).default(""),
    position,
    lessons: z.array(courseLessonSchema).max(200).optional(),
  })
  .refine((c) => c.type === "multi" || c.url, { path: ["url"], message: "A single-video course needs a URL" });

export const toolSchema = z
  .object({
    id,
    name: text(120).min(1),
    description: text(2000).default(""),
    embed_url: url.optional(),
    external_url: url.optional(),
    logo_url: url.optional(),
    partner_name: text(120).default(""),
    category: text(60).min(1).default("General"),
    tags,
    featured: z.boolean().default(false),
    position,
  })
  .refine((t) => t.embed_url || t.external_url, { path: ["external_url"], message: "A tool needs an embed or external URL" });

export const resourceSchema = z.object({
  id,
  title: text(200).min(1),
  description: text(2000).default(""),
  url,
  thumbnail: url.optional(),
  type: z.enum(["article", "template", "app", "website", "video"]).default("article"),
  audience: z.enum(["teacher", "student", "both"]).default("teacher"),
  source_name: text(120).min(1).default("External"),
  tags,
  featured: z.boolean().default(false),
  position,
});

/** Body of a DELETE: which row. */
export const deleteSchema = z.object({ id });

// ─── Community (public, no sign-in) ───────────────────────────

const authorName = text(120).min(1, "Add your name in your profile first");
const avatarColor = z.string().regex(/^#[0-9a-fA-F]{6}$/).optional();

export const postSchema = z.object({
  content: text(5000).min(1, "Write something first"),
  author_name: authorName,
  author_school: text(200).optional(),
  author_subject: text(120).optional(),
  author_avatar: avatarColor,
});

export const commentSchema = z.object({
  content: text(2000).min(1, "Write something first"),
  author_name: authorName,
  author_avatar: avatarColor,
});

/** Like or un-like: the browser remembers which posts it liked. */
export const likeSchema = z.object({ liked: z.boolean() });

export const THUMBNAIL_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const THUMBNAIL_MAX_BYTES = 2 * 1024 * 1024;
