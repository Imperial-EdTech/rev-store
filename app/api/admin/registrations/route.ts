import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/lib/supabase-admin";

/**
 * Returns all waitlist registrations for the admin dashboard. Uses the
 * service-role client deliberately — the public anon key cannot read this
 * table per the "Admins can read registrations" RLS policy, which expects
 * an authenticated Supabase user with an admin role claim. Since the admin
 * page in this app uses a simple passcode gate rather than full Supabase
 * auth, the service role is what actually makes reads possible here.
 *
 * The passcode check happens client-side before this route is ever called
 * from the UI; this route itself has no additional auth check, so treat
 * its URL as sensitive. For production, consider adding a shared-secret
 * header check here too.
 */
export async function GET() {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase admin client is not configured. Add SUPABASE_SERVICE_ROLE_KEY to .env.local." },
      { status: 503 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("waitlist_registrations")
    .select("id, full_name, email, phone, organization, role, interests, device_count, notes, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch registrations:", error);
    return NextResponse.json({ error: "Could not load registrations." }, { status: 500 });
  }

  const registrations = data.map((row) => ({
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    organization: row.organization,
    role: row.role,
    interests: row.interests,
    deviceCount: row.device_count,
    notes: row.notes,
    createdAt: row.created_at
  }));

  return NextResponse.json({ registrations });
}