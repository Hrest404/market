import { NextResponse } from "next/server";
import { createStripeCheckoutSession } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, amountUzs, description, items } = body;

    if (!orderId || !amountUzs) {
      return NextResponse.json(
        { error: "Missing required payment fields" },
        { status: 400 }
      );
    }

    const host = req.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const base = `${protocol}://${host}`;

    const { url, sessionId } = await createStripeCheckoutSession({
      orderId,
      amountUzs,
      description: description || `Заказ ${orderId}`,
      items,
      successUrl: `${base}/checkout/result?orderNumber=${orderId}&total=${amountUzs}&method=stripe`,
      cancelUrl: `${base}/checkout`,
    });

    return NextResponse.json({ success: true, url, sessionId });
  } catch (error) {
    console.error("Stripe checkout session error:", error);
    return NextResponse.json(
      { error: "Failed to create Stripe checkout session" },
      { status: 500 }
    );
  }
}
