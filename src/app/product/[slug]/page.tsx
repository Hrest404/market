"use client";

import { use, useState, Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Heart,
  Scales,
  ShoppingCartSimple,
  Star,
  ShieldCheck,
  Truck,
  ArrowCounterClockwise,
  Check,
  Sparkle,
} from "@phosphor-icons/react";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { useStore } from "@/lib/store-context";
import { formatPrice } from "@/lib/utils";
import { ProductCard } from "@/components/product/ProductCard";

function ProductDetailContent({ slug }: { slug: string }) {
  const product = MOCK_PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const { addToCart, toggleFavorite, isFavorite, toggleCompare, isInCompare, cart } = useStore();
  const [selectedImage, setSelectedImage] = useState(0);

  const favorite = isFavorite(product.id);
  const inCompare = isInCompare(product.id);
  const inCart = cart.some((item) => item.product.id === product.id);

  const attributeGroups = product.attributes.reduce((acc, attr) => {
    if (!acc[attr.group]) acc[attr.group] = [];
    acc[attr.group].push(attr);
    return acc;
  }, {} as Record<string, typeof product.attributes>);

  const relatedProducts = MOCK_PRODUCTS.filter(
    (p) => p.categoryId === product.categoryId && p.id !== product.id
  ).slice(0, 3);

  return (
    <div className="space-y-12">
      {/* Breadcrumbs */}
      <nav className="text-xs text-slate-500 flex items-center gap-2">
        <Link href="/" className="hover:text-slate-900">Главная</Link>
        <span>/</span>
        <Link href="/catalog" className="hover:text-slate-900">Каталог</Link>
        <span>/</span>
        <Link href={`/catalog?category=${product.categoryId}`} className="hover:text-slate-900">
          {product.categoryName}
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main product showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square bg-white rounded-3xl border border-slate-200/80 p-8 flex items-center justify-center relative overflow-hidden">
            <img
              src={product.images[selectedImage] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-contain mix-blend-multiply"
            />
            {product.isNew && (
              <span className="absolute top-6 left-6 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold">
                Новинка
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-2xl bg-white border p-2 shrink-0 transition ${
                    selectedImage === idx
                      ? "border-[#528A9A] ring-2 ring-[#528A9A]/30"
                      : "border-[#D9E7E8] hover:border-[#528A9A]"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-3 text-xs mb-2">
              <span className="font-bold text-[#528A9A] tracking-wider uppercase">
                {product.brand}
              </span>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1 text-amber-500 font-semibold">
                <Star size={16} weight="fill" />
                <span>{product.rating}</span>
                <span className="text-slate-400 font-normal">
                  ({product.reviewsCount} отзывов)
                </span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#25252B] tracking-tight leading-snug">
              {product.name}
            </h1>
          </div>

          {/* Pricing box */}
          <div className="p-6 rounded-2xl bg-white border border-[#D9E7E8] space-y-4 shadow-sm">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-[#25252B] tracking-tight">
                {formatPrice(product.priceUzs)}
              </span>
              {product.oldPriceUzs && (
                <span className="text-base text-slate-400 line-through">
                  {formatPrice(product.oldPriceUzs)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-[#375E6A] font-semibold">
              <Check size={16} weight="bold" />
              <span>В наличии ({product.stock} шт. на складе в Ташкенте)</span>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => addToCart(product, 1)}
                className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 shadow-md ${
                  inCart
                    ? "bg-[#375E6A] hover:bg-[#2F515B] text-white"
                    : "bg-[#528A9A] hover:bg-[#437381] text-white active:scale-98 shadow-[#528A9A]/20"
                }`}
              >
                {inCart ? (
                  <>
                    <Check size={18} weight="bold" />
                    Товар уже в корзине
                  </>
                ) : (
                  <>
                    <ShoppingCartSimple size={18} weight="bold" />
                    Добавить в корзину
                  </>
                )}
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleCompare(product.id)}
                  className={`p-3.5 rounded-xl border transition ${
                    inCompare
                      ? "bg-[#528A9A] border-[#528A9A] text-white"
                      : "bg-white border-[#D9E7E8] text-slate-600 hover:bg-[#D9E7E8]/20"
                  }`}
                  title="Сравнить"
                >
                  <Scales size={20} weight={inCompare ? "bold" : "regular"} />
                </button>
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className={`p-3.5 rounded-xl border transition ${
                    favorite
                      ? "bg-rose-50 border-rose-200 text-rose-600"
                      : "bg-white border-[#D9E7E8] text-slate-600 hover:bg-[#D9E7E8]/20 hover:text-rose-600"
                  }`}
                  title="В избранное"
                >
                  <Heart size={20} weight={favorite ? "fill" : "regular"} />
                </button>
              </div>
            </div>
          </div>

          {/* Quick specs pills */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#25252B] uppercase tracking-wider">
              Ключевые преимущества
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
              {product.features.map((feat, i) => (
                <li key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-[#D9E7E8]/30 border border-[#D9E7E8]/50">
                  <Sparkle size={14} className="text-[#528A9A] shrink-0" weight="fill" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust points */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#D9E7E8] text-center">
            <div className="p-3 rounded-xl bg-white border border-[#D9E7E8]">
              <Truck size={20} className="mx-auto text-[#528A9A] mb-1" />
              <span className="text-[11px] font-semibold text-slate-800 block">Доставка</span>
              <span className="text-[10px] text-slate-500">2 часа по городу</span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-[#D9E7E8]">
              <ShieldCheck size={20} className="mx-auto text-[#528A9A] mb-1" />
              <span className="text-[11px] font-semibold text-slate-800 block">Гарантия</span>
              <span className="text-[10px] text-slate-500">12 мес. сервис</span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-[#D9E7E8]">
              <ArrowCounterClockwise size={20} className="mx-auto text-[#528A9A] mb-1" />
              <span className="text-[11px] font-semibold text-slate-800 block">Возврат</span>
              <span className="text-[10px] text-slate-500">14 дней обмен</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Full Specs */}
      <section className="bg-white rounded-3xl border border-[#D9E7E8] p-8 sm:p-12 space-y-10 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[#25252B] mb-4">Описание устройства</h2>
          <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
            {product.description}
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-[#25252B] mb-6">Технические характеристики</h2>
          <div className="space-y-6 max-w-4xl">
            {Object.entries(attributeGroups).map(([group, attrs]) => (
              <div key={group} className="space-y-3">
                <h4 className="text-xs font-bold text-[#528A9A] uppercase tracking-wider">
                  {group}
                </h4>
                <div className="divide-y divide-slate-100 border-t border-b border-slate-100">
                  {attrs.map((attr, idx) => (
                    <div key={idx} className="py-2.5 grid grid-cols-2 gap-4 text-xs">
                      <span className="text-slate-500">{attr.name}</span>
                      <span className="font-semibold text-slate-900">{attr.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Похожие товары</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ProductPageInner({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <ProductDetailContent slug={slug} />;
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-400">Загрузка карточки товара...</div>}>
      <ProductPageInner params={params} />
    </Suspense>
  );
}
