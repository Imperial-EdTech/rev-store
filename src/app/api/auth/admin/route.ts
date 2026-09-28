import { NextResponse } from "next/server";
import { z } from "zod";
import { checkAdminPassword, failedLoginDelay } from "@/lib/auth/credentials";
import {
  ADMIN_COOKIE, SESSION_TTL_SECONDS, readCookie, sessionCookieOptions, signSession, verifySession,
} from "@/lib/auth/session";

const loginSchema = z.object({ password: z.string().min(1).max(200) });

/** GET /api/auth/admin: is the current browser signed in as admin? */
export async function GET(request: Request) {
  const session = await verifySession(readCookie(request, ADMIN_COOKIE));
  return NextResponse.json({ authenticated: session?.role === "admin" });
}

/** POST /api/auth/admin { password }: sign in. */
export async function POST(request: Request) {
  if (!process.env.ADMIN_PASSWORD || !process.env.AUTH_SESSION_SECRET) {
    return NextResponse.json(
      { error: "Admin sign-in isn't configured. Set ADMIN_PASSWORD and AUTH_SESSION_SECRET." },
      { status: 503 },
    );
  }

  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || !(await checkAdminPassword(parsed.data.password))) {
    await failedLoginDelay();
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const response = NextResponse.json({ authenticated: true });
  response.cookies.set(ADMIN_COOKIE, await signSession({ role: "admin" }), sessionCookieOptions(SESSION_TTL_SECONDS));
  return response;
}

/** DELETE /api/auth/admin: sign out. */
export async function DELETE() {
  const response = NextResponse.json({ authenticated: false });
  response.cookies.set(ADMIN_COOKIE, "", sessionCookieOptions(0));
  return response;
}
