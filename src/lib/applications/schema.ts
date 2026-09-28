import { z } from "zod";
import { NIGERIAN_STATES } from "@/lib/nigeria";
import { GOVERNMENT_BODY_IDS } from "@/lib/organizations";
import { emailAddress, optionalText, phoneNumber } from "@/lib/validation";
import type { ApplicationStatus } from "@/lib/statuses";

/**
 * Teacher Empowerment application (/apply). The form validates with this
 * exact schema (same messages), and POST /api/applications validates again.
 */

export const SALARY_BANDS = ["₦0 – ₦50,000", "₦51,000 – ₦100,000", "Above ₦100,000"] as const;
export const REPAYMENT_OPTIONS = ["Buy Outright (Discounted)", "12 Months", "24 Months", "36 Months"] as const;
export const BUY_OUTRIGHT = REPAYMENT_OPTIONS[0];
export const YEARS_TEACHING = ["Less than 1 year", "1–2 years", "3–5 years", "6–10 years", "11–20 years", "Over 20 years"] as const;

const choose = (message: string) => ({ errorMap: () => ({ message }) });

const applicant = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(160),
  phone: phoneNumber,
  email: emailAddress,
  gender: z.enum(["Male", "Female"], choose("Select your gender")),

  schoolName: z.string().trim().min(2, "Enter your school name").max(200),
  schoolType: z.enum(["Public", "Private"], choose("Select school type")),
  position: z.string().trim().min(2, "Enter your position or designation").max(120),
  state: z.enum(NIGERIAN_STATES, choose("Select your state of residence")),
  lga: z.string().trim().min(2, "Enter your LGA").max(80),
  yearsTeaching: z.enum(YEARS_TEACHING, choose("Select your years of experience")),

  salaryBand: z.enum(SALARY_BANDS, choose("Select your salary range")),
  repaymentTenor: z.enum(REPAYMENT_OPTIONS, choose("Select your preferred repayment tenor")),
  monthlyBudget: optionalText(60),

  ownsLaptop: z.enum(["Yes", "No"], choose("Please answer this question")),
  whyLaptop: z.string().trim().min(10, "Please give a brief explanation (at least 10 characters)").max(2000),
  kycConsent: z.enum(["Yes", "No"], choose("Please answer this question")),
  declaration: z.literal(true, choose("You must confirm this to submit")),

  /** Device chosen before opening the form (/apply?device=orion). Not a form field. */
  deviceId: z.string().max(80).optional(),
});

/**
 * One variant per pathway, so each pathway's own questions (government body,
 * TRCN number) are required as part of the object and reported on the step
 * where they're asked.
 */
export const teacherApplicationSchema = z.discriminatedUnion("applyAs", [
  applicant.extend({ applyAs: z.literal("individual") }),
  applicant.extend({ applyAs: z.literal("ltbt") }),
  applicant.extend({
    applyAs: z.literal("government"),
    governmentBodyId: z.enum(GOVERNMENT_BODY_IDS, choose("Select your government body")),
    trcnNumber: z.string().trim().min(3, "Enter your TRCN registration number").max(60),
  }),
]);

export type TeacherApplication = z.infer<typeof teacherApplicationSchema>;
export type ApplyAs = TeacherApplication["applyAs"];

/** What POST /api/applications returns: an application reference, or a purchase lead for "buy outright". */
export type SubmissionOutcome = { kind: "application"; ref: string } | { kind: "purchase" };

/** A financing application as the admin dashboard and partner portal see it. */
export type FinancingApplication = {
  id: string;
  ref: string;
  status: ApplicationStatus;
  applicantType: "individual" | "partner_member" | "government_staff" | "school";
  sponsor: string | null;
  program: string;
  product: { id: string; name: string } | null;
  termMonths: number;
  monthlyAmount: number | null;
  answers: Record<string, unknown>;
  kycConsent: boolean;
  createdAt: string;
  statusChangedAt: string;
  importedFrom: string | null;
  contact: { id: string; name: string; email: string | null; phone: string | null; gender: string | null; state: string | null; lga: string | null; jobTitle: string | null };
  school: string | null;
};

export const APPLICANT_TYPE_LABEL: Record<FinancingApplication["applicantType"], string> = {
  individual: "Individual",
  partner_member: "Partner member",
  government_staff: "Government staff",
  school: "School",
};
