"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowRight, Sparkle } from "@phosphor-icons/react";
import { formatPrice } from "@/lib/utils";

function ResultContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") || "APX-849201";
  const total = Number(searchParams.get("total")) || 16950000;
  const method = searchParams.get("method") || "yoomoney";

  return (
    <div className="max-w-xl mx-auto py-8">
      <div className="bg-white rounded-3xl border border-[#D9E7E8] p-8 sm:p-12 text-center shadow-sm space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#D9E7E8]/50 text-[#528A9A] flex items-center justify-center mx-auto">
          <CheckCircle size={48} weight="fill" />
        </div>

        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-[#D9E7E8] text-[#375E6A] text-xs font-semibold mb-2">
            Заказ успешно принят в обработку
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#25252B] tracking-tight">
            Спасибо за ваш заказ!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Номер вашего заказа: <span className="font-bold text-[#25252B]">{orderNumber}</span>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#F5F8F8] border border-[#D9E7E8] text-left space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Сумма заказа:</span>
            <span className="font-bold text-[#25252B]">{formatPrice(total)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Способ оплаты:</span>
            <span className="font-semibold text-[#25252B]">
              {method === "yoomoney" ? "YooMoney (Тестовый платеж)" : "Оплата курьеру при получении"}
            </span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Статус оплаты:</span>
            <span className="font-semibold text-[#375E6A] flex items-center gap-1">
              <Sparkle size={12} weight="fill" />
              Подтверждено (Тестовый режим)
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#D9E7E8]/30 border border-[#D9E7E8] text-xs text-[#25252B] text-left">
          ℹ️ Наш оператор свяжется с вами по указанному номеру для согласования времени курьерской доставки по Ташкенту.
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/account"
            className="flex-1 py-3 px-4 rounded-xl border border-[#D9E7E8] text-[#25252B] font-semibold text-xs hover:bg-[#F5F8F8] transition"
          >
            В личный кабинет
          </Link>
          <Link
            href="/catalog"
            className="flex-1 py-3 px-4 rounded-xl bg-[#528A9A] hover:bg-[#437381] text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-md shadow-[#528A9A]/20"
          >
            Продолжить покупки
            <ArrowRight size={14} weight="bold" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutResultPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-400">Загрузка информации о заказе...</div>}>
      <ResultContent />
    </Suspense>
  );
}
