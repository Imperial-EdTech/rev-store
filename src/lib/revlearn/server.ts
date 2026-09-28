import "server-only";
import type { z } from "zod";
import { dbFailure, getDb, notConfigured, type Result } from "@/lib/db";
import type { categorySchema, courseSchema, lessonSchema, resourceSchema, toolSchema } from "./schema";
import { THUMBNAIL_MAX_BYTES, THUMBNAIL_TYPES } from "./schema";
import type { Accent, Audience, Category, Comment, Course, CourseType, Lesson, Post, Resource, ResourceType, Tool } from "./types";

/** RevLearn data access. Server-only; the API routes are thin wrappers around these. */

const ok = <T,>(value: T): Result<T> => ({ ok: true, value });

// ─── Courses ──────────────────────────────────────────────────

type LessonRow = { id: string; course_id: string; title: string; url: string; position: number };
type CourseRow = {
  id: string; category_id: string; title: string; description: string; thumbnail: string; tags: string[];
  type: CourseType; url: string | null; source_name: string; duration: string; position: number; created_at: string;
  revlearn_lessons: LessonRow[];
};
type CategoryRow = {
  id: string; title: string; description: string; icon: string; accent: Accent; position: number;
  revlearn_courses: CourseRow[];
};

const toLesson = (r: LessonRow): Lesson => ({ id: r.id, courseId: r.course_id, title: r.title, url: r.url, position: r.position });

const toCourse = (r: CourseRow): Course => ({
  id: r.id,
  categoryId: r.category_id,
  title: r.title,
  description: r.description,
  thumbnail: r.thumbnail,
  tags: r.tags,
  type: r.type,
  url: r.url ?? undefined,
  lessons: r.revlearn_lessons.map(toLesson),
  sourceName: r.source_name,
  duration: r.duration,
  position: r.position,
  createdAt: r.created_at,
});

/** Every category with its courses and their lessons, in display order. One query. */
export async function getContent(): Promise<Result<Category[]>> {
  const db = getDb();
  if (!db) return notConfigured;
  const { data, error } = await db
    .from("revlearn_categories")
    .select("id, title, description, icon, accent, position, revlearn_courses ( *, revlearn_lessons ( id, course_id, title, url, position ) )")
    .order("position")
    .order("created_at")
    .order("position", { referencedTable: "revlearn_courses" })
    .order("created_at", { referencedTable: "revlearn_courses" })
    .order("position", { referencedTable: "revlearn_courses.revlearn_lessons" });
  if (error) return dbFailure("revlearn: content", error, "Could not load courses.");
  return ok(
    (data as unknown as CategoryRow[]).map((c) => ({
      id: c.id, title: c.title, description: c.description, icon: c.icon, accent: c.accent, position: c.position,
      courses: c.revlearn_courses.map(toCourse),
    })),
  );
}

type CourseInput = z.infer<typeof courseSchema>;

/**
 * Saves a course. If `lessons` is given, the course ends up with exactly
 * those lessons, all in one transaction (revlearn_save_course).
 */
export async function saveCourse(course: CourseInput): Promise<Result<void>> {
  const db = getDb();
  if (!db) return notConfigured;
  const { error } = await db.rpc("revlearn_save_course", { p: course });
  if (error) {
    if (error.code === "23503") return { ok: false, status: 400, error: "That category no longer exists. Reload and try again." };
    return dbFailure("revlearn: save course", error, "Could not save the course.");
  }
  return ok(undefined);
}

// ─── Simple admin rows ────────────────────────────────────────

const TABLES = {
  category: "revlearn_categories",
  course: "revlearn_courses",
  lesson: "revlearn_lessons",
  tool: "revlearn_tools",
  resource: "revlearn_resources",
} as const;
export type ContentKind = keyof typeof TABLES;

type RowFor = {
  category: z.infer<typeof categorySchema>;
  lesson: z.infer<typeof lessonSchema>;
  tool: z.infer<typeof toolSchema>;
  resource: z.infer<typeof resourceSchema>;
};

