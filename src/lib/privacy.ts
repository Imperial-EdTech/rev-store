import { CONTACT } from "@/lib/contact";

/**
 * Facts the privacy policy (/privacy) and the forms' privacy notices state.
 * Change them here only.
 *
 * ⚠ Have your Data Protection Officer confirm every value marked CONFIRM
 * before relying on the policy. When anything here changes, update
 * `lastUpdated`, and if the nominations section changes, bump
 * NOMINATION_NOTICE_VERSION in src/lib/nominations/schema.ts.
 */
export const PRIVACY = {
  lastUpdated: "8 October 2026",
  /** CONFIRM: the legal entity that decides why and how the data is used (the "data controller"). */
  controller: "Revrica Technologies Limited",
  /** Partner named alongside the controller in campaign copy. */
  partner: "Imperial Edtech",
  address: CONTACT.address,
  /** CONFIRM: ideally a dedicated address the DPO monitors, e.g. privacy@revrica.com. */
  contactEmail: CONTACT.supportEmail,
  /** CONFIRM: how long each kind of record is kept. */
  nominationRetention: "up to 6 months after the campaign ends",
  retention: {
    orders: "6 years after the order, as required for tax and accounting records",
    applications: "for the length of any financing agreement plus 6 years; declined or withdrawn applications for 12 months",
    leads: "24 months after our last contact with you, unless you ask us to delete them sooner",
    audits: "24 months after the audit",
    nominations: "up to 6 months after the campaign ends; the winner's details for as long as needed to deliver and record the prize",
  },
} as const;
