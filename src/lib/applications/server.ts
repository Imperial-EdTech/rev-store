import "server-only";
import { displayName, getProduct } from "@/lib/catalog";
import { dbFailure, getDb, notConfigured, type Result } from "@/lib/db";
import { GOVERNMENT_BODIES } from "@/lib/organizations";
import { PARTNERS } from "@/lib/partners";
import type { ApplicationStatus } from "@/lib/statuses";
import { BUY_OUTRIGHT, type FinancingApplication, type TeacherApplication } from "./schema";

const PROGRAM_SLUG = "teacher-empowerment";
const LTBT = PARTNERS.find((p) => p.id === "let-there-be-teachers")!;

export type SubmissionOutcome =
  | { kind: "application"; ref: string }
  | { kind: "lead" };

/**
 * A Teacher Empowerment form submission. A financing term creates a
 * financing application; "Buy outright" is a sales lead instead, because
 * there's nothing to approve.
 */
export async function submitTeacherApplication(a: TeacherApplication): Promise<Result<SubmissionOutcome>> {
  const db = getDb();
  if (!db) return notConfigured;

  // Only trust a device id that exists in the catalogue.
  const product = a.deviceId ? getProduct(a.deviceId) : undefined;
  const termMonths = parseInt(a.repaymentTenor, 10);
  const contact = {
    full_name: a.fullName,
    email: a.email,
    phone: a.phone,
    gender: a.gender.toLowerCase(),
    state: a.state,
    lga: a.lga,
    job_title: a.position,
  };
  const school = { name: a.schoolName, school_type: a.schoolType.toLowerCase(), state: a.state, lga: a.lga };
  const answers = {
    pathway: a.applyAs,
    trcnNumber: a.applyAs === "government" ? a.trcnNumber : undefined,
    yearsTeaching: a.yearsTeaching,
    salaryBand: a.salaryBand,
    repayment: a.repaymentTenor,
    monthlyBudget: a.monthlyBudget || undefined,
    ownsLaptop: a.ownsLaptop,
    whyLaptop: a.whyLaptop,
  };

  if (a.repaymentTenor === BUY_OUTRIGHT) {
    const { error } = await db.rpc("submit_lead", {
      p: {
        contact,
        school,
        source: "website_form",
        source_detail: "Teacher Empowerment form: buy outright",
        intent: "buy_outright",
        interests: ["Buy a Laptop Outright"],
        product_id: product?.id ?? null,
        details: answers,
      },
    });
    if (error) return dbFailure("applications: buy-outright lead", error, "Could not submit your application. Please try again.");
    return { ok: true, value: { kind: "lead" } };
  }

  // The sponsoring organisation is created in the database on first use; its
  // name comes from code, so partners.ts / organizations.ts stay the source.
  let sponsor: { slug: string; name: string; kind: "partner" | "government_body" } | null = null;
  if (a.applyAs === "ltbt") sponsor = { slug: LTBT.id, name: LTBT.name, kind: "partner" };
  if (a.applyAs === "government") {
    const body = GOVERNMENT_BODIES.find((b) => b.id === a.governmentBodyId);
    if (!body) return { ok: false, status: 400, error: "Select your government body." };
    sponsor = { slug: body.id, name: body.name, kind: "government_body" };
  }

  // The application keeps the device and repayment agreed today, so later
  // catalogue changes don't rewrite it.
  const plan = product?.financing?.find((p) => p.months === termMonths);

  const { data, error } = await db.rpc("submit_financing_application", {
    p: {
      contact,
      school,
      program_slug: PROGRAM_SLUG,
      product: product && plan ? { id: product.id, name: displayName(product) } : null,
      term_months: termMonths,
      monthly_amount: plan?.monthly ?? null,
      applicant_type: a.applyAs === "ltbt" ? "partner_member" : a.applyAs === "government" ? "government_staff" : "individual",
      sponsor,
      answers,
      kyc_consent: a.kycConsent === "Yes",
    },
  });
  if (error) return dbFailure("applications: submit", error, "Could not submit your application. Please try again.");
  return { ok: true, value: { kind: "application", ref: data.ref as string } };
}

