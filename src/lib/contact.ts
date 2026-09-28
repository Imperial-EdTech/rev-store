/**
 * Contact and payment details used across the site.
 * Change them here only; nothing else should hard-code a number, address or account.
 */

export const CONTACT = {
  /** Display format. */
  phone: "+234 813 611 7759",
  /** International format, no "+" or spaces (tel: and wa.me require this). */
  phoneE164: "2348136117759",
  supportEmail: "support@revrica.com",
  address: "32, Alh. Kofoworola Cresc., Off Awolowo Way, Ikeja, Lagos",
} as const;

/** WhatsApp line that receives order confirmations and product enquiries. */
export const WHATSAPP_NUMBER = CONTACT.phoneE164;

export const ORDERS_EMAIL = "orders@revrica.com";

export type BankAccount = {
  bankName: string;
  accountName: string;
  accountNumber: string;
};

/**
 * Collection account shown at checkout. Set to null to hide bank details;
 * checkout then asks customers to send their order on WhatsApp and wait for
 * payment details instead.
 */
export const BANK_ACCOUNT: BankAccount | null = {
  bankName: "Providus Unitybank Limited",
  accountName: "Revrica Technologies Limited",
  accountNumber: "1306627034",
};

export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function mailtoLink(subject: string, body: string): string {
  return `mailto:${ORDERS_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
