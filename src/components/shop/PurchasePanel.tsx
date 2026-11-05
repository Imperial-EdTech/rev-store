"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { useCart } from "@/lib/cart/cart-context";
import { BULK_ORDER_LABEL, discountPercent, formatNaira, isPurchasable, type Product } from "@/lib/catalog";
import { ProductAction, QtyStepper } from "./primitives";
import { RepaymentPlans } from "./RepaymentPlans";
import styles from "./purchase.module.css";

/**
 * Price, quantity, buy/enquire button and (for financeable products) the
 * repayment plans. Shared by the product page and the quick-view modal so
 * both always behave the same.
 */
export function PurchasePanel({ product, compact = false }: { product: Product; compact?: boolean }) {
  const cart = useCart();
  // Before the item is added, the stepper picks how many to add. Once it's in
  // the cart, the stepper edits the cart line, so the number shown is what
  // checkout will charge.
  const [qtyToAdd, setQtyToAdd] = useState(1);
  const inCart = cart.qtyOf(product.id);
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
                  <span className={styles.discount}>{discountPercent(product)}% OFF</span>
                  <span className={styles.saving}>Save {formatNaira(saving)}</span>
                </>
              )}
            </div>
            <p className={styles.priceNote}>Price per unit, paid in full</p>
          </>
        ) : (
          <>
            <p className={styles.priceOnRequest}>{BULK_ORDER_LABEL}</p>
            <p className={styles.priceNote}>Sold in bulk. Message us on WhatsApp for the minimum order quantity, price and delivery lead time.</p>
          </>
        )}
      </div>

      <div className={styles.buyRow}>
        {isPurchasable(product) && (
          inCart > 0
            ? <QtyStepper label="Quantity in cart" onChange={(n) => cart.setQty(product.id, n)} value={inCart} />
            : <QtyStepper label="Quantity" onChange={setQtyToAdd} value={qtyToAdd} />
        )}
        <div className={styles.buyAction}>
          <ProductAction product={product} qty={qtyToAdd} size="lg" />
        </div>
      </div>

      {product.financing && <RepaymentPlans compact={compact} product={product} />}
    </div>
  );
}
