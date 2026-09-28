import { toResponse } from "@/lib/db";
import { adminContentRoutes } from "@/lib/revlearn/routes";
import { toolSchema } from "@/lib/revlearn/schema";
import { listTools } from "@/lib/revlearn/server";

/** GET: every tool, in display order. Public. */
export async function GET() {
  return toResponse(await listTools(), (tools) => ({ tools }));
}

/** POST (save) and DELETE { id } a tool. Admin only. */
export const { POST, DELETE } = adminContentRoutes("tool", toolSchema);
