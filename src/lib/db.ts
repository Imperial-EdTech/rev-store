import "server-only";
import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import type { ZodError } from "zod";
import { supabaseAdmin } from "@/lib/supabase-admin";

/**
 * Server-side database access. Every table is locked to the public API (RLS
 * with no policies), so all reads and writes go through here with the
 * service-role client.
 */

export type Result<T> = { ok: true; value: T } | { ok: false; status: number; error: string };

export const notConfigured = {
  ok: false as const,
  status: 503,
  error: "The database isn't configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
};

export function getDb(): SupabaseClient | null {
  return supabaseAdmin;
}

/**
 * Turns a database error into a safe message. The raw error is logged on the
 * server only; customers never see table or constraint names.
 */
export function dbFailure(context: string, error: PostgrestError, fallback: string): { ok: false; status: number; error: string } {
  console.error(`${context}:`, error);
  if (error.code === "PT409") return { ok: false, status: 409, error: error.message };
  // 22023 = raised by our own functions with a customer-safe message.
  if (error.code === "22023") return { ok: false, status: 400, error: error.message };
  return { ok: false, status: 500, error: fallback };
}

export function toResponse<T>(result: Result<T>, body: (value: T) => unknown, status = 200) {
  return result.ok
    ? NextResponse.json(body(result.value), { status })
    : NextResponse.json({ error: result.error }, { status: result.status });
}

/** Reads a JSON body; null if it isn't valid JSON. */
export async function readJson(request: Request): Promise<unknown> {
  return request.json().catch(() => null);
}

/**
 * 400 for a request body that failed validation. `error` is the first
 * problem's message (public forms write these for people); `withField`
 * prefixes the field name, for admin screens. `details` has every problem.
 */
export function invalidRequest(error: ZodError, { withField = false } = {}) {
  const first = error.issues[0];
  const field = withField && first?.path.length ? `${first.path.join(".")}: ` : "";
  return NextResponse.json(
    { error: first ? `${field}${first.message}` : "Some details are missing or invalid.", details: error.flatten() },
    { status: 400 },
  );
}

/** A route parameter that must be a UUID (anything else can't exist, so it's a 404, not a database error). */
export function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}
