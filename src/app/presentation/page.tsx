"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Play, Pause, ArrowRight, ArrowLeft, DeviceMobile, 
  Globe, PaperPlaneTilt, MapPin, CheckCircle, Database, 
  CreditCard, Sparkle, Laptop
} from "@phosphor-icons/react";

interface Slide {
  id: number;
  timeRange: string;
  tag: string;
  title: string;
  subtitle: string;
  badgeColor: string;
  bulletPoints: string[];
  metrics: { label: string; value: string }[];
  visualType: "web" | "checkout_map" | "tma" | "mobile" | "tech";
}

const SLIDES: Slide[] = [
  {
    id: 1,
    timeRange: "0:00 — 0:15",
    tag: "Веб-платформа & Архитектура",
    title: "APEX TECH: Флагманский магазин электроники в Ташкенте",
    subtitle: "Современная омниканальная витрина с мгновенной фильтрацией, поиском и адаптивной Bento-сеткой.",
    badgeColor: "bg-blue-500/10 text-blue-700 border-blue-200",
    bulletPoints: [
      "Bento Grid с акцентом на флагманские девайсы (Apple, Samsung, Sony)",
      "Мгновенный поиск товаров и живая фильтрация без перезагрузки",
      "Синхронизация каталога и остатков через Serverless PostgreSQL в Neon",
      "SSR на Next.js 16 с компиляцией Turbopack для максимальной скорости",
    ],
    metrics: [
      { label: "Скорость загрузки", value: "< 0.8с" },
      { label: "Товаров в каталоге", value: "1000+" },
      { label: "Платформа", value: "Next.js 16" },
    ],
    visualType: "web",
  },
  {
    id: 2,
    timeRange: "0:15 — 0:40",
    tag: "Логистика & Чекаут",
    title: "Интерактивная карта доставки в Ташкенте (как в Яндекс Go)",
    subtitle: "Умный геокодер с поиском по ориентирам города и перемещаемым маркером.",
    badgeColor: "bg-amber-500/10 text-amber-700 border-amber-200",
    bulletPoints: [
      "Поиск по названиям: метро, рынки (Чорсу, Фархадский), ТЦ и ориентиры",
      "Плавное центрирование карты и интерактивный drag-and-drop маркера",
      "Автоматическое обратное геокодирование в реальный адрес",
      "Поля подъезда, этажа, квартиры и выбор способов оплаты (Stripe / курьеру)",
    ],
    metrics: [
      { label: "Точность координат", value: "До метра" },
      { label: "База геокодера", value: "Photon + OSM" },
      { label: "Оплата", value: "Stripe & Наличные" },
    ],
    visualType: "checkout_map",
  },
  {
    id: 3,
    timeRange: "0:40 — 0:55",
    tag: "Telegram Экосистема",
    title: "Нативный Telegram Mini App без дублирования кода",
    subtitle: "Пользователи оформляют заказ прямо внутри мессенджера за пару касаний.",
    badgeColor: "bg-sky-500/10 text-sky-700 border-sky-200",
    bulletPoints: [
      "Автоматическая инициализация через официальный SDK (@telegram-apps)",
      "Раскрытие на весь экран (tg.expand()) и получение профиля покупателя",
      "Тактильный отклик (HapticFeedback) при добавлении товаров в корзину",
      "Единая база данных: заказ из Telegram сразу виден в общей CRM",
    ],
    metrics: [
      { label: "Канал продаж", value: "Telegram" },
      { label: "Авторизация", value: "Бесшовная" },
      { label: "UX", value: "Full Screen" },
    ],
    visualType: "tma",
  },
  {
    id: 4,
    timeRange: "0:55 — 1:15",
    tag: "Mobile Native",
    title: "Мобильное приложение (React Native & Expo)",
    subtitle: "Автономное нативное приложение для iOS и Android с единым API-бэкендом.",
    badgeColor: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
    bulletPoints: [
      "Кроссплатформенная кодовая база на React Native в папке apps_mobile",
      "Поддержка работы через облачный туннель Expo (без ограничений Wi-Fi)",
      "Плавные 60 FPS жесты, нативная корзина и просмотр характеристик",
      "Готовность к сборке в App Store и Google Play через EAS Build",
    ],
    metrics: [
      { label: "Движок", value: "React Native" },
      { label: "Bundler", value: "Metro Expo" },
      { label: "Платформы", value: "iOS / Android" },
    ],
    visualType: "mobile",
  },
  {
    id: 5,
    timeRange: "1:15 — 1:30",
    tag: "Технологический стек",
    title: "Единый бэкенд, три канала продаж, полная готовность",
    subtitle: "Инженерная основа проекта: масштабируемая, безопасная и развернутая.",
    badgeColor: "bg-purple-500/10 text-purple-700 border-purple-200",
    bulletPoints: [
      "База данных: Neon PostgreSQL Serverless с пулом соединений",
      "Фронтенд: Next.js 16 (App Router), React 19, Tailwind CSS",
      "Платежи: Stripe Checkout API + безопасные вебхуки",
      "Хранилище: S3-совместимый Storage для фотографий каталога",
    ],
    metrics: [
      { label: "Репозиторий", value: "Hrest404/market" },
      { label: "БД", value: "Neon PostgreSQL" },
      { label: "Готовность", value: "100% Production" },
    ],
    visualType: "tech",
  },
];

