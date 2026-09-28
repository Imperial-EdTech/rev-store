import { NextResponse } from "next/server";
import { invalidRequest, readJson } from "@/lib/db";
import { techAuditRequestSchema } from "@/lib/tech-audits/schema";
import { submitTechAudit } from "@/lib/tech-audits/server";

/** POST /api/tech-audit: a school's tech audit submission. Public. */
export async function POST(request: Request) {
  const parsed = techAuditRequestSchema.safeParse(await readJson(request));
  if (!parsed.success) return invalidRequest(parsed.error);
  const result = await submitTechAudit(parsed.data);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json({ id: result.value.id }, { status: 201 });
}
