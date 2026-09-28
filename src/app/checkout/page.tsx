"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft, Check, CheckCircle2, ChevronRight, Copy, Mail, MessageCircle, Package, Truck,
} from "lucide-react";
import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { clsx } from "clsx";
import { StorefrontHeader } from "@/components/StorefrontHeader";
import { useCart } from "@/lib/cart/cart-context";
import { displayName, formatNaira } from "@/lib/catalog";
import { BANK_ACCOUNT, CONTACT, mailtoLink, whatsappLink } from "@/lib/contact";
import { buyerSchema, type Buyer, type OrderLine } from "@/lib/orders/schema";
import { fieldErrors } from "@/lib/validation";
import styles from "./checkout.module.css";

// ─── Types ────────────────────────────────────────────────────
type BuyerErrors = Partial<Record<keyof Buyer, string>>;

/** The saved order as confirmed by the server (prices recalculated there). */
type OrderSnapshot = { ref: string; lines: OrderLine[]; total: number };

const EMPTY_BUYER: Buyer = { name: "", phone: "", email: "", fulfillment: "pickup", address: "" };
const STEPS = ["Your details", "Payment", "Confirmation"] as const;

// ─── Helpers ──────────────────────────────────────────────────
function buildOrderMessage(order: OrderSnapshot, buyer: Buyer): string {
  const paid = BANK_ACCOUNT !== null;
  const lines = order.lines.map((l) => `• ${l.qty} × ${l.name} — ${formatNaira(l.lineTotal)}`).join("\n");
  const fulfillment =
    buyer.fulfillment === "pickup" ? `Pickup from ${CONTACT.address}` : `Delivery to: ${buyer.address.trim()}`;
  const payment = BANK_ACCOUNT
    ? `Paid to: ${BANK_ACCOUNT.bankName}, ${BANK_ACCOUNT.accountName}, ${BANK_ACCOUNT.accountNumber}`
    : "Please send me payment details.";

  return [
    paid ? "Hi Revrica! I've paid for my RevStore order." : "Hi Revrica! I'd like to place this RevStore order.",
    "",
    `Order ref: ${order.ref}`,
    "",
    lines,
    `Total: ${formatNaira(order.total)}`,
    "",
    `Name: ${buyer.name.trim()}`,
    `Phone: ${buyer.phone.trim()}`,
    `Email: ${buyer.email.trim()}`,
    `Fulfilment: ${fulfillment}`,
    "",
    payment,
    paid ? "Please confirm my order. Thank you!" : "Thank you!",
  ].join("\n");
}

