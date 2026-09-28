"use client";

import { ArrowRight, CalendarClock } from "lucide-react";
import Link from "next/link";
import { useId, useState } from "react";
import { clsx } from "clsx";
import { formatNaira, formatNairaKobo, type Product } from "@/lib/catalog";
import styles from "./financing.module.css";

/**
 * Teacher Empowerment repayment options for a financeable product: pick a
 * term, see the monthly payment and total, then apply. Figures are the
 * programme's published numbers from the catalogue.
 */
export function RepaymentPlans({ product, compact = false }: { product: Product; compact?: boolean }) {
  const plans = product.financing ?? [];
  // Default to the longest term: the lowest monthly payment.
  const [months, setMonths] = useState(plans.at(-1)?.months ?? 0);
  const groupName = useId();
  const plan = plans.find((p) => p.months === months);
  if (!plan) return null;

  const total = Math.round(plan.monthly * plan.months * 100) / 100;

  return (
    <section aria-label="Pay monthly" className={clsx(styles.panel, compact && styles.compact)}>
      <div className={styles.head}>
        <CalendarClock aria-hidden size={18} />
        <h2>Pay monthly with the Teacher Empowerment Programme</h2>
      </div>

      <fieldset className={styles.terms}>
        <legend className={styles.srOnly}>Repayment term</legend>
        {plans.map((p) => (
          <label className={clsx(styles.term, p.months === months && styles.termActive)} key={p.months}>
            <input
              checked={p.months === months}
              className={styles.srOnly}
              name={groupName}
              onChange={() => setMonths(p.months)}
              type="radio"
              value={p.months}
            />
            {p.months} months
          </label>
        ))}
      </fieldset>

      <dl className={styles.figures}>
        <div className={styles.monthly}>
          <dt>Monthly repayment</dt>
          <dd aria-live="polite">{formatNairaKobo(plan.monthly)}<span>/month</span></dd>
        </div>
        <div>
          <dt>Total repayable</dt>
          <dd>{formatNairaKobo(total)}</dd>
        </div>
        <div>
          <dt>Programme rate</dt>
          <dd>{plan.rate} over {plan.months} months</dd>
        </div>
      </dl>

      <p className={styles.note}>
        Zero upfront payment. Repayments start the month after you receive your laptop.
        {product.price !== null && <> Cash price {formatNaira(product.price)}.</>}
      </p>

      <div className={styles.actions}>
        <Link className={styles.apply} href={`/apply?device=${encodeURIComponent(product.id)}`}>
          Apply for Financing <ArrowRight aria-hidden size={16} />
        </Link>
        {!compact && (
          <Link className={styles.learn} href="/teacher-empowerment">How the programme works</Link>
        )}
      </div>
    </section>
  );
}
