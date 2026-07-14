import { useState, useEffect } from 'react';
import { useApp } from '../store';
import { archetypeById } from '../content/archetypes';
import { styleById } from '../content/styles';
import {
  bodyTypeById,
  faceTypeById,
  faceShapeById,
  LIGHT_PALETTE,
  DARK_PALETTE,
} from '../content/appearance';
import { APP_CONFIG } from '../content/config';
import { Ph, Screen, Eyebrow } from '../components/ui';
import { haptic, openUrl, shareText } from '../telegram';
import { selectStyles, potentialArchetype, potentialStyles } from '../logic/styleSelection';
import { scoreAnswers, ALL_ARCHETYPES } from '../logic/scoring';
import { track } from '../logic/analytics';
import type { Palette } from '../content/types';

/* ── Аккордеон-секция ── */

function Section({
  n,
  title,
  children,
  defaultOpen = false,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-line">
      <button
        onClick={() => {
          haptic('light');
          setOpen(!open);
        }}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-5 text-left focus-visible:outline focus-visible:outline-1 focus-visible:outline-wine"
      >
        <span className="flex items-baseline gap-3">
          <span className="font-display text-sm italic text-wine">{n}</span>
          <span className="font-display text-xl text-cream">{title}</span>
        </span>
        <span
          className={`font-body text-muted transition-transform duration-300 ${open ? 'rotate-45' : ''}`}
          aria-hidden
        >
          +
        </span>
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="pb-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

function Rules({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((r) => (
        <li key={r} className="flex gap-3 font-body text-[13px] leading-relaxed text-cream/80">
          <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-wine" aria-hidden />
          {r}
        </li>
      ))}
    </ul>
  );
}

function PaletteBlock({ palette, label }: { palette: Palette; label?: string }) {
  return (
    <div>
      {label && (
        <p className="mb-2 font-body text-[10px] uppercase tracking-[0.25em] text-muted">
          {label}
        </p>
      )}
      <p className="mb-3 font-display text-base text-cream">{palette.name}</p>
      <div className="grid grid-cols-3 gap-2">
        {palette.colors.map((c) => (
          <div key={c.hex}>
            <div
              className="h-14 w-full border border-line/60"
              style={{ backgroundColor: c.hex }}
            />
            <p className="mt-1 font-body text-[10px] text-muted">{c.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Финальный экран ── */

export function ResultScreen() {
  const state = useApp();
  const archs = state.archetypes.map(archetypeById);

  const body = bodyTypeById(state.bodyType!);
  const face = faceTypeById(state.faceType!);
  const shape = faceShapeById(state.faceShape!);

  const scores = scoreAnswers(state.answers);
  const maxScore = Math.max(...ALL_ARCHETYPES.map((a) => scores[a]), 1);

  const { styleIds, combo } = selectStyles(state.archetypes);
  const styles = styleIds.map(styleById);

  // Зона роста: сильнейший недоминирующий архетип (если реально выражен)
  const potential = potentialArchetype(scores, state.archetypes);
  const growthStyles = potential
    ? potentialStyles(potential, styleIds).map(styleById)
    : [];
  const accessories = [...new Set(archs.flatMap((a) => a.accessories))];

  useEffect(() => {
    track('result_view', {
      archetypes: state.archetypes.join('+'),
      combo: combo?.title ?? null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const share = () => {
    track('share_click');
    haptic('medium');
    shareText(
      `${APP_CONFIG.shareText}\n\nМой архетип: ${archs.map((a) => a.name).join(' + ')}`,
      APP_CONFIG.botUrl
    );
  };

  return (
    <Screen withAction={false}>
      {/* Паспорт стиля */}
      <div className="relative overflow-hidden border border-wine/40 bg-surface">
        {/* Герой: картинка доминирующего архетипа */}
        <div className="relative">
          <Ph
            src={archs[0].image}
            alt={archs[0].name}
            label={archs[0].name}
            className="h-56 w-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p className="font-body text-[10px] uppercase tracking-[0.3em] text-peach">
              Твой стилевой паспорт
            </p>
            <h1 className="mt-1 font-display text-[32px] font-medium leading-tight text-canvas">
              {archs.map((a) => a.name).join(' + ')}
            </h1>
          </div>
        </div>

        <div className="relative p-6">
          {/* декоративный вензель */}
          <span
            className="pointer-events-none absolute -right-3 -top-2 select-none font-display text-[120px] italic leading-none text-peach/30"
            aria-hidden
          >
            {archs[0].name.charAt(0)}
          </span>

          {/* Архетипный профиль — баллы по каждому архетипу */}
          <p className="font-body text-[11px] uppercase tracking-[0.25em] text-muted">
            Архетипный профиль
          </p>
          <div className="mt-3 space-y-2.5">
            {[...ALL_ARCHETYPES]
              .sort((a, b) => scores[b] - scores[a])
              .map((id) => {
                const a = archetypeById(id);
                const dominant = state.archetypes.includes(id);
                return (
                  <div key={id} className="flex items-center gap-3">
                    <span
                      className={`w-24 shrink-0 font-display text-[13px] italic ${
                        dominant ? 'text-cream' : 'text-muted'
                      }`}
                    >
                      {a.name}
                    </span>
                    <div className="h-[6px] flex-1 bg-line/60">
                      <div
                        className={dominant ? 'h-full bg-wine' : 'h-full bg-peach'}
                        style={{ width: `${(scores[id] / maxScore) * 100}%` }}
                      />
                    </div>
                    <span
                      className={`w-6 shrink-0 text-right font-body text-[11px] ${
                        dominant ? 'text-wine' : 'text-muted'
                      }`}
                    >
                      {scores[id]}
                    </span>
                  </div>
                );
              })}
          </div>

          <dl className="mt-6 space-y-3 border-t border-line pt-5">
            {[
              ['Архетип', archs.map((a) => a.name).join(' + ')],
              ['Фигура', body.name],
              ['Тип лица', face.name],
              ['Форма лица', shape.name],
            ].map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-4">
                <dt className="font-body text-[11px] uppercase tracking-[0.25em] text-muted">
                  {k}
                </dt>
                <dd className="text-right font-display text-[15px] italic text-cream">
                  {v}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Секции */}
      <div className="mt-8">
        <Section n="I" title="Твои стили" defaultOpen>
          {combo && (
            <div className="mb-5 border-l-2 border-wine pl-4">
              <p className="font-display text-lg italic text-cream">{combo.title}</p>
              <p className="mt-1 font-body text-[13px] leading-relaxed text-cream/70">
                {combo.description}
              </p>
            </div>
          )}
          <div className="space-y-5">
            {styles.map((s) => (
              <div key={s.id} className="border border-line bg-surface">
                <Ph src={s.image} alt={s.name} label={s.name} className="h-40 w-full" />
                <div className="p-4">
                  <h3 className="font-display text-lg text-cream">{s.name}</h3>
                  <p className="mt-1 font-body text-[13px] leading-relaxed text-cream/70">
                    {s.description}
                  </p>
                  <p className="mt-2 font-body text-[12px] italic leading-relaxed text-wine/90">
                    Почему тебе: {s.whyFits}
                  </p>
                  <button
                    onClick={() => {
                      track('style_link_click', { style: s.id });
                      haptic('light');
                      openUrl(s.pinterestUrl);
                    }}
                    className="mt-3 font-body text-[11px] uppercase tracking-[0.25em] text-cream underline decoration-wine underline-offset-4"
                  >
                    Смотреть образы →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {potential && growthStyles.length > 0 && (
            <div className="mt-8 border-t border-line pt-6">
              <p className="font-body text-[11px] uppercase tracking-[0.25em] text-wine">
                Зона роста
              </p>
              <p className="mt-2 font-body text-[13px] leading-relaxed text-cream/70">
                Тест показал, что в тебе заметно выражен ещё один архетип —{' '}
                <span className="font-display italic text-cream">
                  {archetypeById(potential).name}
                </span>{' '}
                ({scores[potential]} из 15). Это не твоя база, но направление, куда
                твой стиль может расти. Присмотрись:
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {growthStyles.map((s2) => (
                  <button
                    key={s2.id}
                    onClick={() => {
                      haptic('light');
                      openUrl(s2.pinterestUrl);
                    }}
                    className="flex flex-col border border-line bg-surface text-left focus-visible:outline focus-visible:outline-1 focus-visible:outline-wine"
                  >
                    <div className="relative">
                      <Ph src={s2.image} alt={s2.name} label={s2.name} className="h-28 w-full" />
                      <span className="absolute left-2 top-2 bg-peach px-2 py-0.5 font-body text-[9px] uppercase tracking-[0.2em] text-ink">
                        На вырост
                      </span>
                    </div>
                    <p className="p-2 font-body text-[12px] text-cream/80">{s2.name} →</p>
                  </button>
                ))}
              </div>
              <p className="mt-3 font-body text-[12px] italic leading-relaxed text-muted">
                Стоит ли развивать это направление и как совместить его с базой — это
                уже разговор для личной консультации.
              </p>
            </div>
          )}
        </Section>

        <Section n="II" title="Причёски">
          <Rules items={shape.hairRules} />
          <div className="mt-5 grid grid-cols-2 gap-3">
            {shape.hairstyles.map((h) => (
              <button
                key={h.name}
                onClick={() => {
                  haptic('light');
                  openUrl(h.pinterestUrl);
                }}
                className="flex flex-col border border-line text-left focus-visible:outline focus-visible:outline-1 focus-visible:outline-wine"
              >
                <Ph src={h.image} alt={h.name} label={h.name} className="h-28 w-full" />
                <p className="p-2 font-body text-[12px] text-cream/80">{h.name} →</p>
              </button>
            ))}
          </div>
        </Section>

        <Section n="III" title="Аксессуары">
          <Rules items={accessories} />
        </Section>

        <Section n="IV" title="Цвета">
          <p className="mb-5 font-body text-[13px] leading-relaxed text-cream/70">
            {face.paletteNote}
          </p>
          <div className="space-y-6">
            {face.primaryPalette === 'light' && (
              <>
                <PaletteBlock palette={LIGHT_PALETTE} label="Основная" />
                <PaletteBlock palette={DARK_PALETTE} label="Путь контраста" />
              </>
            )}
            {face.primaryPalette === 'dark' && (
              <>
                <PaletteBlock palette={DARK_PALETTE} label="Основная" />
                <PaletteBlock palette={LIGHT_PALETTE} label="Путь контраста" />
              </>
            )}
            {face.primaryPalette === 'both' && (
              <>
                <PaletteBlock palette={LIGHT_PALETTE} label="Палитра 1" />
                <PaletteBlock palette={DARK_PALETTE} label="Палитра 2" />
              </>
            )}
          </div>
        </Section>

        <Section n="V" title="Борода">
          <Rules items={face.beardRules} />
        </Section>

        <Section n="VI" title="Посадка вещей">
          <Rules items={body.fitRules} />
        </Section>
      </div>

      {/* CTA */}
      <div className="mt-10 border border-wine/60 bg-peach/25 p-6 text-center">
        <p className="font-display text-xl italic leading-snug text-ink">
          Это карта. Дальше — дорога.
        </p>
        <p className="mt-3 font-body text-[13px] leading-relaxed text-cream/70">
          {APP_CONFIG.cta.subtext}
        </p>
        <button
          onClick={() => {
            track('cta_click');
            haptic('medium');
            openUrl(APP_CONFIG.cta.url);
          }}
          className="mt-5 w-full bg-wine py-4 font-body text-sm font-semibold uppercase tracking-[0.2em] text-canvas transition-colors active:bg-winedeep"
        >
          {APP_CONFIG.cta.text}
        </button>
        <button
          onClick={share}
          className="mt-3 w-full border border-line bg-surface py-3.5 font-body text-xs uppercase tracking-[0.25em] text-cream/80 transition-colors active:border-wine"
        >
          Поделиться результатом
        </button>
      </div>
    </Screen>
  );
}
