import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  const client = supabaseAdmin; // RLS locks every table to the server key
  if (!client) return NextResponse.json({ error: "Not configured." }, { status: 503 });
  const { data, error } = await client
    .from("revlearn_posts")
    .select("*, revlearn_comments(count)")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: "Could not load." }, { status: 500 });
  const posts = (data ?? []).map(r => ({
    id: r.id, content: r.content,
    authorName: r.author_name, authorSchool: r.author_school,
    authorSubject: r.author_subject, authorAvatar: r.author_avatar,
    likes: r.likes ?? 0,
    commentCount: r.revlearn_comments?.[0]?.count ?? 0,
    createdAt: r.created_at,
  }));
  return NextResponse.json({ posts });
}

export async function POST(req: Request) {
  const client = supabaseAdmin; // RLS locks every table to the server key
  if (!client) return NextResponse.json({ error: "Not configured." }, { status: 503 });
  const body = await req.json().catch(() => null);
  if (!body?.content || !body?.author_name)
    return NextResponse.json({ error: "content and author_name required." }, { status: 400 });
  const { data, error } = await client
    .from("revlearn_posts")
    .insert({ content: body.content, author_name: body.author_name, author_school: body.author_school ?? null, author_subject: body.author_subject ?? null, author_avatar: body.author_avatar ?? null })
    .select("id, created_at").single();
  if (error) return NextResponse.json({ error: "Could not save." }, { status: 500 });
  return NextResponse.json({ id: data.id, createdAt: data.created_at }, { status: 201 });
}

export async function PATCH(req: Request) {
  const client = supabaseAdmin; // RLS locks every table to the server key
  if (!client) return NextResponse.json({ error: "Not configured." }, { status: 503 });
  const { id, increment } = await req.json().catch(() => ({}));
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });
  const { data: current } = await client.from("revlearn_posts").select("likes").eq("id", id).single();
  const newLikes = Math.max(0, (current?.likes ?? 0) + (increment ? 1 : -1));
  const { error } = await client.from("revlearn_posts").update({ likes: newLikes }).eq("id", id);
  if (error) return NextResponse.json({ error: "Could not update." }, { status: 500 });
  return NextResponse.json({ likes: newLikes });
}