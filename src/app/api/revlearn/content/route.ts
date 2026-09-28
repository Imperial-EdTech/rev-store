import { toResponse } from "@/lib/db";
import { getContent } from "@/lib/revlearn/server";

/** GET: categories with their courses and lessons. Public. */
export async function GET() {
  return toResponse(await getContent(), (categories) => ({ categories }));
}
