import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBAPP_URL = process.env.NEXTAUTH_URL || "https://your-domain.uz";

if (!TELEGRAM_BOT_TOKEN) {
  console.log("ℹ️ TELEGRAM_BOT_TOKEN не указан в .env.local.");
  console.log("👉 Для запуска бота укажите TELEGRAM_BOT_TOKEN=\"...\" в .env.local");
  console.log("Пример создания кнопки запуска WebApp:");
  console.log(`
const keyboard = {
  inline_keyboard: [
    [
      {
        text: "🛍 Открыть магазин электроники",
        web_app: { url: "${WEBAPP_URL}" }
      }
    ]
  ]
};
  `);
} else {
  console.log("🚀 Telegram Bot конфигурация готова. Токен найден!");
}
