/**
 * Partner organisations that can view their own applicants in /partners.
 * `id` is the partner organisation's slug in the database (created there the
 * first time a member applies): applications are linked to it via
 * financing_applications.sponsor_organization_id.
 * Safe to import anywhere: passcodes are NOT here. Each partner's passcode
 * lives in a server-only environment variable (see lib/auth/credentials.ts).
 */
export type Partner = {
  id: string;
  name: string;
  /** Server environment variable holding this partner's passcode. */
  passcodeEnv: string;
};

export const PARTNERS: readonly Partner[] = [
  {
    id: "let-there-be-teachers",
    name: "Let There Be Teachers Laptop Scheme",
    passcodeEnv: "PARTNER_LTBT_PASSCODE",
  },
];

export function getPartner(id: string): Partner | undefined {
  return PARTNERS.find((p) => p.id === id);
}

/** One applicant as the partner portal shows it (no contact or financial details). */
export type PartnerApplicant = {
  ref: string;
  name: string;
  school: string | null;
  state: string | null;
  device: string | null;
  termMonths: number | null;
  status: string;
  statusLabel: string;
  createdAt: string;
};
