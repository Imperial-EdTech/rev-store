import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase-admin";

const schema = z.object({
  id: z.string().min(1),
  course_id: z.string().min(1),
  title: z.string().min(1),
  url: z.string().min(1),
  position: z.number().int().default(0),
});

export async function POST(req: Request) {
  if (!supabaseAdmin) return NextResponse.json({ error: "Admin client not configured." }, { status: 503 });
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid data." }, { status: 400 });
  const { error } = await supabaseAdmin.from("revlearn_lessons").upsert(parsed.data, { onConflict: "id" });
  if (error) return NextResponse.json({ error: "Could not save lesson." }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!supabaseAdmin) return NextResponse.json({ error: "Admin client not configured." }, { status: 503 });
  const { id } = await req.json().catch(() => ({}));
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });
  const { error } = await supabaseAdmin.from("revlearn_lessons").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Could not delete." }, { status: 500 });
  return NextResponse.json({ ok: true });
}