import { requireAdmin } from "@/lib/auth/guard";
import { toResponse } from "@/lib/db";
import { listNominations } from "@/lib/nominations/server";

/** GET /api/admin/nominations: every teacher nomination, newest first. Admin only. */
export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  return toResponse(await listNominations(), (nominations) => ({ nominations }));
}