// ─── Small pieces ─────────────────────────────────────────────
function CopyValue({ label, value, display }: { label: string; value: string; display?: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* Clipboard blocked: the value is still visible to copy by hand. */
    }
  }
  return (
    <div className={styles.copyRow}>
      <div>
        <p className={styles.copyLabel}>{label}</p>
        <p className={styles.copyValue}>{display ?? value}</p>
      </div>
      <button aria-label={`Copy ${label.toLowerCase()}`} className={styles.copyButton} onClick={copy} type="button">
        {copied ? <Check aria-hidden size={15} /> : <Copy aria-hidden size={15} />}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

function Field({
  label, error, children, hint,
}: {
  label: string; error?: string; children: React.ReactNode; hint?: string;
}) {
  return (
    <label className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      {children}
      {error ? <span className={styles.fieldError}>{error}</span> : hint ? <span className={styles.fieldHint}>{hint}</span> : null}
    </label>
  );
}

// ─── Page ─────────────────────────────────────────────────────
export default function CheckoutPage() {
  const cart = useCart();
  const [buyer, setBuyer] = useState<Buyer>(EMPTY_BUYER);
  const [errors, setErrors] = useState<BuyerErrors>({});
  const [order, setOrder] = useState<OrderSnapshot | null>(null);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // One key per checkout visit: resubmitting after "Edit details" updates the
  // same order on the server instead of creating a duplicate.
  const clientKey = useRef<string | null>(null);

  const step = done ? 2 : order ? 1 : 0;

  function update<K extends keyof Buyer>(key: K, value: Buyer[K]) {
    setBuyer((b) => ({ ...b, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function toPayment(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    const parsed = buyerSchema.safeParse(buyer);
    if (!parsed.success) {
      const found = fieldErrors<keyof Buyer>(parsed.error);
      setErrors(found);
      // Move focus to the first field with a problem.
      const first = (["name", "phone", "email", "address"] as const).find((k) => found[k]);
      if (first) document.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setErrors({});

    clientKey.current ??= crypto.randomUUID();
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientKey: clientKey.current,
          buyer: parsed.data,
          items: cart.items.map((i) => ({ productId: i.product.id, qty: i.qty })),
        }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok || !body?.order) {
        setSubmitError(body?.error ?? "We couldn’t place your order. Please try again.");
        return;
      }
      setOrder({ ref: body.order.ref, lines: body.order.items, total: body.order.total });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSubmitError("We couldn’t reach our server. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  /** The order is complete once the confirmation is sent, so the cart can be emptied. */
  function markSent() {
    cart.clear();
    setDone(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const message = order ? buildOrderMessage(order, buyer) : "";
  // Used only if saving the order fails, so the customer can still reach us.
  const fallbackMessage = [
    "Hi Revrica! I'd like to order:",
    ...cart.items.map((i) => `• ${i.qty} × ${displayName(i.product)}`),
    `Total: ${formatNaira(cart.subtotal)}`,
    `Name: ${buyer.name.trim()}`,
  ].join("\n");
  const waHref = order ? whatsappLink(message) : "#";
  const mailHref = order ? mailtoLink(`RevStore order ${order.ref}`, message) : "#";

  // ── Guards ──
  if (!cart.hydrated && !order) {
    return (
      <div className={styles.page}>
        <StorefrontHeader showInfoBar={false} />
        <div aria-busy="true" className={styles.container} />
      </div>
    );
  }
  if (!order && cart.items.length === 0) {
    return (
      <div className={styles.page}>
        <StorefrontHeader showInfoBar={false} />
        <div className={styles.container}>
          <div className={styles.emptyCard}>
            <h1>Your cart is empty</h1>
            <p>Add a laptop from the shop to check out.</p>
            <Link className={styles.primaryButton} href="/products">Browse the shop</Link>
          </div>
        </div>
      </div>
    );
  }

  // What the summary shows: the frozen order once created, otherwise the live cart.
  const summaryLines: OrderLine[] = order
    ? order.lines
    : cart.items.map((i) => ({
        productId: i.product.id,
        name: displayName(i.product),
        qty: i.qty,
        unitPrice: i.product.price,
        lineTotal: i.lineTotal,
      }));
  const summaryTotal = order ? order.total : cart.subtotal;

  return (
    <div className={styles.page}>
      <StorefrontHeader showInfoBar={false} />

      <div className={styles.container}>
        <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
          <Link href="/products">Shop</Link>
          <ChevronRight aria-hidden size={14} />
          <Link href="/cart">Cart</Link>
          <ChevronRight aria-hidden size={14} />
          <span aria-current="page">Checkout</span>
        </nav>

        <h1 className={styles.title}>Checkout</h1>

        <ol aria-label="Checkout progress" className={styles.steps}>
          {STEPS.map((label, i) => (
            <li
              aria-current={i === step ? "step" : undefined}
              className={clsx(i < step && styles.stepDone, i === step && styles.stepActive)}
              key={label}
            >
              <span className={styles.stepDot}>{i < step ? <Check aria-hidden size={13} /> : i + 1}</span>
              {label}
            </li>
          ))}
        </ol>

        <div className={styles.layout}>
          <div className={styles.card}>
            <AnimatePresence initial={false} mode="wait">
              {/* ── Step 1: details ── */}
              {step === 0 && (
                <motion.form
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                  key="details"
                  noValidate
                  onSubmit={toPayment}
                >
                  <h2 className={styles.cardTitle}>Your details</h2>
                  <p className={styles.cardLead}>We use these to confirm your order and arrange handover.</p>

                  <div className={styles.fieldGrid}>
                    <Field error={errors.name} label="Full name">
                      <input autoComplete="name" aria-invalid={Boolean(errors.name)} name="name" onChange={(e) => update("name", e.target.value)} value={buyer.name} />
                    </Field>
                    <Field error={errors.phone} hint="We’ll confirm your order on this number" label="Phone number">
                      <input autoComplete="tel" inputMode="tel" aria-invalid={Boolean(errors.phone)} name="phone" onChange={(e) => update("phone", e.target.value)} placeholder="+234" value={buyer.phone} />
                    </Field>
                    <Field error={errors.email} label="Email address">
                      <input autoComplete="email" inputMode="email" aria-invalid={Boolean(errors.email)} name="email" onChange={(e) => update("email", e.target.value)} type="email" value={buyer.email} />
                    </Field>
                  </div>

                  <fieldset className={styles.fulfillment}>
                    <legend className={styles.fieldLabel}>How would you like to receive your order?</legend>
                    <div className={styles.choiceGrid}>
                      {([
                        ["pickup", "Pickup", `Collect from ${CONTACT.address}`, Package],
                        ["delivery", "Delivery", "We deliver to your address", Truck],
                      ] as const).map(([value, label, sub, Icon]) => (
                        <label className={clsx(styles.choice, buyer.fulfillment === value && styles.choiceActive)} key={value}>
                          <input
                            checked={buyer.fulfillment === value}
                            className={styles.srOnly}
                            name="fulfillment"
                            onChange={() => update("fulfillment", value)}
                            type="radio"
                            value={value}
                          />
                          <Icon aria-hidden size={20} />
                          <span>
                            <strong>{label}</strong>
                            <small>{sub}</small>
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  {buyer.fulfillment === "delivery" && (
                    <Field error={errors.address} label="Delivery address">
                      <textarea
                        autoComplete="street-address"
                        aria-invalid={Boolean(errors.address)} name="address"
                        onChange={(e) => update("address", e.target.value)}
                        placeholder="Street, area, city and state"
                        rows={3}
                        value={buyer.address}
                      />
                    </Field>
                  )}

                  <div className={styles.actions}>
                    <Link className={styles.backLink} href="/cart"><ArrowLeft aria-hidden size={15} /> Back to cart</Link>
                    <button className={styles.primaryButton} disabled={submitting} type="submit">
                      {submitting ? "Placing order…" : "Continue to payment"}
                    </button>
                  </div>

                  {submitError && (
                    <div className={styles.submitError} role="alert">
                      <p>{submitError}</p>
                      <a href={whatsappLink(fallbackMessage)} rel="noopener noreferrer" target="_blank">
                        Or send your order to us on WhatsApp
                      </a>
                    </div>
                  )}
                </motion.form>
              )}

              {/* ── Step 2: payment ── */}
              {step === 1 && order && (
                <motion.div animate={{ opacity: 1 }} exit={{ opacity: 0 }} initial={{ opacity: 0 }} key="payment">
                  <h2 className={styles.cardTitle}>Payment</h2>

                  {BANK_ACCOUNT ? (
                    <>
                      <p className={styles.cardLead}>
                        Transfer exactly <strong>{formatNaira(order.total)}</strong> and use your order reference as the
                        transfer narration. Then send us your confirmation on WhatsApp.
                      </p>
                      <div className={styles.bankCard}>
                        <CopyValue label="Amount" display={formatNaira(order.total)} value={String(order.total)} />
                        <CopyValue label="Bank" value={BANK_ACCOUNT.bankName} />
                        <CopyValue label="Account name" value={BANK_ACCOUNT.accountName} />
                        <CopyValue label="Account number" value={BANK_ACCOUNT.accountNumber} />
                        <CopyValue label="Narration (order reference)" value={order.ref} />
                      </div>
                    </>
                  ) : (
                    <>
                      <p className={styles.cardLead}>
                        Send your order to us on WhatsApp. Our team will reply with the account to pay into and confirm
                        availability. Keep your order reference handy.
                      </p>
                      <div className={styles.bankCard}>
                        <CopyValue label="Order reference" value={order.ref} />
                        <CopyValue label="Amount" display={formatNaira(order.total)} value={String(order.total)} />
                      </div>
                    </>
                  )}

                  <div className={styles.sendButtons}>
                    <a className={styles.whatsappButton} href={waHref} onClick={markSent} rel="noopener noreferrer" target="_blank">
                      <MessageCircle aria-hidden size={18} />
                      {BANK_ACCOUNT ? "I’ve paid, send confirmation on WhatsApp" : "Send order on WhatsApp"}
                    </a>
                    <a className={styles.secondaryButton} href={mailHref} onClick={markSent}>
                      <Mail aria-hidden size={16} /> Send by email instead
                    </a>
                  </div>

                  <div className={styles.actions}>
                    <button className={styles.backLink} onClick={() => setOrder(null)} type="button">
                      <ArrowLeft aria-hidden size={15} /> Edit details
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── Step 3: sent ── */}
              {step === 2 && order && (
                <motion.div animate={{ opacity: 1 }} className={styles.doneBlock} initial={{ opacity: 0 }} key="done">
                  <CheckCircle2 aria-hidden className={styles.doneIcon} size={44} />
                  <h2 className={styles.cardTitle}>Order {order.ref} sent</h2>
                  <p className={styles.cardLead}>
                    We’ve opened your confirmation message. Once you send it, our team will reply on WhatsApp to confirm
                    your order{buyer.fulfillment === "delivery" ? " and delivery" : " and pickup"}.
                  </p>
                  <p className={styles.resend}>
                    Didn’t send? <a href={waHref} rel="noopener noreferrer" target="_blank">Open WhatsApp again</a>
                    {" "}or <a href={mailHref}>send by email</a>.
                  </p>
                  <Link className={styles.primaryButton} href="/products">Back to the shop</Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <aside aria-labelledby="co-summary" className={styles.summary}>
            <h2 id="co-summary">Order summary</h2>
            <ul>
              {summaryLines.map((l) => (
                <li key={l.productId}>
                  <span className={styles.summaryName}>
                    {l.name}
                    <small>{l.qty} × {formatNaira(l.unitPrice)}</small>
                  </span>
                  <span className={styles.summaryAmount}>{formatNaira(l.lineTotal)}</span>
                </li>
              ))}
            </ul>
            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>{formatNaira(summaryTotal)}</span>
            </div>
            {order && <p className={styles.summaryRef}>Order reference <strong>{order.ref}</strong></p>}
          </aside>
        </div>
      </div>
    </div>
  );
}
