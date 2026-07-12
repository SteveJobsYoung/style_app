// Обвязка над Telegram WebApp API с фолбэками для локальной разработки в браузере.

interface TgMainButton {
  setParams: (p: {
    text?: string;
    color?: string;
    text_color?: string;
    is_active?: boolean;
    is_visible?: boolean;
  }) => void;
  show: () => void;
  hide: () => void;
  onClick: (cb: () => void) => void;
  offClick: (cb: () => void) => void;
}

interface TgWebApp {
  initData: string;
  platform: string;
  expand: () => void;
  ready: () => void;
  MainButton: TgMainButton;
  HapticFeedback?: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
  };
  openTelegramLink: (url: string) => void;
  openLink: (url: string) => void;
  setBackgroundColor?: (color: string) => void;
  setHeaderColor?: (color: string) => void;
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TgWebApp };
  }
}

export const tg = (): TgWebApp | null => window.Telegram?.WebApp ?? null;

// Скрипт telegram-web-app.js создаёт window.Telegram.WebApp даже в обычном
// браузере, поэтому проверяем реальное окружение: внутри Telegram initData
// не пустая, а platform не 'unknown'.
export const isTelegram = () => {
  const w = tg();
  if (!w) return false;
  return w.initData.length > 0 || (w.platform !== undefined && w.platform !== 'unknown');
};

export function initTelegram() {
  const w = tg();
  if (!w) return;
  w.ready();
  w.expand();
  w.setBackgroundColor?.('#FFF8F0');
  w.setHeaderColor?.('#FFF8F0');
}

export function haptic(style: 'light' | 'medium' | 'heavy' = 'light') {
  tg()?.HapticFeedback?.impactOccurred(style);
}

export function hapticSuccess() {
  tg()?.HapticFeedback?.notificationOccurred('success');
}

export function openUrl(url: string) {
  const w = tg();
  if (!w) {
    window.open(url, '_blank');
    return;
  }
  if (url.startsWith('https://t.me/')) w.openTelegramLink(url);
  else w.openLink(url);
}

export function shareText(text: string, url: string) {
  const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
  openUrl(shareUrl);
}
