import { listApplications } from "@/lib/applications/server";
import { requireAdmin } from "@/lib/auth/guard";
import { toResponse } from "@/lib/db";

/** GET /api/admin/applications: every financing application. Admin only. */
export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  return toResponse(await listApplications(), (applications) => ({ applications }));
}
