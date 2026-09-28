import "server-only";
import { displayName, getProduct } from "@/lib/catalog";
import { dbFailure, getDb, notConfigured, type Result } from "@/lib/db";
import { getGovernmentBody } from "@/lib/organizations";
import { getPartner } from "@/lib/partners";
import type { ApplicationStatus } from "@/lib/statuses";
import { BUY_OUTRIGHT, type FinancingApplication, type SubmissionOutcome, type TeacherApplication } from "./schema";

const PROGRAM_SLUG = "teacher-empowerment";
const LTBT = getPartner("let-there-be-teachers")!;

type Sponsor = { slug: string; name: string; kind: "partner" | "government_body" };

/** Who backs the application. Created in the database on first use, named from code. */
function sponsorOf(a: TeacherApplication): Sponsor | null {
  switch (a.applyAs) {
    case "individual":
      return null;
    case "ltbt":
      return { slug: LTBT.id, name: LTBT.name, kind: "partner" };
    case "government": {
      const body = getGovernmentBody(a.governmentBodyId);
      return { slug: body.id, name: body.name, kind: "government_body" };
    }
  }
}

const APPLICANT_TYPE: Record<TeacherApplication["applyAs"], FinancingApplication["applicantType"]> = {
  individual: "individual",
  ltbt: "partner_member",
  government: "government_staff",
};

/**
 * A Teacher Empowerment form submission. A repayment term creates a financing
 * application; "Buy outright" is a purchase lead instead, because there's
 * nothing to approve.
 */
export async function submitTeacherApplication(a: TeacherApplication): Promise<Result<SubmissionOutcome>> {
  const db = getDb();
  if (!db) return notConfigured;

  // Only trust a device id that exists in the catalogue.
  const product = a.deviceId ? getProduct(a.deviceId) : undefined;

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
    monthlyBudget: a.monthlyBudget,
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
    return { ok: true, value: { kind: "purchase" } };
  }

  // The application keeps the device and repayment on offer today, so later
  // catalogue changes don't rewrite it. A device that can't be financed isn't attached.
  const termMonths = parseInt(a.repaymentTenor, 10);
  const plan = product?.financing?.find((p) => p.months === termMonths);

  const { data, error } = await db.rpc("submit_financing_application", {
    p: {
      contact,
      school,
      program_slug: PROGRAM_SLUG,
      applicant_type: APPLICANT_TYPE[a.applyAs],
      sponsor: sponsorOf(a),
      product: product && plan ? { id: product.id, name: displayName(product) } : null,
      term_months: termMonths,
      monthly_amount: plan?.monthly ?? null,
      answers,
      kyc_consent: a.kycConsent === "Yes",
    },
  });
  if (error) return dbFailure("applications: submit", error, "Could not submit your application. Please try again.");
  return { ok: true, value: { kind: "application", ref: data.ref as string } };
}

// ─── Reading ──────────────────────────────────────────────────

/** `sponsorJoin` is "!inner" when filtering by sponsor, so only matching rows come back. */
const applicationSelect = (sponsorJoin: "" | "!inner") => `
  id, ref, status, applicant_type, product_id, product_name, requested_term_months, monthly_amount,
  answers, kyc_consent, created_at, status_changed_at,
  contacts ( id, full_name, email, phone, gender, state, lga, job_title ),
  financing_programs ( name ),
  sponsor:organizations!financing_applications_sponsor_organization_id_fkey${sponsorJoin} ( slug, name ),
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
  sponsor: { slug: string; name: string } | null;
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
    answers: r.answers,
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
 * (partner portal: filtering happens in the query, so a partner never
 * receives anyone else's applicants).
 */
export async function listApplications(filter?: { sponsorSlug: string }): Promise<Result<FinancingApplication[]>> {
  const db = getDb();
  if (!db) return notConfigured;

  let query = db.from("financing_applications").select(applicationSelect(filter ? "!inner" : ""));
  if (filter) query = query.eq("sponsor.slug", filter.sponsorSlug);

  const { data, error } = await query.order("created_at", { ascending: false }).limit(5000);
  if (error) return dbFailure("applications: list", error, "Could not load applications.");
  return { ok: true, value: (data as unknown as ApplicationRow[]).map(toApplication) };
}

export async function getApplication(id: string): Promise<Result<FinancingApplication>> {
  const db = getDb();
  if (!db) return notConfigured;
  const { data, error } = await db.from("financing_applications").select(applicationSelect("")).eq("id", id).maybeSingle();
  if (error) return dbFailure("applications: get", error, "Could not load the application.");
  if (!data) return { ok: false, status: 404, error: "Not found." };
  return { ok: true, value: toApplication(data as unknown as ApplicationRow) };
}
