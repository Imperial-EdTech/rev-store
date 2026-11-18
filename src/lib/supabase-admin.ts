import "server-only";
import { createClient } from "@supabase/supabase-js";
import { readSupabaseConfig } from "@/lib/supabase-config";

const config = readSupabaseConfig(process.env);

/** Why the database can't be used, or null when it's configured. */
export const databaseConfigProblem: string | null = config.ok ? null : config.problem;

/**
 * Server-only Supabase client using the secret key. This bypasses Row Level
 * Security entirely, so it must only ever be imported from code that runs on
 * the server (API routes, Server Components, Server Actions), never from a
 * "use client" component or anything bundled for the browser. The
 * `server-only` import above will throw a build error if this file is
 * accidentally imported from client code.
 *
 * Null when the settings are missing or wrong; see databaseConfigProblem.
 */
export const supabaseAdmin = config.ok
  ? createClient(config.url, config.secretKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null;
