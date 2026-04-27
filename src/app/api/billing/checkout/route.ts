import { NextRequest, NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";
import { createSupabaseAdminClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const userId = body.userId as string | undefined;
  const plan = (body.plan as "monthly" | "yearly" | undefined) ?? "monthly";
  const charityPercent = Number(body.charityPercent ?? 10);
  const charityId = body.charityId as string | undefined;

  if (!userId || !charityId) {
    return NextResponse.json({ error: "userId and charityId are required" }, { status: 400 });
  }

  const stripe = getStripeClient();

  // If Stripe is not configured, create a demo subscription directly
  if (!stripe) {
    const supabase = createSupabaseAdminClient();

    // Remove any existing subscription for this user, then create new one
    await supabase.from("subscriptions").delete().eq("user_id", userId);

    const priceCents = plan === "yearly" ? 500000 : 50000; // ₹5,000 or ₹500
    const { error: subError } = await supabase.from("subscriptions").insert({
      user_id: userId,
      plan,
      status: "active",
      price_cents: priceCents,
      charity_percent: charityPercent,
      current_period_end: new Date(Date.now() + (plan === "yearly" ? 365 : 30) * 86400000).toISOString(),
      stripe_customer_id: `demo_cus_${userId.slice(0, 8)}`,
      stripe_subscription_id: `demo_sub_${Date.now()}`,
    });

    if (subError) {
      return NextResponse.json({ error: subError.message }, { status: 500 });
    }

    // Save charity preference
    await supabase.from("user_charity_preferences").upsert(
      { user_id: userId, charity_id: charityId, percent: charityPercent },
      { onConflict: "user_id" }
    );

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    return NextResponse.json({ checkoutUrl: `${appUrl}/dashboard?checkout=success` });
  }

  // Stripe checkout flow
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
