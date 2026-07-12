import type { ArchetypeId } from './types';

// Комбо-профили для сочетаний двух архетипов.
// Ключ — id архетипов, отсортированные в порядке: ruler, lover, rebel, magician
// и склеенные через '+' (нормализуется хелпером, руками порядок не важен).
// ЧЕРНОВОЙ контент — названия, описания и наборы стилей проверь экспертным глазом.

export interface ComboProfile {
  /** Название сочетания — показывается на экране результата. */
  title: string;
  /** Объяснение, как два архетипа сплавляются в один образ. */
  description: string;
  /** 3–4 стиля, отражающие именно сочетание, а не сумму двух списков. */
  styleIds: string[];
}

export const COMBOS: Record<string, ComboProfile> = {
  'ruler+lover': {
    title: 'Статусная чувственность',
    description:
      'Власть, которая не давит, а притягивает. Дорогие тактильные ткани, безупречная посадка и лёгкая расслабленность в деталях: расстёгнутая пуговица на дорогой рубашке говорит громче костюма-тройки.',
    styleIds: ['light-casual', 'italian-riviera', 'luxury-resort'],
  },
  'ruler+rebel': {
    title: 'Дорогой бунтарь',
    description:
      'Люкс без разрешения. Качество и статус Правителя, но по своим правилам: кашемир с кожей, костюмные брюки с грубыми ботинками, ноль галстуков. Образ человека, который может себе позволить не соответствовать.',
    styleIds: ['dark-money', 'italian-boss', 'luxury-sport', 'luxury-street'],
  },
  'ruler+magician': {
    title: 'Тёмная власть',
    description:
      'Влияние без демонстрации. Монохром, дорогие ткани, лаконичный крой — издалека просто строгий образ, вблизи считывается уровень. Сила, которую не нужно объявлять.',
    styleIds: ['dark-academia', 'light-academia', 'avant-garde-tailoring'],
  },
  'lover+rebel': {
    title: 'Опасное обаяние',
    description:
      'Притяжение с оттенком риска. Чёрные рубашки по телу, кожа, открытость и дерзость в одном флаконе: образ парня, с которым будет либо очень хорошо, либо очень интересно.',
    styleIds: ['indie-sleaze', 'rockstar', 'luxury-grunge', 'eclectic-grandpa'],
  },
  'lover+magician': {
    title: 'Магнетическая загадка',
    description:
      'Чувственность, которую нужно разгадывать. Тактильные ткани и посадка по телу, но в тёмной сдержанной палитре: он не показывает всё сразу — и именно это цепляет.',
    styleIds: ['dark-romantic', 'mystic-boho', 'ethereal'],
  },
  'rebel+magician': {
    title: 'Тёмный протест',
    description:
      'Бунт без крика. Нестандартные силуэты, техничные ткани, тёмная палитра: протест не в надписях на футболке, а в самой форме, которая не подчиняется правилам.',
    styleIds: ['avant-garde', 'archive-fashion', 'techwear'],
  },
};

/** Порядок нормализации ключа. */
export const ARCHETYPE_ORDER: ArchetypeId[] = ['ruler', 'lover', 'rebel', 'magician'];

export function comboKey(ids: ArchetypeId[]): string {
  return [...ids]
    .sort((a, b) => ARCHETYPE_ORDER.indexOf(a) - ARCHETYPE_ORDER.indexOf(b))
    .join('+');
}
