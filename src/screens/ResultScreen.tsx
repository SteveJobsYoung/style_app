import { useState } from 'react';
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
import { selectStyles } from '../logic/styleSelection';
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

  const { styleIds, combo } = selectStyles(state.archetypes);
  const styles = styleIds.map(styleById);
  const accessories = [...new Set(archs.flatMap((a) => a.accessories))];

  const share = () => {
    haptic('medium');
    shareText(
      `${APP_CONFIG.shareText}\n\nМой архетип: ${archs.map((a) => a.name).join(' + ')}`,
      APP_CONFIG.botUrl
    );
  };

  return (
    <Screen withAction={false}>
      {/* Паспорт стиля */}
      <div className="relative overflow-hidden border border-wine/40 bg-surface p-6">
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-peach/40 blur-3xl"
          aria-hidden
        />
        <Eyebrow>Твой стилевой паспорт</Eyebrow>
        <h1 className="font-display text-[34px] font-medium leading-tight text-cream">
          {archs.map((a) => a.name).join(' + ')}
        </h1>
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
