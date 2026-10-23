"use client";

import { useTelegram } from "@/lib/use-telegram";
import Script from "next/script";

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const { isTelegramApp, user } = useTelegram();

  return (
    <>
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="beforeInteractive"
      />
      {/* Banner if opened inside Telegram */}
      {isTelegramApp && user && (
        <div className="bg-[#528A9A] text-white text-xs px-4 py-1.5 flex items-center justify-between border-b border-[#437381]">
          <span>👋 Привет, {user.first_name}! Вы открыли магазин через Telegram Mini App</span>
          <span className="font-semibold text-[10px] bg-[#25252B] text-[#D9E7E8] px-2 py-0.5 rounded-full">TMA Sync</span>
        </div>
      )}
      {children}
    </>
  );
}
