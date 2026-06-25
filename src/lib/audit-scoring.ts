import { allPrompts, auditSections, pointsForLetter, type AuditOption } from "@/lib/audit-data";

/**
 * Adapted from the source document's "Scoring & Analysis Framework"
 * (A = Foundation ... E = Excellence). The original framework assumed
 * one selected letter per prompt; since the form here is multi-select,
 * a school's score per prompt is the average point value of whatever
 * they check (A=1 ... E=5), and section/overall scores average those.
 * Unanswered prompts (school checked nothing) are excluded from the
 * average rather than counted as 0, so partial submissions aren't
 * unfairly penalized.
 */

export type MaturityBand = {
  label: "Foundation" | "Development" | "Intermediate" | "Advanced" | "Excellence";
  minScore: number; // inclusive
  maxScore: number; // exclusive, except the last band which is inclusive of 5
  description: string;
};

export const maturityBands: MaturityBand[] = [
  { label: "Foundation", minScore: 1, maxScore: 1.8, description: "High-impact opportunity — most fundamentals are missing." },
  { label: "Development", minScore: 1.8, maxScore: 2.6, description: "Good opportunity for targeted improvements." },
  { label: "Intermediate", minScore: 2.6, maxScore: 3.4, description: "Enhancement and integration opportunities." },
  { label: "Advanced", minScore: 3.4, maxScore: 4.2, description: "Optimization and advanced feature opportunities." },
  { label: "Excellence", minScore: 4.2, maxScore: 5.01, description: "Partnership and innovation opportunities." }
];

export function bandForScore(score: number | null): MaturityBand | null {
  if (score === null || Number.isNaN(score)) return null;
  return maturityBands.find((band) => score >= band.minScore && score < band.maxScore) ?? maturityBands[maturityBands.length - 1];
}

/**
 * A submission's answers, keyed by prompt id, to an array of the
 * letters checked for that prompt (can be empty, one, or several).
 */
export type AuditAnswers = Record<string, AuditOption["letter"][]>;

function avgPoints(letters: AuditOption["letter"][]): number | null {
  if (letters.length === 0) return null;
  const sum = letters.reduce((total, letter) => total + pointsForLetter(letter), 0);
  return sum / letters.length;
}

/** Average maturity score (1–5) across every prompt the school answered. Null if nothing answered. */
export function getOverallScore(answers: AuditAnswers): number | null {
  const promptScores = allPrompts
    .map((prompt) => avgPoints(answers[prompt.id] ?? []))
    .filter((value): value is number => value !== null);
  if (promptScores.length === 0) return null;
  return promptScores.reduce((sum, value) => sum + value, 0) / promptScores.length;
}

export type SectionScore = {
  sectionId: string;
  title: string;
  score: number | null;
  band: MaturityBand | null;
};

export function getSectionScores(answers: AuditAnswers): SectionScore[] {
  return auditSections.map((section) => {
    const promptScores = section.items
      .flatMap((item) => item.prompts)
      .map((prompt) => avgPoints(answers[prompt.id] ?? []))
      .filter((value): value is number => value !== null);

    const score = promptScores.length > 0 ? promptScores.reduce((sum, value) => sum + value, 0) / promptScores.length : null;
    return { sectionId: section.id, title: section.title, score, band: bandForScore(score) };
  });
}

/** How many of the 40 prompts the school left completely unanswered. */
export function getUnansweredCount(answers: AuditAnswers): number {
  return allPrompts.filter((prompt) => (answers[prompt.id] ?? []).length === 0).length;
}
