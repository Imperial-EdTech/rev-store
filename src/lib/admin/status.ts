import "server-only";
import { dbFailure, getDb, notConfigured, type Result } from "@/lib/db";

export type StatusEntity = "order" | "application" | "lead";

/**
 * Changes the status of an order, application or lead. The database records
 * the change (with who made it) in the person's activity timeline.
 *
 * `actor`: who made the change. Admin is one shared login for now, so this is
 * "admin"; with staff accounts it becomes the staff member's name.
 */
export async function setStatus(entity: StatusEntity, id: string, status: string, actor = "admin"): Promise<Result<void>> {
  const db = getDb();
  if (!db) return notConfigured;
  const { data, error } = await db.rpc("set_status", { p_entity: entity, p_id: id, p_status: status, p_actor: actor });
  if (error) return dbFailure(`status: ${entity}`, error, "Could not update the status.");
  if (!data?.updated) return { ok: false, status: 404, error: "Not found." };
  return { ok: true, value: undefined };
}
