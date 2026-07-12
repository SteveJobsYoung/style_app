import { useEffect, useRef, useState } from 'react';
import { tg, isTelegram, haptic } from '../telegram';

/* ── Главная кнопка: Telegram MainButton + фолбэк для браузера ── */

export function PrimaryAction({
  text,
  onClick,
  disabled = false,
  visible = true,
}: {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  visible?: boolean;
}) {
  const cbRef = useRef(onClick);
  cbRef.current = onClick;

  useEffect(() => {
    const w = tg();
    if (!w) return;
    const handler = () => cbRef.current();
    w.MainButton.onClick(handler);
    return () => w.MainButton.offClick(handler);
  }, []);

  useEffect(() => {
    const w = tg();
    if (!w) return;
    w.MainButton.setParams({
      text: text.toUpperCase(),
      color: disabled ? '#E7DECF' : '#92140C',
      text_color: disabled ? '#8A8275' : '#FFF8F0',
      is_active: !disabled,
      is_visible: visible,
    });
    if (visible) w.MainButton.show();
    else w.MainButton.hide();
    return () => w.MainButton.hide();
  }, [text, disabled, visible]);

  if (isTelegram() || !visible) return null;

  // Фолбэк вне Telegram (локальная разработка)
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-canvas via-canvas/95 to-transparent px-5 pb-6 pt-10">
      <button
        onClick={() => {
          if (!disabled) {
            haptic('medium');
            onClick();
          }
        }}
        disabled={disabled}
        className={`w-full rounded-none py-4 font-body text-sm font-semibold uppercase tracking-[0.2em] transition-colors ${
          disabled
            ? 'bg-line text-muted'
            : 'bg-wine text-canvas active:bg-winedeep'
        }`}
      >
        {text}
      </button>
    </div>
  );
}

/* ── Прогресс-бар ── */

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="fixed left-0 right-0 top-0 z-50 h-[3px] bg-line/60">
      <div
        className="h-full bg-wine transition-all duration-500 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value * 100))}%` }}
      />
    </div>
  );
}

/* ── Кнопка «назад» ── */

export function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={() => {
        haptic('light');
        onClick();
      }}
      aria-label="Назад"
      className="mb-6 flex items-center gap-2 font-body text-xs uppercase tracking-[0.25em] text-muted transition-colors hover:text-cream focus-visible:outline focus-visible:outline-1 focus-visible:outline-wine"
    >
      <span aria-hidden>←</span> Назад
    </button>
  );
}

/* ── Картинка с элегантным фолбэком (пока нет ассетов) ── */

export function Ph({
  src,
  alt,
  className = '',
  label,
}: {
  src: string;
  alt: string;
  className?: string;
  label?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-[#F3E7D6] via-peach/40 to-wine/20 ${className}`}
        role="img"
        aria-label={alt}
      >
        <span className="select-none font-display text-4xl italic text-ink/30">
          {(label ?? alt).charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}

/* ── Обёртка экрана ── */

export function Screen({
  children,
  withAction = true,
}: {
  children: React.ReactNode;
  withAction?: boolean;
}) {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);
  return (
    <div
      className={`animate-fadein mx-auto min-h-screen w-full max-w-[420px] px-5 pt-8 ${
        withAction ? 'pb-32' : 'pb-10'
      }`}
    >
      {children}
    </div>
  );
}

/* ── Эйбрау-надпись над заголовком ── */

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 font-body text-[11px] uppercase tracking-[0.3em] text-wine">
      {children}
    </p>
  );
}
