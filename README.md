# RevStore

RevStore is a Revrica education access lead-generation platform powered by ImperialEdtech.

## Run locally

```bash
npm install
npm run dev
```

## Configuration

Every setting the app reads is listed in `.env.example`. Copy it to
`.env.local` for local development; in production set the same variables in
the host (e.g. Vercel project settings) and redeploy.

Sign-in fails closed: without `ADMIN_PASSWORD` and a 32+ character
`AUTH_SESSION_SECRET`, `/admin` shows "Admin sign-in isn't configured", and a
partner can't sign in until their passcode variable is set.

## Database (Supabase)

The app reads and writes only from the server, with the service-role key
(`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`). Every table has RLS
on with no policies, so the public anon key can't reach any data.

Setting up a project, in the Supabase SQL editor:

1. **Rebuilding an existing project only:** `supabase/reset.sql`. Its first
   query lists what will be removed; the rest drops everything in `public`
   (Supabase's own schemas, auth users and storage are not touched).
2. `supabase/migrations/20260928000000_initial_schema.sql`: tables, functions
   and permissions. The design notes are at the top of the file.
3. Optional, to load the legacy applications export:
   ```bash
   node scripts/import-legacy-applications.mjs revrica-applications-2026-08-28.xlsx \
     > supabase/imports/2026-08-28_legacy_applications.sql
   ```
   then run that file. It is one transaction and refuses to run twice.
   `supabase/imports/` is git-ignored because it holds personal data.

Schema changes go in a new file in `supabase/migrations/`. Status lists in
`src/lib/statuses.ts` mirror the CHECK constraints there; change both together.
