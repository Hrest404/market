"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Scales, ShoppingCartSimple, Star, Check } from "@phosphor-icons/react";
import { Product } from "@/lib/mock-data";
import { useStore } from "@/lib/store-context";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

export function ProductCard({ product, featured = false }: ProductCardProps) {
  const { addToCart, toggleFavorite, isFavorite, toggleCompare, isInCompare, cart } = useStore();
  const favorite = isFavorite(product.id);
  const inCompare = isInCompare(product.id);
  const inCart = cart.some((item) => item.product.id === product.id);

  return (
    <div
      className={`group relative flex flex-col bg-white rounded-2xl border border-[#D9E7E8] p-4 transition duration-300 hover:shadow-xl hover:shadow-[#528A9A]/10 hover:border-[#528A9A] ${
        featured ? "md:col-span-2 md:row-span-2" : ""
      }`}
    >
      {/* Top badges & action buttons */}
      <div className="flex items-center justify-between w-full mb-3 z-10">
        <div className="flex items-center gap-1.5 flex-wrap">
          {product.isNew && (
            <span className="px-2 py-0.5 rounded-full bg-[#D9E7E8] text-[#375E6A] text-[11px] font-semibold tracking-wide">
              Новинка
            </span>
          )}
          {product.oldPriceUzs && (
            <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[11px] font-semibold tracking-wide">
              Скидка
            </span>
          )}
          {product.stock <= 5 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[11px] font-medium">
              Осталось: {product.stock}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Compare toggle */}
          <button
            onClick={() => toggleCompare(product.id)}
            className={`p-2 rounded-xl border transition ${
              inCompare
                ? "bg-[#528A9A] border-[#528A9A] text-white"
                : "bg-white border-[#D9E7E8] text-slate-500 hover:text-[#25252B] hover:bg-[#D9E7E8]/20"
            }`}
            title="Сравнить характеристики"
            aria-label="Сравнить"
          >
            <Scales size={16} weight={inCompare ? "bold" : "regular"} />
          </button>

          {/* Favorite toggle */}
          <button
            onClick={() => toggleFavorite(product.id)}
            className={`p-2 rounded-xl border transition ${
              favorite
                ? "bg-rose-50 border-rose-200 text-rose-600"
                : "bg-white border-[#D9E7E8] text-slate-500 hover:text-rose-600 hover:bg-[#D9E7E8]/20"
            }`}
            title="В избранное"
            aria-label="В избранное"
          >
            <Heart size={16} weight={favorite ? "fill" : "regular"} />
          </button>
        </div>
      </div>

      {/* Image container */}
      <Link
        href={`/product/${product.slug}`}
        className="relative w-full aspect-square overflow-hidden rounded-xl bg-[#F5F8F8] border border-[#D9E7E8]/50 flex items-center justify-center p-4 mb-4"
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition duration-500"
          loading="lazy"
        />
      </Link>

      {/* Brand & Rating */}
      <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
        <span className="font-medium text-slate-400 uppercase tracking-wider text-[11px]">
          {product.brand}
        </span>
        <div className="flex items-center gap-1 text-amber-500 font-semibold text-xs">
          <Star size={14} weight="fill" />
          <span>{product.rating}</span>
          <span className="text-slate-400 font-normal">({product.reviewsCount})</span>
        </div>
      </div>

      {/* Title */}
      <Link
        href={`/product/${product.slug}`}
        className="text-sm font-semibold text-[#25252B] group-hover:text-[#528A9A] transition line-clamp-2 mb-2 leading-snug"
      >
        {product.name}
      </Link>

      {/* Short feature preview */}
      <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
        {product.description}
      </p>

      {/* Pricing & Add to cart (sticks to bottom) */}
      <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex flex-col">
          {product.oldPriceUzs && (
            <span className="text-[11px] text-slate-400 line-through">
              {formatPrice(product.oldPriceUzs)}
            </span>
          )}
          <span className="text-base font-bold text-[#25252B] tracking-tight">
            {formatPrice(product.priceUzs)}
          </span>
        </div>

        <button
          onClick={() => addToCart(product, 1)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition shadow-sm ${
            inCart
              ? "bg-[#375E6A] hover:bg-[#2F515B] text-white"
              : "bg-[#528A9A] hover:bg-[#437381] text-white active:scale-95 shadow-[#528A9A]/20 shadow-md"
          }`}
        >
          {inCart ? (
            <>
              <Check size={16} weight="bold" />
              В корзине
            </>
          ) : (
            <>
              <ShoppingCartSimple size={16} weight="bold" />
              Купить
            </>
          )}
        </button>
      </div>
    </div>
  );
}
