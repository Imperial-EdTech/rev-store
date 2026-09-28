import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: Request) {
  const client = supabaseAdmin; // RLS locks every table to the server key
  if (!client) return NextResponse.json({ error: "Not configured." }, { status: 503 });
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("postId");
  if (!postId) return NextResponse.json({ error: "postId required." }, { status: 400 });
  const { data, error } = await client
    .from("revlearn_comments").select("*")
    .eq("post_id", postId).order("created_at", { ascending: true });
  if (error) return NextResponse.json({ error: "Could not load." }, { status: 500 });
  const comments = (data ?? []).map(r => ({
    id: r.id, postId: r.post_id, content: r.content,
    authorName: r.author_name, authorAvatar: r.author_avatar, createdAt: r.created_at,
  }));
  return NextResponse.json({ comments });
}

export async function POST(req: Request) {
  const client = supabaseAdmin; // RLS locks every table to the server key
  if (!client) return NextResponse.json({ error: "Not configured." }, { status: 503 });
  const body = await req.json().catch(() => null);
  if (!body?.post_id || !body?.content || !body?.author_name)
    return NextResponse.json({ error: "post_id, content, author_name required." }, { status: 400 });
  const { data, error } = await client
    .from("revlearn_comments")
    .insert({ post_id: body.post_id, content: body.content, author_name: body.author_name, author_avatar: body.author_avatar ?? null })
    .select("id, created_at").single();
  if (error) return NextResponse.json({ error: "Could not save." }, { status: 500 });
  return NextResponse.json({ id: data.id, createdAt: data.created_at }, { status: 201 });
}