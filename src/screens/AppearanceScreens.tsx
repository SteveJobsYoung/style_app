import { useEffect } from 'react';
import { useApp } from '../store';
import { BODY_TYPES, FACE_TYPES, FACE_SHAPES } from '../content/appearance';
import { PrimaryAction, ProgressBar, BackButton, Ph, Screen, Eyebrow } from '../components/ui';
import { TOTAL_STEPS } from './StepScreens';
import { haptic, hapticSuccess } from '../telegram';

/* ── Шаг 3.1: Тип фигуры ── */

export function BodyScreen() {
  const { bodyType, setBodyType, setScreen } = useApp();
  return (
    <Screen>
      <ProgressBar value={16 / TOTAL_STEPS} />
      <BackButton onClick={() => setScreen('archetype-result')} />
      <Eyebrow>Этап 3 · Фигура</Eyebrow>
      <h2 className="font-display text-3xl font-medium leading-tight text-cream">
        Твой тип фигуры
      </h2>
      <p className="mt-2 font-body text-sm leading-relaxed text-muted">
        Оцени себя честно в зеркале: ширину и рост, а не «как хотелось бы». От этого
        зависят правила посадки вещей.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {BODY_TYPES.map((b) => {
          const selected = bodyType === b.id;
          return (
            <button
              key={b.id}
              onClick={() => {
                haptic('light');
                setBodyType(b.id);
              }}
              className={`flex flex-col overflow-hidden border text-left transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-wine ${
                selected ? 'border-wine bg-peach/30' : 'border-line bg-surface'
              }`}
            >
              <Ph src={b.image} alt={b.name} label={b.name} className="h-36 w-full" />
              <div className="p-3">
                <h3 className="font-display text-base text-cream">{b.name}</h3>
                <p className="mt-1 font-body text-[11px] leading-snug text-muted">
                  {b.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <PrimaryAction
        text={bodyType ? 'Дальше' : 'Выбери тип фигуры'}
        disabled={!bodyType}
        onClick={() => setScreen('face-type')}
      />
    </Screen>
  );
}

/* ── Шаг 3.2: Тип лица ── */

export function FaceTypeScreen() {
  const { faceType, setFaceType, setScreen } = useApp();
  return (
    <Screen>
      <ProgressBar value={17 / TOTAL_STEPS} />
      <BackButton onClick={() => setScreen('body')} />
      <Eyebrow>Этап 3 · Лицо</Eyebrow>
      <h2 className="font-display text-3xl font-medium leading-tight text-cream">
        Твой тип лица
      </h2>
      <p className="mt-2 font-body text-sm leading-relaxed text-muted">
        Посмотри на черты: плавные линии — мягкий тип, резкие скулы и челюсть —
        жёсткий, что-то среднее — сбалансированный. От этого зависят палитра и
        правила по бороде.
      </p>

      <div className="mt-6 space-y-4">
        {FACE_TYPES.map((f) => {
          const selected = faceType === f.id;
          return (
            <button
              key={f.id}
              onClick={() => {
                haptic('light');
                setFaceType(f.id);
              }}
              className={`flex w-full items-stretch overflow-hidden border text-left transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-wine ${
                selected ? 'border-wine bg-peach/30' : 'border-line bg-surface'
              }`}
            >
              <Ph src={f.image} alt={f.name} label={f.name} className="h-28 w-24 shrink-0" />
              <div className="p-4">
                <h3 className="font-display text-lg text-cream">{f.name}</h3>
                <p className="mt-1 font-body text-[12px] leading-snug text-muted">
                  {f.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <PrimaryAction
        text={faceType ? 'Дальше' : 'Выбери тип лица'}
        disabled={!faceType}
        onClick={() => setScreen('face-shape')}
      />
    </Screen>
  );
}

/* ── Шаг 3.3: Форма лица ── */

export function FaceShapeScreen() {
  const { faceShape, setFaceShape, setScreen } = useApp();
  return (
    <Screen>
      <ProgressBar value={18 / TOTAL_STEPS} />
      <BackButton onClick={() => setScreen('face-type')} />
      <Eyebrow>Этап 3 · Форма лица</Eyebrow>
      <h2 className="font-display text-3xl font-medium leading-tight text-cream">
        Форма твоего лица
      </h2>
      <p className="mt-2 font-body text-sm leading-relaxed text-muted">
        Убери волосы со лба и посмотри на контур: соотношение ширины лба, скул и
        челюсти. От формы зависят правила по причёскам.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {FACE_SHAPES.map((f) => {
          const selected = faceShape === f.id;
          return (
            <button
              key={f.id}
              onClick={() => {
                haptic('light');
                setFaceShape(f.id);
              }}
              className={`flex flex-col overflow-hidden border text-left transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-wine ${
                selected ? 'border-wine bg-peach/30' : 'border-line bg-surface'
              }`}
            >
              <Ph src={f.image} alt={f.name} label={f.name} className="h-32 w-full" />
              <div className="p-3">
                <h3 className="font-display text-base text-cream">{f.name}</h3>
                <p className="mt-1 font-body text-[11px] leading-snug text-muted">
                  {f.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <PrimaryAction
        text={faceShape ? 'Получить результат' : 'Выбери форму лица'}
        disabled={!faceShape}
        onClick={() => {
          hapticSuccess();
          setScreen('analyzing');
        }}
      />
    </Screen>
  );
}

/* ── Экран анализа ── */

export function AnalyzingScreen() {
  const setScreen = useApp((s) => s.setScreen);

  useEffect(() => {
    const t = setTimeout(() => setScreen('result'), 2600);
    return () => clearTimeout(t);
  }, [setScreen]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-8">
      <div className="relative h-20 w-20">
        <div className="absolute inset-0 animate-spin-slow rounded-full border border-line" />
        <div className="absolute inset-0 animate-spin-slow rounded-full border-t-2 border-t-wine" />
        <div className="absolute inset-3 animate-spin-rev rounded-full border-b border-b-ink/40" />
      </div>
      <p className="mt-8 animate-pulse text-center font-display text-xl italic text-cream/80">
        Анализирую твои ответы…
      </p>
      <p className="mt-2 text-center font-body text-xs uppercase tracking-[0.25em] text-muted">
        Собираю твой стилевой паспорт
      </p>
    </div>
  );
}
