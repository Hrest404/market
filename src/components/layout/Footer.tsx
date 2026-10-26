import Link from "next/link";
import { ShieldCheck, Truck, ArrowCounterClockwise, CreditCard } from "@phosphor-icons/react/dist/ssr";

export function Footer() {
  return (
    <footer className="bg-[#25252B] text-slate-400 mt-20 border-t border-[#32323A]">
      {/* Advantages strip */}
      <div className="border-b border-[#32323A] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[#1A1A1E] text-[#528A9A] border border-white/5">
              <Truck size={24} />
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold mb-1">Быстрая доставка</h4>
              <p className="text-xs text-slate-400">Курьером по Ташкенту день-в-день и экспресс по регионам</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[#1A1A1E] text-[#528A9A] border border-white/5">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold mb-1">Официальная гарантия</h4>
              <p className="text-xs text-slate-400">12 месяцев гарантии сервисного центра на всю технику</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[#1A1A1E] text-[#528A9A] border border-white/5">
              <ArrowCounterClockwise size={24} />
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold mb-1">Обмен и возврат</h4>
              <p className="text-xs text-slate-400">14 дней на проверку устройства без лишних вопросов</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[#1A1A1E] text-[#528A9A] border border-white/5">
              <CreditCard size={24} />
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold mb-1">Удобная оплата</h4>
              <p className="text-xs text-slate-400">Карты Uzum/Payme/Click, наличными или Stripe (тест)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h5 className="text-[#D9E7E8] text-sm font-semibold mb-4 tracking-wide uppercase text-xs">Каталог товаров</h5>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/catalog?category=smartphones" className="hover:text-[#D9E7E8] transition">Смартфоны</Link></li>
              <li><Link href="/catalog?category=laptops" className="hover:text-[#D9E7E8] transition">Ноутбуки</Link></li>
              <li><Link href="/catalog?category=tablets" className="hover:text-[#D9E7E8] transition">Планшеты</Link></li>
              <li><Link href="/catalog?category=headphones" className="hover:text-[#D9E7E8] transition">Аудио & Наушники</Link></li>
              <li><Link href="/catalog?category=smart-watches" className="hover:text-[#D9E7E8] transition">Смарт-часы</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-[#D9E7E8] text-sm font-semibold mb-4 tracking-wide uppercase text-xs">Клиентам</h5>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/compare" className="hover:text-[#D9E7E8] transition">Сравнение техники</Link></li>
              <li><Link href="/favorites" className="hover:text-[#D9E7E8] transition">Список желаний</Link></li>
              <li><Link href="/cart" className="hover:text-[#D9E7E8] transition">Корзина</Link></li>
              <li><Link href="/account" className="hover:text-[#D9E7E8] transition">История заказов</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-[#D9E7E8] text-sm font-semibold mb-4 tracking-wide uppercase text-xs">Магазин</h5>
            <ul className="space-y-2.5 text-xs">
              <li><span className="text-slate-300">г. Ташкент, ул. Амира Темура, 45</span></li>
              <li><span className="text-slate-300">Пн-Вс: 09:00 — 21:00</span></li>
              <li><span className="text-slate-300">+998 (71) 200-00-20</span></li>
              <li><span className="text-slate-300">support@apextech.uz</span></li>
            </ul>
          </div>
          <div>
            <h5 className="text-[#D9E7E8] text-sm font-semibold mb-4 tracking-wide uppercase text-xs">APEX TECH</h5>
            <p className="text-xs leading-relaxed text-slate-400 mb-4">
              Фирменный интернет-магазин оригинальной электроники в Узбекистане.
            </p>
            <div className="p-3 rounded-xl bg-[#1A1A1E] border border-white/5 text-[11px] text-slate-300">
              🛡 Тестовая демонстрационная платформа с интеграцией Telegram Mini App и мобильного приложения.
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#32323A] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 APEX TECH. Все права защищены.</p>
          <div className="flex gap-6">
            <span>Политика конфиденциальности</span>
            <span>Публичная оферта</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
