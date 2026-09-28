import { z } from "zod";
import { interests, roles } from "@/lib/data";
import { FINANCING_INTEREST, SCHOOL_DEVICE_TYPES, SCHOOL_PURPOSES } from "@/lib/school-enquiry";
import type { LeadStatus } from "@/lib/statuses";

/** Public lead submissions accepted by POST /api/leads. */

const phone = z.string().trim().refine((v) => {
  const digits = v.replace(/\D/g, "").length;
  return digits >= 7 && digits <= 15;
}, "Enter a valid phone number");

const deviceTypeIds = SCHOOL_DEVICE_TYPES.map((d) => d.id) as [string, ...string[]];
const purposeIds = SCHOOL_PURPOSES.map((p) => p.id) as [string, ...string[]];

/** Early-access waitlist (/early-access). */
export const waitlistLeadSchema = z.object({
  kind: z.literal("waitlist"),
  fullName: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(200),
  phone,
  organization: z.string().trim().min(2).max(200),
  role: z.enum(roles),
  interests: z.array(z.enum(interests as [string, ...string[]])).min(1).max(interests.length),
  deviceCount: z.number().int().positive().max(1_000_000).nullable().optional(),
  notes: z.string().trim().max(2000).nullable().optional(),
});

/** School device enquiry (/apply/school). */
export const schoolLeadSchema = z.object({
  kind: z.literal("school"),
  contactName: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(200),
  phone,
  schoolName: z.string().trim().min(2).max(200),
  role: z.string().trim().min(2).max(120),
  deviceTypes: z.array(z.enum(deviceTypeIds)).min(1),
  estimatedCount: z.number().int().positive().max(1_000_000).nullable().optional(),
  purposes: z.array(z.enum(purposeIds)).min(1),
  financingInterest: z.enum(FINANCING_INTEREST).nullable().optional(),
  comments: z.string().trim().max(2000).nullable().optional(),
});

export const leadRequestSchema = z.discriminatedUnion("kind", [waitlistLeadSchema, schoolLeadSchema]);
export type LeadRequest = z.infer<typeof leadRequestSchema>;

/** A lead as the admin dashboard sees it. */
export type Lead = {
  id: string;
  status: LeadStatus;
  source: string;
  sourceDetail: string | null;
  intent: string;
  interests: string[];
  productId: string | null;
  deviceCount: number | null;
  details: Record<string, unknown>;
  createdAt: string;
  statusChangedAt: string;
  importedFrom: string | null;
  contact: { id: string; name: string; email: string | null; phone: string | null; state: string | null; jobTitle: string | null };
  organization: string | null;
};

export const LEAD_SOURCE_LABEL: Record<string, string> = {
  website_waitlist: "Website waitlist",
  website_form: "Website form",
  school_enquiry: "School enquiry",
  event: "Event",
  tech_audit: "Tech audit",
  whatsapp: "WhatsApp",
  referral: "Referral",
  walk_in: "Walk-in",
  partner: "Partner",
  legacy_import: "Imported",
  other: "Other",
};

export const LEAD_INTENT_LABEL: Record<string, string> = {
  buy_outright: "Buy outright",
  financing: "Financing",
  bulk_purchase: "Bulk purchase",
  services: "Services",
  general: "General interest",
};
