import "server-only";
import { dbFailure, getDb, notConfigured, type Result } from "@/lib/db";
import { SCHOOL_DEVICE_TYPES, SCHOOL_PURPOSES } from "@/lib/school-enquiry";
import type { LeadStatus } from "@/lib/statuses";
import type { Lead, LeadRequest } from "./schema";

const labelOf = (list: readonly { id: string; label: string }[], id: string) => list.find((x) => x.id === id)?.label ?? id;

/** Turns a validated form submission into the submit_lead payload. */
function toPayload(req: LeadRequest) {
  if (req.kind === "waitlist") {
    return {
      contact: { full_name: req.fullName, email: req.email, phone: req.phone, job_title: req.role },
      source: "website_waitlist",
      source_detail: "Early-access waitlist",
      intent: req.interests.some((i) => /financ|empowerment/i.test(i)) ? "financing"
        : req.interests.includes("Buy a Laptop Outright") ? "buy_outright" : "general",
      interests: req.interests,
      device_count: req.deviceCount ?? null,
      details: { organization: req.organization, role: req.role, notes: req.notes ?? undefined },
    };
  }
  return {
    contact: { full_name: req.contactName, email: req.email, phone: req.phone, job_title: req.role },
    school: { name: req.schoolName },
    source: "school_enquiry",
    source_detail: "School device enquiry",
    intent: req.financingInterest === "yes" || req.financingInterest === "maybe" ? "financing" : "bulk_purchase",
    interests: req.deviceTypes.map((id) => labelOf(SCHOOL_DEVICE_TYPES, id)),
    device_count: req.estimatedCount ?? null,
    details: {
      role: req.role,
      purposes: req.purposes.map((id) => labelOf(SCHOOL_PURPOSES, id)),
      financingInterest: req.financingInterest ?? undefined,
      comments: req.comments ?? undefined,
    },
  };
}

export async function submitLead(req: LeadRequest): Promise<Result<{ id: string }>> {
  const db = getDb();
  if (!db) return notConfigured;
  const { data, error } = await db.rpc("submit_lead", { p: toPayload(req) });
  if (error) return dbFailure("leads: submit", error, "Could not save your details. Please try again.");
  return { ok: true, value: { id: data.id as string } };
}

type LeadRow = {
  id: string; status: LeadStatus; source: string; source_detail: string | null; intent: string;
  interests: string[]; product_id: string | null; device_count: number | null; details: Record<string, unknown>;
  created_at: string; status_changed_at: string;
  contacts: { id: string; full_name: string; email: string | null; phone: string | null; state: string | null; job_title: string | null };
  organizations: { name: string } | null;
  import_batches: { label: string } | null;
};

export async function listLeads(): Promise<Result<Lead[]>> {
  const db = getDb();
  if (!db) return notConfigured;
  const { data, error } = await db
    .from("leads")
    .select(`
      id, status, source, source_detail, intent, interests, product_id, device_count, details, created_at, status_changed_at,
      contacts ( id, full_name, email, phone, state, job_title ),
      organizations ( name ),
      import_batches ( label )`)
    .order("created_at", { ascending: false })
    .limit(5000);
  if (error) return dbFailure("leads: list", error, "Could not load leads.");
  return {
    ok: true,
    value: (data as unknown as LeadRow[]).map((r) => ({
      id: r.id,
      status: r.status,
      source: r.source,
      sourceDetail: r.source_detail,
      intent: r.intent,
      interests: r.interests ?? [],
      productId: r.product_id,
      deviceCount: r.device_count,
      details: r.details ?? {},
      createdAt: r.created_at,
      statusChangedAt: r.status_changed_at,
      importedFrom: r.import_batches?.label ?? null,
      contact: {
        id: r.contacts.id, name: r.contacts.full_name, email: r.contacts.email, phone: r.contacts.phone,
        state: r.contacts.state, jobTitle: r.contacts.job_title,
      },
      organization: r.organizations?.name ?? null,
    })),
  };
}