/** Creates or replaces one category, lesson, tool or resource. */
export async function saveRow<K extends keyof RowFor>(kind: K, row: RowFor[K]): Promise<Result<void>> {
  const db = getDb();
  if (!db) return notConfigured;
  const { error } = await db.from(TABLES[kind]).upsert(row, { onConflict: "id" });
  if (error) {
    // A course or lesson pointing at a parent that doesn't exist.
    if (error.code === "23503") return { ok: false, status: 400, error: "The parent item no longer exists. Reload and try again." };
    return dbFailure(`revlearn: save ${kind}`, error, `Could not save the ${kind}.`);
  }
  return ok(undefined);
}

/** Deletes one row. Deleting a category removes its courses and lessons too. */
export async function deleteRow(kind: ContentKind, id: string): Promise<Result<void>> {
  const db = getDb();
  if (!db) return notConfigured;
  const { data, error } = await db.from(TABLES[kind]).delete().eq("id", id).select("id");
  if (error) return dbFailure(`revlearn: delete ${kind}`, error, `Could not delete the ${kind}.`);
  if (!data.length) return { ok: false, status: 404, error: "Not found." };
  return ok(undefined);
}

// ─── Tools and resources ──────────────────────────────────────

type ToolRow = {
  id: string; name: string; description: string; embed_url: string | null; external_url: string | null;
  logo_url: string | null; partner_name: string; category: string; tags: string[]; featured: boolean; position: number;
};

export async function listTools(): Promise<Result<Tool[]>> {
  const db = getDb();
  if (!db) return notConfigured;
  const { data, error } = await db.from("revlearn_tools").select("*").order("position").order("created_at");
  if (error) return dbFailure("revlearn: tools", error, "Could not load tools.");
  return ok(
    (data as ToolRow[]).map((r) => ({
      id: r.id, name: r.name, description: r.description,
      embedUrl: r.embed_url ?? undefined, externalUrl: r.external_url ?? undefined, logoUrl: r.logo_url ?? undefined,
      partnerName: r.partner_name, category: r.category, tags: r.tags, featured: r.featured, position: r.position,
    })),
  );
}

type ResourceRow = {
  id: string; title: string; description: string; url: string; thumbnail: string | null; type: ResourceType;
  audience: Audience; source_name: string; tags: string[]; featured: boolean; position: number; created_at: string;
};

export async function listResources(): Promise<Result<Resource[]>> {
  const db = getDb();
  if (!db) return notConfigured;
  const { data, error } = await db.from("revlearn_resources").select("*").order("position").order("created_at");
  if (error) return dbFailure("revlearn: resources", error, "Could not load resources.");
  return ok(
    (data as ResourceRow[]).map((r) => ({
      id: r.id, title: r.title, description: r.description, url: r.url, thumbnail: r.thumbnail ?? undefined,
      type: r.type, audience: r.audience, sourceName: r.source_name, tags: r.tags, featured: r.featured,
      position: r.position, createdAt: r.created_at,
    })),
  );
}

// ─── Community ────────────────────────────────────────────────

/** Newest posts shown in the feed. */
const FEED_SIZE = 100;

type PostRow = {
  id: string; content: string; author_name: string; author_school: string | null; author_subject: string | null;
  author_avatar: string | null; likes: number; created_at: string; revlearn_comments: { count: number }[];
};
type CommentRow = { id: string; post_id: string; content: string; author_name: string; author_avatar: string | null; created_at: string };

const POST_SELECT = "id, content, author_name, author_school, author_subject, author_avatar, likes, created_at, revlearn_comments ( count )";

const toPost = (r: PostRow): Post => ({
  id: r.id, content: r.content, authorName: r.author_name,
  authorSchool: r.author_school ?? undefined, authorSubject: r.author_subject ?? undefined,
  authorAvatar: r.author_avatar ?? undefined, likes: r.likes,
  commentCount: r.revlearn_comments[0]?.count ?? 0, createdAt: r.created_at,
});

const toComment = (r: CommentRow): Comment => ({
  id: r.id, postId: r.post_id, content: r.content, authorName: r.author_name,
  authorAvatar: r.author_avatar ?? undefined, createdAt: r.created_at,
});

