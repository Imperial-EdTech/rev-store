"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Ban, Check, ImageOff, MessageCircle, Minus, Plus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import { MAX_QTY_PER_LINE, useCart } from "@/lib/cart/cart-context";
import { productEnquiryMessage, STOCK_LABEL, type Product, type StockStatus } from "@/lib/catalog";
import { whatsappLink } from "@/lib/contact";
import styles from "./shop.module.css";

// ─── Stock pill ───────────────────────────────────────────────
const PILL_CLASS: Record<StockStatus, string> = {
  in_stock: styles.pillOk,
  pre_order: styles.pillInfo,
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

// ─── Primary action: add to cart / request / out of stock ─────
/**
 * The one call-to-action for a product, chosen by stock status:
 *   in_stock     → Add to cart (with brief "Added" confirmation)
 *   on_request   → Request on WhatsApp (pre-filled enquiry)
 *   out_of_stock → disabled
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
  const { add } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(timer.current), []);

  const cls = clsx(styles.action, size === "lg" && styles.actionLg);

  if (product.stock === "on_request") {
    return (
      <a
        className={clsx(cls, styles.actionWhatsapp)}
        href={whatsappLink(productEnquiryMessage(product))}
        rel="noopener noreferrer"
        target="_blank"
      >
        <MessageCircle aria-hidden size={size === "lg" ? 18 : 16} />
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

  function onAdd() {
    add(product.id, qty);
    setJustAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setJustAdded(false), 1800);
  }

  return (
    <button
      className={clsx(cls, styles.actionPrimary, justAdded && styles.actionAdded)}
      onClick={onAdd}
      type="button"
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          animate={{ opacity: 1, y: 0 }}
          className={styles.actionInner}
          exit={{ opacity: 0, y: -4 }}
          initial={{ opacity: 0, y: 4 }}
          key={justAdded ? "added" : "add"}
          transition={{ duration: 0.14 }}
        >
          {justAdded ? <Check aria-hidden size={16} /> : <ShoppingCart aria-hidden size={16} />}
          {justAdded ? "Added to cart" : "Add to Cart"}
        </motion.span>
      </AnimatePresence>
      <span aria-live="polite" className={styles.srOnly}>
        {justAdded ? `${product.name} added to cart` : ""}
      </span>
    </button>
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
