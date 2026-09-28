import { requireAdmin } from "@/lib/auth/guard";
import { invalidRequest, readJson, toResponse } from "@/lib/db";
import { adminDelete } from "@/lib/revlearn/routes";
import { courseSchema } from "@/lib/revlearn/schema";
import { saveCourse } from "@/lib/revlearn/server";

/** POST a course, optionally with its full lesson list (saved together). Admin only. */
export async function POST(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const parsed = courseSchema.safeParse(await readJson(request));
  if (!parsed.success) return invalidRequest(parsed.error, { withField: true });
  return toResponse(await saveCourse(parsed.data), () => ({ ok: true }));
}

/** DELETE { id }: removes the course and its lessons. Admin only. */
export const DELETE = adminDelete("course");
