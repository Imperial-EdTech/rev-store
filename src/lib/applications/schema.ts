import { z } from "zod";
import type { ApplicationStatus } from "@/lib/statuses";

/**
 * Teacher Empowerment application (/apply). Used by the form (client-side
 * validation with these exact messages) and by POST /api/applications.
 */
export const SALARY_BANDS = ["₦0 – ₦50,000", "₦51,000 – ₦100,000", "Above ₦100,000"] as const;
export const REPAYMENT_OPTIONS = ["Buy Outright (Discounted)", "12 Months", "24 Months", "36 Months"] as const;
export const BUY_OUTRIGHT = REPAYMENT_OPTIONS[0];

export const teacherApplicationSchema = z
  .object({
    applyAs: z.enum(["individual", "ltbt", "government"]),
    governmentBodyId: z.string().optional(),

    // TRCN only required for government staff — optional otherwise
    trcnNumber: z.string().trim().max(60).optional(),

    fullName: z.string().trim().min(2, "Enter your full name").max(160),
    phone: z.string().trim().min(7, "Enter a valid phone number").max(30),
    email: z.string().trim().email("Enter a valid email address").max(200),
    gender: z.enum(["Male", "Female"], { required_error: "Select your gender" }),

    schoolName: z.string().trim().min(2, "Enter your school name").max(200),
    schoolType: z.enum(["Public", "Private"], { required_error: "Select school type" }),
    position: z.string().trim().min(2, "Enter your position or designation").max(120),
    state: z.string().trim().min(2, "Select your state of residence").max(60),
    lga: z.string().trim().min(2, "Enter your LGA").max(80),
    yearsTeaching: z.string().min(1, "Select your years of experience").max(40),

    salaryBand: z.enum(SALARY_BANDS, { required_error: "Select your salary range" }),
    repaymentTenor: z.enum(REPAYMENT_OPTIONS, { required_error: "Select your preferred repayment tenor" }),
    monthlyBudget: z.string().max(60).optional(),

    ownsLaptop: z.enum(["Yes", "No"], { required_error: "Please answer this question" }),
    whyLaptop: z.string().trim().min(10, "Please give a brief explanation (at least 10 characters)").max(2000),
    kycConsent: z.enum(["Yes", "No"], { required_error: "Please answer this question" }),
    declaration: z.literal(true, { errorMap: () => ({ message: "You must confirm this to submit" }) }),

    /** Device chosen before opening the form (/apply?device=orion). Not a form field. */
    deviceId: z.string().max(80).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.applyAs === "government" && !data.governmentBodyId) {
      ctx.addIssue({ code: "custom", path: ["governmentBodyId"], message: "Select your government body" });
    }
    if (data.applyAs === "government" && (!data.trcnNumber || data.trcnNumber.length < 3)) {
      ctx.addIssue({ code: "custom", path: ["trcnNumber"], message: "Enter your TRCN registration number" });
    }
  });

export type TeacherApplication = z.infer<typeof teacherApplicationSchema>;

/** A financing application as the admin dashboard and partner portal see it. */
export type FinancingApplication = {
  id: string;
  ref: string;
  status: ApplicationStatus;
  applicantType: "individual" | "partner_member" | "government_staff" | "school";
  sponsor: string | null;
  program: string;
  product: { id: string; name: string } | null;
  termMonths: number | null;
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
