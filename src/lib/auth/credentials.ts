import "server-only";
import { PARTNERS, type Partner } from "@/lib/partners";
import { sessionSecretProblem } from "./session";

/**
 * Password checks. Server-only: secrets are read from environment variables
 * without the NEXT_PUBLIC_ prefix, so they are never sent to the browser.
 */

const encoder = new TextEncoder();

/**
 * Constant-time string comparison. Both sides are hashed first, so the
 * comparison takes the same time whatever the input length or content.
 */
async function safeEqual(a: string, b: string): Promise<boolean> {
  const [ha, hb] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(a)),
    crypto.subtle.digest("SHA-256", encoder.encode(b)),
  ]);
  const x = new Uint8Array(ha);
  const y = new Uint8Array(hb);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

/** Why admin sign-in can't work yet, or null when it's configured. */
export function adminSignInProblem(): string | null {
  if (!process.env.ADMIN_PASSWORD) return "Admin sign-in isn't configured: set ADMIN_PASSWORD.";
  return sessionSecretProblem();
}

/** False if ADMIN_PASSWORD is unset: a missing password never grants access. */
export async function checkAdminPassword(input: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return safeEqual(input, expected);
}

/** Returns the partner whose passcode matches, or null. Partners with no passcode set are skipped. */
export async function findPartnerByPasscode(input: string): Promise<Partner | null> {
  for (const partner of PARTNERS) {
    const expected = process.env[partner.passcodeEnv];
    if (expected && (await safeEqual(input, expected))) return partner;
  }
  return null;
}

/** Slows down wrong guesses. Not a substitute for real rate limiting (see README note). */
export function failedLoginDelay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 600));
}
