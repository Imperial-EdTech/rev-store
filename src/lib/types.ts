import type { AuditAnswers } from "@/lib/audit-scoring";

export type Role =
  | "Teacher"
  | "School Owner"
  | "School Administrator"
  | "Parent"
  | "Education Professional"
  | "Student"
  | "Other";

export type WaitlistRegistration = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  organization: string;
  role: Role;
  interests: string[];
  deviceCount?: number | null;
  notes?: string | null;
  createdAt: string;
};

export type SectionScoreRecord = Record<string, { score: number | null; band: string | null }>;

export type TechAuditRequest = {
  id: string;
  schoolName: string;
  contactName: string;
  email: string;
  phone: string;
  role: Role;
  deviceEstimate?: string | null;
  answers: AuditAnswers;
  overallScore: number | null;
  sectionScores: SectionScoreRecord;
  notes?: string | null;
  createdAt: string;
};
