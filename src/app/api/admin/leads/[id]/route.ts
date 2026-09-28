import { NextResponse } from "next/server";
import { z } from "zod";
import { setStatus } from "@/lib/admin/status";
import { requireAdmin } from "@/lib/auth/guard";
import { readJson, toResponse } from "@/lib/db";
import { getLead } from "@/lib/leads/server";
import { LEAD_STATUS } from "@/lib/statuses";

const bodySchema = z.object({ status: LEAD_STATUS.schema });

/** PATCH /api/admin/leads/[id] { status }. Admin only. */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) return NextResponse.json({ error: "Not found." }, { status: 404 });
  const parsed = bodySchema.safeParse(await readJson(request));
  if (!parsed.success) return NextResponse.json({ error: "Invalid status." }, { status: 400 });

  const result = await setStatus("lead", id, parsed.data.status);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
  return toResponse(await getLead(id), (lead) => ({ lead }));
}
