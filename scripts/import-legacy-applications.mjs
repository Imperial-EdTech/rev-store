#!/usr/bin/env node
/**
 * Turns the legacy "revrica-applications" spreadsheet export into one SQL file
 * that loads it into the new database.
 *
 *   node scripts/import-legacy-applications.mjs <export.xlsx> > supabase/imports/<name>.sql
 *
 * Then run the SQL file once in the Supabase SQL editor (after the initial
 * schema). It is a single transaction and refuses to run twice (the import
 * batch label is unique). supabase/imports/ is git-ignored: the output holds
 * personal data.
 *
 * Every record goes through the same database functions as a live form
 * submission (submit_financing_application / submit_lead), so people are
 * matched and cleaned exactly as they would be today. The original date and
 * the import batch are passed in the payload's `import` key.
 *
 * How rows are read
 *   * Payment option "N Months"  → financing application (Teacher Empowerment).
 *       Exact repeats (same email, term and sponsor) keep only the latest.
 *   * Payment option "Buy Outright (Discounted)" → lead, intent buy_outright,
 *       as the live form does.
 *   * Payment option "—" → the early interest sign-up (June–July 2026), which
 *       only collected name, contact, school and role → lead, intent financing.
 *       One lead per person; if that person later applied, the lead is
 *       marked "converted".
 *   * "—" becomes empty, and so does a School answer that isn't a school
 *       ("School", "Independent", a job title): see NOT_A_SCHOOL.
 *   * Dates in the export are Lagos time (UTC+1).
 *
 * A summary is printed to stderr.
 */
import { randomUUID } from "node:crypto";
import { basename } from "node:path";
import XLSX from "xlsx";

const file = process.argv[2];
if (!file) {
  console.error("Usage: node scripts/import-legacy-applications.mjs <export.xlsx>");
  process.exit(1);
}

const PROGRAM_SLUG = "teacher-empowerment";
const LTBT = { slug: "let-there-be-teachers", name: "Let There Be Teachers Laptop Scheme", kind: "partner" };
const BUY_OUTRIGHT = "Buy Outright (Discounted)";
/** Values typed into the School field that aren't a school (placeholders, typos, job titles). */
const NOT_A_SCHOOL = /^(school|independen[a-z]*|none|n\/?a|teacher|ict teacher|director)$/i;

// ─── Reading ─────────────────────────────────────────────────

/** Cell text, trimmed; "—", "-" and blanks become null. */
const text = (v) => {
  const s = String(v ?? "").replace(/\s+/g, " ").trim();
  return s === "" || s === "—" || s === "-" ? null : s;
};

/** "8/27/2026, 5:00:33 PM" (Lagos time) → ISO timestamp with offset. */
function lagosTime(v) {
  if (v instanceof Date) return v.toISOString();
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4}),\s*(\d{1,2}):(\d{2}):(\d{2})\s*(AM|PM)$/i.exec(String(v).trim());
  if (!m) throw new Error(`Unrecognised date: ${v}`);
  const [, mo, d, y, h, mi, s, ap] = m;
  const hour = (Number(h) % 12) + (ap.toUpperCase() === "PM" ? 12 : 0);
  const pad = (n) => String(n).padStart(2, "0");
  return `${y}-${pad(mo)}-${pad(d)}T${pad(hour)}:${mi}:${s}+01:00`;
}

const workbook = XLSX.readFile(file);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { defval: null, raw: false }).map((r, i) => ({
  line: i + 2, // spreadsheet row number, for tracing
  name: text(r["Name"]),
  email: text(r["Email"])?.toLowerCase() ?? null,
  phone: text(r["Phone"]),
  school: text(r["School"]),
  role: text(r["Role"]),
  partner: text(r["Partner Org"]),
  payment: text(r["Payment Option"]),
  state: text(r["State"]),
  lga: text(r["LGA"]),
  position: text(r["Position"]),
  schoolType: text(r["School Type"]),
  salaryBand: text(r["Salary Band"]),
  yearsTeaching: text(r["Years Teaching"]),
  ownsLaptop: text(r["Owns Laptop"]),
  kycConsent: text(r["KYC Consent"]),
  at: lagosTime(r["Date"]),
}));
rows.sort((a, b) => a.at.localeCompare(b.at)); // oldest first, so the newest details win

const isLtbt = (r) => r.partner === LTBT.name;
const termOf = (r) => (r.payment && /^\d+ Months$/.test(r.payment) ? parseInt(r.payment, 10) : null);
const schoolOf = (r) =>
  r.school && !NOT_A_SCHOOL.test(r.school)
    ? { name: r.school, school_type: r.schoolType?.toLowerCase() ?? null, state: r.state, lga: r.lga }
    : null;
const contactOf = (r, jobTitle) => ({
  full_name: r.name, email: r.email, phone: r.phone, state: r.state, lga: r.lga, job_title: jobTitle,
});
const answersOf = (r) => ({
  pathway: isLtbt(r) ? "ltbt" : "individual",
  yearsTeaching: r.yearsTeaching,
  salaryBand: r.salaryBand,
  repayment: r.payment,
  ownsLaptop: r.ownsLaptop,
});

// ─── Sorting rows into records ───────────────────────────────

