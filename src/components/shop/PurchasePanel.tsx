"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { formatNaira, isPurchasable, type Product } from "@/lib/catalog";
import { ProductAction, QtyStepper } from "./primitives";
import { RepaymentPlans } from "./RepaymentPlans";
import styles from "./purchase.module.css";

/**
 * Price, quantity, buy/enquire button and (for financeable products) the
 * repayment plans. Shared by the product page and the quick-view modal so
 * both always behave the same.
 */
export function PurchasePanel({ product, compact = false }: { product: Product; compact?: boolean }) {
  const [qty, setQty] = useState(1);
  const saving = product.price !== null && product.compareAtPrice ? product.compareAtPrice - product.price : 0;

  return (
    <div className={clsx(compact && styles.compact)}>
      <div className={styles.priceBlock}>
        {product.price !== null ? (
          <>
            <div className={styles.priceRow}>
              <p className={styles.price}>{formatNaira(product.price)}</p>
              {saving > 0 && (
                <>
                  <s className={styles.compare}>
                    <span className={styles.srOnly}>Regular price </span>
                    {formatNaira(product.compareAtPrice!)}
                  </s>
                  <span className={styles.saving}>Save {formatNaira(saving)}</span>
                </>
              )}
            </div>
            <p className={styles.priceNote}>Price per unit, paid in full</p>
          </>
        ) : (
          <>
            <p className={styles.priceOnRequest}>Price on request</p>
            <p className={styles.priceNote}>Message us on WhatsApp for the current price and delivery lead time.</p>
          </>
        )}
      </div>

      <div className={styles.buyRow}>
        {isPurchasable(product) && <QtyStepper label="Quantity" onChange={setQty} value={qty} />}
        <div className={styles.buyAction}>
          <ProductAction product={product} qty={qty} size="lg" />
        </div>
      </div>

      {product.financing && <RepaymentPlans compact={compact} product={product} />}
    </div>
  );
}
