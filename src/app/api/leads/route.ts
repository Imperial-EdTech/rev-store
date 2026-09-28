import { NextResponse } from "next/server";
import { readJson } from "@/lib/db";
import { leadRequestSchema } from "@/lib/leads/schema";
import { submitLead } from "@/lib/leads/server";

/** POST /api/leads: early-access waitlist and school enquiries. Public. */
export async function POST(request: Request) {
  const parsed = leadRequestSchema.safeParse(await readJson(request));
  if (!parsed.success) {
    return NextResponse.json({ error: "Some details are missing or invalid.", details: parsed.error.flatten() }, { status: 400 });
  }
  const result = await submitLead(parsed.data);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json({ ok: true }, { status: 201 });
}
