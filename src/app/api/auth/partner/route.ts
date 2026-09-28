import { NextResponse } from "next/server";
import { z } from "zod";
import { failedLoginDelay, findPartnerByPasscode } from "@/lib/auth/credentials";
import {
  PARTNER_COOKIE, SESSION_TTL_SECONDS, readCookie, sessionCookieOptions, signSession, verifySession,
} from "@/lib/auth/session";
import { getPartner } from "@/lib/partners";

const loginSchema = z.object({ passcode: z.string().min(1).max(200) });

const publicPartner = (id: string) => {
  const p = getPartner(id);
  return p ? { id: p.id, name: p.name } : null;
};

/** GET /api/auth/partner: which partner (if any) is signed in. */
export async function GET(request: Request) {
  const session = await verifySession(readCookie(request, PARTNER_COOKIE));
  return NextResponse.json({ partner: session?.role === "partner" ? publicPartner(session.partnerId) : null });
}

/** POST /api/auth/partner { passcode }: sign in as the matching partner. */
export async function POST(request: Request) {
  if (!process.env.AUTH_SESSION_SECRET) {
    return NextResponse.json({ error: "Partner sign-in isn't configured." }, { status: 503 });
  }

  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  const partner = parsed.success ? await findPartnerByPasscode(parsed.data.passcode) : null;
  if (!partner) {
    await failedLoginDelay();
    return NextResponse.json({ error: "Incorrect passcode. Contact Revrica to retrieve yours." }, { status: 401 });
  }

  const response = NextResponse.json({ partner: publicPartner(partner.id) });
  response.cookies.set(
    PARTNER_COOKIE,
    await signSession({ role: "partner", partnerId: partner.id }),
    sessionCookieOptions(SESSION_TTL_SECONDS),
  );
  return response;
}

/** DELETE /api/auth/partner: sign out. */
export async function DELETE() {
  const response = NextResponse.json({ partner: null });
  response.cookies.set(PARTNER_COOKIE, "", sessionCookieOptions(0));
  return response;
}
