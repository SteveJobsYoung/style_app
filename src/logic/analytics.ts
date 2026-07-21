// Лёгкая аналитика через PostHog Capture API — без библиотек и бэкенда.
// Работает, только если задан ключ VITE_POSTHOG_KEY (в Vercel → Environment Variables).
// Без ключа все вызовы — тихие no-op, приложение работает как раньше.

import { tg } from '../telegram';

// Чистим значения от случайных кавычек/бэктиков/пробелов при копипасте из доков
const clean = (v: string | undefined) =>
  v?.replace(/[`'"\s]/g, '').replace(/\/+$/, '') || undefined;

const KEY = clean(import.meta.env.VITE_POSTHOG_KEY as string | undefined);
const HOST =
  clean(import.meta.env.VITE_POSTHOG_HOST as string | undefined) ??
  'https://eu.i.posthog.com';

let sessionId: string | null = null;

/** Стабильный id: Telegram user id, иначе случайный на сессию. */
function distinctId(): string {
  const tgId = tg()?.initDataUnsafe?.user?.id;
  if (tgId) return `tg_${tgId}`;
  if (!sessionId) sessionId = `anon_${Math.random().toString(36).slice(2, 12)}`;
  return sessionId;
}

/** Метка источника из ссылки t.me/bot/app?startapp=МЕТКА */
export function getSource(): string {
  return tg()?.initDataUnsafe?.start_param ?? 'direct';
}

export function track(event: string, props: Record<string, unknown> = {}) {
  if (!KEY) return;
  try {
    fetch(`${HOST}/capture/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: KEY,
        event,
        distinct_id: distinctId(),
        properties: {
          ...props,
          source: getSource(),
          $current_url: 'miniapp',
        },
      }),
      keepalive: true, // событие долетит, даже если человек закрывает апку
    }).catch(() => {});
  } catch {
    /* аналитика никогда не должна ломать приложение */
  }
}
