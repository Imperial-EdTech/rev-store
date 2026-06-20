import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/src/lib/supabase-admin";
import { supabase } from "@/src/lib/supabase";
import { roles } from "@/src/lib/data";

const payloadSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  organization: z.string().min(2),
  role: z.enum(roles),
  interests: z.array(z.string()).min(1),
  deviceCount: z.number().int().positive().nullable().optional(),
  notes: z.string().nullable().optional()
});

/**
 * Submits a new waitlist registration. Tries the service-role client first
 * (always works, bypasses RLS) and falls back to the public anon client
 * (works because of the "Anyone can register interest" insert policy) if
 * the service role key isn't configured in this environment yet.
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
    return NextResponse.json({ error: "Invalid registration data", details: parsed.error.flatten() }, { status: 400 });
  }

  const client = supabaseAdmin ?? supabase;
  if (!client) {
    return NextResponse.json(
      { error: "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (and ideally SUPABASE_SERVICE_ROLE_KEY) to .env.local." },
      { status: 503 }
    );
  }

  const { fullName, email, phone, organization, role, interests, deviceCount, notes } = parsed.data;

  const { data, error } = await client
    .from("waitlist_registrations")
    .insert({
      full_name: fullName,
      email,
      phone,
      organization,
      role,
      interests,
      device_count: deviceCount ?? null,
      notes: notes ?? null
    })
    .select("id, created_at")
    .single();

  if (error) {
    console.error("Failed to insert registration:", error);
    return NextResponse.json({ error: "Could not save registration. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ id: data.id, createdAt: data.created_at }, { status: 201 });
}