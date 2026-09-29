/**
 * Signed session tokens for the admin dashboard and the partner portal.
 *
 * A token is `<payload>.<signature>`: base64url JSON plus an HMAC-SHA256 of it,
 * keyed with AUTH_SESSION_SECRET. The browser holds it in an httpOnly cookie,
 * so page scripts can't read it and nobody can forge one without the secret.
 *
 * Uses Web Crypto only, so it runs in middleware (Edge) and in route
 * handlers (Node). Fails closed: a missing or short secret means no session
 * is ever valid.
 */

export type Session =
  | { role: "admin"; exp: number }
  | { role: "partner"; partnerId: string; exp: number };

/** Session payload as supplied by the caller: every Session variant minus `exp`. */
export type SessionClaims = Session extends infer S ? (S extends Session ? Omit<S, "exp"> : never) : never;

export const ADMIN_COOKIE = "rs_admin_session";
export const PARTNER_COOKIE = "rs_partner_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours

const encoder = new TextEncoder();
const MIN_SECRET_LENGTH = 32;

/**
 * Why sessions can't be signed yet, or null when AUTH_SESSION_SECRET is usable.
 * The message names the setting, so a misconfigured deploy says what to fix.
 */
export function sessionSecretProblem(): string | null {
  const secret = process.env.AUTH_SESSION_SECRET;
  if (!secret) return "Sign-in isn't configured: set AUTH_SESSION_SECRET.";
  if (secret.length < MIN_SECRET_LENGTH) {
    return `Sign-in isn't configured: AUTH_SESSION_SECRET must be at least ${MIN_SECRET_LENGTH} characters.`;
  }
  return null;
}

function secretBytes(): Uint8Array<ArrayBuffer> | null {
  return sessionSecretProblem() ? null : encoder.encode(process.env.AUTH_SESSION_SECRET!);
}

async function hmacKey(usage: "sign" | "verify"): Promise<CryptoKey | null> {
  const raw = secretBytes();
  if (!raw) return null;
  return crypto.subtle.importKey("raw", raw, { name: "HMAC", hash: "SHA-256" }, false, [usage]);
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array<ArrayBuffer> {
  const b64 = value.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((value.length + 3) % 4);
  const binary = atob(b64);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

/** Creates a signed token. Throws if AUTH_SESSION_SECRET is not usable (check sessionSecretProblem() first). */
export async function signSession(claims: SessionClaims): Promise<string> {
  const key = await hmacKey("sign");
  if (!key) throw new Error(sessionSecretProblem() ?? "AUTH_SESSION_SECRET is not usable.");
  const payload: Session = { ...claims, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS } as Session;
  const body = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(body)));
  return `${body}.${toBase64Url(sig)}`;
}

/** Returns the session if the token is authentic and unexpired, otherwise null. */
export async function verifySession(token: string | undefined | null): Promise<Session | null> {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;

  const key = await hmacKey("verify");
  if (!key) return null;

  try {
    // crypto.subtle.verify compares in constant time.
    const ok = await crypto.subtle.verify("HMAC", key, fromBase64Url(sig), encoder.encode(body));
    if (!ok) return null;
    const session = JSON.parse(new TextDecoder().decode(fromBase64Url(body))) as Session;
    if (typeof session.exp !== "number" || session.exp < Date.now() / 1000) return null;
    if (session.role !== "admin" && session.role !== "partner") return null;
    return session;
  } catch {
    return null;
  }
}

/** Reads one cookie from a request's Cookie header (works in every Next.js version). */
export function readCookie(request: Request, name: string): string | undefined {
  const header = request.headers.get("cookie");
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return decodeURIComponent(v.join("="));
  }
  return undefined;
}

/** Cookie attributes shared by login and logout. */
export function sessionCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const, // Blocks cross-site POST/PATCH/DELETE from carrying the cookie.
    path: "/",
    maxAge,
  };
}