// ─── Reading ──────────────────────────────────────────────────

const APPLICATION_SELECT = `
  id, ref, status, applicant_type, product_id, product_name, requested_term_months, monthly_amount,
  answers, kyc_consent, created_at, status_changed_at,
  contacts ( id, full_name, email, phone, gender, state, lga, job_title ),
  financing_programs ( name ),
  sponsor:organizations!financing_applications_sponsor_organization_id_fkey ( slug, name ),
  school:organizations!financing_applications_school_organization_id_fkey ( name ),
  import_batches ( label )`;

type ApplicationRow = {
  id: string; ref: string; status: ApplicationStatus; applicant_type: FinancingApplication["applicantType"];
  product_id: string | null; product_name: string | null; requested_term_months: number;
  monthly_amount: number | string | null; answers: Record<string, unknown>; kyc_consent: boolean;
  created_at: string; status_changed_at: string;
  contacts: {
    id: string; full_name: string; email: string | null; phone: string | null; gender: string | null;
    state: string | null; lga: string | null; job_title: string | null;
  };
  financing_programs: { name: string };
  sponsor: { slug: string | null; name: string } | null;
  school: { name: string } | null;
  import_batches: { label: string } | null;
};

function toApplication(r: ApplicationRow): FinancingApplication {
  return {
    id: r.id,
    ref: r.ref,
    status: r.status,
    applicantType: r.applicant_type,
    sponsor: r.sponsor?.name ?? null,
    program: r.financing_programs.name,
    product: r.product_id && r.product_name ? { id: r.product_id, name: r.product_name } : null,
    termMonths: r.requested_term_months,
    monthlyAmount: r.monthly_amount === null ? null : Number(r.monthly_amount),
    answers: r.answers ?? {},
    kycConsent: r.kyc_consent,
    createdAt: r.created_at,
    statusChangedAt: r.status_changed_at,
    importedFrom: r.import_batches?.label ?? null,
    contact: {
      id: r.contacts.id, name: r.contacts.full_name, email: r.contacts.email, phone: r.contacts.phone,
      gender: r.contacts.gender, state: r.contacts.state, lga: r.contacts.lga, jobTitle: r.contacts.job_title,
    },
    school: r.school?.name ?? null,
  };
}

/**
 * All applications (admin), or only those sponsored by one organisation
 * (partner portal: filtering happens here, so a partner never receives
 * anyone else's applicants).
 */
export async function listApplications(filter?: { sponsorSlug: string }): Promise<Result<FinancingApplication[]>> {
  const db = getDb();
  if (!db) return notConfigured;

  let query = db.from("financing_applications").select(APPLICATION_SELECT);
  if (filter) {
    const { data: org, error } = await db.from("organizations").select("id").eq("slug", filter.sponsorSlug).maybeSingle();
    if (error) return dbFailure("applications: sponsor lookup", error, "Could not load applications.");
    if (!org) return { ok: true, value: [] };
    query = query.eq("sponsor_organization_id", org.id);
  }

  const { data, error } = await query.order("created_at", { ascending: false }).limit(5000);
  if (error) return dbFailure("applications: list", error, "Could not load applications.");
  return { ok: true, value: (data as unknown as ApplicationRow[]).map(toApplication) };
}

export async function getApplication(id: string): Promise<Result<FinancingApplication>> {
  const db = getDb();
  if (!db) return notConfigured;
  const { data, error } = await db.from("financing_applications").select(APPLICATION_SELECT).eq("id", id).maybeSingle();
  if (error) return dbFailure("applications: get", error, "Could not load the application.");
  if (!data) return { ok: false, status: 404, error: "Not found." };
  return { ok: true, value: toApplication(data as unknown as ApplicationRow) };
}
