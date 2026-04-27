import { NextRequest, NextResponse } from "next/server";
import { drawRequestSchema } from "@/lib/schemas";
import { createSupabaseAdminClient } from "@/lib/supabase";
import {
  buildEntryFromScores,
  calculateMatchTier,
  calculatePrizeSplit,
  generateWinningNumbers,
} from "@/lib/draw";

type ScoreRow = {
  user_id: string;
  stableford_score: number;
  score_date: string;
};

function toMonthStart(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00.000Z`);
  date.setUTCDate(1);
  return date.toISOString().slice(0, 10);
}

function groupEntries(rows: ScoreRow[]) {
  const byUser = new Map<string, ScoreRow[]>();
  for (const row of rows) {
    const list = byUser.get(row.user_id) ?? [];
    list.push(row);
    byUser.set(row.user_id, list);
  }

  return Array.from(byUser.entries()).map(([userId, values]) => {
    const latestFive = values
      .sort((a, b) => b.score_date.localeCompare(a.score_date))
      .slice(0, 5)
      .map((item) => item.stableford_score);

    return {
      userId,
      entryNumbers: buildEntryFromScores(latestFive),
    };
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = drawRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { mode, drawMonth, actorUserId } = parsed.data;
  const monthStart = toMonthStart(drawMonth);
  const supabase = createSupabaseAdminClient();

  const { data: existingDraw } = await supabase
    .from("draws")
    .select("id")
    .eq("draw_month", monthStart)
    .eq("status", "published")
    .maybeSingle();

  if (existingDraw) {
    return NextResponse.json({ error: "Draw already published for this month." }, { status: 409 });
  }

  const { data: scoreRows, error: scoreError } = await supabase
    .from("scores")
    .select("user_id, stableford_score, score_date")
    .order("score_date", { ascending: false });

  if (scoreError) {
    return NextResponse.json({ error: scoreError.message }, { status: 500 });
  }

  const allScores = (scoreRows ?? []).map((row) => row.stableford_score);
  const winningNumbers = generateWinningNumbers(mode, allScores);

  const { data: draw, error: drawError } = await supabase
    .from("draws")
    .insert({
      draw_month: monthStart,
      mode,
      winning_numbers: winningNumbers,
      status: "published",
      created_by: actorUserId,
      published_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (drawError || !draw) {
    return NextResponse.json({ error: drawError?.message ?? "Failed to create draw" }, { status: 500 });
  }

  const entries = groupEntries((scoreRows ?? []) as ScoreRow[]);
  const drawEntries = entries.map((entry) => {
    const result = calculateMatchTier(entry.entryNumbers, winningNumbers);
    return {
      draw_id: draw.id,
      user_id: entry.userId,
      entry_numbers: entry.entryNumbers,
      matched_count: result.matchedCount,
      tier: result.tier,
    };
  });

  if (drawEntries.length > 0) {
    const { error: entryError } = await supabase.from("draw_entries").insert(drawEntries);
    if (entryError) {
      return NextResponse.json({ error: entryError.message }, { status: 500 });
    }
  }

  const { data: activeSubs, error: subError } = await supabase
    .from("subscriptions")
    .select("price_cents")
    .eq("status", "active");

  if (subError) {
    return NextResponse.json({ error: subError.message }, { status: 500 });
  }

  const totalSubscriptionCents = (activeSubs ?? []).reduce((sum, row) => sum + row.price_cents, 0);
  const totalPoolCents = Math.floor(totalSubscriptionCents * 0.4);
  const pool5 = Math.floor(totalPoolCents * 0.4);
  const pool4 = Math.floor(totalPoolCents * 0.35);
  const pool3 = totalPoolCents - pool5 - pool4;

  const winners5 = drawEntries.filter((entry) => entry.tier === "5-match");
  const winners4 = drawEntries.filter((entry) => entry.tier === "4-match");
  const winners3 = drawEntries.filter((entry) => entry.tier === "3-match");

  const winnerRows = [
    ...winners5.map((entry) => ({
      draw_id: draw.id,
      user_id: entry.user_id,
      tier: "5-match",
      payout_cents: calculatePrizeSplit(pool5, winners5.length),
    })),
    ...winners4.map((entry) => ({
      draw_id: draw.id,
      user_id: entry.user_id,
      tier: "4-match",
      payout_cents: calculatePrizeSplit(pool4, winners4.length),
    })),
    ...winners3.map((entry) => ({
      draw_id: draw.id,
      user_id: entry.user_id,
      tier: "3-match",
      payout_cents: calculatePrizeSplit(pool3, winners3.length),
    })),
  ];

  if (winnerRows.length > 0) {
    const { error: winnerError } = await supabase.from("winners").insert(winnerRows);
    if (winnerError) {
      return NextResponse.json({ error: winnerError.message }, { status: 500 });
    }
  }

  const rollover5MatchCents = winners5.length === 0 ? pool5 : 0;
  const { error: poolError } = await supabase.from("prize_pools").insert({
    draw_id: draw.id,
    total_pool_cents: totalPoolCents,
    pool_5_match_cents: pool5,
    pool_4_match_cents: pool4,
    pool_3_match_cents: pool3,
    rollover_5_match_cents: rollover5MatchCents,
  });

  if (poolError) {
    return NextResponse.json({ error: poolError.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    drawId: draw.id,
    winningNumbers,
    winners: {
      fiveMatch: winners5.length,
      fourMatch: winners4.length,
      threeMatch: winners3.length,
    },
    rollover5MatchCents,
  });
}