const unknown = rows.filter((r) => r.payment && r.payment !== BUY_OUTRIGHT && termOf(r) === null);
if (unknown.length) throw new Error(`Unknown payment option on rows ${unknown.map((r) => r.line).join(", ")}`);
const missing = rows.filter((r) => !r.name || !r.email);
if (missing.length) throw new Error(`Name or email missing on rows ${missing.map((r) => r.line).join(", ")}`);

// Applications: collapse exact repeats, keeping the latest.
const applicationsByKey = new Map();
for (const r of rows.filter((r) => termOf(r) !== null)) {
  applicationsByKey.set(`${r.email}|${termOf(r)}|${isLtbt(r)}`, r);
}
const applications = [...applicationsByKey.values()];
const appliedEmails = new Set(applications.map((r) => r.email));

const buyOutright = rows.filter((r) => r.payment === BUY_OUTRIGHT);

// Early interest sign-ups: one per person, dated at their first sign-up.
const interestByEmail = new Map();
for (const r of rows.filter((r) => r.payment === null)) {
  const first = interestByEmail.get(r.email);
  interestByEmail.set(r.email, { ...r, at: first?.at ?? r.at, repeats: (first?.repeats ?? 0) + (first ? 1 : 0) });
}
const interest = [...interestByEmail.values()];

// ─── Payloads ────────────────────────────────────────────────

const batchId = randomUUID();
const importMeta = (at, status) => ({ batch_id: batchId, submitted_at: at, ...(status ? { status } : {}) });

const calls = [
  ...applications.map((r) => ({
    at: r.at, line: r.line, fn: "submit_financing_application",
    payload: {
      contact: contactOf(r, r.position),
      school: schoolOf(r),
      program_slug: PROGRAM_SLUG,
      applicant_type: isLtbt(r) ? "partner_member" : "individual",
      sponsor: isLtbt(r) ? LTBT : null,
      product: null, // the export doesn't say which device
      term_months: termOf(r),
      answers: answersOf(r),
      kyc_consent: r.kycConsent === "Yes",
      import: importMeta(r.at),
    },
  })),
  ...buyOutright.map((r) => ({
    at: r.at, line: r.line, fn: "submit_lead",
    payload: {
      contact: contactOf(r, r.position),
      school: schoolOf(r),
      source: "website_form",
      source_detail: "Teacher Empowerment form: buy outright",
      intent: "buy_outright",
      interests: ["Buy a Laptop Outright"],
      details: { ...answersOf(r), kycConsent: r.kycConsent },
      import: importMeta(r.at),
    },
  })),
  ...interest.map((r) => ({
    at: r.at, line: r.line, fn: "submit_lead",
    payload: {
      contact: contactOf(r, r.role),
      school: schoolOf(r),
      source: "website_form",
      source_detail: "Teacher Empowerment interest sign-up (early form)",
      intent: "financing",
      interests: ["Teacher Empowerment Program"],
      details: { role: r.role },
      import: importMeta(r.at, appliedEmails.has(r.email) ? "converted" : null),
    },
  })),
].sort((a, b) => a.at.localeCompare(b.at));

// ─── SQL ─────────────────────────────────────────────────────

const sqlString = (s) => `'${s.replace(/'/g, "''")}'`;
const source = basename(file);
const label = `Legacy applications export (${source})`;

const out = [
  `-- Generated by scripts/import-legacy-applications.mjs from ${source}.`,
  `-- Contains personal data: do not commit. Run once, after the initial schema.`,
  ``,
  `begin;`,
  ``,
  `insert into public.import_batches (id, label, source_file, notes) values (`,
  `  ${sqlString(batchId)}, ${sqlString(label)}, ${sqlString(source)},`,
  `  ${sqlString(`${rows.length} rows: ${applications.length} financing applications, ${buyOutright.length} buy-outright leads, ${interest.length} early interest leads.`)}`,
  `);`,
  ``,
  ...calls.map((c) => `select public.${c.fn}(${sqlString(JSON.stringify(c.payload))}::jsonb); -- row ${c.line}`),
  ``,
  `commit;`,
  ``,
  `-- What landed:`,
  `select 'financing applications' as record, count(*) from public.financing_applications where import_batch_id = ${sqlString(batchId)}`,
  `union all select 'leads', count(*) from public.leads where import_batch_id = ${sqlString(batchId)}`,
  `union all select 'contacts (all)', count(*) from public.contacts;`,
  ``,
];
process.stdout.write(out.join("\n"));

// ─── Report ──────────────────────────────────────────────────

const report = [
  `Read ${rows.length} rows from ${source}.`,
  `  ${applications.length} financing applications (${rows.filter((r) => termOf(r) !== null).length - applications.length} exact repeat(s) dropped)`,
  `    ${applications.filter(isLtbt).length} via Let There Be Teachers, ${applications.filter((r) => !isLtbt(r)).length} individual`,
  `  ${buyOutright.length} buy-outright leads`,
  `  ${interest.length} early interest leads (${rows.filter((r) => r.payment === null).length - interest.length} repeat sign-up(s) merged), ` +
    `${interest.filter((r) => appliedEmails.has(r.email)).length} marked converted`,
  `  ${new Set(rows.map((r) => r.email)).size} distinct people (by email)`,
  `  ${rows.filter((r) => r.school && NOT_A_SCHOOL.test(r.school)).length} School answers that aren't a school, left empty`,
];
console.error(report.join("\n"));
