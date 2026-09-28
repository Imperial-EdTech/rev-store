import { NextResponse } from "next/server";
import { z } from "zod";
import { setStatus } from "@/lib/admin/status";
import { requireAdmin } from "@/lib/auth/guard";
import { readJson, toResponse } from "@/lib/db";
import { getOrder } from "@/lib/orders/server";
import { ORDER_STATUS } from "@/lib/statuses";

const bodySchema = z.object({ status: ORDER_STATUS.schema });

/** PATCH /api/admin/orders/[id] { status }: change an order's status. Admin only. */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) return NextResponse.json({ error: "Order not found." }, { status: 404 });
  const parsed = bodySchema.safeParse(await readJson(request));
  if (!parsed.success) return NextResponse.json({ error: "Invalid status." }, { status: 400 });

  const updated = await setStatus("order", id, parsed.data.status);
  if (!updated.ok) return NextResponse.json({ error: updated.error }, { status: updated.status });
  return toResponse(await getOrder(id), (order) => ({ order }));
}
