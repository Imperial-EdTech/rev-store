"use client";

import Link from "next/link";
import { clsx } from "clsx";
import { formatNaira, getCategory, specSummary, type Product } from "@/lib/catalog";
import { ProductAction, ProductImage, StockPill } from "./primitives";
import styles from "./shop.module.css";

export function ProductCard({ product, view }: { product: Product; view: "grid" | "list" }) {
  const href = `/products/${product.id}`;
  const category = getCategory(product.category);

  return (
    <article className={clsx(styles.card, view === "list" && styles.cardList)}>
      <Link aria-label={`View ${product.name}`} className={styles.cardMedia} href={href} tabIndex={-1}>
        <StockPill className={styles.cardPill} status={product.stock} />
        <ProductImage
          product={product}
          sizes={view === "list" ? "220px" : "(min-width: 1100px) 260px, (min-width: 520px) 45vw, 90vw"}
        />
      </Link>

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
              {product.price === null ? "Price on request" : formatNaira(product.price)}
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
