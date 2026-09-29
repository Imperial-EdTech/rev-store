"use client";

import { ArrowRight, CalendarClock, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useId, useState } from "react";
import { clsx } from "clsx";
import { formatNairaKobo, lowestMonthly, type Product } from "@/lib/catalog";
import styles from "./financing.module.css";

/**
 * Teacher Empowerment repayment options for a financeable product: pick a
 * term, see the monthly payment, then apply. Collapsed until opened; the
 * summary shows the lowest monthly figure. Figures are the programme's
 * published numbers from the catalogue.
 */
export function RepaymentPlans({ product, compact = false }: { product: Product; compact?: boolean }) {
  const plans = product.financing ?? [];
  // Default to the longest term: the lowest monthly payment.
  const [months, setMonths] = useState(plans.at(-1)?.months ?? 0);
  const groupName = useId();
  const plan = plans.find((p) => p.months === months);
  const lowest = lowestMonthly(product);
  if (!plan || !lowest) return null;

  return (
    <details className={clsx(styles.panel, compact && styles.compact)}>
      <summary className={styles.head}>
        <CalendarClock aria-hidden className={styles.headIcon} size={18} />
        <span className={styles.headText}>
          <span className={styles.headTitle}>Pay monthly with the Teacher Empowerment Programme</span>
          <span className={styles.headSub}>From {formatNairaKobo(lowest.monthly)}/month</span>
        </span>
        <ChevronDown aria-hidden className={styles.chevron} size={18} />
      </summary>

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
      </dl>

      <div className={styles.actions}>
        <Link className={styles.apply} href={`/apply?device=${encodeURIComponent(product.id)}`}>
          Apply for Financing <ArrowRight aria-hidden size={16} />
        </Link>
        {!compact && (
          <Link className={styles.learn} href="/teacher-empowerment">How the programme works</Link>
        )}
      </div>
    </details>
  );
}
