"use client";

import Link from "next/link";
import { Heart } from "@phosphor-icons/react";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { useStore } from "@/lib/store-context";
import { ProductCard } from "@/components/product/ProductCard";

export default function FavoritesPage() {
  const { favorites } = useStore();
  const favoriteProducts = MOCK_PRODUCTS.filter((p) => favorites.includes(p.id));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#25252B]">
          Избранные товары ({favoriteProducts.length})
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Товары, которые вы сохранили для будущих покупок
        </p>
      </div>

      {favoriteProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#D9E7E8] p-12 text-center max-w-lg mx-auto my-12 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
            <Heart size={32} />
          </div>
          <h2 className="text-xl font-bold text-[#25252B] mb-2">В избранном пока ничего нет</h2>
          <p className="text-xs sm:text-sm text-slate-500 mb-6">
            Нажимайте на сердечко на карточках техники, чтобы не потерять понравившиеся устройства.
          </p>
          <Link
            href="/catalog"
            className="px-6 py-3 rounded-xl bg-[#528A9A] text-white font-semibold text-xs hover:bg-[#437381] transition inline-block shadow-md shadow-[#528A9A]/20"
          >
            В каталог товаров
          </Link>
        </div>
      )}
    </div>
  );
}
