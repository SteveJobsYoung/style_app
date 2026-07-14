import type { ArchetypeId } from '../content/types';
import { archetypeById } from '../content/archetypes';
import { COMBOS, comboKey, type ComboProfile } from '../content/combos';
import { ALL_ARCHETYPES, type Scores } from './scoring';

export interface StyleSelection {
  styleIds: string[];
  /** Комбо-профиль, если результат — сочетание двух архетипов с заполненным комбо. */
  combo: ComboProfile | null;
}

/**
 * Логика выдачи стилей:
 * 1 архетип  → его чистые стили;
 * 2 архетипа → комбо-профиль сочетания (своя эстетика, не сумма списков);
 * комбо не заполнено → фолбэк: слияние списков двух архетипов (максимум 4).
 */
export function selectStyles(archetypeIds: ArchetypeId[]): StyleSelection {
  if (archetypeIds.length === 1) {
    return { styleIds: archetypeById(archetypeIds[0]).styleIds, combo: null };
  }

  const combo = COMBOS[comboKey(archetypeIds)];
  if (combo) {
    return { styleIds: combo.styleIds, combo };
  }

  // Фолбэк — старое поведение, чтобы незаполненная пара ничего не ломала.
  const merged = [
    ...new Set(archetypeIds.flatMap((id) => archetypeById(id).styleIds)),
  ].slice(0, 4);
  return { styleIds: merged, combo: null };
}


/**
 * Потенциальный архетип — сильнейший из НЕдоминирующих.
 * Показываем только если он реально выражен (набрал >= minScore),
 * иначе это шум, а не грань личности.
 */
export function potentialArchetype(
  scores: Scores,
  dominant: ArchetypeId[],
  minScore = 3
): ArchetypeId | null {
  const rest = ALL_ARCHETYPES.filter((a) => !dominant.includes(a)).sort(
    (a, b) => scores[b] - scores[a]
  );
  const top = rest[0];
  return top && scores[top] >= minScore ? top : null;
}

/** 2 стиля «на вырост» из потенциального архетипа, не дублирующие основные. */
export function potentialStyles(
  potential: ArchetypeId,
  mainStyleIds: string[]
): string[] {
  return archetypeById(potential)
    .styleIds.filter((id) => !mainStyleIds.includes(id))
    .slice(0, 2);
}
