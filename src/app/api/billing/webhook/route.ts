import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripeClient } from "@/lib/stripe";
import { createSupabaseAdminClient } from "@/lib/supabase";

async function upsertSubscriptionFromStripe(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId;
  if (!userId) {
    return;
  }

  const plan = subscription.items.data[0]?.plan?.interval === "year" ? "yearly" : "monthly";
  const status =
    subscription.status === "active"
      ? "active"
      : subscription.status === "past_due"
        ? "past_due"
        : subscription.status === "canceled"
          ? "canceled"
          : "inactive";

  const charityPercent = Number(subscription.metadata.charityPercent ?? "10");
  const priceCents = subscription.items.data[0]?.price.unit_amount ?? 0;
  const subAny = subscription as unknown as { current_period_end?: number };
  const currentPeriodEnd = subAny.current_period_end
    ? new Date(subAny.current_period_end * 1000).toISOString()
    : null;

  const supabase = createSupabaseAdminClient();

  await supabase.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_customer_id: subscription.customer as string,
      stripe_subscription_id: subscription.id,
      plan,
      status,
      price_cents: priceCents,
      charity_percent: charityPercent,
      current_period_end: currentPeriodEnd,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  const charityId = subscription.metadata.charityId;
  if (charityId) {
    await supabase.from("user_charity_preferences").upsert(
      {
        user_id: userId,
        charity_id: charityId,
        charity_percent: charityPercent,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );
  }
}

export async function POST(request: Request) {
  const stripe = getStripeClient();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const signature = (await headers()).get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: "Missing stripe signature or STRIPE_WEBHOOK_SECRET" },
      { status: 400 }
    );
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.subscription) {
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
      await upsertSubscriptionFromStripe(subscription);
    }
  }

  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    await upsertSubscriptionFromStripe(subscription);
  }

  return NextResponse.json({ received: true });
}
