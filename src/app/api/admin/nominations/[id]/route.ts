import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guard";
import { isUuid } from "@/lib/db";
import { deleteNomination } from "@/lib/nominations/server";

/** DELETE /api/admin/nominations/[id]: erasure requests and teachers who opt out. Admin only. */
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const { id } = await params;
  if (!isUuid(id)) return NextResponse.json({ error: "Not found." }, { status: 404 });
  const result = await deleteNomination(id);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json({ ok: true });
}
