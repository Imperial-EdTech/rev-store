import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { supabase } from "@/lib/supabase";
import type { Resource } from "@/lib/revlearn-types";

export async function GET() {
  const client = supabaseAdmin ?? supabase;
  if (!client) return NextResponse.json({ error: "Not configured." }, { status: 503 });
  const { data, error } = await client.from("revlearn_resources").select("*").order("position");
  if (error) return NextResponse.json({ error: "Could not load." }, { status: 500 });
  const resources: Resource[] = (data ?? []).map(r => ({
    id: r.id, title: r.title, description: r.description ?? "",
    url: r.url, thumbnail: r.thumbnail ?? undefined,
    type: r.type ?? "article", audience: r.audience ?? "teacher",
    sourceName: r.source_name ?? "External", tags: r.tags ?? [],
    featured: r.featured ?? false, position: r.position, createdAt: r.created_at,
  }));
  return NextResponse.json({ resources });
}

export async function POST(req: Request) {
  if (!supabaseAdmin) return NextResponse.json({ error: "Admin only." }, { status: 503 });
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  const { error } = await supabaseAdmin.from("revlearn_resources").upsert(body, { onConflict: "id" });
  if (error) return NextResponse.json({ error: "Could not save." }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!supabaseAdmin) return NextResponse.json({ error: "Admin only." }, { status: 503 });
  const { id } = await req.json().catch(() => ({}));
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });
  const { error } = await supabaseAdmin.from("revlearn_resources").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Could not delete." }, { status: 500 });
  return NextResponse.json({ ok: true });
}