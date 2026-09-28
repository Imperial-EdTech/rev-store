import { requireAdmin } from "@/lib/auth/guard";
import { toResponse } from "@/lib/db";
import { listLeads } from "@/lib/leads/server";

/** GET /api/admin/leads: every lead, newest first. Admin only. */
export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  return toResponse(await listLeads(), (leads) => ({ leads }));
}
