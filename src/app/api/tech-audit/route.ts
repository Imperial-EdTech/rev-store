import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { supabase } from "@/lib/supabase";
import { roles } from "@/lib/data";
import { allPrompts } from "@/lib/audit-data";
import { getOverallScore, getSectionScores } from "@/lib/audit-scoring";

const letterSchema = z.enum(["A", "B", "C", "D", "E"]);
const validPromptIds = new Set(allPrompts.map((prompt) => prompt.id));

const answersSchema = z
  .record(z.string(), z.array(letterSchema))
  .refine((value) => Object.keys(value).every((key) => validPromptIds.has(key)), {
    message: "Answers contain an unrecognized prompt id"
  });

const payloadSchema = z.object({
  schoolName: z.string().min(2),
  contactName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  role: z.enum(roles),
  deviceEstimate: z.string().nullable().optional(),
  answers: answersSchema,
  notes: z.string().nullable().optional()
});

/**
 * Submits a new free Tech Audit request. Computes the maturity score
 * server-side (never trust a client-submitted score) before insert, so
 * the admin dashboard can sort/filter on overall_score and
 * section_scores without recomputing from raw answers every load.
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
    return NextResponse.json({ error: "Invalid request data", details: parsed.error.flatten() }, { status: 400 });
  }

  const client = supabaseAdmin ?? supabase;
  if (!client) {
    return NextResponse.json(
      { error: "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (and ideally SUPABASE_SERVICE_ROLE_KEY) to .env.local." },
      { status: 503 }
    );
  }

  const { schoolName, contactName, email, phone, role, deviceEstimate, answers, notes } = parsed.data;

  const overallScore = getOverallScore(answers);
  const sectionScores = getSectionScores(answers).reduce<Record<string, { score: number | null; band: string | null }>>(
    (acc, section) => {
      acc[section.sectionId] = { score: section.score, band: section.band?.label ?? null };
      return acc;
    },
    {}
  );

  const { data, error } = await client
    .from("tech_audit_requests")
    .insert({
      school_name: schoolName,
      contact_name: contactName,
      email,
      phone,
      role,
      device_estimate: deviceEstimate ?? null,
      answers,
      overall_score: overallScore,
      section_scores: sectionScores,
      notes: notes ?? null
    })
    .select("id, created_at")
    .single();

  if (error) {
    console.error("Failed to insert tech audit request:", error);
    return NextResponse.json({ error: "Could not save your request. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ id: data.id, createdAt: data.created_at }, { status: 201 });
}
