import { describe, it, expect } from 'vitest';
import { scoreAnswers, dominantArchetypes, ALL_ARCHETYPES } from './scoring';
import type { ArchetypeId } from '../content/types';
import { QUESTIONS } from '../content/questions';

describe('scoreAnswers', () => {
  it('считает баллы по каждому архетипу', () => {
    const answers: ArchetypeId[] = ['ruler', 'ruler', 'lover', 'magician'];
    const s = scoreAnswers(answers);
    expect(s.ruler).toBe(2);
    expect(s.lover).toBe(1);
    expect(s.magician).toBe(1);
    expect(s.rebel).toBe(0);
  });
});

describe('dominantArchetypes', () => {
  it('выдаёт один архетип при разрыве больше 2 баллов', () => {
    const s = scoreAnswers([
      ...Array<ArchetypeId>(9).fill('ruler'),
      ...Array<ArchetypeId>(4).fill('lover'),
      ...Array<ArchetypeId>(2).fill('rebel'),
    ]);
    expect(dominantArchetypes(s)).toEqual(['ruler']);
  });

  it('выдаёт два архетипа при разрыве ровно 2 балла', () => {
    const s = scoreAnswers([
      ...Array<ArchetypeId>(7).fill('ruler'),
      ...Array<ArchetypeId>(5).fill('lover'),
      ...Array<ArchetypeId>(3).fill('rebel'),
    ]);
    expect(dominantArchetypes(s)).toEqual(['ruler', 'lover']);
  });

  it('выдаёт два архетипа при равном счёте', () => {
    const s = scoreAnswers([
      ...Array<ArchetypeId>(6).fill('magician'),
      ...Array<ArchetypeId>(6).fill('rebel'),
      ...Array<ArchetypeId>(3).fill('ruler'),
    ]);
    const result = dominantArchetypes(s);
    expect(result).toHaveLength(2);
    expect(result).toContain('magician');
    expect(result).toContain('rebel');
  });
});

describe('целостность контента', () => {
  it('15 вопросов, в каждом 4 ответа — по одному на каждый архетип', () => {
    expect(QUESTIONS).toHaveLength(15);
    for (const q of QUESTIONS) {
      expect(q.answers).toHaveLength(4);
      const archs = q.answers.map((a) => a.archetype).sort();
      expect(archs).toEqual([...ALL_ARCHETYPES].sort());
    }
  });
});
