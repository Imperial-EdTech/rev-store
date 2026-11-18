/**
 * Reads and checks the Supabase settings the server needs.
 *
 * Supabase's API keys replace the old anon and service_role JWTs:
 *   - Secret key (sb_secret_...): full access, the successor to service_role.
 *     Server only. This is the key the app uses.
 *   - Publishable key (sb_publishable_...): the successor to anon. Safe in the
 *     browser, but it acts as the `anon` role, which this database gives no
 *     access (RLS on, no policies), so it can't stand in for the secret key.
 *
 * Pure (takes the environment as an argument) so it can be tested without
 * touching process.env. Messages name the setting, so a misconfigured deploy
 * says what to fix.
 */

export type SupabaseConfig =
  | { ok: true; url: string; secretKey: string }
  | { ok: false; problem: string };

type Env = Record<string, string | undefined>;

export function readSupabaseConfig(env: Env): SupabaseConfig {
  // Trimmed: a stray space or newline from copy-paste is a common cause of
  // "invalid key" and "can't connect" errors that are hard to spot.
  const url = env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  // SUPABASE_SERVICE_ROLE_KEY is the name this setting had before the new API
  // keys. Still read, so a deployment that put the secret key there works.
  const secretKey = (env.SUPABASE_SECRET_KEY ?? env.SUPABASE_SERVICE_ROLE_KEY)?.trim();

  if (!url) return { ok: false, problem: "The database isn't configured: set NEXT_PUBLIC_SUPABASE_URL." };
  if (!secretKey) return { ok: false, problem: "The database isn't configured: set SUPABASE_SECRET_KEY." };

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { ok: false, problem: "NEXT_PUBLIC_SUPABASE_URL isn't a valid URL. Use https://<project-ref>.supabase.co." };
  }
  if (parsed.pathname !== "/" || parsed.search || parsed.hash) {
    return {
      ok: false,
      problem: "NEXT_PUBLIC_SUPABASE_URL must be the project URL only, like https://<project-ref>.supabase.co (no /rest/v1 or other path).",
    };
  }

  if (secretKey.startsWith("sb_publishable_")) {
    return {
      ok: false,
      problem:
        "SUPABASE_SECRET_KEY holds a publishable key. The server needs the secret key (sb_secret_...): " +
        "a publishable key can't read or write any table here.",
    };
  }

  return { ok: true, url: parsed.origin, secretKey };
}
