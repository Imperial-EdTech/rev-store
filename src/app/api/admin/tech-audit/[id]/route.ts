import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

/**
 * GET /api/admin/tech-audit/[id]
 *
 * Fetches a single tech audit submission for the per-school report page.
 */
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase admin client is not configured." },
      { status: 503 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("tech_audit_requests")
    .select(
      "id, school_name, contact_name, email, phone, role, device_estimate, answers, triggered_products, top_products, section_gaps, notes, created_at"
    )
    .eq("id", params.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Submission not found." }, { status: 404 });
  }

  return NextResponse.json({
    request: {
      id: data.id,
      schoolName: data.school_name,
      contactName: data.contact_name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      deviceEstimate: data.device_estimate,
      answers: data.answers ?? {},
      triggeredProducts: data.triggered_products ?? {},
      topProducts: data.top_products ?? [],
      sectionGaps: data.section_gaps ?? {},
      notes: data.notes,
      createdAt: data.created_at
    }
  });
}
