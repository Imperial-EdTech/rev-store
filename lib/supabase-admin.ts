import "server-only";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Server-only Supabase client using the service_role key. This bypasses
 * Row Level Security entirely, so it must only ever be imported from
 * code that runs on the server (API routes, Server Components, Server
 * Actions) — never from a "use client" component or anything bundled
 * for the browser. The `server-only` import above will throw a build
 * error if this file is accidentally imported from client code.
 */
export const supabaseAdmin =
  supabaseUrl && serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false }
      })
    : null;