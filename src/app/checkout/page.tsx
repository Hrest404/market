"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, CreditCard, ShieldCheck } from "@phosphor-icons/react";
import { useStore } from "@/lib/store-context";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useStore();

  const [name, setName] = useState("Тимур Алиев");
  const [phone, setPhone] = useState("+998 90 123-45-67");
  const [address, setAddress] = useState("г. Ташкент, Мирзо-Улугбекский р-н, ул. Паркентская, д. 21, кв. 45");
  const [paymentMethod, setPaymentMethod] = useState<"yoomoney" | "cash">("yoomoney");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deliveryFee = cartTotal > 10000000 || cartTotal === 0 ? 0 : 50000;
  const finalTotal = cartTotal + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderNumber = "APX-" + Math.floor(100000 + Math.random() * 900000);

    try {
      // 1. Создаем заказ в API/БД
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderNumber,
          customerName: name,
          customerPhone: phone,
          deliveryAddress: address,
          paymentMethod,
          totalUzs: finalTotal,
          items: cart.map((item) => ({
            productId: item.product.id,
            productName: item.product.name,
            unitPriceUzs: item.product.priceUzs,
            quantity: item.quantity,
          })),
        }),
      });

      // 2. Если выбран YooMoney, инициируем платеж через серверный шлюз
      if (paymentMethod === "yoomoney") {
        const paymentRes = await fetch("/api/payments/yoomoney/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: orderNumber,
            amountUzs: finalTotal,
            description: `Оплата заказа ${orderNumber} в магазине APEX TECH`,
          }),
        });

        const paymentData = await paymentRes.json();
        clearCart();

        if (paymentData.confirmationUrl) {
          window.location.href = paymentData.confirmationUrl;
          return;
        }
      }

      // 3. Если наличными курьеру
      clearCart();
      router.push(`/checkout/result?orderNumber=${orderNumber}&total=${finalTotal}&method=${paymentMethod}`);
    } catch (err) {
      console.error("Error creating order or payment:", err);
      clearCart();
      router.push(`/checkout/result?orderNumber=${orderNumber}&total=${finalTotal}&method=${paymentMethod}`);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-[#D9E7E8] p-12 text-center max-w-lg mx-auto my-12 shadow-sm">
        <h1 className="text-xl font-bold text-[#25252B] mb-2">Корзина пуста</h1>
        <p className="text-xs text-slate-500 mb-6">
          Чтобы оформить заказ, сначала добавьте товары в корзину.
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
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#25252B]">
          Оформление заказа
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Заполните данные для оперативной доставки по Ташкенту
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form fields */}
        <div className="lg:col-span-7 space-y-6">
          {/* Contact Details */}
          <div className="bg-white rounded-3xl border border-[#D9E7E8] p-6 sm:p-8 space-y-4 shadow-sm">
            <h2 className="text-base font-bold text-[#25252B] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#D9E7E8] text-[#375E6A] text-xs flex items-center justify-center font-bold">
                1
              </span>
              Контактные данные
            </h2>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Имя и фамилия получателя
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Иван Иванов"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F8F8] border border-[#D9E7E8] text-sm focus:outline-none focus:border-[#528A9A]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Номер телефона (для курьера)
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+998 90 000-00-00"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F8F8] border border-[#D9E7E8] text-sm focus:outline-none focus:border-[#528A9A]"
                />
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-3xl border border-[#D9E7E8] p-6 sm:p-8 space-y-4 shadow-sm">
            <h2 className="text-base font-bold text-[#25252B] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#D9E7E8] text-[#375E6A] text-xs flex items-center justify-center font-bold">
                2
              </span>
              Адрес доставки в Ташкенте
            </h2>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Улица, дом, квартира / ориентир
              </label>
              <textarea
                required
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="г. Ташкент, ул. ..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F8F8] border border-[#D9E7E8] text-sm focus:outline-none focus:border-[#528A9A]"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-3xl border border-[#D9E7E8] p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#25252B] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#D9E7E8] text-[#375E6A] text-xs flex items-center justify-center font-bold">
                  3
                </span>
                Способ оплаты
              </h2>
              <span className="text-[11px] font-semibold text-[#375E6A] bg-[#D9E7E8]/50 px-2.5 py-1 rounded-full border border-[#D9E7E8]">
                🛡 Тестовый режим оплаты
              </span>
            </div>

            <div className="space-y-3">
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition ${
                  paymentMethod === "yoomoney"
                    ? "border-[#528A9A] bg-[#D9E7E8]/20"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "yoomoney"}
                  onChange={() => setPaymentMethod("yoomoney")}
                  className="mt-1 text-[#528A9A] focus:ring-[#528A9A]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#25252B]">YooMoney (Тестовый платеж)</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#D9E7E8] text-[#375E6A] text-[10px] font-semibold">
                      Демо-касса
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Серверное создание тестового платежа, безопасная проверка статуса и поддержка вебхуков.
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition ${
                  paymentMethod === "cash"
                    ? "border-[#528A9A] bg-[#D9E7E8]/20"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cash"}
                  onChange={() => setPaymentMethod("cash")}
                  className="mt-1 text-[#528A9A] focus:ring-[#528A9A]"
                />
                <div>
                  <span className="text-sm font-bold text-[#25252B]">При получении (курьеру)</span>
                  <p className="text-xs text-slate-500 mt-1">
                    Оплата наличными или через Uzum / Payme / Click при доставке.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order details summary */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#D9E7E8] p-6 space-y-6 sticky top-28 shadow-sm">
          <h2 className="text-base font-bold text-[#25252B]">Ваш заказ</h2>

          <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1">
            {cart.map(({ product, quantity }) => (
              <div key={product.id} className="py-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#F5F8F8] p-1 shrink-0 border border-[#D9E7E8]/60 flex items-center justify-center">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </div>
                  <div>
                    <span className="font-semibold text-[#25252B] line-clamp-1 max-w-[180px]">
                      {product.name}
                    </span>
                    <span className="text-slate-500">{quantity} шт.</span>
                  </div>
                </div>
                <span className="font-bold text-[#25252B] shrink-0">
                  {formatPrice(product.priceUzs * quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Товары:</span>
              <span className="font-medium text-[#25252B]">{formatPrice(cartTotal)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Доставка:</span>
              <span className="font-medium text-[#25252B]">
                {deliveryFee === 0 ? "Бесплатно" : formatPrice(deliveryFee)}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline text-sm">
              <span className="font-bold text-[#25252B]">Итого:</span>
              <span className="text-xl font-extrabold text-[#528A9A]">
                {formatPrice(finalTotal)}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl bg-[#528A9A] hover:bg-[#437381] text-white font-bold text-sm transition shadow-lg shadow-[#528A9A]/20 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Lock size={16} weight="bold" />
            {isSubmitting ? "Обработка платежа..." : "Оплатить (Тест) и подтвердить"}
          </button>
        </div>
      </form>
    </div>
  );
}
