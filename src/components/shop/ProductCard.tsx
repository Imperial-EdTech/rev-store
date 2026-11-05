"use client";

import { Eye } from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";
import { discountPercent, formatNaira, getCategory, priceLabel, specSummary, type Product } from "@/lib/catalog";
import { ProductAction, ProductImage, StockPill } from "./primitives";
import styles from "./shop.module.css";

export function ProductCard({
  product,
  view,
  onQuickView,
}: {
  product: Product;
  view: "grid" | "list";
  /** When provided, the card shows a Quick view button. */
  onQuickView?: (product: Product) => void;
}) {
  const href = `/products/${product.id}`;
  const category = getCategory(product.category);
  const discount = discountPercent(product);

  return (
    <article className={clsx(styles.card, view === "list" && styles.cardList)}>
      <div className={styles.cardMedia}>
        <Link aria-label={`View ${product.name}`} className={styles.cardMediaLink} href={href} tabIndex={-1}>
          <ProductImage
            product={product}
            sizes={view === "list" ? "220px" : "(min-width: 1100px) 260px, (min-width: 520px) 45vw, 90vw"}
          />
        </Link>
        <StockPill className={styles.cardPill} status={product.stock} />
        {discount > 0 && <span className={styles.cardDiscount}>{discount}% OFF</span>}
        {onQuickView && (
          <button
            // Explicit label: on touch screens the visible text is hidden (icon only).
            aria-label={`Quick view ${product.name}`}
            className={styles.quickView}
            onClick={() => onQuickView(product)}
            type="button"
          >
            <Eye aria-hidden size={15} />
            <span aria-hidden>Quick view</span>
          </button>
        )}
      </div>

      <div className={styles.cardBody}>
        <p className={styles.cardCategory}>{category.label}</p>
        <h3 className={styles.cardName}>
          <Link href={href}>{product.name}</Link>
        </h3>
        {product.variant && <p className={styles.cardVariant}>{product.variant}</p>}
        <p className={styles.cardSpecs} title={specSummary(product)}>
          {specSummary(product)}
        </p>

        <div className={styles.cardFooter}>
          <div className={styles.cardPriceRow}>
            <p className={clsx(styles.cardPrice, product.price === null && styles.cardPriceMuted)}>
              {priceLabel(product)}
            </p>
            {product.price !== null && product.compareAtPrice && product.compareAtPrice > product.price && (
              <s className={styles.cardCompare}>
                <span className={styles.srOnly}>Regular price </span>
                {formatNaira(product.compareAtPrice)}
              </s>
            )}
          </div>
          <ProductAction product={product} />
        </div>
      </div>
    </article>
  );
}
