import { allQuestions, auditSections } from "@/lib/audit-data";
import {
  aggregateProductFrequencies,
  aggregateSectionGaps,
  scoreAudit,
  sectionPriority,
  type AuditScore,
  type ProductFrequency,
  type SectionGapScore,
} from "@/lib/audit-scoring";
import type { TechAuditRequest } from "@/lib/tech-audits/schema";

/**
 * Admin-dashboard analytics over a list of TechAuditRequest rows.
 *
 * Built entirely on what audit-scoring.ts actually exports:
 *   scoreAudit, sectionPriority, aggregateProductFrequencies,
 *   aggregateSectionGaps, ProductFrequency, SectionGapScore, AuditScore
 *
 * TechAuditRequest has: answers, triggeredProducts, topProducts, sectionGaps
 * — no overallScore or sectionScores columns.
 */

// ─── Re-export useful types so consumers only need this file ──
export type { ProductFrequency, SectionGapScore, AuditScore };

// ─── Band label derived from gap score ───────────────────────
export type BandLabel = "Critical" | "High" | "Medium" | "Low" | "Strong";

export type BandDistributionEntry = {
  band: BandLabel;
  count: number;
  pct: number;
};

export type OptionFrequency = {
  sectionTitle: string;
  questionNumber: number;
  questionText: string;
  letter: string;
  optionText: string;
  count: number;
  pct: number;
};

export type SectionAverage = {
  sectionId: string;
  title: string;
  avgGapScore: number;
  priority: ReturnType<typeof sectionPriority>;
};

// ─── Overall "score" — average gap score across all sections ──
function overallGapScore(request: TechAuditRequest): number {
  const gaps = Object.values(request.sectionGaps);
  if (gaps.length === 0) {
    // Fall back: re-score from raw answers
    const scored = scoreAudit(request.answers);
    const all = scored.sectionGaps;
    if (all.length === 0) return 0;
    return Math.round(all.reduce((s, g) => s + g.gapScore, 0) / all.length);
  }
  return Math.round(gaps.reduce((s, g) => s + g.gapScore, 0) / gaps.length);
}

// ─── Public API ───────────────────────────────────────────────

export function getAverageOverallScore(
  requests: TechAuditRequest[]
): number | null {
  if (requests.length === 0) return null;
  const sum = requests.reduce((s, r) => s + overallGapScore(r), 0);
  return Math.round((sum / requests.length) * 100) / 100;
}

export function getOverallBand(
  requests: TechAuditRequest[]
): ReturnType<typeof sectionPriority> | null {
  const avg = getAverageOverallScore(requests);
  if (avg === null) return null;
  return sectionPriority(avg);
}

export function getBandDistribution(
  requests: TechAuditRequest[]
): BandDistributionEntry[] {
  const total = requests.length || 1;
  const bands: BandLabel[] = ["Critical", "High", "Medium", "Low", "Strong"];
  const counts = new Map<BandLabel, number>(bands.map((b) => [b, 0]));

  for (const request of requests) {
    const { label } = sectionPriority(overallGapScore(request));
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }

  return bands.map((band) => {
    const count = counts.get(band) ?? 0;
    return { band, count, pct: Math.round((count / total) * 100) };
  });
}

export function getSectionAverages(
  requests: TechAuditRequest[]
): SectionAverage[] {
  const averaged = aggregateSectionGaps(requests.map((r) => r.answers));
  return averaged.map((s) => ({
    sectionId:    s.sectionId,
    title:        s.sectionTitle,
    avgGapScore:  s.avgGapScore,
    priority:     sectionPriority(s.avgGapScore),
  }));
}

/**
 * How often each individual A–E option was selected across all submissions.
 * Uses allQuestions (flat list of AuditQuestion) and iterates section.questions
 * (not section.items — that field does not exist).
 */
export function getOptionFrequencies(
  requests: TechAuditRequest[]
): OptionFrequency[] {
  const total = requests.length || 1;
  const counts = new Map<string, number>();

  for (const request of requests) {
    for (const [qNum, letters] of Object.entries(request.answers ?? {})) {
      for (const letter of letters) {
        const key = `${qNum}::${letter}`;
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
    }
  }

  const results: OptionFrequency[] = [];

  for (const section of auditSections) {
    for (const question of section.questions) {
      for (const option of question.options) {
        const key   = `${question.number}::${option.letter}`;
        const count = counts.get(key) ?? 0;
        results.push({
          sectionTitle:   section.title,
          questionNumber: question.number,
          questionText:   question.title,
          letter:         option.letter,
          optionText:     option.text,
          count,
          pct: Math.round((count / total) * 100),
        });
      }
    }
  }

  return results.sort((a, b) => b.count - a.count);
}

/**
 * What percentage of questions (by count) did submitters actually answer?
 * Uses allQuestions.length as the denominator per submission.
 */
export function getAnsweredRate(requests: TechAuditRequest[]): number {
  if (requests.length === 0) return 0;
  const totalPossible = requests.length * allQuestions.length;
  let totalAnswered = 0;
  for (const request of requests) {
    totalAnswered += Object.values(request.answers ?? {}).filter(
      (letters) => letters.length > 0
    ).length;
  }
  return totalPossible > 0
    ? Math.round((totalAnswered / totalPossible) * 100)
    : 0;
}

/**
 * Thin wrapper around audit-scoring's aggregateProductFrequencies —
 * re-exported here so dashboard components only need to import from
 * audit-analytics.
 */
export function getProductFrequencies(
  requests: TechAuditRequest[]
): ProductFrequency[] {
  return aggregateProductFrequencies(requests.map((r) => r.answers));
}