# Style Is All You Need — Telegram Mini App

Стилевая диагностика для мужчин: архетипы (15 вопросов) → адаптация под
внешность → персональный результат с паспортом стиля.

## Стек
React + Vite + TypeScript + Tailwind CSS + Zustand. Весь результат считается на
клиенте, бэкенда нет.

## Запуск локально
```bash
npm install
npm run dev        # http://localhost:5173 — работает и в обычном браузере
npm test           # юнит-тесты скоринга и логики конфликта
npm run build      # прод-сборка в dist/
```
Вне Telegram главная кнопка рендерится внизу экрана как фолбэк — можно тестировать
весь флоу в браузере.

## Где редактировать контент (без правки логики)
Всё в `src/content/`:
- `questions.ts` — 15 вопросов × 5 ответов
- `archetypes.ts` — описания архетипов, их стили и правила по аксессуарам
- `styles.ts` — стили, описания и ссылки на Pinterest-борды (`pinterestUrl`)
- `appearance.ts` — фигуры, типы лица, палитры, формы лица, причёски, борода
- `config.ts` — тексты приветствия, **ссылка на консультацию (CTA)** и ссылка на бота для шеринга

Картинки — см. `ASSETS.md`. Пока их нет, показываются плейсхолдеры.

## Деплой (Vercel)
1. Залей репозиторий на GitHub
2. vercel.com → Add New Project → выбери репо
3. Framework: Vite (подхватится сам), Build: `npm run build`, Output: `dist`
4. Deploy → получишь https-ссылку вида `https://твой-проект.vercel.app`

Альтернатива — Cloudflare Pages: Pages → Create → подключи репо,
Build command `npm run build`, Output `dist`.

Mini App обязан работать по HTTPS — оба варианта дают это из коробки.

## Подключение к боту через BotFather
1. Создай бота: `@BotFather` → `/newbot` (если ещё нет)
2. `/newapp` → выбери бота → заполни название, описание, загрузи превью
3. В поле **Web App URL** вставь ссылку с Vercel/Cloudflare
4. Готово: приложение открывается через кнопку бота или прямую ссылку
   `https://t.me/ТВОЙ_БОТ/НАЗВАНИЕ_APP`

Чтобы кнопка меню бота открывала Mini App: `@BotFather` → `/mybots` → бот →
Bot Settings → Menu Button → вставь тот же URL.

## Логика (для справки)
- Скоринг: `src/logic/scoring.ts` (+ тесты `scoring.test.ts`)
- Два архетипа выдаются, если разрыв между №1 и №2 ≤ 2 балла
