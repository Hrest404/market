"use client";

import { useEffect, useState } from "react";

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export function useTelegram() {
  const [isReady, setIsReady] = useState(false);
  const [tgUser, setTgUser] = useState<TelegramUser | null>(null);
  const [isTelegramApp, setIsTelegramApp] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const tg = (window as unknown as { Telegram?: { WebApp?: any } }).Telegram?.WebApp;

    if (tg) {
      try {
        tg.ready();
        tg.expand(); // Раскрываем на весь экран в Telegram

        if (tg.initDataUnsafe?.user) {
          setTgUser(tg.initDataUnsafe.user);
          setIsTelegramApp(true);
        }

        setIsReady(true);
      } catch (e) {
        console.warn("Telegram WebApp initialization error:", e);
      }
    }
  }, []);

  const showMainButton = (text: string, onClick: () => void) => {
    const tg = (window as unknown as { Telegram?: { WebApp?: any } }).Telegram?.WebApp;
    if (tg?.MainButton) {
      tg.MainButton.text = text;
      tg.MainButton.show();
      tg.MainButton.onClick(onClick);
    }
  };

  const hideMainButton = () => {
    const tg = (window as unknown as { Telegram?: { WebApp?: any } }).Telegram?.WebApp;
    if (tg?.MainButton) {
      tg.MainButton.hide();
    }
  };

  const hapticFeedback = () => {
    const tg = (window as unknown as { Telegram?: { WebApp?: any } }).Telegram?.WebApp;
    if (tg?.HapticFeedback) {
      tg.HapticFeedback.impactOccurred("medium");
    }
  };

  return {
    isReady,
    isTelegramApp,
    user: tgUser,
    showMainButton,
    hideMainButton,
    hapticFeedback,
  };
}
