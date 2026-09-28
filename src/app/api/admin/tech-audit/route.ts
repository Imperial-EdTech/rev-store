import { requireAdmin } from "@/lib/auth/guard";
import { toResponse } from "@/lib/db";
import { listTechAudits } from "@/lib/tech-audits/server";

/** GET /api/admin/tech-audit: all tech audit submissions. Admin only. */
export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  return toResponse(await listTechAudits(), (requests) => ({ requests }));
}
