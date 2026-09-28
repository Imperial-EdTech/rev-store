import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { Tool } from "@/lib/revlearn-types";
import { requireAdmin } from "@/lib/auth/guard";

export async function GET() {
  const client = supabaseAdmin; // RLS locks every table to the server key
  if (!client) return NextResponse.json({ error: "Not configured." }, { status: 503 });
  const { data, error } = await client.from("revlearn_tools").select("*").order("position");
  if (error) return NextResponse.json({ error: "Could not load tools." }, { status: 500 });
  const tools: Tool[] = (data ?? []).map(r => ({
    id: r.id, name: r.name, description: r.description ?? "",
    embedUrl: r.embed_url ?? undefined, externalUrl: r.external_url ?? undefined,
    logoUrl: r.logo_url ?? undefined, partnerName: r.partner_name ?? "",
    category: r.category ?? "General", tags: r.tags ?? [],
    featured: r.featured ?? false, position: r.position,
  }));
  return NextResponse.json({ tools });
}

export async function POST(req: Request) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  if (!supabaseAdmin) return NextResponse.json({ error: "Admin only." }, { status: 503 });
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  const { error } = await supabaseAdmin.from("revlearn_tools").upsert(body, { onConflict: "id" });
  if (error) return NextResponse.json({ error: "Could not save." }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  if (!supabaseAdmin) return NextResponse.json({ error: "Admin only." }, { status: 503 });
  const { id } = await req.json().catch(() => ({}));
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });
  const { error } = await supabaseAdmin.from("revlearn_tools").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Could not delete." }, { status: 500 });
  return NextResponse.json({ ok: true });
}