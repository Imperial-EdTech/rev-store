/**
 * Contact and payment details used across the storefront.
 * Change them here only; nothing else should hard-code a number or account.
 */

/** International format, no "+" or spaces (wa.me requires this). */
export const WHATSAPP_NUMBER = "2348136117198";

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
  bankName: "Sterling Bank",
  accountName: "Revrica Technology Ltd",
  accountNumber: "0123456789",
};

export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function mailtoLink(subject: string, body: string): string {
  return `mailto:${ORDERS_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
