"use client";

import { ChevronRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { StorefrontFooter } from "@/components/StorefrontFooter";
import { StorefrontHeader } from "@/components/StorefrontHeader";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductAction, ProductImage, QtyStepper, StockPill } from "@/components/shop/primitives";
import {
  PRODUCTS, displayName, formatNaira, getCategory, getProduct, isPurchasable,
} from "@/lib/catalog";
import { whatsappLink } from "@/lib/contact";
import styles from "./product.module.css";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const product = getProduct(params?.id ?? "");
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div className={styles.page}>
        <StorefrontHeader showInfoBar={false} />
        <div className={styles.notFound}>
          <h1>This product isn’t in the shop</h1>
          <p>It may have been removed or renamed. Everything we currently sell is in the shop.</p>
          <Link className={styles.notFoundLink} href="/products">Browse the shop</Link>
        </div>
      </div>
    );
  }

  const category = getCategory(product.category);
  const saving =
    product.price !== null && product.compareAtPrice ? product.compareAtPrice - product.price : 0;
  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const bulkMessage = `Hi Revrica, I'd like a volume quote for the ${displayName(product)} for my school/organisation. Quantity: `;

  return (
    <div className={styles.page}>
      <StorefrontHeader showInfoBar={false} />

      <div className={styles.container}>
        <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <ChevronRight aria-hidden size={14} />
          <Link href="/products">Shop</Link>
          <ChevronRight aria-hidden size={14} />
          <Link href={`/products?category=${category.id}`}>{category.label}</Link>
          <ChevronRight aria-hidden size={14} />
          <span aria-current="page">{product.name}</span>
        </nav>

        <div className={styles.layout}>
          <div className={styles.media}>
            <StockPill className={styles.mediaPill} status={product.stock} />
            <ProductImage priority product={product} sizes="(min-width: 900px) 580px, 92vw" />
          </div>

          <div className={styles.info}>
            <p className={styles.category}>{category.singular}</p>
            <h1 className={styles.name}>{product.name}</h1>
            {product.variant && <p className={styles.variant}>{product.variant}</p>}

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
                  <p className={styles.priceNote}>
                    {product.stock === "pre_order"
                      ? "Pre-order price per unit. Pay now to reserve yours from the first shipment."
                      : "Price per unit"}
                  </p>
                  {product.financing && (
                    <p className={styles.financing}>
                      Or from <strong>{formatNaira(product.financing.monthlyFrom)}/month</strong> over{" "}
                      {product.financing.months} months with the{" "}
                      <Link href="/teacher-empowerment">Teacher Empowerment Programme</Link>
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p className={styles.priceOnRequest}>Price on request</p>
                  <p className={styles.priceNote}>
                    Message us on WhatsApp for the current price and delivery lead time.
                  </p>
                </>
              )}
            </div>

            <div className={styles.buyRow}>
              {isPurchasable(product) && (
                <QtyStepper label="Quantity" onChange={setQty} value={qty} />
              )}
              <div className={styles.buyAction}>
                <ProductAction product={product} qty={qty} size="lg" />
              </div>
            </div>

            <a
              className={styles.bulkLink}
              href={whatsappLink(bulkMessage)}
              rel="noopener noreferrer"
              target="_blank"
            >
              <MessageCircle aria-hidden size={15} />
              Buying for a school or team? Ask for a volume quote
            </a>

            <section aria-labelledby="specs-heading" className={styles.specs}>
              <h2 id="specs-heading">Specifications</h2>
              <dl>
                {product.specs.map((s) => (
                  <div key={s.label}>
                    <dt>{s.label}</dt>
                    <dd>{s.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>
        </div>

        {related.length > 0 && (
          <section aria-labelledby="related-heading" className={styles.related}>
            <div className={styles.relatedHead}>
              <h2 id="related-heading">More {category.label.toLowerCase()}</h2>
              <Link href={`/products?category=${category.id}`}>See all {category.label.toLowerCase()}</Link>
            </div>
            <div className={styles.relatedGrid}>
              {related.map((p) => <ProductCard key={p.id} product={p} view="grid" />)}
            </div>
          </section>
        )}
      </div>

      <StorefrontFooter />
    </div>
  );
}
