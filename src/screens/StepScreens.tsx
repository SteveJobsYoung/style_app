import { useMemo } from 'react';
import { useApp } from '../store';
import { QUESTIONS } from '../content/questions';
import { APP_CONFIG } from '../content/config';
import { PrimaryAction, ProgressBar, BackButton, Screen, Eyebrow } from '../components/ui';
import { haptic } from '../telegram';
import { scoreAnswers, dominantArchetypes } from '../logic/scoring';
import { track } from '../logic/analytics';

// Всего «шагов» для прогресс-бара: 15 вопросов + 3 внешность = 18
export const TOTAL_STEPS = 18;

/* ── Экран 0: Приветствие ── */

export function WelcomeScreen() {
  const setScreen = useApp((s) => s.setScreen);
  return (
    <Screen>
      <div className="flex min-h-[70vh] flex-col justify-center">
        <Eyebrow>Стилевая диагностика | Michele Aleer</Eyebrow>
        <h1 className="font-display text-[42px] font-medium leading-[1.05] text-cream">
          Style
          <br />
          Is All
          <br />
          <span className="italic text-wine">You Need</span>
        </h1>
        <p className="mt-6 font-body text-[15px] leading-relaxed text-cream/70">
          {APP_CONFIG.welcomeSubtitle}
        </p>
        <ul className="mt-8 space-y-3 border-l border-wine/50 pl-4">
          {APP_CONFIG.welcomeBullets.map((b) => (
            <li key={b} className="font-body text-sm text-cream/80">
              {b}
            </li>
          ))}
        </ul>
      </div>
      <PrimaryAction
        text="Начать"
        onClick={() => {
          track('quiz_start');
          setScreen('quiz');
        }}
      />
    </Screen>
  );
}

/* ── Этап 1: Тест на архетипы ── */

// стабильное перемешивание ответов на основе id вопроса
function shuffled<T>(arr: T[], seed: string): T[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    h = (h * 1103515245 + 12345) & 0x7fffffff;
    const j = h % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function QuizScreen() {
  const { questionIndex, answerQuestion, goBackInQuiz, setScreen, answers, setTestArchetypes } =
    useApp();

  const q = QUESTIONS[questionIndex];
  const options = useMemo(() => (q ? shuffled(q.answers, q.id) : []), [q]);

  if (!q) return null;

  const isLast = questionIndex === QUESTIONS.length - 1;

  return (
    <Screen withAction={false}>
      <ProgressBar value={(questionIndex + 1) / TOTAL_STEPS} />
      <BackButton
        onClick={() => (questionIndex === 0 ? setScreen('welcome') : goBackInQuiz())}
      />
      <Eyebrow>
        Вопрос {questionIndex + 1} / {QUESTIONS.length}
      </Eyebrow>
      <h2 className="font-display text-[26px] font-medium leading-snug text-cream">
        {q.question}
      </h2>

      <div className="mt-7 space-y-3">
        {options.map((opt) => (
          <button
            key={opt.text}
            onClick={() => {
              haptic('light');
              answerQuestion(opt.archetype);
              track('question_answered', { question: questionIndex + 1 });
              if (isLast) {
                const finalAnswers = [...answers];
                finalAnswers[questionIndex] = opt.archetype;
                const scores = scoreAnswers(finalAnswers);
                const dominant = dominantArchetypes(scores);
                setTestArchetypes(dominant);
                track('archetype_result', { archetypes: dominant.join('+') });
                setScreen('archetype-result');
              }
            }}
            className="block w-full border border-line bg-surface px-4 py-4 text-left font-body text-[14px] leading-snug text-cream/90 transition-colors active:border-wine active:bg-peach/25 focus-visible:outline focus-visible:outline-1 focus-visible:outline-wine"
          >
            {opt.text}
          </button>
        ))}
      </div>
    </Screen>
  );
}
