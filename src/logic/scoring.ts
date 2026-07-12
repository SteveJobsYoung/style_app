import type { ArchetypeId } from '../content/types';

export const ALL_ARCHETYPES: ArchetypeId[] = [
  'ruler',
  'lover',
  'rebel',
  'magician',
];

export type Scores = Record<ArchetypeId, number>;

/** Считает баллы по массиву ответов (каждый ответ = архетип). */
export function scoreAnswers(answers: ArchetypeId[]): Scores {
  const scores: Scores = {
    ruler: 0,
    lover: 0,
    rebel: 0,
    magician: 0,
  };
  for (const a of answers) scores[a] += 1;
  return scores;
}

/**
 * Определяет 1 или 2 доминирующих архетипа.
 * Правило: если разрыв между №1 и №2 <= gap (по умолчанию 2 балла) — два архетипа.
 */
export function dominantArchetypes(scores: Scores, gap = 2): ArchetypeId[] {
  const sorted = [...ALL_ARCHETYPES].sort((a, b) => scores[b] - scores[a]);
  const [first, second] = sorted;
  if (scores[first] - scores[second] <= gap) return [first, second];
  return [first];
}
