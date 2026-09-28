import { NextResponse } from "next/server";
import { z } from "zod";
import { setStatus } from "@/lib/admin/status";
import { getApplication } from "@/lib/applications/server";
import { requireAdmin } from "@/lib/auth/guard";
import { readJson, toResponse } from "@/lib/db";
import { APPLICATION_STATUS } from "@/lib/statuses";

const bodySchema = z.object({ status: APPLICATION_STATUS.schema });

/** PATCH /api/admin/applications/[id] { status }. Admin only. */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) return NextResponse.json({ error: "Not found." }, { status: 404 });
  const parsed = bodySchema.safeParse(await readJson(request));
  if (!parsed.success) return NextResponse.json({ error: "Invalid status." }, { status: 400 });

  const result = await setStatus("application", id, parsed.data.status);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
  return toResponse(await getApplication(id), (application) => ({ application }));
}
