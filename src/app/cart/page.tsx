"use client";

import { ChevronRight, ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";
import { StorefrontFooter } from "@/components/StorefrontFooter";
import { StorefrontHeader } from "@/components/StorefrontHeader";
import { ProductImage, QtyStepper } from "@/components/shop/primitives";
import { useCart } from "@/lib/cart/cart-context";
import { formatNaira, getCategory, specSummary } from "@/lib/catalog";
import { BANK_ACCOUNT } from "@/lib/contact";
import styles from "./cart.module.css";

export default function CartPage() {
  const { items, count, subtotal, hydrated, setQty, remove, clear } = useCart();

  return (
    <div className={styles.page}>
      <StorefrontHeader showInfoBar={false} />

      <div className={styles.container}>
        <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <ChevronRight aria-hidden size={14} />
          <Link href="/products">Shop</Link>
          <ChevronRight aria-hidden size={14} />
          <span aria-current="page">Cart</span>
        </nav>

        <div className={styles.titleRow}>
          <h1 className={styles.title}>Your cart</h1>
          {hydrated && count > 0 && (
            <p className={styles.titleMeta}>{count} item{count === 1 ? "" : "s"}</p>
          )}
        </div>

        {!hydrated ? (
          // Saved cart not read yet: hold the space instead of flashing "empty".
          <div aria-busy="true" className={styles.skeleton} />
        ) : items.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}><ShoppingCart aria-hidden size={28} /></span>
            <h2>Your cart is empty</h2>
            <p>Laptops you add from the shop will appear here.</p>
            <Link className={styles.primaryButton} href="/products">Browse the shop</Link>
          </div>
        ) : (
          <div className={styles.layout}>
            <section aria-label="Items in your cart" className={styles.lines}>
              <ul>
                {items.map(({ product, qty, lineTotal }) => (
                  <li className={styles.line} key={product.id}>
                    <Link aria-label={product.name} className={styles.thumb} href={`/products/${product.id}`} tabIndex={-1}>
                      <ProductImage product={product} sizes="112px" />
                    </Link>

                    <div className={styles.lineInfo}>
                      <p className={styles.lineCategory}>{getCategory(product.category).singular}</p>
                      <h2 className={styles.lineName}>
                        <Link href={`/products/${product.id}`}>{product.name}</Link>
                      </h2>
                      {product.variant && <p className={styles.lineVariant}>{product.variant}</p>}
                      <p className={styles.lineSpecs}>{specSummary(product)}</p>
                      <p className={styles.unitPrice}>{formatNaira(product.price)} each</p>
                    </div>

                    <div className={styles.lineControls}>
                      <QtyStepper
                        label={`Quantity for ${product.name}`}
                        onChange={(n) => setQty(product.id, n)}
                        value={qty}
                      />
                      <p className={styles.lineTotal}>{formatNaira(lineTotal)}</p>
                      <button
                        className={styles.removeButton}
                        onClick={() => remove(product.id)}
                        type="button"
                      >
                        <Trash2 aria-hidden size={15} /> Remove
                        <span className={styles.srOnly}> {product.name}</span>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className={styles.linesFooter}>
                <Link className={styles.textLink} href="/products">Continue shopping</Link>
                <button className={styles.textButton} onClick={clear} type="button">Empty cart</button>
              </div>
            </section>

            <aside aria-labelledby="summary-heading" className={styles.summary}>
              <h2 id="summary-heading">Order summary</h2>
              <dl>
                <div>
                  <dt>Subtotal ({count} item{count === 1 ? "" : "s"})</dt>
                  <dd>{formatNaira(subtotal)}</dd>
                </div>
                <div>
                  <dt>Delivery</dt>
                  <dd className={styles.muted}>Confirmed with your order</dd>
                </div>
                <div className={styles.totalRow}>
                  <dt>Total</dt>
                  <dd>{formatNaira(subtotal)}</dd>
                </div>
              </dl>
              <Link className={styles.checkoutButton} href="/checkout">Continue to checkout</Link>
              <p className={styles.summaryNote}>
                {BANK_ACCOUNT
                  ? "You’ll pay by bank transfer and send your payment confirmation to us on WhatsApp."
                  : "You’ll send your order to us on WhatsApp, and we’ll reply with payment details."}
              </p>
            </aside>
          </div>
        )}
      </div>

      <StorefrontFooter />
    </div>
  );
}
