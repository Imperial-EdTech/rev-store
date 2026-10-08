import { z } from "zod";
import { NIGERIAN_STATES } from "@/lib/nigeria";
import { optionalText, phoneNumber } from "@/lib/validation";

/**
 * "My Teacher, My Hero": public teacher nominations (/nominate-a-teacher).
 * The form validates with this same schema, so it shows the server's exact
 * rules and messages. Roles and statuses mirror the CHECK constraints in
 * supabase/migrations/20261008000000_teacher_nominations.sql.
 */

export const CAMPAIGN = {
  name: "My Teacher, My Hero",
  prize: "a brand-new Rev laptop",
} as const;

/**
 * Version of the privacy notice shown on the form. Stored with each
 * nomination, so we can show what someone agreed to. Bump it whenever the
 * nomination section of /privacy changes.
 */
export const NOMINATION_NOTICE_VERSION = "2026-10-08";

export const NOMINATOR_ROLES = [
  { id: "student", label: "Student" },
  { id: "former_student", label: "Former student" },
  { id: "parent", label: "Parent / guardian" },
  { id: "teacher", label: "Fellow teacher" },
  { id: "principal", label: "Principal / head teacher" },
  { id: "school_owner", label: "School owner" },
  { id: "other", label: "Other" },
] as const;
export type NominatorRole = (typeof NOMINATOR_ROLES)[number]["id"];
const roleIds = NOMINATOR_ROLES.map((r) => r.id) as [NominatorRole, ...NominatorRole[]];

export const nominationRequestSchema = z.object({
  nominatorName: z.string().trim().min(2, "Enter your full name").max(160),
  nominatorPhone: phoneNumber,
  nominatorRole: z.enum(roleIds, { errorMap: () => ({ message: "Tell us who you are" }) }),
  teacherName: z.string().trim().min(2, "Enter the teacher's full name").max(160),
  teacherPhone: phoneNumber,
  teacherSubject: optionalText(120),
  schoolName: z.string().trim().min(2, "Enter the teacher's school").max(200),
  schoolState: z.enum(NIGERIAN_STATES, { errorMap: () => ({ message: "Select the school's state" }) }),
  reason: z.string().trim()
    .min(40, "Tell us a little more: at least a couple of sentences")
    .max(2000, "Please keep it under 2,000 characters"),

  // ── Data protection (NDPA 2023 / GDPR). Stored with the nomination as the record. ──
  /** Read the privacy notice; details are accurate and shared in good faith. */
  privacyAccepted: z.literal(true, { errorMap: () => ({ message: "Please confirm to continue" }) }),
  /** NDPA s.31: under-18s need a parent or guardian's consent. */
  ageConfirmed: z.literal(true, { errorMap: () => ({ message: "Please confirm to continue" }) }),
  /** Separate, optional, unticked by default: news about Rev devices. */
  marketingOptIn: z.boolean().default(false),
});
export type NominationRequest = z.infer<typeof nominationRequestSchema>;

export const NOMINATION_STATUS = [
  { value: "submitted", label: "Submitted" },
  { value: "verified", label: "Verified" },
  { value: "spotlighted", label: "Spotlighted" },
  { value: "finalist", label: "Finalist" },
  { value: "winner", label: "Winner" },
  { value: "declined", label: "Declined" },
] as const;
export type NominationStatus = (typeof NOMINATION_STATUS)[number]["value"];

/** A nomination as the admin dashboard sees it. */
export type Nomination = {
  id: string;
  ref: string;
  status: NominationStatus;
  createdAt: string;
  nominator: { name: string; phone: string; role: NominatorRole };
  teacher: { name: string; phone: string; subject: string | null };
  school: { name: string; state: string };
  reason: string;
  marketingOptIn: boolean;
};

export const nominatorRoleLabel = (id: string) => NOMINATOR_ROLES.find((r) => r.id === id)?.label ?? id;
export const nominationStatusLabel = (v: string) => NOMINATION_STATUS.find((s) => s.value === v)?.label ?? v;
