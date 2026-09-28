import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/auth/guard";

const schema = z.object({
  id: z.string().min(1),
  category_id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional().default(""),
  thumbnail: z.string().optional().default(""),
  tags: z.array(z.string()).default([]),
  type: z.enum(["single", "multi"]).default("single"),
  url: z.string().optional(),
  source_name: z.string().optional().default("External"),
  duration: z.string().optional().default(""),
  position: z.number().int().default(0),
});

export async function POST(req: Request) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  if (!supabaseAdmin) return NextResponse.json({ error: "Admin client not configured." }, { status: 503 });
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid data." }, { status: 400 });
  const { error } = await supabaseAdmin.from("revlearn_courses").upsert(parsed.data, { onConflict: "id" });
  if (error) return NextResponse.json({ error: "Could not save course." }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  if (!supabaseAdmin) return NextResponse.json({ error: "Admin client not configured." }, { status: 503 });
  const { id } = await req.json().catch(() => ({}));
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });
  const { error } = await supabaseAdmin.from("revlearn_courses").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Could not delete." }, { status: 500 });
  return NextResponse.json({ ok: true });
}