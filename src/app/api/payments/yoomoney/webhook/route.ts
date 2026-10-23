import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const event = await req.json();

    // Verify event type
    if (event.type === "notification" && event.event === "payment.succeeded") {
      const payment = event.object;
      console.log(`[YooMoney Webhook] Оплата успешно подтверждена: PaymentID=${payment.id}, OrderID=${payment.metadata?.orderId}`);
      // В реальной базе Neon обновляем статус заказа на 'paid'
    }

    // Always respond 200 OK to prevent duplicate webhooks from YooMoney
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ received: true });
  }
}
