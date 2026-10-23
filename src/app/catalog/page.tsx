"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Funnel, X, FadersHorizontal, MagnifyingGlass } from "@phosphor-icons/react";
import { MOCK_PRODUCTS, CATEGORIES, BRANDS } from "@/lib/mock-data";
import { ProductCard } from "@/components/product/ProductCard";

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const initialQuery = searchParams.get("q") || "";
  const initialSort = searchParams.get("sort") || "popular";

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [search, setSearch] = useState<string>(initialQuery);
  const [sortBy, setSortBy] = useState<string>(initialSort);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      if (selectedCategory && product.categoryId !== selectedCategory) {
        return false;
      }
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
        return false;
      }
      if (
        search.trim() &&
        !product.name.toLowerCase().includes(search.toLowerCase()) &&
        !product.brand.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
      if (inStockOnly && product.stock <= 0) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.priceUzs - b.priceUzs;
      if (sortBy === "price-desc") return b.priceUzs - a.priceUzs;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "new") return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
    });
  }, [selectedCategory, selectedBrands, search, sortBy, inStockOnly]);

  const clearAllFilters = () => {
    setSelectedCategory("");
    setSelectedBrands([]);
    setSearch("");
    setInStockOnly(false);
  };

  const isFiltered = Boolean(selectedCategory || selectedBrands.length > 0 || search || inStockOnly);

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {selectedCategory
              ? CATEGORIES.find((c) => c.id === selectedCategory)?.name || "Каталог товаров"
              : "Каталог техники"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Найдено {filteredProducts.length} товаров в наличии
          </p>
        </div>

        {/* Sort & Mobile filter trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#D9E7E8] text-sm font-semibold text-[#25252B]"
          >
            <Funnel size={16} />
            Фильтры
            {isFiltered && <span className="w-2 h-2 rounded-full bg-[#528A9A]" />}
          </button>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs text-slate-500 font-medium">Сортировка:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-[#D9E7E8] text-xs sm:text-sm text-[#25252B] font-medium focus:outline-none focus:border-[#528A9A]"
            >
              <option value="popular">По популярности</option>
              <option value="new">Сначала новинки</option>
              <option value="price-asc">Сначала дешевле</option>
              <option value="price-desc">Сначала дороже</option>
              <option value="rating">По рейтингу</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main layout: Filters + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block bg-white p-6 rounded-2xl border border-[#D9E7E8] space-y-6 sticky top-28 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-sm text-[#25252B]">
              <FadersHorizontal size={18} className="text-[#528A9A]" />
              Фильтры
            </div>
            {isFiltered && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-[#528A9A] hover:text-[#437381] font-medium"
              >
                Сбросить
              </button>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-2">
              Поиск по каталогу
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Модель, серия..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#F5F8F8] border border-[#D9E7E8] text-xs focus:outline-none focus:border-[#528A9A]"
              />
              <MagnifyingGlass
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-2">
              Категория
            </label>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory("")}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition ${
                  selectedCategory === ""
                    ? "bg-[#D9E7E8] text-[#25252B] font-bold"
                    : "text-slate-600 hover:bg-[#F5F8F8]"
                }`}
              >
                Все категории
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex justify-between items-center ${
                    selectedCategory === cat.id
                      ? "bg-[#D9E7E8] text-[#25252B] font-bold"
                      : "text-slate-600 hover:bg-[#F5F8F8]"
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-[10px] text-slate-400">{cat.itemCount}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-2">
              Бренды
            </label>
            <div className="space-y-2">
              {BRANDS.map((brand) => (
                <label key={brand} className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    className="w-4 h-4 rounded border-slate-300 text-[#528A9A] focus:ring-[#528A9A]"
                  />
                  <span>{brand}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#528A9A] focus:ring-[#528A9A]"
              />
              <span className="font-medium">Только в наличии</span>
            </label>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="lg:col-span-3">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#D9E7E8] p-12 text-center max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-[#D9E7E8]/40 flex items-center justify-center mx-auto mb-4 text-[#528A9A]">
                <MagnifyingGlass size={32} />
              </div>
              <h3 className="text-lg font-bold text-[#25252B] mb-1">Ничего не найдено</h3>
              <p className="text-xs text-slate-500 mb-6">
                Попробуйте изменить параметры фильтрации или поисковый запрос.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 rounded-xl bg-[#528A9A] text-white text-xs font-semibold hover:bg-[#437381] transition shadow-sm"
              >
                Сбросить фильтры
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Drawer Filters */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex bg-black/40 backdrop-blur-sm lg:hidden">
          <div className="w-full max-w-xs bg-white h-full ml-auto p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="font-bold text-base text-[#25252B]">Фильтры каталога</span>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-[#25252B] uppercase tracking-wider block mb-2">
                  Категория
                </label>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory("")}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs ${
                      selectedCategory === "" ? "bg-[#D9E7E8] text-[#25252B] font-bold" : "text-slate-600"
                    }`}
                  >
                    Все категории
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs ${
                        selectedCategory === cat.id ? "bg-[#D9E7E8] text-[#25252B] font-bold" : "text-slate-600"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#25252B] uppercase tracking-wider block mb-2">
                  Бренды
                </label>
                <div className="space-y-2">
                  {BRANDS.map((brand) => (
                    <label key={brand} className="flex items-center gap-2.5 text-xs text-slate-700">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="w-4 h-4 rounded text-[#528A9A]"
                      />
                      <span>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex gap-3">
              <button
                onClick={clearAllFilters}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-[#25252B]"
              >
                Сбросить
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#528A9A] text-white text-xs font-semibold hover:bg-[#437381]"
              >
                Применить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-400">Загрузка каталога...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
