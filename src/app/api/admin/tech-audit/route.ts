import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

/**
 * Returns all tech audit requests for the admin dashboard. Same
 * service-role-required pattern as /api/admin/registrations.
 */
export async function GET() {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase admin client is not configured. Add SUPABASE_SERVICE_ROLE_KEY to .env.local." },
      { status: 503 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("tech_audit_requests")
    .select("id, school_name, contact_name, email, phone, role, device_estimate, answers, overall_score, section_scores, notes, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch tech audit requests:", error);
    return NextResponse.json({ error: "Could not load tech audit requests." }, { status: 500 });
  }

  const requests = data.map((row) => ({
    id: row.id,
    schoolName: row.school_name,
    contactName: row.contact_name,
    email: row.email,
    phone: row.phone,
    role: row.role,
    deviceEstimate: row.device_estimate,
    answers: row.answers ?? {},
    overallScore: row.overall_score,
    sectionScores: row.section_scores ?? {},
    notes: row.notes,
    createdAt: row.created_at
  }));

  return NextResponse.json({ requests });
}
