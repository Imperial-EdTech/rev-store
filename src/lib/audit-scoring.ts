/**
 * audit-scoring.ts
 *
 * Converts raw audit answers (question id → array of selected option letters)
 * into a ranked list of Revrica product recommendations.
 *
 * Logic:
 *  - Each checked option fires its product triggers.
 *  - We count how many times each product was triggered across all answers.
 *  - Products are ranked by trigger count (desc). Ties are broken by the
 *    order they appear in allProductTriggers.
 *  - We also compute a per-section "gap score" (0–100) showing how many
 *    triggering answers the school gave in each section vs. the maximum
 *    possible — higher = more gaps = higher priority section.
 */

import {
  allProductTriggers,
  allQuestions,
  auditSections,
  type AuditOption,
  type ProductTrigger
} from "@/lib/audit-data";

// ─── Core types ───────────────────────────────────────────────────────────────

/** Raw answers: question number (as string key "1"…"20") → letter array */
export type AuditAnswers = Record<string, AuditOption["letter"][]>;

export type ProductRecommendation = {
  product: ProductTrigger;
  /** How many distinct option selections triggered this product */
  triggerCount: number;
  /**
   * Which questions triggered this product, so the report can explain
   * WHY each product is recommended.
   */
  triggeredByQuestions: number[];
};

export type SectionGapScore = {
  sectionId: string;
  sectionTitle: string;
  /** 0–100: percentage of maximum possible triggers fired in this section */
  gapScore: number;
  /** Number of options checked that carry at least one trigger */
  triggeringSelections: number;
  /** Maximum triggering selections possible if all options were checked */
  maxTriggeringSelections: number;
};

export type AuditScore = {
  /** Ranked product recommendations, highest trigger count first */
  recommendations: ProductRecommendation[];
  /** Per-section gap analysis */
  sectionGaps: SectionGapScore[];
  /** Total number of options the school checked */
  totalSelections: number;
  /** Total number of unique products triggered */
  uniqueProductsTriggered: number;
};

// ─── Scoring ─────────────────────────────────────────────────────────────────

export function scoreAudit(answers: AuditAnswers): AuditScore {
  const productCounts = new Map<ProductTrigger, number>();
  const productQuestions = new Map<ProductTrigger, Set<number>>();
  let totalSelections = 0;

  for (const question of allQuestions) {
    const selected = answers[String(question.number)] ?? [];
    for (const letter of selected) {
      totalSelections++;
      const option = question.options.find((o) => o.letter === letter);
      if (!option) continue;
      for (const trigger of option.triggers) {
        productCounts.set(trigger, (productCounts.get(trigger) ?? 0) + 1);
        if (!productQuestions.has(trigger)) productQuestions.set(trigger, new Set());
        productQuestions.get(trigger)!.add(question.number);
      }
    }
  }

  // Build ranked recommendations (only include products that were actually triggered)
  const recommendations: ProductRecommendation[] = allProductTriggers
    .filter((product) => (productCounts.get(product) ?? 0) > 0)
    .map((product) => ({
      product,
      triggerCount: productCounts.get(product) ?? 0,
      triggeredByQuestions: Array.from(productQuestions.get(product) ?? []).sort((a, b) => a - b)
    }))
    .sort((a, b) => b.triggerCount - a.triggerCount);

  // Per-section gap analysis
  const sectionGaps: SectionGapScore[] = auditSections.map((section) => {
    let triggeringSelections = 0;
    let maxTriggeringSelections = 0;

    for (const question of section.questions) {
      const selected = answers[String(question.number)] ?? [];
      // Count how many options in this question have triggers
      for (const option of question.options) {
        if (option.triggers.length > 0) maxTriggeringSelections++;
      }
      // Count how many of the SELECTED options in this question have triggers
      for (const letter of selected) {
        const option = question.options.find((o) => o.letter === letter);
        if (option && option.triggers.length > 0) triggeringSelections++;
      }
    }

    const gapScore =
      maxTriggeringSelections > 0
        ? Math.round((triggeringSelections / maxTriggeringSelections) * 100)
        : 0;

    return {
      sectionId: section.id,
      sectionTitle: section.title,
      gapScore,
      triggeringSelections,
      maxTriggeringSelections
    };
  });

  return {
    recommendations,
    sectionGaps,
    totalSelections,
    uniqueProductsTriggered: recommendations.length
  };
}

/**
 * Returns only the top N recommendations (default 5) for use in
 * summary cards and email previews.
 */
export function topRecommendations(
  score: AuditScore,
  n = 5
): ProductRecommendation[] {
  return score.recommendations.slice(0, n);
}

/**
 * Human-readable priority label based on gap score.
 * Used in per-school reports.
 */
export function sectionPriority(gapScore: number): {
  label: "Critical" | "High" | "Medium" | "Low" | "Strong";
  color: string;
} {
  if (gapScore >= 70) return { label: "Critical", color: "#C0392B" };
  if (gapScore >= 50) return { label: "High", color: "#E74C3C" };
  if (gapScore >= 30) return { label: "Medium", color: "#E67E22" };
  if (gapScore >= 10) return { label: "Low", color: "#F39C12" };
  return { label: "Strong", color: "#27AE60" };
}

// ─── Admin aggregate analytics ────────────────────────────────────────────────

export type ProductFrequency = {
  product: ProductTrigger;
  count: number;
  pct: number;
};

/** Across many submissions, how often was each product triggered? */
export function aggregateProductFrequencies(
  allAnswers: AuditAnswers[]
): ProductFrequency[] {
  const total = allAnswers.length || 1;
  const counts = new Map<ProductTrigger, number>();

  for (const answers of allAnswers) {
    const score = scoreAudit(answers);
    for (const rec of score.recommendations) {
      counts.set(rec.product, (counts.get(rec.product) ?? 0) + 1);
    }
  }

  return allProductTriggers
    .filter((p) => (counts.get(p) ?? 0) > 0)
    .map((product) => ({
      product,
      count: counts.get(product) ?? 0,
      pct: Math.round(((counts.get(product) ?? 0) / total) * 100)
    }))
    .sort((a, b) => b.count - a.count);
}

/** How many submissions triggered each section as a high-priority gap. */
export function aggregateSectionGaps(allAnswers: AuditAnswers[]): {
  sectionId: string;
  sectionTitle: string;
  avgGapScore: number;
}[] {
  if (allAnswers.length === 0) {
    return auditSections.map((s) => ({
      sectionId: s.id,
      sectionTitle: s.title,
      avgGapScore: 0
    }));
  }

  const sectionTotals = new Map<string, number>();
  for (const answers of allAnswers) {
    const { sectionGaps } = scoreAudit(answers);
    for (const gap of sectionGaps) {
      sectionTotals.set(gap.sectionId, (sectionTotals.get(gap.sectionId) ?? 0) + gap.gapScore);
    }
  }

  return auditSections.map((section) => ({
    sectionId: section.id,
    sectionTitle: section.title,
    avgGapScore: Math.round((sectionTotals.get(section.id) ?? 0) / allAnswers.length)
  }));
}
