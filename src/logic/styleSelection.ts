import type { ArchetypeId } from '../content/types';
import { archetypeById } from '../content/archetypes';
import { COMBOS, comboKey, type ComboProfile } from '../content/combos';

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
