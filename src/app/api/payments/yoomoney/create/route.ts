import { NextResponse } from "next/server";
import { createYooMoneyPayment } from "@/lib/yoomoney";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, amountUzs, description } = body;

    if (!orderId || !amountUzs) {
      return NextResponse.json({ error: "Missing required payment fields" }, { status: 400 });
    }

    const host = req.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const returnUrl = `${protocol}://${host}/checkout/result?orderNumber=${orderId}&total=${amountUzs}&method=yoomoney`;

    const payment = await createYooMoneyPayment({
      orderId,
      amountUzs,
      description: description || `Заказ ${orderId}`,
      returnUrl,
    });

    return NextResponse.json({
      success: true,
      payment,
      confirmationUrl: payment.confirmation.confirmation_url,
    });
  } catch (error) {
    console.error("YooMoney payment creation error:", error);
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 });
  }
}
