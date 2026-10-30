"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MagnifyingGlass,
  ShoppingCartSimple,
  Heart,
  Scales,
  User,
  List,
  X,
  MapPin,
  PhoneCall,
} from "@phosphor-icons/react";
import { useStore } from "@/lib/store-context";

export function Header() {
  const router = useRouter();
  const { cartCount, favorites, comparison, user } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#25252B]/95 backdrop-blur-md border-b border-[#32323A] text-white">
      {/* Top info strip */}
      <div className="bg-[#1A1A1E] text-slate-300 text-xs py-2 px-4 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-300">
              <MapPin size={14} className="text-[#528A9A]" />
              Ташкент, доставка по всему Узбекистану
            </span>
            <span className="hidden sm:flex items-center gap-1.5 text-slate-400">
              <PhoneCall size={14} />
              +998 (71) 200-00-20
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
            <Link 
              href="/presentation" 
              className="text-amber-300 hover:text-amber-200 flex items-center gap-1 font-semibold transition"
            >
              <span>🎬 Презентация проекта</span>
            </Link>
            <span className="hidden md:inline">Гарантия 12 месяцев</span>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4 sm:gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-[#528A9A] flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:bg-[#437381] transition">
              A
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-[#D9E7E8] transition">
                APEX TECH
              </span>
              <span className="text-[10px] tracking-widest text-[#D9E7E8]/70 uppercase font-medium">
                Tashkent Store
              </span>
            </div>
          </Link>

          {/* Catalog link button */}
          <Link
            href="/catalog"
            className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#32323A] hover:bg-[#3E3E47] text-[#D9E7E8] text-sm font-semibold transition border border-white/10"
          >
            <List size={18} weight="bold" />
            Каталог
          </Link>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="flex-1 max-w-xl relative hidden sm:block"
          >
            <input
              type="text"
              placeholder="Поиск по 1000+ товарам, брендам или моделям..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1A1A1E] border border-white/10 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#528A9A]/30 focus:border-[#528A9A] transition"
            />
            <MagnifyingGlass
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </form>

          {/* User actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Compare */}
            <Link
              href="/compare"
              className="relative p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
              title="Сравнение товаров"
            >
              <Scales size={22} />
              {comparison.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#528A9A] text-white text-[10px] font-bold flex items-center justify-center">
                  {comparison.length}
                </span>
              )}
            </Link>

            {/* Favorites */}
            <Link
              href="/favorites"
              className="relative p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
              title="Избранное"
            >
              <Heart size={22} />
              {favorites.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#528A9A] text-white text-[10px] font-bold flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex items-center gap-2 p-2.5 sm:px-3 sm:py-2 rounded-xl bg-[#528A9A] hover:bg-[#437381] text-white transition shadow-sm"
              title="Корзина"
            >
              <ShoppingCartSimple size={22} weight="bold" />
              <span className="hidden md:inline text-xs font-semibold">Корзина</span>
              {cartCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#25252B] text-[#D9E7E8] text-xs font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Account */}
            <Link
              href={user ? "/account" : "/login"}
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition flex items-center gap-2"
              title={user ? `Личный кабинет (${user.name})` : "Войти в аккаунт"}
            >
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-6 h-6 rounded-full object-cover border border-[#D9E7E8]"
                />
              ) : user ? (
                <div className="w-6 h-6 rounded-full bg-[#528A9A] text-white text-[10px] font-bold flex items-center justify-center">
                  {user.name.slice(0, 1).toUpperCase()}
                </div>
              ) : (
                <User size={22} />
              )}
              {user && (
                <span className="hidden xl:inline text-xs font-medium text-[#D9E7E8] max-w-[90px] truncate">
                  {user.name.split(" ")[0]}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-300 hover:bg-white/10 md:hidden transition"
              aria-label="Меню"
            >
              {mobileMenuOpen ? <X size={22} /> : <List size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="pb-3 sm:hidden">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Поиск товаров..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#1A1A1E] border border-white/10 text-sm text-white focus:outline-none focus:border-[#528A9A]"
            />
            <MagnifyingGlass
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </form>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#32323A] bg-[#25252B] px-4 py-4 space-y-3">
          <Link
            href="/catalog"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 py-2 text-[#D9E7E8] hover:text-white font-medium"
          >
            <List size={20} />
            Все категории каталога
          </Link>
          <Link
            href="/compare"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 py-2 text-[#D9E7E8] hover:text-white font-medium"
          >
            <Scales size={20} />
            Сравнение товаров ({comparison.length})
          </Link>
          <Link
            href="/favorites"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 py-2 text-[#D9E7E8] hover:text-white font-medium"
          >
            <Heart size={20} />
            Избранное ({favorites.length})
          </Link>
          <Link
            href="/cart"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 py-2 text-[#D9E7E8] hover:text-white font-medium"
          >
            <ShoppingCartSimple size={20} />
            Корзина ({cartCount})
          </Link>
          <Link
            href="/account"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 py-2 text-[#D9E7E8] hover:text-white font-medium"
          >
            <User size={20} />
            Профиль и заказы
          </Link>
        </div>
      )}
    </header>
  );
}
