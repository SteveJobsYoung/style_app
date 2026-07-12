import { describe, it, expect } from 'vitest';
import { COMBOS, comboKey } from '../content/combos';
import { STYLES } from '../content/styles';
import { ARCHETYPES } from '../content/archetypes';
import { selectStyles } from './styleSelection';
import { ALL_ARCHETYPES } from './scoring';

const validStyleIds = new Set(STYLES.map((s) => s.id));

describe('комбо-профили', () => {
  it('заполнены все 6 пар архетипов', () => {
    const pairs: string[] = [];
    for (let i = 0; i < ALL_ARCHETYPES.length; i++)
      for (let j = i + 1; j < ALL_ARCHETYPES.length; j++)
        pairs.push(comboKey([ALL_ARCHETYPES[i], ALL_ARCHETYPES[j]]));
    for (const key of pairs) {
      expect(COMBOS[key], `нет комбо для ${key}`).toBeDefined();
    }
    expect(Object.keys(COMBOS)).toHaveLength(6);
  });

  it('все styleIds в комбо существуют, стилей 3–4', () => {
    for (const [key, combo] of Object.entries(COMBOS)) {
      expect(combo.styleIds.length).toBeGreaterThanOrEqual(3);
      expect(combo.styleIds.length).toBeLessThanOrEqual(4);
      for (const id of combo.styleIds) {
        expect(validStyleIds.has(id), `в ${key} неизвестный стиль ${id}`).toBe(true);
      }
    }
  });

  it('ключ нормализуется независимо от порядка архетипов', () => {
    expect(comboKey(['rebel', 'ruler'])).toBe('ruler+rebel');
    expect(comboKey(['magician', 'lover'])).toBe('lover+magician');
  });
});

describe('selectStyles', () => {
  it('один архетип → его чистые стили', () => {
    const ruler = ARCHETYPES.find((a) => a.id === 'ruler')!;
    const sel = selectStyles(['ruler']);
    expect(sel.styleIds).toEqual(ruler.styleIds);
    expect(sel.combo).toBeNull();
  });

  it('два архетипа → комбо-профиль сочетания', () => {
    const sel = selectStyles(['rebel', 'ruler']); // порядок не важен
    expect(sel.combo?.title).toBe('Дорогой бунтарь');
    expect(sel.styleIds).toEqual(COMBOS['ruler+rebel'].styleIds);
  });
});
