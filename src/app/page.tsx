"use client";

import Link from "next/link";
import { ArrowRight, Sparkle, Lightning, ShieldCheck, Flame, DeviceMobile, Laptop, Headphones, DeviceTablet, Watch, PlugCharging } from "@phosphor-icons/react";
import { MOCK_PRODUCTS, CATEGORIES } from "@/lib/mock-data";
import { ProductCard } from "@/components/product/ProductCard";
import { formatPrice } from "@/lib/utils";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  smartphones: <DeviceMobile size={24} />,
  laptops: <Laptop size={24} />,
  tablets: <DeviceTablet size={24} />,
  headphones: <Headphones size={24} />,
  "smart-watches": <Watch size={24} />,
  accessories: <PlugCharging size={24} />,
};

export default function HomePage() {
  const heroProduct = MOCK_PRODUCTS.find((p) => p.slug === "apple-iphone-16-pro-max-256gb-natural-titanium") || MOCK_PRODUCTS[0];
  const macbookProduct = MOCK_PRODUCTS.find((p) => p.slug === "apple-macbook-pro-16-m3-max-space-black");
  const popularProducts = MOCK_PRODUCTS.filter((p) => p.isPopular);
  const newProducts = MOCK_PRODUCTS.filter((p) => p.isNew);

  return (
    <div className="space-y-16">
      {/* SECTION: Hero & Bento Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Main Hero Card */}
        <div className="lg:col-span-8 bg-gradient-to-br from-[#25252B] via-[#2D2E35] to-[#1E2528] border border-[#3E4549] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden flex flex-col justify-between shadow-2xl">
          <div className="relative z-10 max-w-xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#528A9A]/20 text-[#D9E7E8] text-xs font-semibold tracking-wide border border-[#528A9A]/40 mb-6">
              <Sparkle size={14} weight="fill" className="text-[#D9E7E8]" />
              Флагман 2026 года в Ташкенте
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-4 text-[#D9E7E8]">
              {heroProduct.name}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-md">
              Титановый корпус, прорывной чип A18 Pro и непревзойденная система камер. В наличии с официальной гарантией.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={`/product/${heroProduct.slug}`}
                className="px-6 py-3.5 rounded-xl bg-[#528A9A] hover:bg-[#437381] text-white font-semibold text-sm transition flex items-center gap-2 shadow-lg shadow-[#528A9A]/30 active:scale-95"
              >
                Купить за {formatPrice(heroProduct.priceUzs)}
                <ArrowRight size={16} weight="bold" />
              </Link>
              <Link
                href="/catalog"
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#D9E7E8] font-medium text-sm transition backdrop-blur-sm border border-white/10"
              >
                Все новинки
              </Link>
            </div>
          </div>

          {/* Floating Hero Image */}
          <div className="mt-8 lg:mt-0 lg:absolute lg:right-6 lg:bottom-6 w-full lg:w-80 aspect-square flex items-center justify-center pointer-events-none">
            <img
              src={heroProduct.images[0]}
              alt={heroProduct.name}
              className="w-full h-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.6)] transform lg:scale-110"
            />
          </div>
        </div>

        {/* Side Bento Banners */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Bento 1: MacBook Pro */}
          {macbookProduct && (
            <div className="flex-1 bg-white rounded-3xl p-6 border border-[#D9E7E8] shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-[#528A9A] transition">
              <div>
                <span className="text-[11px] font-bold text-[#528A9A] uppercase tracking-wider">
                  Для профессионалов
                </span>
                <h3 className="text-xl font-bold text-[#25252B] mt-1 mb-2 group-hover:text-[#528A9A] transition">
                  MacBook Pro M3 Max
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                  До 22 часов автономной работы и максимальная мощность для тяжелых задач.
                </p>
              </div>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-sm font-bold text-[#25252B]">
                  {formatPrice(macbookProduct.priceUzs)}
                </span>
                <Link
                  href={`/product/${macbookProduct.slug}`}
                  className="p-2.5 rounded-xl bg-[#D9E7E8]/40 group-hover:bg-[#528A9A] group-hover:text-white transition text-[#25252B]"
                >
                  <ArrowRight size={18} weight="bold" />
                </Link>
              </div>
            </div>
          )}

          {/* Bento 2: Delivery & Express info */}
          <div className="bg-[#D9E7E8]/35 border border-[#D9E7E8] rounded-3xl p-6 flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-[#528A9A] text-white shrink-0 shadow-sm">
              <Lightning size={28} weight="fill" />
            </div>
            <div>
              <h4 className="text-[#25252B] font-bold text-sm">Экспресс-доставка по Ташкенту</h4>
              <p className="text-xs text-[#25252B]/75 mt-0.5">
                Закажите сейчас и получите технику курьером в течение 2 часов.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: Categories Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#25252B]">Популярные категории</h2>
            <p className="text-xs sm:text-sm text-slate-500">Быстрый переход к интересующим устройствам</p>
          </div>
          <Link
            href="/catalog"
            className="text-xs sm:text-sm font-semibold text-[#528A9A] hover:text-[#437381] flex items-center gap-1"
          >
            Весь каталог
            <ArrowRight size={14} weight="bold" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/catalog?category=${cat.id}`}
              className="flex flex-col items-center text-center p-5 rounded-2xl bg-white border border-[#D9E7E8] hover:border-[#528A9A] hover:shadow-md transition group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#D9E7E8]/40 group-hover:bg-[#528A9A] text-[#25252B] group-hover:text-white flex items-center justify-center mb-3 transition">
                {CATEGORY_ICONS[cat.id] || <Sparkle size={24} />}
              </div>
              <span className="text-xs sm:text-sm font-semibold text-[#25252B] group-hover:text-[#528A9A] transition">
                {cat.name}
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5">
                {cat.itemCount} товаров
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* SECTION: Popular Products */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[#D9E7E8]/50 text-[#528A9A]">
              <Flame size={20} weight="fill" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#25252B]">Хиты продаж</h2>
              <p className="text-xs text-slate-500">Самые востребованные устройства недели</p>
            </div>
          </div>
          <Link
            href="/catalog?sort=popular"
            className="text-xs sm:text-sm font-semibold text-[#528A9A] hover:text-[#437381] flex items-center gap-1"
          >
            Смотреть все
            <ArrowRight size={14} weight="bold" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* SECTION: New Arrivals */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#25252B]">Новинки каталога</h2>
            <p className="text-xs text-slate-500">Свежие релизы мировых брендов</p>
          </div>
          <Link
            href="/catalog?sort=new"
            className="text-xs sm:text-sm font-semibold text-[#528A9A] hover:text-[#437381] flex items-center gap-1"
          >
            Все новинки
            <ArrowRight size={14} weight="bold" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
