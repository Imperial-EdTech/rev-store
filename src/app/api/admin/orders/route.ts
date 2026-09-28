import { requireAdmin } from "@/lib/auth/guard";
import { toResponse } from "@/lib/db";
import { listOrders } from "@/lib/orders/server";

/** GET /api/admin/orders: all orders, newest first. Admin only. */
export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  return toResponse(await listOrders(), (orders) => ({ orders }));
}
