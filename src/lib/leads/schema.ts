import { z } from "zod";
import { interests, roles } from "@/lib/data";
import {
  FINANCING_INTEREST, SCHOOL_DEVICE_TYPES, SCHOOL_PURPOSES, SCHOOL_ROLES,
  type SchoolDeviceTypeId, type SchoolPurposeId,
} from "@/lib/school-enquiry";
import type { LeadStatus } from "@/lib/statuses";
import { emailAddress, optionalCount, optionalText, phoneNumber } from "@/lib/validation";

/**
 * Public lead submissions accepted by POST /api/leads. The forms validate with
 * these same schemas, so they show the server's exact rules and messages.
 */

const deviceTypeIds = SCHOOL_DEVICE_TYPES.map((d) => d.id) as [SchoolDeviceTypeId, ...SchoolDeviceTypeId[]];
const purposeIds = SCHOOL_PURPOSES.map((p) => p.id) as [SchoolPurposeId, ...SchoolPurposeId[]];

/** Early-access waitlist (/early-access). */
export const waitlistLeadSchema = z.object({
  kind: z.literal("waitlist"),
  fullName: z.string().trim().min(2, "Enter your full name").max(160),
  email: emailAddress,
  phone: phoneNumber,
  organization: z.string().trim().min(2, "Enter your school or organisation").max(200),
  role: z.enum(roles, { errorMap: () => ({ message: "Select your role" }) }),
  interests: z.array(z.enum(interests)).min(1, "Select at least one interest").max(interests.length),
  deviceCount: optionalCount("Enter a whole number of devices"),
  notes: optionalText(2000),
});

/** School device enquiry (/apply/school). */
export const schoolLeadSchema = z.object({
  kind: z.literal("school"),
  contactName: z.string().trim().min(2, "Enter your name").max(160),
  email: emailAddress,
  phone: phoneNumber,
  schoolName: z.string().trim().min(2, "Enter your school name").max(200),
  role: z.enum(SCHOOL_ROLES, { errorMap: () => ({ message: "Select your role" }) }),
  deviceTypes: z.array(z.enum(deviceTypeIds)).min(1, "Select at least one device type"),
  estimatedCount: optionalCount("Enter a whole number of devices"),
  purposes: z.array(z.enum(purposeIds)).min(1, "Select at least one purpose"),
  financingInterest: z.enum(FINANCING_INTEREST).optional(),
  comments: optionalText(2000),
});

export type WaitlistLead = z.infer<typeof waitlistLeadSchema>;
export type SchoolLead = z.infer<typeof schoolLeadSchema>;

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
