import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase";

function isAuthorizedAdmin(request: NextRequest) {
  const secret = request.headers.get("x-admin-secret");
  return Boolean(secret && process.env.ADMIN_API_SECRET && secret === process.env.ADMIN_API_SECRET);
}

export async function GET(request: NextRequest) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createSupabaseAdminClient();

  const [usersRes, subsRes, drawsRes, poolsRes, prefRes] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("subscriptions").select("status, price_cents"),
    supabase.from("draws").select("id", { count: "exact", head: true }),
    supabase.from("prize_pools").select("total_pool_cents, rollover_5_match_cents"),
    supabase.from("user_charity_preferences").select("charity_percent"),
  ]);

  if (usersRes.error || subsRes.error || drawsRes.error || poolsRes.error || prefRes.error) {
    return NextResponse.json(
      {
        error:
          usersRes.error?.message ||
          subsRes.error?.message ||
          drawsRes.error?.message ||
          poolsRes.error?.message ||
          prefRes.error?.message ||
          "Failed to build reports",
      },
      { status: 500 }
    );
  }

  const activeSubs = (subsRes.data ?? []).filter((row) => row.status === "active");
  const mrrCents = activeSubs.reduce((sum, row) => sum + row.price_cents, 0);
  const totalPrizePoolCents = (poolsRes.data ?? []).reduce((sum, row) => sum + row.total_pool_cents, 0);
  const totalRolloverCents = (poolsRes.data ?? []).reduce(
    (sum, row) => sum + row.rollover_5_match_cents,
    0
  );
  const avgCharityPercent =
    (prefRes.data ?? []).length > 0
      ? Math.round(
          ((prefRes.data ?? []).reduce((sum, row) => sum + Number(row.charity_percent), 0) /
            (prefRes.data ?? []).length) *
            100
        ) / 100
      : 0;

  return NextResponse.json({
    totals: {
      users: usersRes.count ?? 0,
      activeSubscribers: activeSubs.length,
      draws: drawsRes.count ?? 0,
      monthlyRevenueCents: mrrCents,
      prizePoolCents: totalPrizePoolCents,
      rolloverCents: totalRolloverCents,
      averageCharityPercent: avgCharityPercent,
    },
  });
}
