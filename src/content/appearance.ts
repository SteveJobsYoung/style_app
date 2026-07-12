import type { BodyType, FaceType, FaceShape, Palette } from './types';

// ЧЕРНОВОЙ контент — правила и формулировки замени на свои.

export const BODY_TYPES: BodyType[] = [
  {
    id: 'slim-short',
    name: 'Худой и низкий',
    description: 'Узкие плечи, лёгкий костяк, рост ниже среднего.',
    image: '/assets/body/slim-short.jpg',
    fitRules: [
      'Всё по фигуре: слим и регуляр, никакого оверсайза с головы до ног',
      'Укороченные куртки и пиджаки — линия талии визуально выше',
      'Монохромные вертикали: один цвет сверху вниз вытягивает силуэт',
      'Брюки с высокой посадкой и без подворотов в пол',
      'Обувь с невысокой массивной подошвой добавляет роста без каблука',
    ],
  },
  {
    id: 'slim-tall',
    name: 'Худой и высокий',
    description: 'Вытянутый силуэт, длинные конечности, лёгкий костяк.',
    image: '/assets/body/slim-tall.jpg',
    fitRules: [
      'Слои и объём: многослойность добавляет массы верху',
      'Горизонтальное членение: контраст верха и низа дробит рост',
      'Фактурные ткани — твид, вельвет, плотный трикотаж создают объём',
      'Оверсайз работает на тебя, но держи одну вещь по фигуре',
      'Избегай сплошных вертикальных линий — они вытягивают ещё сильнее',
    ],
  },
  {
    id: 'solid-short',
    name: 'Плотный и низкий',
    description: 'Широкий костяк или плотное телосложение при невысоком росте.',
    image: '/assets/body/solid-short.jpg',
    fitRules: [
      'Чёткая посадка по плечам — вещь не должна висеть и не должна обтягивать',
      'Вертикаль во всём: V-вырезы, планки, вертикальные линии кроя',
      'Тёмный монохром стройнит и вытягивает одновременно',
      'Средняя длина верха: не укороченное и не ниже бедра',
      'Структурные плотные ткани держат форму лучше мягких',
    ],
  },
  {
    id: 'solid-tall',
    name: 'Плотный и высокий',
    description: 'Крупный костяк, широкие плечи, рост выше среднего.',
    image: '/assets/body/solid-tall.jpg',
    fitRules: [
      'Регуляр-крой: слим будет тесен, оверсайз добавит массы',
      'Минимум мелких деталей — крупному силуэту нужны крупные элементы',
      'Спокойные тёмные и глубокие тона работают на солидность',
      'Вещи точно по длине рукава и брючин — на крупной фигуре видно всё',
      'Избегай мелких принтов и тонких полосок — рябит на большом объёме',
    ],
  },
];

export const LIGHT_PALETTE: Palette = {
  name: 'Светлая палитра',
  colors: [
    { hex: '#F2ECE3', name: 'Слоновая кость' },
    { hex: '#D9CBB6', name: 'Беж' },
    { hex: '#B8A98F', name: 'Кэмел светлый' },
    { hex: '#9FA8A3', name: 'Шалфей' },
    { hex: '#7E8CA0', name: 'Пыльно-голубой' },
    { hex: '#C4C0B6', name: 'Светло-серый тёплый' },
  ],
};

export const DARK_PALETTE: Palette = {
  name: 'Тёмная палитра',
  colors: [
    { hex: '#101010', name: 'Чёрный' },
    { hex: '#2B2B2E', name: 'Графит' },
    { hex: '#1F2A38', name: 'Тёмно-синий' },
    { hex: '#3C2F2A', name: 'Тёмный шоколад' },
    { hex: '#3A4238', name: 'Тёмный хаки' },
    { hex: '#5E1621', name: 'Бордо' },
  ],
};

export const FACE_TYPES: FaceType[] = [
  {
    id: 'soft',
    name: 'Мягкий',
    description: 'Плавные черты, округлые линии, мягкий контраст лица.',
    image: '/assets/face-type/soft.jpg',
    primaryPalette: 'light',
    paletteNote:
      'Твоя основа — светлая палитра: она усиливает природный мягкий вайб. Тёмная палитра — альтернативный путь, если хочешь добавить контраста и жёсткости образу.',
    beardRules: [
      'Борода добавляет недостающую жёсткость: короткая щетина или бородка с чёткими линиями',
      'Чёткий контур по скулам и шее обязателен — размытые края усиливают мягкость',
      'Избегай пушистой длинной бороды без формы',
    ],
  },
  {
    id: 'balanced',
    name: 'Сбалансированный',
    description: 'Среднее между мягкими и жёсткими чертами, гибкий типаж.',
    image: '/assets/face-type/balanced.jpg',
    primaryPalette: 'both',
    paletteNote:
      'Тебе подходят обе палитры — светлая и тёмная. Выбирай под задачу: светлая — расслабленность и доступность, тёмная — сила и дистанция.',
    beardRules: [
      'Свобода выбора: от чистого бритья до полноценной бороды',
      'Ориентируйся на форму лица и стиль, а не на ограничения типажа',
      'Лёгкая щетина — универсальный безопасный вариант',
    ],
  },
  {
    id: 'hard',
    name: 'Жёсткий',
    description: 'Резкие черты, выраженные скулы и челюсть, высокий контраст.',
    image: '/assets/face-type/hard.jpg',
    primaryPalette: 'dark',
    paletteNote:
      'Твоя основа — тёмная палитра: она резонирует с контрастом лица и усиливает харизму. Светлая палитра — путь контраста, смягчает образ, когда нужно быть доступнее.',
    beardRules: [
      'Можешь позволить и чистое бритьё — костяк лица сам держит образ',
      'Борода усиливает брутальность: следи, чтобы не перегрузить',
      'Аккуратная средняя борода балансирует резкость черт',
    ],
  },
];

