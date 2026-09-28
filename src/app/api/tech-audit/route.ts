import { NextResponse } from "next/server";
import { readJson } from "@/lib/db";
import { submitTechAudit, techAuditRequestSchema } from "@/lib/tech-audits";

/** POST /api/tech-audit: a school's tech audit submission. Public. */
export async function POST(request: Request) {
  const parsed = techAuditRequestSchema.safeParse(await readJson(request));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request data", details: parsed.error.flatten() }, { status: 400 });
  }
  const result = await submitTechAudit(parsed.data);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json({ id: result.value.id }, { status: 201 });
}
