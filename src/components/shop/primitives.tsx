"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Ban, Check, ImageOff, MessageCircle, Minus, Plus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { clsx } from "clsx";
import { MAX_QTY_PER_LINE, useCart } from "@/lib/cart/cart-context";
import { productEnquiryMessage, STOCK_LABEL, type Product, type StockStatus } from "@/lib/catalog";
import { whatsappLink } from "@/lib/contact";
import styles from "./shop.module.css";

// ─── Stock pill ───────────────────────────────────────────────
const PILL_CLASS: Record<StockStatus, string> = {
  in_stock: styles.pillOk,
  on_request: styles.pillWarn,
  out_of_stock: styles.pillBad,
};

export function StockPill({ status, className }: { status: StockStatus; className?: string }) {
  return (
    <span className={clsx(styles.pill, PILL_CLASS[status], className)}>
      <span aria-hidden className={styles.pillDot} />
      {STOCK_LABEL[status]}
    </span>
  );
}

// ─── Product image (falls back to a neutral placeholder) ──────
export function ProductImage({
  product,
  sizes,
  priority,
}: {
  product: Product;
  sizes: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (!product.image || failed) {
    return (
      <div className={styles.imagePlaceholder}>
        <ImageOff aria-hidden size={26} strokeWidth={1.5} />
        {/* Only products with no photo say so; a failed load just shows the icon. */}
        {!product.image && <span>Photo available on request</span>}
      </div>
    );
  }

  return (
    <Image
      alt={product.variant ? `${product.name}, ${product.variant}` : product.name}
      className={styles.image}
      fill
      onError={() => setFailed(true)}
      priority={priority}
      sizes={sizes}
      src={product.image}
    />
  );
}

// ─── Primary action: add to cart / checkout / request / out of stock ─────
/**
 * The one call-to-action for a product, chosen by stock status and cart:
 *   in_stock, not in cart → Add to cart
 *   in_stock, in cart     → Checkout, via the cart page so the order can be reviewed first
 *   on_request            → Request on WhatsApp (pre-filled enquiry)
 *   out_of_stock          → disabled
 */
export function ProductAction({
  product,
  qty = 1,
  size = "md",
}: {
  product: Product;
  qty?: number;
  size?: "md" | "lg";
}) {
  const { add, qtyOf } = useCart();
  // Set when this button added the item, so screen readers hear the change.
  const [announced, setAnnounced] = useState(false);

  const cls = clsx(styles.action, size === "lg" && styles.actionLg);
  const iconSize = size === "lg" ? 18 : 16;

  if (product.stock === "on_request") {
    return (
      <a
        className={clsx(cls, styles.actionWhatsapp)}
        href={whatsappLink(productEnquiryMessage(product))}
        rel="noopener noreferrer"
        target="_blank"
      >
        <MessageCircle aria-hidden size={iconSize} />
        Request on WhatsApp
      </a>
    );
  }

  if (product.stock === "out_of_stock" || product.price === null) {
    return (
      <button className={clsx(cls, styles.actionDisabled)} disabled type="button">
        <Ban aria-hidden size={16} />
        Out of stock
      </button>
    );
  }

  const inCart = qtyOf(product.id) > 0;

  return (
    <>
      <AnimatePresence initial={false} mode="wait">
        {inCart ? (
          <motion.span animate={{ opacity: 1, scale: 1 }} className={styles.actionSlot} initial={{ opacity: 0, scale: 0.96 }} key="checkout" transition={{ duration: 0.16 }}>
            <Link className={clsx(cls, styles.actionCheckout)} href="/cart">
              <Check aria-hidden size={iconSize} />
              Checkout
              <ArrowRight aria-hidden className={styles.actionArrow} size={iconSize} />
            </Link>
          </motion.span>
        ) : (
          <motion.span animate={{ opacity: 1, scale: 1 }} className={styles.actionSlot} initial={{ opacity: 0, scale: 0.96 }} key="add" transition={{ duration: 0.16 }}>
            <button
              className={clsx(cls, styles.actionPrimary)}
              onClick={() => { add(product.id, qty); setAnnounced(true); }}
              type="button"
            >
              <ShoppingCart aria-hidden size={iconSize} />
              Add to Cart
            </button>
          </motion.span>
        )}
      </AnimatePresence>
      <span aria-live="polite" className={styles.srOnly}>
        {announced && inCart ? `${product.name} added to cart. Checkout is now available.` : ""}
      </span>
    </>
  );
}

// ─── Quantity stepper ─────────────────────────────────────────
export function QtyStepper({
  value,
  onChange,
  label,
  max = MAX_QTY_PER_LINE,
}: {
  value: number;
  onChange: (next: number) => void;
  label: string;
  max?: number;
}) {
  return (
    <div className={styles.stepper} role="group" aria-label={label}>
      <button
        aria-label="Decrease quantity"
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
        type="button"
      >
        <Minus aria-hidden size={14} />
      </button>
      <span aria-live="polite">{value}</span>
      <button
        aria-label="Increase quantity"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        type="button"
      >
        <Plus aria-hidden size={14} />
      </button>
    </div>
  );
}