export default function PresentationPage() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const slide = SLIDES[currentSlideIndex];

  // Автоплей слайдов по таймеру
  useEffect(() => {
    if (!isPlaying) {
      setProgress(0);
      return;
    }

    const interval = 100;
    const duration = 12000; // 12 секунд на слайд
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentSlideIndex((old) => (old + 1) % SLIDES.length);
          return 0;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, currentSlideIndex]);

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % SLIDES.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-slate-100 flex flex-col justify-between p-4 sm:p-8 font-sans selection:bg-[#528A9A] selection:text-white">
      {/* Верхняя навигация презентации */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#375E6A] to-[#528A9A] flex items-center justify-center font-bold text-white shadow-lg shadow-[#528A9A]/20 text-lg">
            A
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-wide text-white">APEX TECH</span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Live Video Presentation
              </span>
            </div>
            <p className="text-xs text-slate-400">Презентация омниканальной платформы электроники</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold transition border border-slate-700 text-slate-200"
          >
            ← В магазин
          </Link>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-md ${
              isPlaying 
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" 
                : "bg-[#528A9A] text-white hover:bg-[#437381]"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" /> Пауза автоплея
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> Запустить автоплей (Loom)
              </>
            )}
          </button>
        </div>
      </header>

      {/* Полоса прогресса автоплея */}
      {isPlaying && (
        <div className="w-full bg-slate-800/50 h-1 rounded-full overflow-hidden my-3">
          <div 
            className="bg-[#528A9A] h-full transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Основной интерактивный слайд */}
      <main className="my-auto py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-7xl mx-auto w-full">
        {/* Левая колонка: Текст презентации и буллеты */}
        <div className="lg:col-span-6 space-y-6">
          <div className="flex items-center gap-3">
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${slide.badgeColor}`}>
              {slide.tag}
            </span>
            <span className="text-xs font-mono text-slate-400 bg-slate-800/60 px-2.5 py-1 rounded-lg border border-slate-700">
              ⏱ {slide.timeRange}
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {slide.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              {slide.subtitle}
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            {slide.bulletPoints.map((point, i) => (
              <div key={i} className="flex items-start gap-3 bg-slate-800/40 p-3 rounded-2xl border border-slate-800 hover:border-slate-700 transition">
                <div className="w-5 h-5 rounded-full bg-[#528A9A]/20 text-[#528A9A] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-xs sm:text-sm text-slate-300 font-medium">
                  {point}
                </span>
              </div>
            ))}
          </div>

          {/* Ключевые метрики слайда */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {slide.metrics.map((m, i) => (
              <div key={i} className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl text-center">
                <div className="text-base sm:text-xl font-bold text-white font-mono">{m.value}</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Правая колонка: Интерактивный интерактивный макет/визуал */}
        <div className="lg:col-span-6">
          <div className="relative rounded-3xl bg-gradient-to-b from-slate-800/50 to-slate-900/90 border border-slate-700/80 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            {/* 1. Визуал Web Store */}
            {slide.visualType === "web" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-xs font-mono text-slate-400">apextech.uz</span>
                  <Globe className="w-4 h-4 text-slate-400" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                    <div className="text-[11px] text-slate-400">Смартфоны</div>
                    <div className="text-sm font-bold text-white mt-1">Galaxy S24 Ultra</div>
                    <div className="text-xs text-emerald-400 font-mono mt-1">15 400 000 сум</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                    <div className="text-[11px] text-slate-400">Ноутбуки</div>
                    <div className="text-sm font-bold text-white mt-1">MacBook Pro 16</div>
                    <div className="text-xs text-emerald-400 font-mono mt-1">28 900 000 сум</div>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
                  <span>⚡ Серверный рендеринг Next.js 16</span>
                  <span className="text-emerald-400 font-mono font-bold">200 OK</span>
                </div>
              </div>
            )}

            {/* 2. Визуал Яндекс Доставки */}
            {slide.visualType === "checkout_map" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-700 pb-3 text-xs text-slate-300">
                  <span className="font-semibold flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-amber-400" /> Выбор на карте Ташкента
                  </span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">Яндекс Style</span>
                </div>
                <div className="h-44 rounded-2xl bg-slate-950 border border-slate-800 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
                  <div className="relative text-center">
                    <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-900 mx-auto flex items-center justify-center font-bold shadow-lg shadow-amber-400/30 animate-bounce">
                      📍
                    </div>
                    <div className="text-xs font-semibold text-white mt-2">Рынок Чорсу, Ташкент</div>
                    <div className="text-[10px] text-slate-400 font-mono">41.3258° N, 69.2368° E</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700">Подъезд: 2</div>
                  <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700">Этаж: 4</div>
                  <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700">Кв: 45</div>
                </div>
              </div>
            )}

            {/* 3. Визуал Telegram Mini App */}
            {slide.visualType === "tma" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-700 pb-3 text-xs text-sky-400">
                  <span className="font-semibold flex items-center gap-1.5">
                    <PaperPlaneTilt className="w-4 h-4" /> Telegram WebApp Client
                  </span>
                  <span className="text-[10px] bg-sky-500/20 px-2 py-0.5 rounded-full font-mono">tg.expand()</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#17212B] border border-sky-500/30 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-xs">
                      TG
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Привет, Тимур! 👋</div>
                      <div className="text-[10px] text-slate-400">Открыто внутри Telegram Mini App</div>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#242F3D] text-xs text-slate-200 flex justify-between items-center">
                    <span>Корзина (2 товара)</span>
                    <span className="font-mono font-bold text-sky-400">24 800 000 сум</span>
                  </div>
                  <button className="w-full py-2.5 rounded-xl bg-[#2481CC] text-white font-bold text-xs shadow-md">
                    Оформить заказ в Telegram
                  </button>
                </div>
              </div>
            )}

            {/* 4. Визуал Mobile App */}
            {slide.visualType === "mobile" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-700 pb-3 text-xs text-emerald-400">
                  <span className="font-semibold flex items-center gap-1.5">
                    <DeviceMobile className="w-4 h-4" /> React Native (Expo Go)
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded-full font-mono">Tunnel Active</span>
                </div>
                <div className="mx-auto w-48 h-56 rounded-3xl border-4 border-slate-700 bg-slate-950 p-3 flex flex-col justify-between shadow-xl">
                  <div className="w-12 h-1 bg-slate-800 rounded-full mx-auto" />
                  <div className="space-y-1.5 text-center my-auto">
                    <div className="text-xs font-bold text-white">APEX Mobile</div>
                    <div className="text-[10px] text-emerald-400">60 FPS Native UI</div>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-[8px] text-center text-slate-400 pt-2 border-t border-slate-800">
                    <div>Каталог</div>
                    <div className="text-white font-bold">Корзина</div>
                    <div>Профиль</div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. Визуал Tech Stack */}
            {slide.visualType === "tech" && (
              <div className="space-y-3">
                <div className="text-xs font-bold text-purple-400 border-b border-slate-700 pb-2">
                  Архитектурный стек
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex justify-between items-center">
                    <span className="flex items-center gap-2 text-slate-300">
                      <Database className="w-4 h-4 text-emerald-400" /> Database
                    </span>
                    <span className="font-mono text-emerald-400">Neon Serverless PG</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex justify-between items-center">
                    <span className="flex items-center gap-2 text-slate-300">
                      <CreditCard className="w-4 h-4 text-sky-400" /> Payments
                    </span>
                    <span className="font-mono text-sky-400">Stripe Webhooks</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex justify-between items-center">
                    <span className="flex items-center gap-2 text-slate-300">
                      <Laptop className="w-4 h-4 text-purple-400" /> Core
                    </span>
                    <span className="font-mono text-purple-400">Next.js 16 + Turbopack</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Нижняя панель переключения слайдов */}
      <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-5">
        <div className="flex items-center gap-2">
          {SLIDES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                setCurrentSlideIndex(idx);
                setProgress(0);
              }}
              className={`h-2.5 rounded-full transition-all ${
                idx === currentSlideIndex 
                  ? "w-8 bg-[#528A9A]" 
                  : "w-2.5 bg-slate-700 hover:bg-slate-600"
              }`}
              title={s.title}
            />
          ))}
          <span className="text-xs text-slate-400 ml-2 font-mono">
            {currentSlideIndex + 1} / {SLIDES.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition border border-slate-700"
            title="Предыдущий слайд"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="px-4 py-2.5 rounded-xl bg-[#528A9A] hover:bg-[#437381] text-white font-bold text-xs transition flex items-center gap-2 shadow-md shadow-[#528A9A]/20"
            title="Следующий слайд"
          >
            Следующий слайд
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}
