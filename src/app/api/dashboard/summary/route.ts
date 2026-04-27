import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();

  const [subRes, preferenceRes, drawsRes, winnerRes] = await Promise.all([
    supabase
      .from("subscriptions")
      .select("plan, status, current_period_end, charity_percent")
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("user_charity_preferences")
      .select("charity_percent, charities(name)")
      .eq("user_id", userId)
      .maybeSingle(),
    supabase.from("draw_entries").select("id", { count: "exact", head: true }).eq("user_id", userId),
    supabase
      .from("winners")
      .select("payout_cents, status")
      .eq("user_id", userId),
  ]);

  if (subRes.error || preferenceRes.error || drawsRes.error || winnerRes.error) {
    return NextResponse.json(
      {
        error:
          subRes.error?.message ||
          preferenceRes.error?.message ||
          drawsRes.error?.message ||
          winnerRes.error?.message ||
          "Failed to load dashboard summary",
      },
      { status: 500 }
    );
  }

  const winners = winnerRes.data ?? [];
  const totalWonCents = winners.reduce((sum, item) => sum + (item.payout_cents ?? 0), 0);
  const unpaid = winners.filter((item) => item.status !== "paid").length;

  const charityName =
    preferenceRes.data &&
    typeof preferenceRes.data.charities === "object" &&
    preferenceRes.data.charities !== null &&
    "name" in preferenceRes.data.charities
      ? (preferenceRes.data.charities as { name?: string }).name ?? null
      : null;

  return NextResponse.json({
    subscription: subRes.data,
    charity: {
      name: charityName,
      percent: preferenceRes.data?.charity_percent ?? subRes.data?.charity_percent ?? 10,
    },
    participation: {
      drawsEntered: drawsRes.count ?? 0,
    },
    winnings: {
      totalWonCents,
      pendingCount: unpaid,
    },
  });
}
