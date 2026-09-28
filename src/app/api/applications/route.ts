import { NextResponse } from "next/server";
import { teacherApplicationSchema } from "@/lib/applications/schema";
import { submitTeacherApplication } from "@/lib/applications/server";
import { invalidRequest, readJson } from "@/lib/db";

/** POST /api/applications: Teacher Empowerment application (/apply). Public. */
export async function POST(request: Request) {
  const parsed = teacherApplicationSchema.safeParse(await readJson(request));
  if (!parsed.success) return invalidRequest(parsed.error);
  const result = await submitTeacherApplication(parsed.data);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json(result.value, { status: 201 });
}
