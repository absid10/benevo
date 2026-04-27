import { NextRequest, NextResponse } from "next/server";
import { drawRequestSchema } from "@/lib/schemas";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { buildEntryFromScores, calculateMatchTier, generateWinningNumbers } from "@/lib/draw";

type ScoreRow = {
  user_id: string;
  stableford_score: number;
  score_date: string;
};

function buildEntries(rows: ScoreRow[]) {
  const byUser = new Map<string, ScoreRow[]>();

  for (const row of rows) {
    const list = byUser.get(row.user_id) ?? [];
    list.push(row);
    byUser.set(row.user_id, list);
  }

  return Array.from(byUser.entries()).map(([userId, userScores]) => {
    const latestFive = userScores
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

  const { mode, drawMonth } = parsed.data;
  const supabase = createSupabaseAdminClient();

  const { data: scoreRows, error } = await supabase
    .from("scores")
    .select("user_id, stableford_score, score_date")
    .order("score_date", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const allScores = (scoreRows ?? []).map((row) => row.stableford_score);
  const winningNumbers = generateWinningNumbers(mode, allScores);
  const entries = buildEntries((scoreRows ?? []) as ScoreRow[]);

  const tierSummary = { fiveMatch: 0, fourMatch: 0, threeMatch: 0 };
  for (const entry of entries) {
    const result = calculateMatchTier(entry.entryNumbers, winningNumbers);
    if (result.tier === "5-match") tierSummary.fiveMatch += 1;
    if (result.tier === "4-match") tierSummary.fourMatch += 1;
    if (result.tier === "3-match") tierSummary.threeMatch += 1;
  }

  return NextResponse.json({
    drawMonth,
    mode,
    winningNumbers,
    participants: entries.length,
    projectedWinners: tierSummary,
  });
}
