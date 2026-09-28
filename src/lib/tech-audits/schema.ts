import { z } from "zod";
import type { ProductTrigger } from "@/lib/audit-data";
import { allQuestions } from "@/lib/audit-data";
import type { AuditAnswers } from "@/lib/audit-scoring";
import { roles } from "@/lib/data";
import { emailAddress, optionalText, phoneNumber } from "@/lib/validation";

/**
 * Tech audit submission (/tech-audit). The form validates with this schema,
 * and POST /api/tech-audit validates again.
 */

const letterSchema = z.enum(["A", "B", "C", "D", "E"]);
const validQuestionKeys = new Set(allQuestions.map((q) => String(q.number)));

export const techAuditRequestSchema = z.object({
  schoolName: z.string().trim().min(2, "Enter your school or organisation name").max(200),
  contactName: z.string().trim().min(2, "Enter your full name").max(160),
  email: emailAddress,
  phone: phoneNumber,
  role: z.enum(roles, { errorMap: () => ({ message: "Select your role" }) }),
  deviceEstimate: optionalText(100),
  /** Question number ("1"…"20") → selected option letters. Unanswered questions may be missing or empty. */
  answers: z
    .record(z.string(), z.array(letterSchema))
    .refine((val) => Object.keys(val).every((k) => validQuestionKeys.has(k)), {
      message: "Answers contain an unrecognised question number",
    }),
  notes: optionalText(4000),
});

export type TechAuditSubmission = z.infer<typeof techAuditRequestSchema>;

export type SectionGapRecord = Record<
  string,
  { gapScore: number; triggeringSelections: number; maxTriggeringSelections: number }
>;

/** A saved audit as the admin screens see it. */
export type TechAuditRequest = {
  id: string;
  schoolName: string;
  contactName: string;
  email: string;
  phone: string;
  role: TechAuditSubmission["role"];
  deviceEstimate: string | null;
  answers: AuditAnswers;
  /** { productName: triggerCount }, from scoreAudit() when submitted. */
  triggeredProducts: Record<string, number>;
  /** Top 5 product names, in order. */
  topProducts: ProductTrigger[];
  /** Per-section gap data. */
  sectionGaps: SectionGapRecord;
  notes: string | null;
  createdAt: string;
};
