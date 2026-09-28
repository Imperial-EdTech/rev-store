"use client";

import { ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { getCategory, type Product } from "@/lib/catalog";
import { ProductImage, StockPill } from "./primitives";
import { PurchasePanel } from "./PurchasePanel";
import styles from "./quickview.module.css";

/** Specs worth showing at a glance; the full list is on the product page. */
const KEY_SPECS = ["Processor", "Memory", "Storage", "Display", "Operating system"];

/**
 * Product quick view, built on the native <dialog> element: the browser
 * provides Escape-to-close, focus containment, an inert background and
 * focus return to the button that opened it.
 */
export function QuickView({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (product && !dialog.open) dialog.showModal();
    if (!product && dialog.open) dialog.close();
  }, [product]);

  // Stop the page behind from scrolling while open.
  useEffect(() => {
    if (!product) return;
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    return () => { html.style.overflow = previous; };
  }, [product]);

  const specs = product?.specs.filter((s) => KEY_SPECS.includes(s.label)) ?? [];

  return (
    <dialog
      aria-labelledby="quickview-title"
      className={styles.dialog}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} // click on the backdrop
      onClose={onClose}
      ref={ref}
    >
      {product && (
        <div className={styles.body}>
          <button aria-label="Close quick view" className={styles.close} onClick={onClose} type="button">
            <X aria-hidden size={18} />
          </button>

          <div className={styles.media}>
            <StockPill className={styles.pill} status={product.stock} />
            <ProductImage product={product} sizes="(min-width: 760px) 360px, 92vw" />
          </div>

          <div className={styles.info}>
            <p className={styles.category}>{getCategory(product.category).singular}</p>
            <h2 className={styles.name} id="quickview-title">{product.name}</h2>
            {product.variant && <p className={styles.variant}>{product.variant}</p>}

            {specs.length > 0 && (
              <dl className={styles.specs}>
                {specs.map((s) => (
                  <div key={s.label}>
                    <dt>{s.label}</dt>
                    <dd>{s.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {/* Keyed so quantity and term reset when switching products. */}
            <PurchasePanel compact key={product.id} product={product} />

            <Link className={styles.details} href={`/products/${product.id}`}>
              View full details <ArrowRight aria-hidden size={15} />
            </Link>
          </div>
        </div>
      )}
    </dialog>
  );
}
