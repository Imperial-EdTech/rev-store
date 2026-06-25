import { allPrompts, auditSections } from "@/lib/audit-data";
import { bandForScore, getOverallScore, getSectionScores, maturityBands, type MaturityBand } from "@/lib/audit-scoring";
import type { TechAuditRequest } from "@/lib/types";

/**
 * Admin-dashboard analytics over a list of TechAuditRequest rows.
 * Scores are read from the stored overall_score/section_scores columns
 * where available (computed at insert time) and recomputed from raw
 * answers as a fallback for older rows or local testing.
 */

export type BandDistributionEntry = {
  band: MaturityBand["label"];
  count: number;
  pct: number;
};

export type OptionFrequency = {
  sectionTitle: string;
  itemNumber: number;
  itemTitle: string;
  promptLabel: string;
  letter: string;
  optionText: string;
  count: number;
  pct: number;
};

function resolveOverallScore(request: TechAuditRequest): number | null {
  return request.overallScore ?? getOverallScore(request.answers);
}

export function getAverageOverallScore(requests: TechAuditRequest[]): number | null {
  const scores = requests.map(resolveOverallScore).filter((value): value is number => value !== null);
  if (scores.length === 0) return null;
  return Math.round((scores.reduce((sum, value) => sum + value, 0) / scores.length) * 100) / 100;
}

export function getOverallBand(requests: TechAuditRequest[]): MaturityBand | null {
  return bandForScore(getAverageOverallScore(requests));
}

export function getBandDistribution(requests: TechAuditRequest[]): BandDistributionEntry[] {
  const total = requests.length || 1;
  const counts = new Map<MaturityBand["label"], number>(maturityBands.map((band: { label: any; }) => [band.label, 0]));

  for (const request of requests) {
    const band = bandForScore(resolveOverallScore(request));
    if (band) counts.set(band.label, (counts.get(band.label) ?? 0) + 1);
  }

  return maturityBands.map((band: { label: any; }) => {
    const count = counts.get(band.label) ?? 0;
    return { band: band.label, count, pct: Math.round((count / total) * 100) };
  });
}

export type SectionAverage = {
  sectionId: string;
  title: string;
  avgScore: number | null;
  band: MaturityBand | null;
};

export function getSectionAverages(requests: TechAuditRequest[]): SectionAverage[] {
  return auditSections.map((section) => {
    const scores = requests
      .map((request) => {
        const stored = request.sectionScores?.[section.id]?.score;
        if (typeof stored === "number") return stored;
        return getSectionScores(request.answers).find((s: { sectionId: string; }) => s.sectionId === section.id)?.score ?? null;
      })
      .filter((value): value is number => value !== null);

    const avgScore = scores.length > 0 ? Math.round((scores.reduce((sum, v) => sum + v, 0) / scores.length) * 100) / 100 : null;
    return { sectionId: section.id, title: section.title, avgScore, band: bandForScore(avgScore) };
  });
}

/**
 * How often each individual A-E option was checked across all
 * submissions, flattened and ranked. Mirrors the source document's own
 * framing ("mostly A & B responses = high-impact opportunity") — this
 * is what lets the team see exactly which gaps are most common.
 */
export function getOptionFrequencies(requests: TechAuditRequest[]): OptionFrequency[] {
  const total = requests.length || 1;
  const counts = new Map<string, number>();

  for (const request of requests) {
    for (const [promptId, letters] of Object.entries(request.answers ?? {})) {
      for (const letter of letters) {
        const key = `${promptId}::${letter}`;
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
    }
  }

  const results: OptionFrequency[] = [];
  for (const section of auditSections) {
    for (const item of section.items) {
      for (const prompt of item.prompts) {
        for (const option of prompt.options) {
          const count = counts.get(`${prompt.id}::${option.letter}`) ?? 0;
          results.push({
            sectionTitle: section.title,
            itemNumber: item.number,
            itemTitle: item.title,
            promptLabel: prompt.label,
            letter: option.letter,
            optionText: option.text,
            count,
            pct: Math.round((count / total) * 100)
          });
        }
      }
    }
  }

  return results.sort((a, b) => b.count - a.count);
}

export function getAnsweredRate(requests: TechAuditRequest[]): number {
  if (requests.length === 0) return 0;
  const totalPossible = requests.length * allPrompts.length;
  let totalAnswered = 0;
  for (const request of requests) {
    totalAnswered += Object.values(request.answers ?? {}).filter((letters) => letters.length > 0).length;
  }
  return totalPossible > 0 ? Math.round((totalAnswered / totalPossible) * 100) : 0;
}
