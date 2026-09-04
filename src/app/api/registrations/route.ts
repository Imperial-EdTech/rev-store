import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { supabase } from "@/lib/supabase";

// ─── Roles now include school submission role ─────────────────
const VALID_ROLES = [
  "Teacher",
  "School Owner",
  "School Administrator",
  "Parent",
  "Education Professional",
  "Student",
  "Other",
] as const;

const payloadSchema = z.object({
  fullName:     z.string().min(2),
  email:        z.string().email(),
  phone:        z.string().min(7),
  organization: z.string().min(2),
  role:         z.enum(VALID_ROLES),
  interests:    z.array(z.string()).min(1),
  deviceCount:  z.number().int().positive().nullable().optional(),
  notes:        z.string().nullable().optional(),
});

/**
 * Accepts both individual teacher applications and school enquiries.
 * School submissions set role="School Owner" and embed structured data
 * (submissionType, deviceTypes, purposes, financingInterest, etc.) in
 * the JSON notes field. The admin dashboard reads that field to separate
 * and display the two streams cleanly.
 *
 * Uses the service-role client (bypasses RLS) where available; falls back
 * to the anon client which has an INSERT policy for this table.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = payloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid registration data", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const client = supabaseAdmin ?? supabase;
  if (!client) {
    return NextResponse.json(
      { error: "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local." },
      { status: 503 }
    );
  }

  const { fullName, email, phone, organization, role, interests, deviceCount, notes } = parsed.data;

  const { data, error } = await client
    .from("waitlist_registrations")
    .insert({
      full_name:    fullName,
      email,
      phone,
      organization,
      role,
      interests,
      device_count: deviceCount ?? null,
      notes:        notes ?? null,
    })
    .select("id, created_at")
    .single();

  if (error) {
    console.error("Failed to insert registration:", error);
    return NextResponse.json(
      { error: "Could not save registration. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ id: data.id, createdAt: data.created_at }, { status: 201 });
}