import "server-only";
import { z } from "zod";
import { allQuestions } from "@/lib/audit-data";
import { scoreAudit } from "@/lib/audit-scoring";
import { roles } from "@/lib/data";
import { dbFailure, getDb, notConfigured, type Result } from "@/lib/db";
import type { TechAuditRequest } from "@/lib/types";

const letterSchema = z.enum(["A", "B", "C", "D", "E"]);
const validQuestionKeys = new Set(allQuestions.map((q) => String(q.number)));

export const techAuditRequestSchema = z.object({
  schoolName: z.string().trim().min(2).max(200),
  contactName: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(7).max(30),
  role: z.enum(roles),
  deviceEstimate: z.string().max(100).nullable().optional(),
  answers: z
    .record(z.string(), z.array(letterSchema))
    .refine((val) => Object.keys(val).every((k) => validQuestionKeys.has(k)), {
      message: "Answers contain an unrecognised question number",
    }),
  notes: z.string().max(4000).nullable().optional(),
});
export type TechAuditSubmission = z.infer<typeof techAuditRequestSchema>;

/**
 * Saves an audit. Scores are computed here, never taken from the browser.
 * The database also opens a lead for the school, so it lands in the pipeline.
 */
export async function submitTechAudit(s: TechAuditSubmission): Promise<Result<{ id: string }>> {
  const db = getDb();
  if (!db) return notConfigured;

  const score = scoreAudit(s.answers);
  const triggeredProducts = Object.fromEntries(score.recommendations.map((r) => [r.product, r.triggerCount]));
  const sectionGaps = Object.fromEntries(
    score.sectionGaps.map((g) => [
      g.sectionId,
      { gapScore: g.gapScore, triggeringSelections: g.triggeringSelections, maxTriggeringSelections: g.maxTriggeringSelections },
    ]),
  );

  const { data, error } = await db.rpc("submit_tech_audit", {
    p: {
      contact: { full_name: s.contactName, email: s.email, phone: s.phone, job_title: s.role },
      school: { name: s.schoolName },
      contact_role: s.role,
      device_estimate: s.deviceEstimate ?? null,
      answers: s.answers,
      triggered_products: triggeredProducts,
      top_products: score.recommendations.slice(0, 5).map((r) => r.product),
      section_gaps: sectionGaps,
      notes: s.notes ?? null,
    },
  });
  if (error) return dbFailure("tech audit: submit", error, "Could not save your request. Please try again.");
  return { ok: true, value: { id: data.id as string } };
}

const AUDIT_SELECT = `
  id, contact_role, device_estimate, answers, triggered_products, top_products, section_gaps, notes, created_at,
  contacts ( full_name, email, phone ),
  organizations ( name )`;

type AuditRow = {
  id: string; contact_role: string | null; device_estimate: string | null; answers: TechAuditRequest["answers"];
  triggered_products: Record<string, number>; top_products: TechAuditRequest["topProducts"];
  section_gaps: TechAuditRequest["sectionGaps"]; notes: string | null; created_at: string;
  contacts: { full_name: string; email: string | null; phone: string | null };
  organizations: { name: string } | null;
};

/** Mapped to the shape the existing tech-audit screens use. */
function toRequest(r: AuditRow): TechAuditRequest {
  return {
    id: r.id,
    schoolName: r.organizations?.name ?? "",
    contactName: r.contacts.full_name,
    email: r.contacts.email ?? "",
    phone: r.contacts.phone ?? "",
    role: (r.contact_role ?? "Other") as TechAuditRequest["role"],
    deviceEstimate: r.device_estimate,
    answers: r.answers ?? {},
    triggeredProducts: r.triggered_products ?? {},
    topProducts: r.top_products ?? [],
    sectionGaps: r.section_gaps ?? {},
    notes: r.notes,
    createdAt: r.created_at,
  };
}

export async function listTechAudits(): Promise<Result<TechAuditRequest[]>> {
  const db = getDb();
  if (!db) return notConfigured;
  const { data, error } = await db.from("tech_audits").select(AUDIT_SELECT).order("created_at", { ascending: false });
  if (error) return dbFailure("tech audit: list", error, "Could not load tech audit requests.");
  return { ok: true, value: (data as unknown as AuditRow[]).map(toRequest) };
}

export async function getTechAudit(id: string): Promise<Result<TechAuditRequest>> {
  const db = getDb();
  if (!db) return notConfigured;
  if (!z.string().uuid().safeParse(id).success) return { ok: false, status: 404, error: "Audit request not found." };
  const { data, error } = await db.from("tech_audits").select(AUDIT_SELECT).eq("id", id).maybeSingle();
  if (error) return dbFailure("tech audit: get", error, "Could not load this audit request.");
  if (!data) return { ok: false, status: 404, error: "Audit request not found." };
  return { ok: true, value: toRequest(data as unknown as AuditRow) };
}
