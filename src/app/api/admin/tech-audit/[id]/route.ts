import { requireAdmin } from "@/lib/auth/guard";
import { toResponse } from "@/lib/db";
import { getTechAudit } from "@/lib/tech-audits";

/** GET /api/admin/tech-audit/[id]: one submission with its scores. Admin only. */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const { id } = await params;
  return toResponse(await getTechAudit(id), (req) => ({ request: req }));
}
