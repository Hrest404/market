import crypto from "crypto";

export interface CreatePaymentParams {
  orderId: string;
  amountUzs: number;
  description: string;
  returnUrl: string;
}

export interface PaymentResult {
  paymentId: string;
  orderId: string;
  status: "pending" | "waiting_for_capture" | "succeeded" | "canceled";
  amount: {
    value: string;
    currency: string;
  };
  confirmation: {
    type: "redirect";
    confirmation_url: string;
  };
  created_at: string;
  test: boolean;
}

// In-memory/local payment tracker for idempotency & mock verification
const paymentStore = new Map<string, PaymentResult>();

/**
 * Создание серверного тестового платежа YooMoney
 * Поддерживает как реальный YooKassa API через переменные окружения, так и встроенный mock sandbox
 */
export async function createYooMoneyPayment(params: CreatePaymentParams): Promise<PaymentResult> {
  const shopId = process.env.YOOKASSA_SHOP_ID || process.env.YOOMONEY_SHOP_ID;
  const secretKey = process.env.YOOKASSA_SECRET_KEY || process.env.YOOMONEY_SECRET_KEY;

  const paymentId = "pay_" + crypto.randomBytes(8).toString("hex");
  const idempotencyKey = crypto.randomUUID();

  // If real YooKassa credentials are provided, try calling the official API
  if (shopId && secretKey && shopId !== "test_shop_12345") {
    try {
      const basicAuth = Buffer.from(`${shopId}:${secretKey}`).toString("base64");
      const res = await fetch("https://api.yookassa.ru/v3/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotence-Key": idempotencyKey,
          Authorization: `Basic ${basicAuth}`,
        },
        body: JSON.stringify({
          amount: {
            value: (params.amountUzs / 150).toFixed(2), // Test approximate RUB equivalent or direct amount
            currency: "RUB",
          },
          capture: true,
          confirmation: {
            type: "redirect",
            return_url: params.returnUrl,
          },
          description: `Оплата заказа ${params.orderId} (Тестовый режим)`,
          test: true,
          metadata: {
            orderId: params.orderId,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        paymentStore.set(data.id, data);
        return data;
      }
    } catch (e) {
      console.warn("YooKassa live API fallback to sandbox simulator:", e);
    }
  }

  // Robust test sandbox simulator
  const mockPayment: PaymentResult = {
    paymentId,
    orderId: params.orderId,
    status: "pending",
    amount: {
      value: params.amountUzs.toString(),
      currency: "UZS",
    },
    confirmation: {
      type: "redirect",
      confirmation_url: `${params.returnUrl}&paymentId=${paymentId}&status=succeeded`,
    },
    created_at: new Date().toISOString(),
    test: true,
  };

  paymentStore.set(paymentId, mockPayment);
  return mockPayment;
}

/**
 * Проверка статуса платежа на сервере
 */
export async function getYooMoneyPaymentStatus(paymentId: string): Promise<PaymentResult | null> {
  const payment = paymentStore.get(paymentId);
  if (!payment) return null;
  return payment;
}
