import { NextRequest, NextResponse } from "next/server";
import { subscriptionEventSchema } from "@/lib/schemas";
import { createSupabaseAdminClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("subscriptions")
    .select("id, plan, status, price_cents, charity_percent, current_period_end, cancel_at_period_end")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ subscription: data });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = subscriptionEventSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { userId, plan, status, priceCents, charityPercent, currentPeriodEnd } = parsed.data;
  const supabase = createSupabaseAdminClient();

  const { error } = await supabase.from("subscriptions").upsert(
    {
      user_id: userId,
      plan,
      status,
      price_cents: priceCents,
      charity_percent: charityPercent,
      current_period_end: currentPeriodEnd ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
