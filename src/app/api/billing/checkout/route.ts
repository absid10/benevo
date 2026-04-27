import { NextRequest, NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const stripe = getStripeClient();
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured. Set STRIPE_SECRET_KEY." },
      { status: 500 }
    );
  }

  const body = await request.json();
  const userId = body.userId as string | undefined;
  const plan = (body.plan as "monthly" | "yearly" | undefined) ?? "monthly";
  const charityPercent = Number(body.charityPercent ?? 10);
  const charityId = body.charityId as string | undefined;

  if (!userId || !charityId) {
    return NextResponse.json({ error: "userId and charityId are required" }, { status: 400 });
  }

  const monthlyPriceId = process.env.STRIPE_MONTHLY_PRICE_ID;
  const yearlyPriceId = process.env.STRIPE_YEARLY_PRICE_ID;
  const selectedPriceId = plan === "yearly" ? yearlyPriceId : monthlyPriceId;

  if (!selectedPriceId) {
    return NextResponse.json({ error: "Missing Stripe price id configuration" }, { status: 500 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: selectedPriceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard?checkout=success`,
    cancel_url: `${appUrl}/dashboard?checkout=cancelled`,
    metadata: {
      userId,
      plan,
      charityPercent: String(charityPercent),
      charityId,
    },
  });

  return NextResponse.json({ checkoutUrl: session.url });
}
