"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Package, MapPin, Heart, SignOut, Clock, CheckCircle } from "@phosphor-icons/react";
import { formatPrice } from "@/lib/utils";
import { useStore } from "@/lib/store-context";

interface MockOrder {
  id: string;
  date: string;
  status: "delivered" | "processing" | "cancelled";
  statusText: string;
  totalUzs: number;
  items: string[];
}

const MOCK_USER_ORDERS: MockOrder[] = [
  {
    id: "APX-928174",
    date: "18 октября 2026",
    status: "processing",
    statusText: "В пути к получателю",
    totalUzs: 16950000,
    items: ["Apple iPhone 16 Pro Max 256GB Natural Titanium"],
  },
  {
    id: "APX-651920",
    date: "12 сентября 2026",
    status: "delivered",
    statusText: "Доставлен",
    totalUzs: 3100000,
    items: ["Apple AirPods Pro 2 с кейсом MagSafe"],
  },
];

export default function AccountPage() {
  const router = useRouter();
  const { user, logoutUser } = useStore();
  const [activeTab, setActiveTab] = useState<"orders" | "profile" | "addresses">("orders");

  const displayName = user?.name || "Тимур Алиев";
  const displayEmail = user?.email || "timur.aliev@example.uz";
  const userInitials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    logoutUser();
    router.push("/login");
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#25252B]">
          Личный кабинет
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Управление заказами, адресами доставки и профилем
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* User navigation sidebar */}
        <aside className="lg:col-span-4 bg-white rounded-3xl border border-[#D9E7E8] p-6 space-y-6 shadow-sm">
          <div className="flex items-center gap-3 pb-6 border-b border-[#D9E7E8]">
            {user?.image ? (
              <img
                src={user.image}
                alt={displayName}
                className="w-12 h-12 rounded-2xl object-cover border border-[#D9E7E8] shadow-sm"
              />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-[#528A9A] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                {userInitials}
              </div>
            )}
            <div className="min-w-0">
              <span className="font-bold text-sm text-[#25252B] block truncate">
                {displayName}
              </span>
              <span className="text-xs text-slate-400 block truncate">
                {displayEmail}
              </span>
              {user?.id && (
                <span className="inline-flex items-center gap-1 text-[10px] text-[#528A9A] font-semibold mt-0.5">
                  <CheckCircle size={12} weight="fill" /> Google аккаунт
                </span>
              )}
            </div>
          </div>

          <nav className="space-y-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === "orders"
                  ? "bg-[#D9E7E8] text-[#25252B] font-bold"
                  : "text-slate-600 hover:bg-[#F5F8F8]"
              }`}
            >
              <Package size={18} />
              История заказов ({MOCK_USER_ORDERS.length})
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === "profile"
                  ? "bg-[#D9E7E8] text-[#25252B] font-bold"
                  : "text-slate-600 hover:bg-[#F5F8F8]"
              }`}
            >
              <User size={18} />
              Личные данные
            </button>
            <button
              onClick={() => setActiveTab("addresses")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === "addresses"
                  ? "bg-[#D9E7E8] text-[#25252B] font-bold"
                  : "text-slate-600 hover:bg-[#F5F8F8]"
              }`}
            >
              <MapPin size={18} />
              Адреса доставки
            </button>
          </nav>

          <div className="pt-4 border-t border-[#D9E7E8]">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-2 rounded-xl transition"
            >
              <SignOut size={16} />
              Выйти из аккаунта
            </button>
          </div>
        </aside>

        {/* Tab content */}
        <main className="lg:col-span-8 bg-white rounded-3xl border border-[#D9E7E8] p-6 sm:p-8 shadow-sm">
          {activeTab === "orders" && (
            <div className="space-y-6">
              <h2 className="text-base font-bold text-[#25252B]">Мои заказы</h2>
              <div className="space-y-4">
                {MOCK_USER_ORDERS.map((order) => (
                  <div
                    key={order.id}
                    className="p-5 rounded-2xl bg-[#F5F8F8] border border-[#D9E7E8] space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#D9E7E8]/60 text-xs">
                      <div>
                        <span className="font-bold text-[#25252B] block">Заказ #{order.id}</span>
                        <span className="text-slate-400">{order.date}</span>
                      </div>
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold w-fit ${
                          order.status === "delivered"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-[#D9E7E8] text-[#375E6A]"
                        }`}
                      >
                        {order.statusText}
                      </span>
                    </div>

                    <div className="text-xs text-slate-700">
                      <ul className="list-disc list-inside space-y-1">
                        {order.items.map((item, idx) => (
                          <li key={idx} className="font-medium">{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 flex justify-between items-center text-xs">
                      <span className="text-slate-500">Сумма заказа:</span>
                      <span className="text-sm font-extrabold text-slate-900">
                        {formatPrice(order.totalUzs)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="space-y-6">
              <h2 className="text-base font-bold text-[#25252B]">Данные аккаунта</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-slate-500 block mb-1">Имя и фамилия</label>
                  <input
                    type="text"
                    defaultValue={displayName}
                    className="w-full px-3 py-2 rounded-xl bg-[#F5F8F8] border border-[#D9E7E8] text-[#25252B] font-medium focus:outline-none focus:border-[#528A9A]"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Электронная почта</label>
                  <input
                    type="email"
                    defaultValue={displayEmail}
                    className="w-full px-3 py-2 rounded-xl bg-[#F5F8F8] border border-[#D9E7E8] text-[#25252B] font-medium focus:outline-none focus:border-[#528A9A]"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Номер телефона</label>
                  <input
                    type="text"
                    defaultValue="+998 90 123-45-67"
                    className="w-full px-3 py-2 rounded-xl bg-[#F5F8F8] border border-[#D9E7E8] text-[#25252B] font-medium focus:outline-none focus:border-[#528A9A]"
                  />
                </div>
              </div>
              <button className="px-5 py-2.5 rounded-xl bg-[#528A9A] text-white font-semibold text-xs hover:bg-[#437381] transition shadow-md shadow-[#528A9A]/20">
                Сохранить изменения
              </button>
            </div>
          )}

          {activeTab === "addresses" && (
            <div className="space-y-6">
              <h2 className="text-base font-bold text-[#25252B]">Адреса доставки</h2>
              <div className="p-4 rounded-2xl bg-[#F5F8F8] border border-[#D9E7E8] flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-[#25252B] block mb-1">Основной адрес (Ташкент)</span>
                  <p className="text-xs text-slate-600">
                    г. Ташкент, Мирзо-Улугбекский р-н, ул. Паркентская, д. 21, кв. 45
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-[#D9E7E8] text-[#375E6A] text-[10px] font-bold">
                  По умолчанию
                </span>
              </div>
              <button className="px-4 py-2 rounded-xl border border-[#D9E7E8] text-[#25252B] font-semibold text-xs hover:bg-[#F5F8F8] transition">
                + Добавить новый адрес
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
