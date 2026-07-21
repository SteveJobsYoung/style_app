import type { ArchetypeId } from './types';

// Референсы для насмотренности — по кому «насматривать» стиль под архетип.
// ЧЕРНОВОЙ список публичных аккаунтов. Проверь и замени на своих,
// в идеале — на тех, чью эстетику ты сам считаешь эталонной под каждый архетип.

export interface StyleRef {
  handle: string; // без @
  note: string; // за что смотреть
}

export const REFS: Record<ArchetypeId, StyleRef[]> = {
  ruler: [
    { handle: 'tobiasrtr', note: 'сдержанный old money, безупречная посадка' },
    { handle: 'deniscebulec', note: 'классическая элегантность и тихая роскошь' },
    { handle: 'erik.forsgren', note: 'итальянская сартория с достоинством' },
    { handle: 'pauli.kllr', note: 'эталон old-money' },
  ],
  lover: [
    { handle: 'janis_danner', note: 'чувственная небрежность и харизма' },
    { handle: 'lifeof_riley', note: 'тактильные фактуры, тело в фокусе' },
    { handle: 'philsoda', note: 'южная расслабленная притягательность' },
    { handle: 'tashlanov.v', note: 'романтизация жизни' },
  ],
  rebel: [
    { handle: 'terribletil', note: 'уличная дерзость и характер' },
    { handle: 'michelemorrone', note: 'статусная маскулинность' },
    { handle: 'blackmetalsosa', note: 'темный лорд' },
    { handle: 'michele.aleer', note: 'слова излишни' }

  ],
  magician: [
    { handle: 'sir_bucksl', note: 'силуэты как загадка' },
    { handle: 'wisdm', note: 'сложные и артистичные образы' },
    { handle: '__maleeq', note: 'сложные тёмные силуэты и слои' },
    { handle: 'johnnydepp', note: 'чистый маг' },

  ],
};

export const refsFor = (id: ArchetypeId) => REFS[id] ?? [];
