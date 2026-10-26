import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.warn("[Stripe] STRIPE_SECRET_KEY is not set — payments will fail.");
}

// Stripe instance — server only
export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, { apiVersion: "2026-09-30.endive" })
  : null;

export interface StripeCheckoutParams {
  orderId: string;
  /** Total in UZS — converted to USD cents for Stripe (1 USD ≈ 12700 UZS) */
  amountUzs: number;
  description: string;
  successUrl: string;
  cancelUrl: string;
  items?: { name: string; priceUzs: number; quantity: number }[];
}

/** USD cents ≈ amountUzs / 12700 * 100 (rounded to nearest cent) */
function uzsToCents(amountUzs: number): number {
  return Math.max(50, Math.round((amountUzs / 12700) * 100));
}

/**
 * Creates a Stripe Checkout Session.
 * Falls back to a sandbox mock if STRIPE_SECRET_KEY is not set.
 */
export async function createStripeCheckoutSession(
  params: StripeCheckoutParams
): Promise<{ url: string; sessionId: string }> {
  if (!stripe) {
    throw new Error(
      "Stripe is not configured. Set STRIPE_SECRET_KEY in environment variables."
    );
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
    params.items && params.items.length > 0
      ? params.items.map((item) => ({
          quantity: item.quantity,
          price_data: {
            currency: "usd",
            unit_amount: uzsToCents(item.priceUzs),
            product_data: { name: item.name },
          },
        }))
      : [
          {
            quantity: 1,
            price_data: {
              currency: "usd",
              unit_amount: uzsToCents(params.amountUzs),
              product_data: { name: params.description },
            },
          },
        ];

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    metadata: { orderId: params.orderId },
    success_url: params.successUrl + "&session_id={CHECKOUT_SESSION_ID}",
    cancel_url: params.cancelUrl,
  });

  return { url: session.url!, sessionId: session.id };
}
