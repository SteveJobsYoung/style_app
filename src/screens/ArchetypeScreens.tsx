import { useApp } from '../store';
import { archetypeById } from '../content/archetypes';
import { PrimaryAction, ProgressBar, Ph, Screen, Eyebrow } from '../components/ui';
import { TOTAL_STEPS } from './StepScreens';
import { hapticSuccess } from '../telegram';

/* ── Результат теста на архетипы ── */

export function ArchetypeResultScreen() {
  const { archetypes, setScreen } = useApp();

  return (
    <Screen>
      <ProgressBar value={15 / TOTAL_STEPS} />
      <Eyebrow>Твой результат</Eyebrow>
      <h2 className="font-display text-3xl font-medium leading-tight text-cream">
        {archetypes.length === 2 ? 'В тебе живут два архетипа' : 'Твой архетип'}
      </h2>

      <div className="mt-6 space-y-6">
        {archetypes.map((id) => {
          const a = archetypeById(id);
          return (
            <div key={id} className="border border-line bg-surface">
              <div className="relative">
                <Ph src={a.image} alt={a.name} label={a.name} className="h-52 w-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink to-transparent" />
                <div className="absolute bottom-0 p-4">
                  <p className="font-body text-[10px] uppercase tracking-[0.3em] text-peach">
                    {a.vibeName}
                  </p>
                  <h3 className="font-display text-3xl text-canvas">{a.name}</h3>
                </div>
              </div>
              <p className="p-4 font-body text-[14px] leading-relaxed text-cream/75">
                {a.fullDescription}
              </p>
            </div>
          );
        })}
      </div>

      <p className="mt-6 border-l border-wine/50 pl-4 font-body text-sm text-cream/60">
        Дальше — адаптация под твою внешность: фигура, лицо, форма. Из этого
        соберётся твой персональный стилевой паспорт.
      </p>

      <PrimaryAction
        text="Дальше"
        onClick={() => {
          hapticSuccess();
          setScreen('body');
        }}
      />
    </Screen>
  );
}
