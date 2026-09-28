import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { Category, Course, Lesson } from "@/lib/revlearn-types";

export async function GET() {
  const client = supabaseAdmin; // RLS locks every table to the server key
  if (!client) {
    return NextResponse.json({ error: "Supabase not configured." }, { status: 503 });
  }

  const [catRes, courseRes, lessonRes] = await Promise.all([
    client.from("revlearn_categories").select("*").order("position", { ascending: true }),
    client.from("revlearn_courses").select("*").order("position", { ascending: true }),
    client.from("revlearn_lessons").select("*").order("position", { ascending: true }),
  ]);

  if (catRes.error || courseRes.error || lessonRes.error) {
    const err = catRes.error ?? courseRes.error ?? lessonRes.error;
    console.error("[RevLearn] content fetch error:", err);
    return NextResponse.json({ error: "Could not load content." }, { status: 500 });
  }

  const lessonsByCourse = new Map<string, Lesson[]>();
  for (const row of lessonRes.data ?? []) {
    const lesson: Lesson = {
      id: row.id,
      courseId: row.course_id,
      title: row.title,
      url: row.url,
      position: row.position,
    };
    if (!lessonsByCourse.has(row.course_id)) lessonsByCourse.set(row.course_id, []);
    lessonsByCourse.get(row.course_id)!.push(lesson);
  }

  const coursesByCategory = new Map<string, Course[]>();
  for (const row of courseRes.data ?? []) {
    const course: Course = {
      id: row.id,
      categoryId: row.category_id,
      title: row.title,
      description: row.description ?? "",
      thumbnail: row.thumbnail ?? "",
      tags: row.tags ?? [],
      type: row.type ?? "single",
      url: row.url ?? undefined,
      lessons: lessonsByCourse.get(row.id) ?? [],
      sourceName: row.source_name ?? "External",
      duration: row.duration ?? "",
      position: row.position,
      createdAt: row.created_at,
    };
    if (!coursesByCategory.has(row.category_id)) coursesByCategory.set(row.category_id, []);
    coursesByCategory.get(row.category_id)!.push(course);
  }

  const categories: Category[] = (catRes.data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    icon: row.icon ?? "📚",
    accent: row.accent ?? "orange",
    position: row.position,
    courses: coursesByCategory.get(row.id) ?? [],
  }));

  return NextResponse.json({ categories });
}