export async function listPosts(): Promise<Result<Post[]>> {
  const db = getDb();
  if (!db) return notConfigured;
  const { data, error } = await db.from("revlearn_posts").select(POST_SELECT).order("created_at", { ascending: false }).limit(FEED_SIZE);
  if (error) return dbFailure("revlearn: posts", error, "Could not load posts.");
  return ok((data as unknown as PostRow[]).map(toPost));
}

/** One post with its comments, oldest comment first. */
export async function getPost(id: string): Promise<Result<{ post: Post; comments: Comment[] }>> {
  const db = getDb();
  if (!db) return notConfigured;
  const [post, comments] = await Promise.all([
    db.from("revlearn_posts").select(POST_SELECT).eq("id", id).maybeSingle(),
    db.from("revlearn_comments").select("*").eq("post_id", id).order("created_at"),
  ]);
  if (post.error) return dbFailure("revlearn: post", post.error, "Could not load the post.");
  if (comments.error) return dbFailure("revlearn: comments", comments.error, "Could not load the comments.");
  if (!post.data) return { ok: false, status: 404, error: "Post not found." };
  return ok({ post: toPost(post.data as unknown as PostRow), comments: (comments.data as CommentRow[]).map(toComment) });
}

export async function createPost(p: {
  content: string; author_name: string; author_school?: string; author_subject?: string; author_avatar?: string;
}): Promise<Result<Post>> {
  const db = getDb();
  if (!db) return notConfigured;
  const { data, error } = await db.from("revlearn_posts").insert(p).select(POST_SELECT).single();
  if (error) return dbFailure("revlearn: create post", error, "Could not share your post. Please try again.");
  return ok(toPost(data as unknown as PostRow));
}

export async function createComment(postId: string, c: { content: string; author_name: string; author_avatar?: string }): Promise<Result<Comment>> {
  const db = getDb();
  if (!db) return notConfigured;
  const { data, error } = await db.from("revlearn_comments").insert({ ...c, post_id: postId }).select("*").single();
  if (error) {
    if (error.code === "23503") return { ok: false, status: 404, error: "Post not found." };
    return dbFailure("revlearn: create comment", error, "Could not post your reply. Please try again.");
  }
  return ok(toComment(data as CommentRow));
}

/** Adds or removes one like, atomically. Returns the new count. */
export async function setLike(postId: string, liked: boolean): Promise<Result<{ likes: number }>> {
  const db = getDb();
  if (!db) return notConfigured;
  const { data, error } = await db.rpc("revlearn_like_post", { p_post_id: postId, p_delta: liked ? 1 : -1 });
  if (error) return dbFailure("revlearn: like", error, "Could not update the like.");
  if (data === null) return { ok: false, status: 404, error: "Post not found." };
  return ok({ likes: data as number });
}

// ─── Thumbnails ───────────────────────────────────────────────

/** Public Supabase Storage bucket for course thumbnails (created by the migration). */
const THUMBNAIL_BUCKET = "revlearn-thumbnails";
const EXTENSION: Record<(typeof THUMBNAIL_TYPES)[number], string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

/** Stores an uploaded course thumbnail and returns its public URL. */
export async function uploadThumbnail(file: File): Promise<Result<{ url: string }>> {
  const db = getDb();
  if (!db) return notConfigured;
  const type = file.type as (typeof THUMBNAIL_TYPES)[number];
  if (!THUMBNAIL_TYPES.includes(type)) return { ok: false, status: 400, error: "Use a JPG, PNG or WebP image." };
  if (file.size > THUMBNAIL_MAX_BYTES) return { ok: false, status: 400, error: "The image must be 2 MB or smaller." };

  const path = `${crypto.randomUUID()}.${EXTENSION[type]}`;
  const { error } = await db.storage.from(THUMBNAIL_BUCKET).upload(path, file, { contentType: type, cacheControl: "31536000" });
  if (error) {
    console.error("revlearn: thumbnail upload:", error);
    return { ok: false, status: 500, error: "Could not upload the image." };
  }
  return ok({ url: db.storage.from(THUMBNAIL_BUCKET).getPublicUrl(path).data.publicUrl });
}
