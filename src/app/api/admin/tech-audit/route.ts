import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

/**
 * GET /api/admin/tech-audit
 *
 * Returns all tech audit submissions for the admin dashboard.
 * Requires SUPABASE_SERVICE_ROLE_KEY (same pattern as /api/admin/registrations).
 */
export async function GET() {
  if (!supabaseAdmin) {
    return NextResponse.json(
      {
        error:
          "Supabase admin client is not configured. Add SUPABASE_SERVICE_ROLE_KEY to .env.local."
      },
      { status: 503 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("tech_audit_requests")
    .select(
      "id, school_name, contact_name, email, phone, role, device_estimate, answers, triggered_products, top_products, section_gaps, notes, created_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch tech audit requests:", error);
    return NextResponse.json({ error: "Could not load tech audit requests." }, { status: 500 });
  }

  const requests = (data ?? []).map((row) => ({
    id: row.id,
    schoolName: row.school_name,
    contactName: row.contact_name,
    email: row.email,
    phone: row.phone,
    role: row.role,
    deviceEstimate: row.device_estimate,
    answers: row.answers ?? {},
    triggeredProducts: row.triggered_products ?? {},
    topProducts: row.top_products ?? [],
    sectionGaps: row.section_gaps ?? {},
    notes: row.notes,
    createdAt: row.created_at
  }));

  return NextResponse.json({ requests });
}
