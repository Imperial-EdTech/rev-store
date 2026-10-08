import { NextResponse } from "next/server";
import { invalidRequest, readJson } from "@/lib/db";
import { nominationRequestSchema } from "@/lib/nominations/schema";
import { submitNomination } from "@/lib/nominations/server";

/** POST /api/nominations: "My Teacher, My Hero" nominations. Public. */
export async function POST(request: Request) {
  const parsed = nominationRequestSchema.safeParse(await readJson(request));
  if (!parsed.success) return invalidRequest(parsed.error);
  const result = await submitNomination(parsed.data);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json({ ok: true, ref: result.value.ref }, { status: 201 });
}
