import "server-only";
import { NextResponse } from "next/server";
import type { z } from "zod";
import { requireAdmin } from "@/lib/auth/guard";
import { invalidRequest, readJson, toResponse } from "@/lib/db";
import { deleteSchema } from "./schema";
import { deleteRow, saveRow, type ContentKind } from "./server";

type Saved = Parameters<typeof saveRow>[0];

/**
 * POST (create or replace) and DELETE handlers for one kind of RevLearn
 * content. Both are admin only and validate the body first.
 */
export function adminContentRoutes<K extends Saved>(kind: K, schema: z.ZodType<Parameters<typeof saveRow<K>>[1], z.ZodTypeDef, unknown>) {
  return {
    async POST(request: Request) {
      const denied = await requireAdmin(request);
      if (denied) return denied;
      const parsed = schema.safeParse(await readJson(request));
      if (!parsed.success) return invalidRequest(parsed.error, { withField: true });
      return toResponse(await saveRow(kind, parsed.data), () => ({ ok: true }));
    },
    DELETE: adminDelete(kind),
  };
}

/** DELETE { id }: admin only. */
export function adminDelete(kind: ContentKind) {
  return async function DELETE(request: Request) {
    const denied = await requireAdmin(request);
    if (denied) return denied;
    const parsed = deleteSchema.safeParse(await readJson(request));
    if (!parsed.success) return NextResponse.json({ error: "Missing id." }, { status: 400 });
    return toResponse(await deleteRow(kind, parsed.data.id), () => ({ ok: true }));
  };
}
