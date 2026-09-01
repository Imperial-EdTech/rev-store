import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { supabase } from "@/lib/supabase";
import { roles } from "@/lib/data";
import { allQuestions } from "@/lib/audit-data";
import { scoreAudit } from "@/lib/audit-scoring";

const letterSchema = z.enum(["A", "B", "C", "D", "E"]);

const validQuestionKeys = new Set(allQuestions.map((q) => String(q.number)));

const answersSchema = z
  .record(z.string(), z.array(letterSchema))
  .refine(
    (val) => Object.keys(val).every((k) => validQuestionKeys.has(k)),
    { message: "Answers contain an unrecognised question number" }
  );

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
 * POST /api/tech-audit
 *
 * Saves a new audit submission. Scores are computed server-side so the
 * admin dashboard never needs to re-derive them from raw answers.
 *
 * Stored columns:
 *   answers          JSONB  { "1": ["A","C"], "2": ["B"], … }
 *   triggered_products JSONB  { product: triggerCount, … }   (ranked)
 *   top_products     text[] top-5 product names for quick admin filtering
 *   section_gaps     JSONB  { sectionId: { gapScore, triggeringSelections, … } }
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
      { error: "Invalid request data", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const client = supabaseAdmin ?? supabase;
  if (!client) {
    return NextResponse.json(
      {
        error:
          "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local."
      },
      { status: 503 }
    );
  }

  const { schoolName, contactName, email, phone, role, deviceEstimate, answers, notes } =
    parsed.data;

  // Score server-side — never trust client-submitted scores
  const auditScore = scoreAudit(answers);

  // Serialise triggered products as { productName: triggerCount }
  const triggeredProducts: Record<string, number> = {};
  for (const rec of auditScore.recommendations) {
    triggeredProducts[rec.product] = rec.triggerCount;
  }

  // Top 5 product names for quick column filtering in Supabase
  const topProducts = auditScore.recommendations.slice(0, 5).map((r) => r.product);

  // Serialise section gaps
  const sectionGaps: Record<
    string,
    { gapScore: number; triggeringSelections: number; maxTriggeringSelections: number }
  > = {};
  for (const gap of auditScore.sectionGaps) {
    sectionGaps[gap.sectionId] = {
      gapScore: gap.gapScore,
      triggeringSelections: gap.triggeringSelections,
      maxTriggeringSelections: gap.maxTriggeringSelections
    };
  }

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
      triggered_products: triggeredProducts,
      top_products: topProducts,
      section_gaps: sectionGaps,
      notes: notes ?? null
    })
    .select("id, created_at")
    .single();

  if (error) {
    console.error("Failed to insert tech audit request:", error);
    return NextResponse.json(
      { error: "Could not save your request. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ id: data.id, createdAt: data.created_at }, { status: 201 });
}
