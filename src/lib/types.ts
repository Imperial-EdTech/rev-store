import type { AuditAnswers } from "@/lib/audit-scoring";
import type { ProductTrigger } from "@/lib/audit-data";

export type Role =
  | "Teacher"
  | "School Owner"
  | "School Administrator"
  | "Parent"
  | "Education Professional"
  | "Student"
  | "Other";


export type SectionGapRecord = Record<
  string,
  { gapScore: number; triggeringSelections: number; maxTriggeringSelections: number }
>;

export type TechAuditRequest = {
  id: string;
  schoolName: string;
  contactName: string;
  email: string;
  phone: string;
  role: Role;
  deviceEstimate?: string | null;
  answers: AuditAnswers;
  /** { productName: triggerCount } — serialised from scoreAudit() at insert time */
  triggeredProducts: Record<string, number>;
  /** Top 5 product names, in order */
  topProducts: ProductTrigger[];
  /** Per-section gap data */
  sectionGaps: SectionGapRecord;
  notes?: string | null;
  createdAt: string;
};