export const FACE_SHAPES: FaceShape[] = [
  {
    id: 'square',
    image: '/assets/face-shape/square.jpg',
    name: 'Квадратная',
    description: 'Ширина лба, скул и челюсти почти равны, углы выражены.',
    hairRules: [
      'Объём сверху вытягивает лицо: кроп с текстурой, кифф, помпадур',
      'Короткие виски подчёркивают челюсть — это твоя сила',
      'Избегай плоских причёсок с прямой чёлкой — квадратят ещё сильнее',
    ],
    hairstyles: [
      { name: 'Текстурный кроп', image: '/assets/hair/crop.jpg', pinterestUrl: 'https://pinterest.com/PLACEHOLDER/crop' },
      { name: 'Кифф', image: '/assets/hair/quiff.jpg', pinterestUrl: 'https://pinterest.com/PLACEHOLDER/quiff' },
    ],
  },
  {
    id: 'oval',
    image: '/assets/face-shape/oval.jpg',
    name: 'Овальная',
    description: 'Плавно сужается ото лба к подбородку, идеальные пропорции.',
    hairRules: [
      'Подходит почти всё — выбирай под стиль, а не под ограничения',
      'Не закрывай лицо: длинная чёлка на глаза ломает пропорции',
      'Средняя длина с зачёсом назад — беспроигрышный вариант',
    ],
    hairstyles: [
      { name: 'Зачёс назад', image: '/assets/hair/slick-back.jpg', pinterestUrl: 'https://pinterest.com/PLACEHOLDER/slick-back' },
      { name: 'Средняя длина', image: '/assets/hair/medium.jpg', pinterestUrl: 'https://pinterest.com/PLACEHOLDER/medium' },
    ],
  },
  {
    id: 'rectangle',
    image: '/assets/face-shape/rectangle.jpg',
    name: 'Прямоугольная',
    description: 'Вытянутое лицо с выраженными углами челюсти.',
    hairRules: [
      'Не добавляй высоты сверху — лицо и так вытянуто',
      'Объём по бокам и текстура балансируют длину',
      'Чёлка укорачивает лицо — рабочий инструмент',
    ],
    hairstyles: [
      { name: 'Френч кроп с чёлкой', image: '/assets/hair/french-crop.jpg', pinterestUrl: 'https://pinterest.com/PLACEHOLDER/french-crop' },
      { name: 'Текстура с объёмом по бокам', image: '/assets/hair/side-volume.jpg', pinterestUrl: 'https://pinterest.com/PLACEHOLDER/side-volume' },
    ],
  },
  {
    id: 'round',
    image: '/assets/face-shape/round.jpg',
    name: 'Круглая',
    description: 'Мягкие линии, ширина и высота лица почти равны.',
    hairRules: [
      'Высота сверху + короткие виски = визуально вытянутое лицо',
      'Асимметрия и угловатые линии добавляют структуру',
      'Избегай округлых форм и равномерной длины по всей голове',
    ],
    hairstyles: [
      { name: 'Помпадур', image: '/assets/hair/pompadour.jpg', pinterestUrl: 'https://pinterest.com/PLACEHOLDER/pompadour' },
      { name: 'Андеркат с высоким верхом', image: '/assets/hair/undercut.jpg', pinterestUrl: 'https://pinterest.com/PLACEHOLDER/undercut' },
    ],
  },
  {
    id: 'diamond',
    image: '/assets/face-shape/diamond.jpg',
    name: 'Ромбовидная',
    description: 'Широкие скулы, узкие лоб и подбородок.',
    hairRules: [
      'Объём у лба балансирует узкую верхнюю часть',
      'Чёлка или текстура на лоб — рабочий приём',
      'Не убирай волосы полностью назад — оголяет узкий лоб',
    ],
    hairstyles: [
      { name: 'Текстурная чёлка', image: '/assets/hair/fringe.jpg', pinterestUrl: 'https://pinterest.com/PLACEHOLDER/fringe' },
      { name: 'Свободная средняя длина', image: '/assets/hair/loose-medium.jpg', pinterestUrl: 'https://pinterest.com/PLACEHOLDER/loose-medium' },
    ],
  },
  {
    id: 'triangle',
    image: '/assets/face-shape/triangle.jpg',
    name: 'Треугольная',
    description: 'Челюсть шире лба, лицо расширяется книзу.',
    hairRules: [
      'Объём сверху и на висках уравновешивает широкую челюсть',
      'Средняя длина с боковым объёмом — базовый приём',
      'Избегай ультракоротких стрижек — оголяют дисбаланс',
    ],
    hairstyles: [
      { name: 'Объёмная средняя длина', image: '/assets/hair/volume-medium.jpg', pinterestUrl: 'https://pinterest.com/PLACEHOLDER/volume-medium' },
      { name: 'Сайд-парт с объёмом', image: '/assets/hair/side-part.jpg', pinterestUrl: 'https://pinterest.com/PLACEHOLDER/side-part' },
    ],
  },
];

export const bodyTypeById = (id: string) => BODY_TYPES.find((b) => b.id === id)!;
export const faceTypeById = (id: string) => FACE_TYPES.find((f) => f.id === id)!;
export const faceShapeById = (id: string) => FACE_SHAPES.find((f) => f.id === id)!;
