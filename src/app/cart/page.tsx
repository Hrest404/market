"use client";

import Link from "next/link";
import { ShoppingCartSimple, Trash, Plus, Minus, ArrowRight, ShieldCheck } from "@phosphor-icons/react";
import { useStore } from "@/lib/store-context";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useStore();

  const deliveryFee = cartTotal > 10000000 || cartTotal === 0 ? 0 : 50000;
  const finalTotal = cartTotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-[#D9E7E8] p-12 text-center max-w-lg mx-auto my-12 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-[#D9E7E8]/50 text-[#528A9A] flex items-center justify-center mx-auto mb-4">
          <ShoppingCartSimple size={32} />
        </div>
        <h1 className="text-xl font-bold text-[#25252B] mb-2">Ваша корзина пуста</h1>
        <p className="text-xs sm:text-sm text-slate-500 mb-6">
          Выберите нужные товары в каталоге и добавьте их в корзину для быстрого заказа.
        </p>
        <Link
          href="/catalog"
          className="px-6 py-3 rounded-xl bg-[#528A9A] text-white font-semibold text-xs hover:bg-[#437381] transition inline-block shadow-md shadow-[#528A9A]/20"
        >
          Перейти к покупкам
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#25252B]">
            Корзина покупок
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {cart.length} наименования техники
          </p>
        </div>
        <button
          onClick={clearCart}
          className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-semibold"
        >
          <Trash size={16} />
          Очистить корзину
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart items list */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#D9E7E8] p-6 divide-y divide-slate-100 shadow-sm">
          {cart.map(({ product, quantity }) => (
            <div key={product.id} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-[#F5F8F8] rounded-2xl p-2 shrink-0 border border-[#D9E7E8]/60 flex items-center justify-center">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {product.brand}
                  </span>
                  <Link
                    href={`/product/${product.slug}`}
                    className="text-sm font-bold text-[#25252B] hover:text-[#528A9A] block line-clamp-2 max-w-md transition"
                  >
                    {product.name}
                  </Link>
                  <span className="text-xs text-slate-500 mt-0.5 block">
                    Цена за ед.: {formatPrice(product.priceUzs)}
                  </span>
                </div>
              </div>

              {/* Quantity control & Price */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                <div className="flex items-center border border-[#D9E7E8] rounded-xl bg-[#F5F8F8] p-1">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="p-1 rounded-lg text-slate-500 hover:bg-white hover:text-[#25252B] transition"
                    aria-label="Уменьшить"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-[#25252B]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="p-1 rounded-lg text-slate-500 hover:bg-white hover:text-[#25252B] transition"
                    aria-label="Увеличить"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <div className="text-right min-w-[120px]">
                  <span className="text-base font-extrabold text-[#25252B] block">
                    {formatPrice(product.priceUzs * quantity)}
                  </span>
                </div>

                <button
                  onClick={() => removeFromCart(product.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                  title="Удалить"
                >
                  <Trash size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary box */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-[#D9E7E8] p-6 space-y-6 sticky top-28 shadow-sm">
          <h2 className="text-base font-bold text-[#25252B]">Итого по заказу</h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Стоимость товаров</span>
              <span className="font-semibold text-[#25252B]">{formatPrice(cartTotal)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Доставка по Ташкенту</span>
              <span className="font-semibold text-[#25252B]">
                {deliveryFee === 0 ? "Бесплатно" : formatPrice(deliveryFee)}
              </span>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline text-sm">
              <span className="font-bold text-[#25252B]">К оплате:</span>
              <span className="text-xl font-extrabold text-[#528A9A]">
                {formatPrice(finalTotal)}
              </span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full py-3.5 rounded-xl bg-[#528A9A] hover:bg-[#437381] text-white font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-[#528A9A]/20"
          >
            Перейти к оформлению
            <ArrowRight size={16} weight="bold" />
          </Link>

          <div className="p-3.5 rounded-xl bg-[#D9E7E8]/30 border border-[#D9E7E8]/60 flex items-start gap-2.5 text-xs text-[#25252B]">
            <ShieldCheck size={20} className="text-[#528A9A] shrink-0" weight="fill" />
            <span>
              Безопасное оформление с проверкой остатков на складе и резервированием товара.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
