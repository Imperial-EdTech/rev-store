import { toResponse } from "@/lib/db";
import { adminContentRoutes } from "@/lib/revlearn/routes";
import { resourceSchema } from "@/lib/revlearn/schema";
import { listResources } from "@/lib/revlearn/server";

/** GET: every resource, in display order. Public. */
export async function GET() {
  return toResponse(await listResources(), (resources) => ({ resources }));
}

/** POST (save) and DELETE { id } a resource. Admin only. */
export const { POST, DELETE } = adminContentRoutes("resource", resourceSchema);
