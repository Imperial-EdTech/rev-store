import "server-only";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, PARTNER_COOKIE, readCookie, verifySession } from "./session";

/**
 * Call at the top of every protected route handler:
 *
 *   const denied = await requireAdmin(request);
 *   if (denied) return denied;
 *
 * Checking in each handler (not only in middleware) means a route is
 * protected where it is defined, and a middleware matcher mistake can't
 * expose it.
 */
export async function requireAdmin(request: Request): Promise<NextResponse | null> {
  const session = await verifySession(readCookie(request, ADMIN_COOKIE));
  if (session?.role === "admin") return null;
  return NextResponse.json({ error: "Not signed in." }, { status: 401 });
}

/** Returns the signed-in partner's id, or a 401 response. */
export async function requirePartner(
  request: Request,
): Promise<{ partnerId: string } | NextResponse> {
  const session = await verifySession(readCookie(request, PARTNER_COOKIE));
  if (session?.role === "partner") return { partnerId: session.partnerId };
  return NextResponse.json({ error: "Not signed in." }, { status: 401 });
}
