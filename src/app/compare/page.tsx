"use client";

import Link from "next/link";
import { Scales, Trash, ShoppingCartSimple, Plus } from "@phosphor-icons/react";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { useStore } from "@/lib/store-context";
import { formatPrice } from "@/lib/utils";

export default function ComparePage() {
  const { comparison, toggleCompare, clearCompare, addToCart } = useStore();

  const comparedProducts = MOCK_PRODUCTS.filter((p) => comparison.includes(p.id));

  // Extract all unique attribute names
  const allAttributes = Array.from(
    new Set(
      comparedProducts.flatMap((p) => p.attributes.map((a) => a.name))
    )
  );

  if (comparedProducts.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-[#D9E7E8] p-12 text-center max-w-lg mx-auto my-12 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-[#D9E7E8]/50 text-[#528A9A] flex items-center justify-center mx-auto mb-4">
          <Scales size={32} />
        </div>
        <h1 className="text-xl font-bold text-[#25252B] mb-2">Список сравнения пуст</h1>
        <p className="text-xs sm:text-sm text-slate-500 mb-6">
          Добавляйте до 4 моделей техники на карточках товаров, чтобы наглядно сопоставить характеристики.
        </p>
        <Link
          href="/catalog"
          className="px-6 py-3 rounded-xl bg-[#528A9A] text-white font-semibold text-xs hover:bg-[#437381] transition inline-block shadow-md shadow-[#528A9A]/20"
        >
          Перейти в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#25252B]">
            Сравнение моделей ({comparedProducts.length} из 4)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Наглядная таблица отличий в параметрах
          </p>
        </div>
        <button
          onClick={clearCompare}
          className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-semibold"
        >
          <Trash size={16} />
          Очистить список
        </button>
      </div>

      {/* Comparison table */}
      <div className="bg-white rounded-3xl border border-[#D9E7E8] overflow-x-auto p-6 shadow-sm">
        <div className="min-w-[640px]">
          {/* Header cards */}
          <div className="grid grid-cols-5 gap-4 pb-6 border-b border-[#D9E7E8]">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-end">
              Параметры
            </div>
            {comparedProducts.map((product) => (
              <div key={product.id} className="flex flex-col relative group">
                <button
                  onClick={() => toggleCompare(product.id)}
                  className="absolute -top-2 -right-2 p-1.5 rounded-full bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-400 transition"
                  title="Удалить"
                >
                  <Trash size={14} />
                </button>
                <div className="w-full aspect-square bg-[#F5F8F8] rounded-xl p-3 flex items-center justify-center mb-3 border border-[#D9E7E8]/50">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>
                <Link
                  href={`/product/${product.slug}`}
                  className="text-xs font-bold text-[#25252B] hover:text-[#528A9A] line-clamp-2 mb-2 transition"
                >
                  {product.name}
                </Link>
                <span className="text-sm font-extrabold text-[#25252B] mb-3">
                  {formatPrice(product.priceUzs)}
                </span>
                <button
                  onClick={() => addToCart(product, 1)}
                  className="w-full py-2 rounded-lg bg-[#528A9A] hover:bg-[#437381] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-sm"
                >
                  <ShoppingCartSimple size={14} weight="bold" />
                  Купить
                </button>
              </div>
            ))}
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-100 text-xs">
            {allAttributes.map((attrName) => (
              <div key={attrName} className="grid grid-cols-5 gap-4 py-3.5 items-center">
                <span className="font-semibold text-slate-600">{attrName}</span>
                {comparedProducts.map((product) => {
                  const val = product.attributes.find((a) => a.name === attrName)?.value || "—";
                  return (
                    <span key={product.id} className="text-slate-900 font-medium">
                      {val}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
